# 📄 AI Skills 展示网站设计规格文档

> **版本**：v1.1  
> **最后更新**：2026-04-28  
> **状态**：✅ 已确认，可开始开发

---

## 1. 概述

### 1.1 项目目的
为小红书 AI 博主打造一个极简专业的个人网站，体系化展示 AI Skills（介绍、场景、示例、实践），方便快速分享给粉丝，彰显对 AI 解决方案的专业思考能力。

### 1.2 目标受众
小红书评论/私信的粉丝，对 AI 解决方案感兴趣的学习者。

### 1.3 核心风格
**极简专业风（Notion/Claude 风格）**：内容为王，大量留白，黑白灰为主色调，突出逻辑与条理。

---

## 2. 技术架构

### 2.1 技术栈

| 层次 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | Next.js 14 (App Router) | React 框架，支持 ISR |
| 内容管理 | Notion（Headless CMS） | 写内容的后台 |
| 内容渲染 | `react-notion-x` | 渲染 Notion Block，无需手写解析器 |
| Slug 生成 | `pinyin-pro` | 中文名称转拼音 slug |
| 部署平台 | Vercel | 免费额度，ISR 原生支持 |

### 2.2 数据流向

```
[Notion 数据库]
    ↓ Notion API（构建时 / ISR 触发时）
[lib/notion.ts → lib/transform.ts]  ← 数据适配层
    ↓ 干净的 Skill 对象
[Next.js 页面组件]
    ↓ 静态生成（ISR）
[Vercel CDN]
    ↓ 访客浏览器
```

### 2.3 成本评估

| 项目 | 费用 |
|------|------|
| 服务器 / Vercel | 0 元（免费额度） |
| Notion API | 0 元（个人免费账号） |
| 域名（按需） | 约 60 元/年 |
| **合计** | **约 60 元/年** |

### 2.4 环境变量

```bash
# .env.local（本地开发，不提交到 Git）
NOTION_TOKEN=your_notion_integration_secret
NOTION_DATABASE_ID=your_skills_database_id

# .env.example（提交到 Git，作为配置参考）
NOTION_TOKEN=
NOTION_DATABASE_ID=
```

Vercel 部署时，需在项目 Settings → Environment Variables 中填写以上两个变量。

### 2.5 文件目录结构

```
/
├── app/
│   ├── page.tsx              # 首页（Skills 列表 + 个人介绍）
│   ├── skill/
│   │   └── [slug]/
│   │       └── page.tsx      # 详情页（单个 Skill）
│   ├── layout.tsx            # 根布局（Nav + Footer + 全局样式）
│   ├── globals.css           # 全局 CSS（包含 Design Token）
│   └── not-found.tsx         # 自定义 404 页面
├── lib/
│   ├── notion.ts             # Notion API 调用封装
│   ├── transform.ts          # 数据适配层：Notion 原始数据 → Skill 对象
│   └── slug.ts               # generateSlug() 工具函数
├── components/
│   ├── SkillCard.tsx         # 首页 Skill 卡片
│   ├── CategoryFilter.tsx    # 分类筛选标签（客户端组件）
│   ├── Nav.tsx               # 顶部导航
│   └── Footer.tsx            # 页脚
├── types/
│   └── index.ts              # Skill interface 等类型定义
├── public/
│   └── og-default.png        # 默认 OG 分享图
└── .env.example
```

---

## 3. 数据模型

### 3.1 Notion 数据库字段

| 字段名 | Notion 类型 | 必填 | 说明 | Notion API 原始路径 |
|--------|------------|------|------|-------------------|
| Name | Title | ✅ | Skill 名称，如 "Prompt分层架构法" | `page.properties.Name.title[0].plain_text` |
| Status | Select | ✅ | `Draft` / `Published`，仅展示 Published | `page.properties.Status.select.name` |
| Category | Select | ✅ | 分类，如 `提示词工程`、`工作流自动化`，用于首页筛选 | `page.properties.Category.select.name` |
| Summary | Text | ✅ | 一句话简介，用于首页卡片展示 | `page.properties.Summary.rich_text[0].plain_text` |
| Slug | Text | ❌ | 自定义 URL，可选，为空则自动生成 | `page.properties.Slug.rich_text[0]?.plain_text` |
| GitHub URL | URL | ❌ | 对应 GitHub 文件链接，用于「在 GitHub 查看」按钮 | `page.properties["GitHub URL"].url` |
| XHS URL | URL | ❌ | 对应小红书原帖链接，用于「查看小红书原帖」按钮 | `page.properties["XHS URL"].url` |
| Icon | Files | ❌ | Skill 图标/封面图 | `page.properties.Icon.files[0]?.file?.url` |
| Created At | Created time | ✅ | 自动记录，用于排序 | `page.properties["Created At"].created_time` |

