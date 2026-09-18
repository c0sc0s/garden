# garden

白底、手写标题与大留白的个人博客。参考给定网站的 About 页面布局实现；首页为 About Me，导航只保留 About Me 和 Blog，旧 `/about` 地址永久跳转至 `/`，Blog 延续相同视觉。参考截图没有提供其他页面，因此文章列表和详情为配套设计。

## 技术栈与架构

- Next.js 16 App Router + React 19 + TypeScript：页面默认使用服务端组件，已发布文章在构建时预生成。
- Markdown + gray-matter + react-markdown + remark-gfm：文章与代码分离，支持图片、链接、表格、代码块；不执行文章中的 JSX 或原始 HTML。
- 原生 CSS：设计变量、响应式排版集中管理，无 UI 库依赖。
- Vercel + Git：提交触发构建部署，不需要数据库、CMS 或额外服务密钥。

```text
content/posts/          Markdown 文章与 frontmatter
public/images/          照片、文章配图、手绘标题
public/fonts/           自托管 Caveat 字体及许可证
src/app/                首页、About、Blog、文章详情、404、SEO
src/components/         共享导航、页头、About 布局
src/lib/site.ts         个人资料与网站配置
src/lib/posts.ts        文章读取、校验、草稿过滤与排序
scripts/new-post.mjs    文章模板生成器
```

## 本地运行

需要 Node.js 22 LTS 或更新的兼容版本。

```bash
npm ci
npm run dev
```

打开 http://localhost:3000 。检查：`npm run lint`、`npm run typecheck`、`npm run build`。

## 添加文章

```bash
npm run post -- my-first-post "我的第一篇文章"
```

编辑生成的 `content/posts/my-first-post.md`：

```markdown
---
title: "我的第一篇文章"
date: "2026-09-18"
description: "文章的一句话摘要"
tags: ["生活", "随笔"]
draft: true
---

这里是正文。

## 一个小标题

![照片说明](/images/my-photo.jpg)
```

1. 文件名使用小写英文、数字与连字符，它就是永久链接 `/blog/my-first-post`。发布日期必须加引号。
2. 图片放到 `public/images/`，Markdown 使用 `/images/文件名`。
3. `npm run dev` 可以预览草稿。准备发布时设置 `draft: false`，提交并推送到 Git。
4. 生产环境不显示草稿，直接访问草稿地址也会返回 404。只有 `draft` 控制发布；未来日期不会自动定时发布。
5. 文章默认按日期倒序。发布后尽量不改文件名，避免旧链接失效。

也可以直接在 GitHub 网页创建 Markdown 文件并提交。没有在线后台和上传接口；所有持久内容以 Git 中的文件为准。

## 个性化

修改 `src/lib/site.ts` 中的作者、简介与照片配置。现有介绍和两篇文章都是示例，发布前替换或删除。About Me 已使用提供的车内侧脸照片；可通过 `portrait` 和 `portraitAlt` 更换。配置 `email` 和 `instagram` 后显示联系入口，留空则隐藏。GitHub、Bilibili、Twitter 使用手绘图标，修改 `site.socials` 对应的 `url` 即可启用链接；URL 留空时仅显示图标。顶部用 BLOG 替代无关的个人兴趣栏目；不包含截图中的 Wix 平台标识。

About Me 标题与站点字标统一使用本地 Caveat 手写字体，以静态文字呈现。Caveat 字体按 SIL OFL 授权使用。正文采用 Inter Variable（英文）与 Noto Sans SC Variable（中文），通过 Fontsource 本地打包并按 Unicode 范围加载，授权文件随 npm 包提供。树林占位图来自 Unsplash：https://images.unsplash.com/photo-1441974231531-c6227db76b6e 。

## 部署到 Vercel

