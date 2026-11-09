import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [slug, game, title = `${game}通关手记`] = process.argv.slice(2);
if (
  !slug ||
  !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
  !game?.trim() ||
  !title.trim()
) {
  console.error(
    '用法：npm run game -- hollow-knight "空洞骑士" "我的通关手记"',
  );
  process.exit(1);
}
const directory = join(process.cwd(), "content/games");
mkdirSync(directory, { recursive: true });
const file = join(directory, `${slug}.md`);
const date = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
try {
  writeFileSync(
    file,
    `---
title: ${JSON.stringify(title.trim())}
game: ${JSON.stringify(game.trim())}
date: "${date}"
description: ""
draft: true
---

从这里开始写作，随时插入喜欢的图片。
`,
    { flag: "wx" },
  );
  console.log(`已创建 ${file}。本地预览后，将 draft 改为 false 发布。`);
} catch (error) {
  console.error(
    error.code === "EEXIST" ? "同名手记已存在，请换一个 slug。" : error.message,
  );
  process.exit(1);
}
