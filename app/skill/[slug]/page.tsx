import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotionContent } from "@/components/NotionContent";
import { DocsSidebar } from "@/components/DocsSidebar";
import { SkillSidebar } from "@/components/SkillSidebar";
import {
  getAdjacentSkills,
  getPublishedSkills,
  getSkillBySlug
} from "@/lib/notion";
import { getSkillSections } from "@/lib/skill-navigation";
import { getSidebarConfig } from "@/lib/sidebar-config";

export const revalidate = 3600;

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const skills = await getPublishedSkills();

  return skills.map((skill) => ({
    slug: skill.slug
  }));
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const skill = await getSkillBySlug(params.slug, { includeContent: false });

  if (!skill) {
    notFound();
  }

  return {
    title: skill.name,
    description: skill.summary,
    openGraph: {
      title: skill.name,
      description: skill.summary,
      images: [skill.icon ?? "/og-default.png"]
    }
  };
}

export default async function SkillPage({ params }: PageProps) {
  const [skill, sidebarConfig, adjacent, skills] = await Promise.all([
    getSkillBySlug(params.slug),
    getSidebarConfig(),
    getAdjacentSkills(params.slug),
    getPublishedSkills()
  ]);

  if (!skill) {
    notFound();
  }

  const sections = getSkillSections(skill);

  return (
    <main className="docs-page">
      <div className="docs-layout">
        <DocsSidebar config={sidebarConfig} />

        <div className="docs-content">
          <div className="skill-detail-shell">
            <SkillSidebar sections={sections} />

            <div className="skill-detail-main">
              <article className="article-layout">
                <nav className="breadcrumb" aria-label="面包屑">
                  <Link href="/">首页</Link>
                  {skill.category ? <Link href={`/#category=${encodeURIComponent(skill.category)}`}>{skill.category}</Link> : null}
                  <span>{skill.name}</span>
                </nav>

                <header className="article-header">
                  {skill.category ? (
                    <span className="category-pill">{skill.category}</span>
                  ) : null}
                  <h1>{skill.name}</h1>
                  <p>{skill.summary || "暂无简介"}</p>
                  <div className="article-actions" aria-label="外部链接">
                    {skill.githubUrl ? (
                      <a href={skill.githubUrl} target="_blank" rel="noreferrer">
                        在 GitHub 查看
                      </a>
                    ) : null}
                    {skill.xhsUrl ? (
                      <a href={skill.xhsUrl} target="_blank" rel="noreferrer">
                        查看小红书原帖
                      </a>
                    ) : null}
                  </div>
                </header>

                <NotionContent
                  blocks={skill.content}
                  fallbackSections={skill.demoSections}
                />
              </article>

              <nav className="pagination" aria-label="上一篇和下一篇">
                {adjacent.previous ? (
                  <Link href={`/skill/${adjacent.previous.slug}`}>
                    <span>上一篇</span>
                    {adjacent.previous.name}
                  </Link>
                ) : (
                  <span />
                )}
                {adjacent.next ? (
                  <Link href={`/skill/${adjacent.next.slug}`}>
                    <span>下一篇</span>
                    {adjacent.next.name}
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
