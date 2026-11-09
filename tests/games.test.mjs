import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { afterEach, beforeEach, test } from "node:test";
import sharp from "sharp";
import { getGameArtwork, getGamePost, getGamePosts } from "../src/lib/games.ts";

const originalDirectory = process.cwd();
const generator = path.join(originalDirectory, "scripts/new-game.mjs");
const originalEnvironment = process.env.NODE_ENV;
let directory;

beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), "garden-games-"));
  await fs.mkdir(path.join(directory, "content/games"), { recursive: true });
  await fs.mkdir(path.join(directory, "public/images"), { recursive: true });
  process.chdir(directory);
  process.env.NODE_ENV = "production";
});

afterEach(async () => {
  process.chdir(originalDirectory);
  if (originalEnvironment === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = originalEnvironment;
  await fs.rm(directory, { recursive: true, force: true });
});

async function note(slug, fields = {}, body = "自由写作。") {
  const metadata = {
    title: "手记",
    game: "游戏",
    date: "2026-11-09",
    ...fields,
  };
  const frontmatter = Object.entries(metadata)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");
  await fs.writeFile(
    path.join(directory, "content/games", `${slug}.md`),
    `---\n${frontmatter}\n---\n\n${body}\n`,
  );
}

test("a collection without any note files is empty", async () => {
  await fs.rm(path.join(directory, "content/games"), { recursive: true });
  assert.deepEqual(await getGamePosts(), []);
  assert.equal(await getGamePost("missing"), undefined);
});

test("production excludes drafts from both the index and direct lookup", async () => {
  await note("published", { date: "2026-11-08" });
  await note("draft", { draft: true });
  assert.deepEqual(
    (await getGamePosts()).map((post) => post.slug),
    ["published"],
  );
  assert.equal(await getGamePost("draft"), undefined);
  process.env.NODE_ENV = "development";
  assert.deepEqual(
    (await getGamePosts()).map((post) => post.slug),
    ["draft", "published"],
  );
  assert.equal((await getGamePost("draft")).draft, true);
  assert.deepEqual(
    (await getGamePosts(false)).map((post) => post.slug),
    ["published"],
  );
});

test("an unfinished draft cannot break the published collection", async () => {
  await note("unfinished", {
    draft: true,
    title: "",
    cover: "/images/missing.webp",
  });
  assert.deepEqual(await getGamePosts(), []);
});

test("text-only notes and arbitrary Markdown images keep their content", async () => {
  const body =
    "第一段。\n\n第二段。\n\n![截图](/images/a.png)\n\n![喜欢的图片](https://example.com/photo.jpg)\n\n第三段。";
  await note("text-first", {}, body);
  const post = await getGamePost("text-first");
  assert.equal(post.content.trim(), body);
  assert.equal(post.cover, undefined);
  assert.equal(await getGameArtwork(post.cover), null);
});

test("invalid calendar dates and malformed metadata fail with a useful error", async () => {
  await note("invalid", { date: "2026-02-30" });
  await assert.rejects(getGamePosts(), /invalid date/);
  await note("invalid", { draft: "false" });
  await assert.rejects(getGamePosts(), /draft must be true or false/);
  await note("invalid", { game: 42 });
  await assert.rejects(getGamePosts(), /game must be a nonempty string/);
});

test("cover paths cannot leave public images, including through symlinks", async () => {
  await note("escape", { cover: "/images/%2e%2e/secret.png" });
  await assert.rejects(getGamePosts(), /Invalid game cover path/);
  const secret = path.join(directory, "private.png");
  await fs.writeFile(secret, "private");
  await fs.symlink(secret, path.join(directory, "public/images/link.png"));
  await note("escape", { cover: "/images/link.png" });
  await assert.rejects(getGamePosts(), /Invalid game cover path/);
});

test("artwork colors come from the selected image and grayscale has a fallback", async () => {
  const imageDirectory = path.join(directory, "public/images");
  for (const [name, background] of [
    ["red", "#ca4030"],
    ["gray", "#777777"],
  ]) {
    await sharp({ create: { width: 32, height: 24, channels: 3, background } })
      .png()
      .toFile(path.join(imageDirectory, `${name}.png`));
  }
  const red = await getGameArtwork("/images/red.png");
  assert.match(red.primary, /^#[0-9a-f]{6}$/);
  assert.ok(
    parseInt(red.primary.slice(1, 3), 16) >
      parseInt(red.primary.slice(3, 5), 16) * 2,
  );
  const encoded = Buffer.from(red.background.split(",")[1], "base64");
  assert.equal((await sharp(encoded).metadata()).format, "webp");
  const gray = await getGameArtwork("/images/gray.png");
  assert.equal(gray.primary, "#777777");
  assert.equal(gray.secondary, gray.primary);
});

test("the authoring command creates a draft and never overwrites an existing note", async () => {
  execFileSync(
    process.execPath,
    [generator, "my-game", "我的游戏", '标题含有 "引号"'],
    { cwd: directory },
  );
  assert.deepEqual(await getGamePosts(), []);
  const [post] = await getGamePosts(true);
  assert.equal(post.title, '标题含有 "引号"');
  assert.equal(post.game, "我的游戏");
  const file = path.join(directory, "content/games/my-game.md");
  const before = await fs.readFile(file, "utf8");
  const result = spawnSync(
    process.execPath,
    [generator, "my-game", "其他游戏"],
    { cwd: directory },
  );
  assert.equal(result.status, 1);
  assert.equal(await fs.readFile(file, "utf8"), before);
});