### 3.2 前端数据模型（TypeScript）

```typescript
// types/index.ts
interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  icon: string | null;
  githubUrl: string | null;      // GitHub 文件链接，可选
  xhsUrl: string | null; // 小红书原帖链接（XHS URL），可选
  createdAt: string;
  content?: AnyBlock[]; // 仅详情页需要，react-notion-x 所需结构
}
```

### 3.3 正文结构模板（Notion 页面内）

每个 Skill 的 Notion 页面按以下固定结构编写，保持一致性：

```
## 🎯 介绍
这个 Skill 是什么，解决什么核心问题

## 🌍 使用场景
- 场景 1：...
- 场景 2：...

## 💡 使用示例
具体的提示词 / 代码 / 操作截图

## 🔧 我的实践
真实使用经验、踩坑心得、效果反馈
```

---

## 4. UI 设计规格

### 4.1 颜色系统（CSS Token）

```css
/* globals.css */
:root {
  /* 背景 */
  --color-bg:            #ffffff;
  --color-bg-secondary:  #f7f7f5;
  --color-bg-hover:      #f1f0ef;

  /* 边框 */
  --color-border:        #e8e8e4;
  --color-border-strong: #d3d3cf;

  /* 文字 */
  --color-text-primary:  #1a1a1a;
  --color-text-secondary:#5a5a5a;
  --color-text-muted:    #787774;

  /* 强调色（链接/标签 active 状态） */
  --color-accent:        #2383e2;
  --color-accent-bg:     #e8f1fb;

  /* 标签默认背景 */
  --color-tag-bg:        #f1f0ef;

  /* 代码块背景 */
  --color-code-bg:       #f4f4f0;
}
```

### 4.2 字体规格

```css
/* 字体族 */
--font-sans:  'Geist', 'SF Pro Text', -apple-system, system-ui, sans-serif;
--font-mono:  'Geist Mono', 'SF Mono', 'Fira Code', monospace;

/* 字号比例 */
--text-xs:   12px;   /* 辅助信息、时间戳 */
--text-sm:   14px;   /* 标签文字、元信息 */
--text-base: 16px;   /* 正文默认 */
--text-lg:   18px;   /* 卡片标题 */
--text-xl:   24px;   /* 页面副标题 */
--text-2xl:  32px;   /* 页面主标题 */

/* 行高 */
--leading-tight:  1.3;   /* 标题 */
--leading-normal: 1.6;   /* 正文 */
--leading-relaxed:1.75;  /* 长文阅读 */

/* 字重 */
--font-normal:  400;
--font-medium:  500;
--font-semibold:600;
```

引入方式（`layout.tsx` 中）：
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono&display=swap" rel="stylesheet" />
```

### 4.3 间距系统

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-6:  24px;
--space-8:  32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
```

### 4.4 组件视觉状态

#### Skill 卡片
| 状态 | 样式 |
|------|------|
| 默认 | 白底，`1px solid var(--color-border)`，`border-radius: 8px`，`padding: 20px` |
| Hover | `background: var(--color-bg-secondary)`，边框颜色 → `var(--color-border-strong)`，`transition: all 150ms ease` |
| Loading | 骨架屏：灰色圆角占位块，宽高与内容一致 |

#### 分类筛选标签
| 状态 | 样式 |
|------|------|
| 默认 | `background: var(--color-tag-bg)`，`color: var(--color-text-secondary)`，`border-radius: 6px`，`padding: 4px 12px`，`font-size: 14px` |
| Active | `background: var(--color-text-primary)`，`color: #ffffff` |
| Hover（非 active） | `background: var(--color-border)`，`transition: 100ms` |

#### 404 / 空状态
- 居中布局，图标 + 一句话提示 + 返回首页按钮
- 文字：`var(--color-text-muted)`，`font-size: 16px`
- 按钮：边框风格（outline），`border: 1px solid var(--color-border-strong)`

### 4.5 响应式断点

