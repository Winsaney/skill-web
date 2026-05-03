import type { Metadata } from "next";
import { CategoryFilter } from "@/components/CategoryFilter";
import { getPublishedSkills } from "@/lib/notion";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Agent Skills",
  description:
    "体系化整理 AI 使用技巧，涵盖提示词工程、工作流自动化等，持续更新中。",
  openGraph: {
    title: "Agent Skills",
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
        <h1>Agent Skills</h1>
        <p className="hero-copy">
          体系化整理我在 AI 领域的实践方法论。每个 Skill 包含核心介绍、使用场景、实战示例。
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
        </dl>
      </section>

      <CategoryFilter skills={skills} categories={categories} />
    </main>
  );
}
