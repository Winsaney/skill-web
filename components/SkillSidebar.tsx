import Link from "next/link";
import type { Skill } from "@/types";
import type { SkillSectionNavItem } from "@/lib/skill-navigation";

type SkillSidebarProps = {
  sections: SkillSectionNavItem[];
  relatedSkills: Array<Pick<Skill, "category" | "name" | "slug">>;
};

export function SkillSidebar({
  sections,
  relatedSkills
}: SkillSidebarProps) {
  return (
    <aside className="skill-sidebar" aria-label="Skill 页面导航">
      <div className="skill-sidebar-inner">
        <Link className="sidebar-home-link" href="/">
          <span aria-hidden="true">←</span>
          全部 Skills
        </Link>

        {sections.length > 0 ? (
          <section className="sidebar-block" aria-labelledby="page-toc-title">
            <h2 id="page-toc-title">本页目录</h2>
            <ol className="sidebar-list">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    className="sidebar-toc-link"
                    data-level={section.level}
                    href={`#${section.id}`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {relatedSkills.length > 0 ? (
          <section
            className="sidebar-block"
            aria-labelledby="related-skills-title"
          >
            <h2 id="related-skills-title">相关 Skill</h2>
            <ul className="sidebar-list">
              {relatedSkills.map((skill) => (
                <li key={skill.slug}>
                  <Link
                    className="sidebar-skill-link"
                    href={`/skill/${skill.slug}`}
                  >
                    <span>{skill.name}</span>
                    {skill.category ? <small>{skill.category}</small> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </aside>
  );
}