| 断点 | 屏幕宽度 | 卡片列数 | 侧边距 |
|------|---------|---------|--------|
| 手机 | `< 640px` | 1 列 | `16px` |
| 平板 | `640px ~ 1024px` | 2 列 | `32px` |
| 桌面 | `> 1024px` | 3 列 | 居中，最大宽度 `1200px` |

> 详情页正文内容区在所有断点下最大宽度均为 `720px`，左右自动居中。

---

## 5. 模块设计

### 5.1 首页（`/`）

**页面组件树：**
```
<Page>
  <Nav />
  <HeroSection />        ← 个人简介（2-3 行文字）
  <CategoryFilter />     ← 分类筛选标签（客户端组件）
  <SkillGrid>
    <SkillCard />        ← 重复 N 次
  </SkillGrid>
  <Footer />
```

**交互行为：**
- 分类筛选：客户端 JS 过滤，无页面刷新，点击标签后卡片列表平滑过渡（`opacity + transform`）
- 默认显示全部 Published Skills，按 `Created At` 降序

### 5.2 详情页（`/skill/[slug]`）

**页面组件树：**
```
<Page>
  <Nav />
  <Breadcrumb>首页 › 分类 › Skill名</Breadcrumb>
  <article>
    <header>
      <h1>{skill.name}</h1>
      <CategoryTag>{skill.category}</CategoryTag>
    </header>
    <NotionContent />    ← react-notion-x 渲染正文
  </article>
  <Pagination>          ← 上一篇 / 下一篇
  <Footer />
```

**正文渲染：**
- 使用 `react-notion-x` 渲染 Notion Block Children
- 支持代码高亮（内置 `prism-react-renderer`）
- 内容区最大宽度 `720px`，行高 `1.75`，字号 `16px`

### 5.3 数据适配层（`lib/transform.ts`）

```typescript
// Notion 原始数据 → 干净的 Skill 对象
function transformNotionPage(page: PageObjectResponse): Skill {
  return {
    id:             page.id,
    name:           page.properties.Name.title[0]?.plain_text ?? '',
    status:         page.properties.Status.select?.name ?? 'Draft',
    category:       page.properties.Category.select?.name ?? '',
    summary:        page.properties.Summary.rich_text[0]?.plain_text ?? '',
    slug:           generateSlug(page),
    icon:           page.properties.Icon.files[0]?.file?.url ?? null,
    githubUrl:      page.properties["GitHub URL"].url ?? null,
    xhsUrl:         page.properties["XHS URL"].url ?? null,
    createdAt:      page.properties["Created At"].created_time,
  };
}
```

**原则：UI 组件不直接接触 Notion 原始数据结构，解耦 Notion API 变更风险。**

### 5.4 Slug 半自动生成（`lib/slug.ts`）

工具函数 `generateSlug(page)` 逻辑：
1. 优先读取 Notion 的 `Slug` 字段（Text 类型，非必填）
2. 若为空，从 `Name` 字段自动生成：
   - 英文保留原样，转小写
   - 中文用 `pinyin-pro` 转拼音
   - 空格、特殊字符替换为 `-`

```
"Prompt 分层架构法" → "prompt-fen-ceng-jia-gou-fa"
"Chain of Thought"  → "chain-of-thought"
```

---

## 6. 接口与缓存策略

### 6.1 数据获取

| 接口 | 调用时机 | 过滤条件 | 排序 | 返回字段 |
|------|---------|---------|------|---------|
| 列表 | 首页构建时 | `Status = Published` | `Created At` 降序 | Name, Category, Summary, Icon, Slug |
| 详情 | 详情页构建时 | 通过 Slug / Page ID | — | 全部属性 + Block Children |

### 6.2 ISR 缓存策略

```typescript
// 首页 page.tsx
export const revalidate = 3600; // 1 小时

// 详情页 [slug]/page.tsx
export const revalidate = 3600;
```

**选择 3600 秒的理由：**
- 个人站点内容更新频率低（通常每周 1-2 次）
- 60 秒会产生大量无效 Notion API 调用
- 若需即时更新，在 Vercel 控制台手动 Redeploy（一键操作）

---

## 7. 错误处理

### 7.1 构建期错误

| 场景 | 处理方式 |
|------|---------|
| 首次构建时 Notion API 失败 | Vercel 拒绝部署，回滚到上一稳定版本，对访客无感知 |
| ISR revalidate 时 Notion API 失败 | Next.js 继续提供上一次成功构建的静态缓存页面，对访客无感知 |

