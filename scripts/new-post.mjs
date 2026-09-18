import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const [slug, title = "新的文章"] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('用法：npm run post -- my-first-post "我的第一篇文章"');
  process.exit(1);
}
const directory = join(process.cwd(), "content/posts");
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
    `---\ntitle: ${JSON.stringify(title)}\ndate: "${date}"\ndescription: "写一句文章摘要"\ntags: []\ndraft: true\n---\n\n从这里开始写作。\n`,
    { flag: "wx" },
  );
  console.log(`已创建 ${file}。本地预览后，将 draft 改为 false 发布。`);
} catch (error) {
  console.error(
    error.code === "EEXIST" ? "同名文章已存在，请换一个 slug。" : error.message,
  );
  process.exit(1);
}
