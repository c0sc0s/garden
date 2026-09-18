---
name: garden-ops
description: 检查 Garden 在 Vercel 的部署、线上可用性、访问统计和真实访客性能，排查构建、域名与回滚问题。用于运维，不用于撰写博客内容。
---

# Garden 运维

在包含 `package.json` 的 garden 仓库根目录执行命令。正式域名为 https://garden.cos02.top，仓库为 https://github.com/c0sc0s/garden，Vercel 项目为 https://vercel.com/c0sc0s-projects/garden。

## 线上检查

运行 `npm run ops:check` 检查首页、Blog、Thoughts、robots、sitemap、canonical 和统计脚本。命令非零退出代表至少一项失败；网络超时不等于已确认站点故障，结合浏览器和 Vercel 状态区分本地网络与线上故障。检查预览部署时使用 `npm run ops:check -- https://预览域名.vercel.app`；canonical 仍应指向正式域名。部署保护返回登录页时，不把它报告为应用崩溃。

## 性能与访问统计

- 速度面板：https://vercel.com/c0sc0s-projects/garden/speed-insights
- 访问面板：https://vercel.com/c0sc0s-projects/garden/analytics
- 先区分 Production 与 Preview，再记录时间范围、设备、页面和样本量。没有足够访客数据时明确说明，不能编造分数。
- Speed Insights 是真实访客数据；PageSpeed Insights/Lighthouse 是实验室测试；`ops:check` 的响应时间只代表本机这一次请求，三者不要混用。
- 分析 LCP 时检查首屏图片与字体，分析 CLS 时检查尺寸预留，分析 INP 时检查客户端长任务。根据证据选择改动，保持小鱼、手写标题、主题切换和移动端设计。
- SDK 位于 `src/app/layout.tsx`。如果没有数据，检查面板开关、部署提交、`/_vercel/*/script.js`、浏览器网络请求和拦截插件。

## 部署与故障

查看 https://vercel.com/c0sc0s-projects/garden/deployments 和 https://vercel.com/c0sc0s-projects/garden/logs，确认部署环境、提交 SHA、Ready/失败状态，再判断构建还是运行故障。本项目主要是静态页面，Runtime Logs 不一定包含客户端错误；浏览器控制台错误不能靠服务器日志代替。

改动前查看 git 状态，保留用户修改。发布代码前运行 `npm run lint`、`npm run build`、`npm run typecheck`。正式地址由 `src/lib/site.ts` 提供，`NEXT_PUBLIC_SITE_URL` 可覆盖；Vercel 上若曾设置 localhost，修改 Production 环境变量并重新部署。

用户要求发布修复时提交并推送，等待对应部署 Ready 后运行线上检查。仅要求分析时报告结果，不自动回滚或改生产配置。用户要求回滚时先确定最近正常部署和当前提交，优先使用 Vercel 回滚；不要 force push 或删除部署。报告实际完成项和任何阻碍。
