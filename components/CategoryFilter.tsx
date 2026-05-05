"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SkillCard } from "@/components/SkillCard";
import type { Skill } from "@/types";

const ALL = "全部";

function getCategoryFromHash(): string {
  if (typeof window === "undefined") return ALL;
  const match = window.location.hash.match(/[#&]category=([^&]*)/);
  if (!match) return ALL;
  const decoded = decodeURIComponent(match[1]);
  return decoded || ALL;
}

export function CategoryFilter({
  skills,
  categories
}: {
  skills: Skill[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState(ALL);

  const handleCategoryClick = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  useEffect(() => {
    function syncCategoryFromHash() {
      const hashCategory = getCategoryFromHash();
      setActiveCategory(hashCategory);
      return hashCategory;
    }

    const initialCategory = syncCategoryFromHash();
    window.addEventListener("hashchange", syncCategoryFromHash);

    if (initialCategory !== ALL) {
      document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
    }

    return () => {
      window.removeEventListener("hashchange", syncCategoryFromHash);
    };
  }, []);

  const visibleSkills = useMemo(() => {
    if (activeCategory === ALL) {
      return skills;
    }

    return skills.filter((skill) => skill.category === activeCategory);
  }, [activeCategory, skills]);

  const filterItems = [ALL, ...categories];

  return (
    <>
      <div className="category-filter" aria-label="按分类筛选">
        {filterItems.map((category) => (
          <button
            className="filter-chip"
            data-active={activeCategory === category}
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {visibleSkills.length > 0 ? (
        <div className="skill-grid">
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
    </>
  );
}
