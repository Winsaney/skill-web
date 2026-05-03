import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsSidebar } from "@/components/DocsSidebar";
import { getPublishedSkills } from "@/lib/notion";
import { getSidebarConfig } from "@/lib/sidebar-config";

export const revalidate = 3600;

type PageProps = {
  params: { name: string };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const name = decodeURIComponent(params.name);
  return {
    title: name,
    description: `${name}分类下的所有 Skills。`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const categoryName = decodeURIComponent(params.name);

  const [skills, sidebarConfig] = await Promise.all([
    getPublishedSkills(),
    getSidebarConfig(),
  ]);

  const categorySkills = skills.filter((s) => s.category === categoryName);
  if (categorySkills.length === 0) notFound();

  return (
    <main className="docs-page">
      <div className="docs-layout">
        <DocsSidebar config={sidebarConfig} />

        <div className="docs-content">
          <article className="article-layout">
            <nav className="breadcrumb" aria-label="面包屑">
              <Link href="/">首页</Link>
              <span>{categoryName}</span>
            </nav>

            <header className="article-header">
              <h1>{categoryName}</h1>
              <p>
                {categoryName}分类下的 {categorySkills.length} 个 Skills。
              </p>
            </header>

            <div className="skill-grid" style={{ marginTop: "var(--space-8)" }}>
              {categorySkills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/skill/${skill.slug}`}
                  className="skill-card"
                >
                  <div className="skill-card-topline">
                    <h2>{skill.name}</h2>
                    {skill.icon ? (
                      <div className="skill-icon">
                        <img
                          src={skill.icon}
                          alt=""
                          width={38}
                          height={38}
                        />
                      </div>
                    ) : null}
                  </div>
                  <p>{skill.summary}</p>
                  <div className="skill-card-meta">
                    {skill.category ? (
                      <span className="category-pill">{skill.category}</span>
                    ) : null}
                    <time dateTime={skill.createdAt}>
                      {new Date(skill.createdAt).toLocaleDateString("zh-CN")}
                    </time>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