1. 将 garden 提交到自己的 GitHub 仓库。
2. 在 Vercel 中 Import Git Repository，Framework Preset 选 Next.js。
3. 如果仓库根目录就是 garden，Root Directory 留默认；如果上传整个父目录，Root Directory 设为 `garden`。
4. 默认安装命令和 `npm run build` 即可，不需要手动指定 Output Directory。
5. 设置环境变量 `NEXT_PUBLIC_SITE_URL` 为最终 HTTPS 域名，例如 `https://your-garden.vercel.app`；绑定自定义域名后同步修改并重新部署。此地址用于 sitemap 和规范链接。
6. 后续推送生产分支自动更新网站，其他分支可以使用 Vercel Preview 验证。

没有提供部署凭据，因此本次仅准备项目，没有创建云端项目或实际发布。

官方文档：https://vercel.com/docs/frameworks/full-stack/nextjs

## 后续扩展边界

当前内容规模适合文件博客。若以后需要手机端后台、多人协作或在线媒体管理，可以增加 CMS，再让 `src/lib/posts.ts` 对接新内容源；页面组件无需绑定具体 CMS。需要文章内嵌交互组件时再引入 MDX，当前纯 Markdown 写作更直接。

## 外观主题

顶部自定义 SVG 手绘太阳/月亮按钮适用于全部页面，显示点击后要切换的主题；太阳 30px、月亮 28px，共用 48px 点击区域；切换带路径描线、光芒依次出现和轻微旋转动画，并尊重减少动态效果偏好。首次访问跟随系统，手动选择后保存在本机浏览器的 `garden-theme` 中。深色模式单独调整背景、正文、代码块和手绘图标，个人照片保持原色。

左上角为 AI 生成的蓝色手绘小鱼标志，素材位于 `public/images/fish-logo.png`，深浅色模式保留原色。

## 随想 Thoughts

导航中的 Thoughts 用于一两句话的短记录，无需标题和摘要。编辑 `content/thoughts.json`，每条记录填写唯一 `id`、日期 `date` 和正文 `text`，页面自动按日期倒序排列：

```json
[
  { "id": "2026-09-18-01", "date": "2026-09-18", "text": "这里写一句随想。" }
]
```

保存后可在 `/thoughts` 查看。添加 `"animation": "fish-blink"` 可以在正文下展示自动循环眨眼的小鱼，使用 `/images/fish-blink.png` 精灵图；系统开启减少动态效果时展示静态小鱼。

随想也支持配图，在记录中添加可选的 `images` 数组：

```json
{
  "id": "2026-09-18-03",
  "date": "2026-09-18",
  "text": "今天看到的风景。",
  "images": [{ "src": "/images/garden.jpg", "alt": "树林里的阳光" }]
}
```

可以添加多张图片，也可以省略 `text` 只发图片。图片完整显示，移动端自动调整为单列。

## Vercel 运维与统计

正式域名为 https://garden.cos02.top。根布局接入 `@vercel/analytics` 与 `@vercel/speed-insights`，无需在页面逐个添加。Vercel 项目中分别开启 [Web Analytics](https://vercel.com/c0sc0s-projects/garden/analytics) 和 [Speed Insights](https://vercel.com/c0sc0s-projects/garden/speed-insights)，部署后访问网站，数据随真实访问累积。

`NEXT_PUBLIC_SITE_URL` 默认正式域名。如果 Vercel Production 环境中已有该变量，确保不是 localhost；修改后重新部署。此地址用于 canonical、robots 与 sitemap。

- `npm run ops:check`：检查正式网站页面、SEO 地址和两个统计脚本，失败时非零退出。
- `npm run ops:check -- https://预览域名.vercel.app`：检查指定部署，SEO 地址仍指向正式域名。
- `.agents/skills/garden-ops/SKILL.md`：仓库内运维 Skill，可用 `$garden-ops` 请求检查线上状态或分析性能。

检查命令的耗时是本机单次请求时间，不是网站速度评分。Speed Insights 使用真实访客数据；Lighthouse/PageSpeed Insights 用于实验室测试。暂无访客数据时先验证脚本与面板开关，不据此判断性能好坏。排查部署看 Vercel Deployments 与 Logs；客户端错误另查浏览器控制台。本次接入没有创建定时巡检或故障通知服务。
