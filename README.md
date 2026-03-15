# AI Playbook · AI for Engineering Teams

A bilingual technical blog for engineering organizations, focused on **practical AI adoption in software delivery workflows, architecture, and team execution**.

- Live site: [https://blog.pnpm.ai](https://blog.pnpm.ai)
- Languages: English / Chinese
- Positioning: practical AI playbooks and reusable engineering patterns

Chinese version: [README-zh.md](README-zh.md)

## Content Focus

- AI adoption roadmaps for engineering teams
- Workflow practices: requirement analysis, task decomposition, execution, and retrospectives
- Agent-oriented collaboration models and engineering architecture
- From validated MVP scenarios to scaled rollout

## Site Features

- Bilingual routing (`/en`, `/zh`)
- Home / Post List / Post Detail / About
- Tag pages (`/[lang]/tags/[tag]`)
- Full-text search (static index)
- RSS (`/rss.xml`), Sitemap (`/sitemap.xml`), Robots

## Tech Stack

- Next.js 16 + Nextra 4 + MDX
- TypeScript + React
- Cloudflare Workers (free-tier deployable setup)
- GitHub Actions CI/CD

## Local Development

```bash
npm install
npm run dev
```

Default URL: `http://localhost:3000/en`

## Build and Deploy

```bash
# Validate
npm run check

# Build (auto-generates robots/sitemap/rss)
npm run build

# Deploy to Cloudflare Workers
npm run deploy
```

## Project Structure

```text
src/
  app/           # routes and pages
  content/       # blog content (en/zh)
  lib/           # site config and content utilities
  components/    # UI components
scripts/
  generate-meta.mjs  # generates robots/sitemap/rss during build
worker-static.js     # lightweight Workers entry
```
