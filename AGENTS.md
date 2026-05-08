# 项目协作笔记

本文档记录我通读项目后整理出的关键信息，方便后续 Agent 或开发者快速接手。内容以当前仓库实际实现为准；`README.md` 和 `spec.md` 是重要背景材料，但部分细节已在源码中演进。

## 项目概览

- 项目名：`skill-web-codex`
- 产品形态：Agent Skills 展示站 / 文档站。
- 核心目标：体系化展示 AI Agent Skills 的概念、规范、示例、分类内容和支持该格式的 Agent 工具。
- 主要受众：对 AI Skills、Agent 工作流、AI 提效方法感兴趣的学习者和内容读者。
- 技术基座：Next.js 14 App Router + React 18 + TypeScript。
- 内容来源：优先读取 Notion 数据库；未配置 Notion 环境变量时自动使用 `lib/demo-data.ts` 的演示数据。
- 部署目标：Vercel，使用 ISR 和 Vercel Analytics / Speed Insights。

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

说明：

- `npm run dev` 启动 Next.js 开发服务器。
- `npm run build` 执行生产构建。
- `npm run lint` 使用 Next.js ESLint 配置。
- `npm run typecheck` 执行 `tsc --noEmit`。

## 环境变量

`.env.example` 中声明了：

```bash
NOTION_TOKEN=
NOTION_DATABASE_ID=
```

源码中还使用了：

```bash
NEXT_PUBLIC_SITE_URL=
```

用途：

- `NOTION_TOKEN`：Notion Integration Secret。
- `NOTION_DATABASE_ID`：Skills 数据库 ID。
- `NEXT_PUBLIC_SITE_URL`：生成 metadata、robots 和 sitemap 的站点根地址；未设置时回退到 `http://localhost:3000`。

注意：

- `.env.local` 已被 `.gitignore` 忽略，不要提交真实密钥。
- 如果缺少 `NOTION_TOKEN` 或 `NOTION_DATABASE_ID`，站点会调用演示数据，不会直接失败。

## 技术栈与依赖

- Next.js：`^14.2.0`，使用 App Router。
- React / React DOM：`^18.3.1`。
- TypeScript：严格模式开启，路径别名 `@/*` 指向项目根目录。
- Notion SDK：`@notionhq/client`。
- Notion 相关依赖：`notion-client`、`notion-types`、`react-notion-x` 已安装；当前源码主要使用自定义 Notion block 渲染器，同时在全局布局中引入了 `react-notion-x/src/styles.css`。
- Slug：`pinyin-pro`，用于中文 Skill 名称转拼音 URL。
- 主题：`next-themes`，默认亮色，禁用系统主题跟随。
- 图标：`lucide-react`，当前用于主题切换按钮。
- 观测：`@vercel/analytics` 和 `@vercel/speed-insights`。

## 目录结构

```text
app/
  layout.tsx              全局布局，注入字体、Nav、Footer、主题、Vercel 观测
  page.tsx                首页，包含 Hero、工作原理、Skills 列表、统计、CTA
  about/page.tsx          Agent Skills 概览文档
  specification/page.tsx  Skills 格式规范文档
  clients/page.tsx        支持 Agent Skills 的工具列表
  category/[name]/page.tsx 分类页
  skill/[slug]/page.tsx   Skill 详情页
  loading.tsx             全局加载骨架
  not-found.tsx           自定义 404
  robots.ts               robots 配置
  sitemap.ts              sitemap 配置
  globals.css             全局样式、设计令牌、响应式布局、深色模式

components/
  Nav.tsx                 顶部导航
  NavCta.tsx              仅首页展示的导航中部链接和 CTA
  Footer.tsx              页脚
  Hero.tsx                首页 Hero
  TrustBar.tsx            Agent 工具信任条
  CategoryFilter.tsx      客户端分类筛选
  SkillCard.tsx           Skill 卡片
  DocsSidebar.tsx         文档页左侧导航，移动端抽屉
  SkillSidebar.tsx        Skill 详情页右侧目录
  NotionContent.tsx       Notion block 与演示正文渲染
  ThemeProvider.tsx       next-themes Provider
  ThemeToggle.tsx         亮色 / 深色切换按钮

lib/
  notion.ts               Notion 数据获取、缓存、重试、嵌入数据库读取
  transform.ts            Notion Page 到 Skill 类型的适配层
  slug.ts                 Slug 归一化和中文转拼音
  sidebar-config.ts       从 Skills 动态生成文档侧边栏
  skill-navigation.ts     详情页目录与相关 Skills 逻辑
  clients-data.ts         Agent 工具数据
  demo-data.ts            未配置 Notion 时的演示 Skills

types/
  index.ts                Skill、NotionBlock、嵌入数据库等类型定义

public/
  静态图片和默认 OG 图
```

