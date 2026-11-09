import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import sharp from "sharp";

export type GamePost = {
  slug: string;
  title: string;
  game: string;
  date: string;
  description?: string;
  cover?: string;
  coverAlt?: string;
  platform?: string;
  playtime?: string;
  draft: boolean;
  content: string;
};

function textField(
  data: Record<string, unknown>,
  key: string,
  file: string,
  required = false,
): string | undefined {
  const value = data[key];
  if (value === undefined && !required) return;
  if (typeof value !== "string" || (required && !value.trim())) {
    throw new Error(
      `${file}: ${key} must be ${required ? "a nonempty" : "a"} string. Quote dates.`,
    );
  }
  return value.trim() || undefined;
}

async function localCoverPath(source: string) {
  const decoded = decodeURIComponent(source);
  if (!decoded.startsWith("/images/") || /[\\?#\0]/.test(decoded)) {
    throw new Error(
      `Game covers must be local files under /images/: ${source}`,
    );
  }
  const directory = await fs.realpath(
    path.join(process.cwd(), "public/images"),
  );
  const candidate = path.resolve(directory, decoded.slice("/images/".length));
  const isWithin = (file: string) => {
    const relative = path.relative(directory, file);
    return (
      relative !== ".." &&
      !relative.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relative)
    );
  };
  if (!isWithin(candidate))
    throw new Error(`Invalid game cover path: ${source}`);
  const resolved = await fs.realpath(candidate);
  if (!isWithin(resolved))
    throw new Error(`Invalid game cover path: ${source}`);
  return resolved;
}

export async function getGamePosts(
  includeDrafts = process.env.NODE_ENV === "development",
): Promise<GamePost[]> {
  const directory = path.join(process.cwd(), "content/games");
  let entries: string[];
  try {
    entries = await fs.readdir(directory);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT")
      return [];
    throw error;
  }
  const files = entries.filter((file) => file.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (file): Promise<GamePost | null> => {
      const { data, content } = matter(
        await fs.readFile(path.join(directory, file), "utf8"),
      );
      if (data.draft !== undefined && typeof data.draft !== "boolean") {
        throw new Error(`${file}: draft must be true or false`);
      }
      if (data.draft === true && !includeDrafts) return null;
      const slug = file.slice(0, -3);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error(`Invalid game filename: ${file}`);
      }
      const title = textField(data, "title", file, true)!;
      const game = textField(data, "game", file, true)!;
      const date = textField(data, "date", file, true)!;
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date
      )
        throw new Error(`${file}: invalid date`);
      const cover = textField(data, "cover", file);
      if (cover) await localCoverPath(cover);
      return {
        slug,
        title,
        game,
        date,
        content,
        cover,
        description: textField(data, "description", file),
        coverAlt: textField(data, "coverAlt", file),
        platform: textField(data, "platform", file),
        playtime: textField(data, "playtime", file),
        draft: data.draft ?? false,
      };
    }),
  );
  return posts
    .filter((post): post is GamePost => post !== null)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
}

export async function getGamePost(slug: string) {
  return (await getGamePosts()).find((post) => post.slug === slug);
}

export async function getGameArtwork(source?: string) {
  if (!source) return null;
  const file = await localCoverPath(source);
  const image = sharp(file)
    .rotate()
    .resize(80, 80, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#18191b" })
    .toColourspace("srgb");
  const [{ data, info }, preview] = await Promise.all([
    image.clone().raw().toBuffer({ resolveWithObject: true }),
    image.clone().webp({ quality: 55 }).toBuffer(),
  ]);
  const buckets = new Map<string, { count: number; sum: number[] }>();
  const total = [0, 0, 0];
  for (let index = 0; index < data.length; index += info.channels) {
    const rgb = [data[index], data[index + 1], data[index + 2]];
    rgb.forEach((value, channel) => (total[channel] += value));
    const lightness = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    // Exclude UI whites and deep shadows so the tint follows the scene's colors.
    if (
      lightness < 35 ||
      lightness > 235 ||
      Math.max(...rgb) - Math.min(...rgb) < 18
    )
      continue;
    const key = rgb.map((value) => Math.floor(value / 32)).join(",");
    const bucket = buckets.get(key) ?? { count: 0, sum: [0, 0, 0] };
    bucket.count++;
    rgb.forEach((value, channel) => (bucket.sum[channel] += value));
    buckets.set(key, bucket);
  }
  const candidates = [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .map((bucket) =>
      bucket.sum.map((value) => Math.round(value / bucket.count)),
    );
  const colors: number[][] = [];
  for (const candidate of candidates) {
    if (
      colors.every(
        (color) =>
          Math.hypot(...candidate.map((value, index) => value - color[index])) >
          65,
      )
    ) {
      colors.push(candidate);
    }
    if (colors.length === 3) break;
  }
  if (!colors.length)
    colors.push(
      total.map((value) => Math.round(value / (info.width * info.height))),
    );
  const hex = (rgb: number[]) =>
    `#${rgb.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
  return {
    background: `data:image/webp;base64,${preview.toString("base64")}`,
    primary: hex(colors[0]),
    secondary: hex(colors.at(-1)!),
  };
}
