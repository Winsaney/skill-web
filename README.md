# Nick 的 AI Skills 库

一个按 `spec.md` 实现的极简 AI Skills 展示站，基于 Next.js App Router、Notion 数据库、ISR 和 `react-notion-x`。

## 本地开发

```bash
npm install
npm run dev
```

未配置 `.env.local` 时，站点会使用 `lib/demo-data.ts` 中的演示数据，方便直接预览页面。

## Notion 配置

复制环境变量模板：

```bash
cp .env.example .env.local
```

然后填入：

```bash
NOTION_TOKEN=your_notion_integration_secret
NOTION_DATABASE_ID=your_skills_database_id
```

Notion 数据库字段请与 `spec.md` 第 3 节保持一致。列表数据使用官方 Notion API 获取；详情正文使用 `react-notion-x` 渲染 Notion 页面内容，因此生产环境中建议确保对应 Notion 页面可被读取。