## 页面与路由

- `/`：首页。通过 `getPublishedSkills()` 获取 Skills，并计算分类数、Skill 数和工具数。
- `/about`：Agent Skills 概览，使用 `DocsSidebar`。
- `/specification`：Skills 格式规范，使用 `DocsSidebar`。
- `/clients`：Agent 工具列表，数据来自 `lib/clients-data.ts`。
- `/category/[name]`：按分类展示 Skills；没有匹配分类时调用 `notFound()`。
- `/skill/[slug]`：Skill 详情页；生成静态参数、动态 metadata、正文、左侧文档导航、右侧本页目录和上一篇 / 下一篇。
- `/robots.txt` 和 `/sitemap.xml`：由 App Router metadata route 生成。

所有主要页面都设置了：

```ts
export const revalidate = 3600;
```

即 ISR 缓存 1 小时。

## 数据流

主要入口在 `lib/notion.ts`：

1. `getPublishedSkills()` 判断 Notion 配置是否完整。
2. 未配置时返回 `demoSkills`，并按 `createdAt` 降序排列。
3. 已配置时查询 Notion 数据库，只取 `Status = Published` 的页面。
4. Notion 原始页面经过 `transformNotionPage()` 转为干净的 `Skill` 对象。
5. 列表数据使用 `unstable_cache(..., { revalidate: 3600 })` 缓存，并用 React `cache()` 去重。
6. `getSkillBySlug(slug)` 先从 Published Skills 中定位 Skill；详情页默认会继续读取该页面的 block children。
7. 如果正文中有 `child_database` block，会递归读取嵌入数据库并转成表格数据。

Notion 请求具备轻量重试：

- 重试次数：3 次。
- 初始延迟：450ms，并按 attempt 递增。
- 会重试 429、5xx 和常见网络错误。

## Skill 数据模型

核心类型在 `types/index.ts`：

```ts
interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  icon: string | null;
  githubUrl: string | null;
  xhsUrl: string | null;
  createdAt: string;
  status?: string;
  content?: NotionBlock[] | null;
  demoSections?: SkillContentSection[];
}
```

Notion 字段约定：

- `Name`：标题。
- `Status`：Select；仅展示 `Published`。
- `Category`：Select 或 Multi Select；如果是 Multi Select，只取第一个分类。
- `Summary`：Rich Text。
- `Slug`：Rich Text；可选。
- `Icon`：Files；支持 Notion file 或 external file。
- `GitHub URL` / `Github URL`：URL；两种拼写都兼容。
- `XHS URL`：URL。
- `Created At`：Created time；缺失时回退到页面 `created_time`。

## Slug 规则

实现位置：`lib/slug.ts`。

- 优先使用 Notion 的 `Slug` 字段。
- 否则根据 `Name` 生成。
- 英文和数字保留并转小写。
- 中文通过 `pinyin-pro` 转无声调拼音。
- 非 `a-z0-9` 字符统一归一化为 `-`。
- 空结果回退为 `untitled-skill`。

示例：

```text
Prompt 分层架构法 -> prompt-fen-ceng-jia-gou-fa
Chain of Thought -> chain-of-thought
```

## Notion 正文渲染

实现位置：`components/NotionContent.tsx`。

当前不是简单把 Notion 原始结构直接交给页面组件，而是自定义渲染以下 block：

- paragraph
- heading_1 / heading_2 / heading_3
- bulleted_list_item / numbered_list_item
- quote
- callout
- code
- divider
- image
- table / table_row
- child_database
- to_do
- toggle

渲染细节：

- 富文本支持 bold、italic、strikethrough、underline、inline code 和链接。
- 连续列表项会合并成同一个 `ul` 或 `ol`。
- 嵌套 block 通过 `NestedBlocks` 递归渲染。
- 详情页目录通过 heading block 自动生成锚点。
- 没有 Notion 正文时，演示数据使用 `demoSections` 渲染。

## 导航与侧边栏

- `lib/sidebar-config.ts` 从 Published Skills 动态生成全局文档侧边栏。
- 固定文档链接包括：
  - Skills 概览：`/about`
  - Skills 规范：`/specification`
  - Agent 工具：`/clients`
