# Agent Skills

体系化整理 AI 使用技巧的展示站，涵盖提示词工程、工作流自动化等内容，持续更新中。基于 Next.js 14 App Router + Notion Headless CMS + react-notion-x + Vercel ISR 构建。

## 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 14 (App Router) | ISR 增量静态生成 |
| 内容 | Notion API | Headless CMS |
| 渲染 | react-notion-x | Notion Block 渲染（含表格、子数据库） |
| Slug | pinyin-pro | 中文标题转拼音路径 |
| 主题 | next-themes | 亮色 / 暗色模式切换 |
| 图标 | lucide-react | 侧边栏与 UI 图标 |
| 部署 | Vercel | ISR + Analytics |

## 页面

| 路径 | 说明 |
|------|------|
| `/` | 首页 — Skills 列表 + 分类筛选 |
| `/skill/[slug]` | Skill 详情页（Notion 内容 + 侧边栏导航） |
| `/category/[name]` | 分类页 — 按分类筛选 Skills |
| `/specification` | Skills 规范说明 |
| `/clients` | Agent 工具列表（Junie、Gemini CLI 等） |

## 项目结构

```
app/
  page.tsx                # 首页 — Skills 列表 + 分类筛选
  layout.tsx              # 全局布局（Nav + Footer + ThemeProvider）
  globals.css             # 全局样式（含暗色模式）
  skill/[slug]/page.tsx   # Skill 详情页
  category/[name]/page.tsx # 分类页
  specification/page.tsx  # Skills 规范
  clients/page.tsx        # Agent 工具
  loading.tsx             # 加载状态
  not-found.tsx           # 404 页
  robots.ts / sitemap.ts  # SEO
components/
  Nav.tsx                 # 顶部导航
  Footer.tsx              # 页脚
  ThemeProvider.tsx        # 暗色模式 Provider
  ThemeToggle.tsx         # 主题切换按钮
  SkillCard.tsx           # Skill 卡片（首页 / 分类页复用）
  SkillSidebar.tsx        # 详情页内目录导航
  DocsSidebar.tsx         # 全局侧边栏（桌面常驻 + 移动端抽屉）
  CategoryFilter.tsx      # 分类筛选器（URL hash 联动）
  NotionContent.tsx       # Notion 内容渲染器
lib/
  notion.ts               # Notion API 数据获取
  transform.ts            # Notion 数据 → Skill 对象
  slug.ts                 # Slug 生成（中文 → 拼音）
  sidebar-config.ts       # 侧边栏导航配置（动态从 Notion 生成）
  skill-navigation.ts     # 详情页上下篇导航
  clients-data.ts         # Agent 工具数据
  demo-data.ts            # 未配置 Notion 时的演示数据
types/
  index.ts                # TypeScript 类型定义
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
