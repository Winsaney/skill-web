import type { SkillSectionNavItem } from "@/lib/skill-navigation";

type SkillSidebarProps = {
  sections: SkillSectionNavItem[];
};

export function SkillSidebar({ sections }: SkillSidebarProps) {
  if (sections.length === 0) return null;

  return (
    <aside className="skill-sidebar" aria-label="Skill 页面导航">
      <div className="skill-sidebar-inner">
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
      </div>
    </aside>
  );
}
