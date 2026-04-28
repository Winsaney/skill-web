"use client";

import { useMemo, useState } from "react";
import { SkillCard } from "@/components/SkillCard";
import type { Skill } from "@/types";

const ALL = "全部";

export function CategoryFilter({
  skills,
  categories
}: {
  skills: Skill[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState(ALL);

  const visibleSkills = useMemo(() => {
    if (activeCategory === ALL) {
      return skills;
    }

    return skills.filter((skill) => skill.category === activeCategory);
  }, [activeCategory, skills]);

  const filterItems = [ALL, ...categories];

  return (
    <section className="skills-section" id="skills" aria-labelledby="skills-title">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Library</p>
          <h2 id="skills-title">已整理的 Skills</h2>
        </div>
        <span className="skill-count">{visibleSkills.length} / {skills.length}</span>
      </div>

      <div className="category-filter" aria-label="按分类筛选">
        {filterItems.map((category) => (
          <button
            className="filter-chip"
            data-active={activeCategory === category}
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {visibleSkills.length > 0 ? (
        <div className="skill-grid" key={activeCategory}>
          {visibleSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">+</span>
          <p>这个分类下暂时没有 Published Skills。</p>
        </div>
      )}
    </section>
  );
}