> **注意**：不在数据层写 `try/catch` 返回空数组——构建期失败直接让 Vercel 回滚即可，运行时 ISR 失败由 Next.js 缓存兜底，无需额外代码。

### 7.2 前端防御性渲染

| 场景 | 处理方式 |
|------|---------|
| `Summary` 字段为空 | 不渲染简介区块，或显示默认文案"暂无简介" |
| `Category` 字段为空 | 不渲染分类标签，不崩溃 |
| Icon 图片加载失败 | `<Image onError>` 降级为默认占位图 |
| 访问不存在的 slug | `not-found.tsx` 渲染极简 404 页面 |

---

## 8. SEO 规格

### 8.1 首页

```typescript
export const metadata: Metadata = {
  title: 'Nick 的 AI Skills 库',
  description: '体系化整理 AI 使用技巧，涵盖提示词工程、工作流自动化等，持续更新中。',
  openGraph: {
    title: 'Nick 的 AI Skills 库',
    description: '体系化整理 AI 使用技巧，持续更新中。',
    images: ['/og-default.png'],
  },
};
```

### 8.2 详情页（动态生成）

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const skill = await getSkillBySlug(params.slug);
  return {
    title: `${skill.name} | AI Skills 库`,
    description: skill.summary,
    openGraph: {
      title: skill.name,
      description: skill.summary,
      images: [skill.icon ?? '/og-default.png'],
    },
  };
}
```

### 8.3 其他 SEO 配置
- `robots.txt`：允许所有爬虫
- `sitemap.xml`：Next.js App Router 自动生成，或手写静态文件

---

## 9. 测试场景

| 测试场景 | 预期结果 |
|---------|---------|
| Notion 新增 Skill 并设为 Published | 1 小时内网站首页自动出现该卡片（ISR） |
| Notion 暂无 Published 的 Skill | 首页显示友好空状态提示 |
| 访问不存在的 `/skill/xxx` | 显示自定义极简 404 页面 |
| 点击首页分类标签 | 卡片列表无刷新平滑过滤 |
| Skill 未填写 Slug 字段 | URL 自动生成中文拼音连字符格式 |
| 详情页包含大段代码块 | `react-notion-x` 正确高亮显示 |
| 手机端访问首页 | 1 列卡片布局，侧边距 16px，正常可读 |
| 微信/小红书分享链接 | OG 图、标题、描述正确展示 |

---

## 10. 关键决策记录

| 编号 | 决策 | 理由 |
|------|------|------|
| 1 | Next.js + Notion + Vercel | 零成本、高定制化、编辑体验最好 |
| 2 | ISR `revalidate: 3600` | 个人站点更新频率低，避免无效 API 调用 |
| 3 | 使用 `react-notion-x` 渲染正文 | 省去手写 Notion Block 解析器的巨大工作量 |
| 4 | 客户端 JS 筛选分类 | 数据量小，逻辑最简，无刷新体验最好 |
| 5 | 增加数据适配层（Transform） | UI 组件与 Notion 原始数据结构解耦，防止 API 变更破坏组件 |
| 6 | 去除 try/catch 返回空数组逻辑 | 信任 Vercel 回滚 + Next.js ISR 旧缓存原生机制，无需冗余代码 |
| 7 | Slug 半自动生成 | 日常不需维护，需要自定义时才填，降低内容录入心智负担 |

---

## 11. 下一步行动清单

- [ ] **Step 1 - 准备 Notion**：创建 Skills 数据库，按第 3 节字段建好列，录入 2-3 篇测试 Skill
- [ ] **Step 2 - 初始化项目**：`npx create-next-app@latest ./`，选 App Router + TypeScript
- [ ] **Step 3 - 安装依赖**：`npm install react-notion-x notion-client pinyin-pro`
- [ ] **Step 4 - 配置环境变量**：创建 `.env.local`，填入 `NOTION_TOKEN` 和 `NOTION_DATABASE_ID`
- [ ] **Step 5 - 实现数据层**：完成 `lib/notion.ts`、`lib/transform.ts`、`lib/slug.ts`
- [ ] **Step 6 - 实现 UI**：`globals.css`（Design Token）→ 组件 → 首页 → 详情页 → 404
- [ ] **Step 7 - 本地验证**：`npm run dev`，跑完第 9 节所有测试场景
- [ ] **Step 8 - 部署**：推送 GitHub → 绑定 Vercel → 配置环境变量 → 购买/绑定域名
