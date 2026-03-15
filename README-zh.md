# AI Playbook · AI for Engineering Teams

面向企业研发团队的双语技术博客，聚焦 **AI 在研发流程中的落地方法、架构实践与组织推进路径**。

- 在线地址：[https://blog.pnpm.ai](https://blog.pnpm.ai)
- 语言：中文 / English
- 定位：企业研发 AI 落地方法论 + 可复用实践

英文版说明：[README.md](README.md)

## 站点内容方向

- 企业研发场景下的 AI 落地路线图
- 需求分析、任务拆解、研发协同、复盘等流程实践
- Agent 化协作模型与工程化架构设计
- 可验证场景（MVP）到规模化推广的方法

## 站点功能

- 双语路由（`/zh`、`/en`）
- 首页 / 文章列表 / 文章详情 / 关于页
- 标签聚合（`/[lang]/tags/[tag]`）
- 全文搜索（静态索引）
- RSS（`/rss.xml`）/ Sitemap（`/sitemap.xml`）/ Robots

## 技术栈

- Next.js 16 + Nextra 4 + MDX
- TypeScript + React
- Cloudflare Workers（免费版可部署方案）
- GitHub Actions 自动部署

## 本地开发

```bash
npm install
npm run dev
```

默认访问：`http://localhost:3000/en`

## 构建与部署

```bash
# 代码检查
npm run check

# 构建（会自动生成 robots/sitemap/rss）
npm run build

# 发布到 Cloudflare Workers
npm run deploy
```

## 仓库结构

```text
src/
  app/           # 页面与路由
  content/       # 博客内容（zh/en）
  lib/           # 站点配置与内容读取逻辑
  components/    # 业务组件
scripts/
  generate-meta.mjs  # 构建时生成 robots/sitemap/rss
worker-static.js     # Workers 轻量入口
```
