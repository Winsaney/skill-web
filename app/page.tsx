import type { Metadata } from "next";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getPublishedSkills } from "@/lib/notion";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nick 的 AI Skills 库",
  description:
    "体系化整理 AI 使用技巧，涵盖提示词工程、工作流自动化等，持续更新中。",
  openGraph: {
    title: "Nick 的 AI Skills 库",
    description: "体系化整理 AI 使用技巧，持续更新中。",
    images: ["/og-default.png"]
  }
};

export default async function Home() {
  const skills = await getPublishedSkills();
  const categories = Array.from(
    new Set(skills.map((skill) => skill.category).filter(Boolean))
  );

  return (
    <main>
      <section className="hero-section">
        <p className="eyebrow">AI Skills / Notion CMS / 小红书实践</p>
        <h1>把零散的 AI 经验，整理成可以反复使用的 Skills。</h1>
        <p className="hero-copy">
          这里收集提示词工程、工作流自动化和内容创作中的方法、场景与示例。
          每个 Skill 都尽量写成可复用的解决方案，方便学习、分享和继续迭代。
        </p>
        <dl className="hero-stats" aria-label="站点统计">
          <div>
            <dt>{skills.length}</dt>
            <dd>Published Skills</dd>
          </div>
          <div>
            <dt>{categories.length}</dt>
            <dd>Categories</dd>
          </div>
          <div>
            <dt>1h</dt>
            <dd>ISR Refresh</dd>
          </div>
        </dl>
      </section>

      <CategoryFilter skills={skills} categories={categories} />
    </main>
  );
}