- 每个分类会成为侧边栏分组，组内列出该分类下的 Skills。
- `DocsSidebar` 是客户端组件，支持：
  - 当前路径高亮
  - 分组折叠
  - 移动端抽屉
  - ESC 关闭
  - 打开时锁定 body 滚动
- `SkillSidebar` 是详情页右侧目录，只在存在 heading 或演示 section 时展示。

## UI 与设计系统

全局样式集中在 `app/globals.css`，体量较大，是项目视觉系统的核心。

设计方向：

- Claude / Anthropic 风格的暖色、极简、文档感界面。
- 默认背景是暖奶油色，并带细网格背景。
- 主要强调色是 coral：`#cc785c`。
- 暗色模式通过 `html.dark` 覆盖 CSS 变量。
- 展示标题使用 `Cormorant Garamond`。
- 正文使用 Next Font 加载的 `Inter`。
- 代码使用 `JetBrains Mono`。

重要布局：

- 顶部导航 sticky，高度约 64px。
- 首页 Hero 约占满首屏。
- Skills 卡片在 640px 以上为 2 列，1024px 以上为 3 列。
- 文档页 1100px 以上固定左侧导航。
- Skill 详情页 800px 以上显示右侧目录。
- 移动端会隐藏首页中部导航、Hero 代码块和部分装饰元素。

## 已知实现细节与注意事项

- `AGENTS.md` 当前是新增的项目说明文件，原文件为空。
- 仓库中存在 `.env.local`，但不要读取、打印或提交其中的真实值。
- `README.md` / `spec.md` 提到 `react-notion-x` 直接渲染正文；当前源码实际上主要使用 `components/NotionContent.tsx` 的自定义渲染逻辑。
- `package.json` 里保留了 `notion-client`、`notion-types`、`react-notion-x` 依赖；改动前确认是否还需要它们。
- 首页“查看全部”和 CTA 中有写死的 `/category/产品经理` 链接；如果真实 Notion 数据里没有该分类，会进入 404。
- CSS 中有若干固定分类色映射，例如 `提示工程`、`代码开发`、`内容创作`、`数据分析`、`安全审计`、`文档处理`、`工作流自动化`。新增分类时若想有专属色，需要补充 `data-category` 样式。
- 演示数据里存在 `提示词工程`，而 CSS 固定映射里是 `提示工程`；该分类会使用默认卡片强调色。
- `NavHomeLinks` 和 `NavCta` 只在首页展示，其他页面导航更简洁。
- `SkillCard` 是客户端组件，原因是需要处理图片加载失败状态。
- `CategoryFilter` 使用 URL hash 中的 `category=` 初始化筛选，并在命中时滚动到 Skills 区域；点击筛选按钮本身不更新 hash。
- Notion URL 字段会通过正则提取第一个 `http(s)` 链接，避免混入额外文本。
- `getRelatedSkills()` 当前定义了相关 Skills 逻辑，但实际详情页没有使用。
- `.claude/settings.local.json` 是本地工具权限配置，不属于站点运行逻辑。

## 修改建议

后续改动时优先遵守这些边界：

- UI 组件不要直接依赖 Notion 原始 API 结构，应通过 `lib/transform.ts` 和 `types/index.ts`。
- 新增 Notion 字段时，同时更新类型、转换函数和文档说明。
- 新增页面时检查是否需要 `revalidate`、metadata、侧边栏入口和 sitemap。
- 新增分类时检查首页筛选、侧边栏分组、分类页 URL 编码和 CSS 分类色。
- 调整 Notion 正文能力时，优先扩展 `NotionContent.tsx` 的 block 渲染器。
- 涉及视觉变更时先看 `globals.css` 的 CSS 变量和已有类名，尽量复用设计令牌。
- 对外链保持 `target="_blank"` 与 `rel="noreferrer"`。
- 保持中文内容和中文 metadata 的一致性。

## 验证清单

文档或小改动：

```bash
npm run typecheck
npm run lint
```

页面或数据层改动：

```bash
npm run build
```

建议手动检查：

- 首页 `/`
- Skill 详情页 `/skill/[slug]`
- 分类页 `/category/[name]`
- 文档页 `/about`、`/specification`、`/clients`
- Notion 未配置时的演示数据回退
- 移动端侧边栏抽屉
- 深色模式
- 404 页面

## Git 状态备注

本次整理前，`AGENTS.md` 已存在但为空，并处于未跟踪状态。除写入该文件外，不应修改其他文件。
