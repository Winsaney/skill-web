# Nick 的 AI Skills 库

面向小红书 AI 博主的极简专业 Skills 展示站。基于 Next.js 14 App Router + Notion Headless CMS + react-notion-x + Vercel ISR 构建。

## 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 14 (App Router) | ISR 增量静态生成 |
| 内容 | Notion API | Headless CMS |
| 渲染 | react-notion-x | Notion Block 渲染 |
| Slug | pinyin-pro | 中文标题转拼音路径 |
| 部署 | Vercel | 免费 ISR 原生支持 |
| 样式 | Tailwind CSS | 原子化 CSS |

## 项目结构

```
app/
  page.tsx              # 首页 — Skills 列表 + 分类筛选
  layout.tsx            # 全局布局（Nav + Footer）
  globals.css           # 全局样式
  skill/[slug]/page.tsx # Skill 详情页
  loading.tsx           # 加载状态
  not-found.tsx         # 404 页
  robots.ts / sitemap.ts
components/
  Nav.tsx               # 顶部导航
  Footer.tsx            # 页脚
  SkillCard.tsx         # Skill 卡片
  SkillSidebar.tsx      # 详情页侧边栏导航
  CategoryFilter.tsx    # 分类筛选器
  NotionContent.tsx     # Notion 内容渲染器
lib/
  notion.ts             # Notion API 数据获取
  transform.ts          # Notion 数据 → Skill 对象
  slug.ts               # Slug 生成（中文 → 拼音）
  skill-navigation.ts   # 侧边栏导航数据
  demo-data.ts          # 未配置 Notion 时的演示数据
types/
  index.ts              # TypeScript 类型定义
```

## 本地开发

```bash
npm install
npm run dev
```

未配置 `.env.local` 时，站点使用 `lib/demo-data.ts` 中的演示数据，可直接预览。

## Notion 配置

```bash
cp .env.example .env.local
```

填入：

```bash
NOTION_TOKEN=your_notion_integration_secret
NOTION_DATABASE_ID=your_skills_database_id
```

Notion 数据库字段需与 `spec.md` 第 3 节保持一致。

## 常用命令

```bash
npm run dev        # 启动开发服务器
npm run build      # 生产构建
npm run start      # 启动生产服务器
npm run lint       # ESLint 检查
npm run typecheck  # TypeScript 类型检查
```
