import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  content: string;
};
const directory = path.join(process.cwd(), "content/posts");

export function getPosts(): Post[] {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(
        fs.readFileSync(path.join(directory, file), "utf8"),
      );
      const slug = file.slice(0, -3);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
        throw new Error(`Invalid post filename: ${file}`);
      for (const key of ["title", "date", "description"] as const) {
        if (typeof data[key] !== "string" || !data[key].trim())
          throw new Error(
            `${file}: ${key} must be a nonempty string. Quote dates.`,
          );
      }
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
        Number.isNaN(Date.parse(data.date)) ||
        new Date(data.date).toISOString().slice(0, 10) !== data.date
      )
        throw new Error(`${file}: invalid date`);
      if (data.draft !== undefined && typeof data.draft !== "boolean")
        throw new Error(`${file}: draft must be true or false`);
      if (
        data.tags !== undefined &&
        (!Array.isArray(data.tags) ||
          !data.tags.every((tag: unknown) => typeof tag === "string"))
      )
        throw new Error(`${file}: tags must be strings`);
      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        tags: data.tags ?? [],
        draft: data.draft ?? false,
        content,
      };
    })
    .filter((post) => !post.draft || process.env.NODE_ENV === "development")
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
}

export function getPost(slug: string) {
  return getPosts().find((post) => post.slug === slug);
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
