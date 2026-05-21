# Agent Skills

Agent Skills 展示站 — 一种轻量、开放的 AI Agent 能力扩展格式。基于 Next.js 14 App Router + Notion Headless CMS 构建，采用 Anthropic Claude 品牌设计语言。

## 核心特性

- **Notion Headless CMS**：无缝对接 Notion 数据库，直接将文档和子表格转化为富文本呈现。
- **全局文档搜索**：基于原生 `<dialog>` 的全局搜索模块（快捷键 `⌘K` / `Ctrl+K`），原生支持 ESC 退出与焦点捕获。
- **现代化设计系统**：基于 Anthropic Claude 品牌设计规范，提供响应式布局以及优雅的亮色 / 暗色模式平滑切换。
- **极致性能**：采用 Next.js ISR 增量静态生成，静态缓存与定时刷新结合。

## 技术栈

| 层次 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 14 (App Router) | ISR 增量静态生成 |
| 内容 | Notion API | Headless CMS |
| 渲染 | react-notion-x | Notion Block 渲染（含表格、子数据库） |
| 字体 | Cormorant Garamond + Inter | Claude 品牌设计语言（Copernicus + StyreneB 替代） |
| Slug | pinyin-pro | 中文标题转拼音路径 |
| 主题 | next-themes | 亮色 / 暗色模式切换 |
| 部署 | Vercel | ISR + Analytics |

## 设计系统

基于 [Anthropic Claude 品牌设计规范](https://claude.ai)，核心设计令牌：

| 令牌 | 值 | 用途 |
|------|------|------|
| Canvas | `#faf9f5` | 暖奶油色页面底色 |
| Coral Primary | `#cc785c` | 主强调色（按钮、链接、CTA） |
| Ink | `#141413` | 主文本色 |
| Surface Dark | `#181715` | 深色表面（Footer、代码窗口） |
| Display Font | Cormorant Garamond | 衬线展示标题（Copernicus 开源替代） |
| Body Font | Inter | 无衬线正文（StyreneB 替代） |

## 页面

| 路径 | 说明 |
|------|------|
| `/` | Landing Page — Hero / TrustBar / 工作原理 / Skills 展示 / Stats / CTA |
| `/about` | Skills 概览 — Agent Skills 介绍文档 |
| `/skill/[slug]` | Skill 详情页（Notion 内容 + 双侧边栏导航） |
| `/category/[name]` | 分类页 — 按分类筛选 Skills |
| `/specification` | Skills 格式规范说明 |
| `/clients` | Agent 工具列表（Claude Code、Cursor、Amp 等） |

## 项目结构

```
app/
  api/search/route.ts     # 全局搜索 API 接口
  page.tsx                # Landing Page
  about/page.tsx          # Skills 概览（DocsSidebar 布局）
  layout.tsx              # 全局布局（Nav + Footer + ThemeProvider）
  globals.css             # 全局样式 + Claude 品牌设计令牌
  skill/[slug]/page.tsx   # Skill 详情页
  category/[name]/page.tsx # 分类页
  specification/page.tsx  # Skills 规范
  clients/page.tsx        # Agent 工具
  loading.tsx             # 加载状态
  not-found.tsx           # 404 页
  robots.ts / sitemap.ts  # SEO
components/
  Nav.tsx                 # 顶部导航（品牌 + 中间链接 + CTA）
  SearchModal.tsx         # 全局搜索弹窗 (原生 Dialog)
  SearchTrigger.tsx       # 全局搜索触发按钮
  Footer.tsx              # 深色页脚
  Hero.tsx                # Landing Hero（大标题 + 几何装饰 + 代码预览）
  TrustBar.tsx            # Agent 产品信任条
  ThemeProvider.tsx        # 暗色模式 Provider
  ThemeToggle.tsx         # 主题切换按钮
  SkillCard.tsx           # Skill 卡片（分类色标 + hover 动画）
  SkillSidebar.tsx        # 详情页右侧目录导航
  DocsSidebar.tsx         # 全局左侧边栏（桌面常驻 + 移动端抽屉）
  CategoryFilter.tsx      # 分类筛选器（客户端交互）
  NotionContent.tsx       # Notion 内容渲染器
lib/
  notion.ts               # Notion API 数据获取（React.cache 去重）
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
pnpm install
pnpm dev
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

## 常用命令

```bash
pnpm dev        # 启动开发服务器
pnpm build      # 生产构建
pnpm start      # 启动生产服务器
pnpm lint       # ESLint 检查
pnpm typecheck  # TypeScript 类型检查
```
