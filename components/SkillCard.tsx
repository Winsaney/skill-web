"use client";

import Link from "next/link";
import { useState } from "react";
import type { Skill } from "@/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export function SkillCard({ skill }: { skill: Skill }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(skill.icon && !imageFailed);
  const fallbackMark = skill.name.slice(0, 1).toUpperCase();

  return (
    <Link className="skill-card" href={`/skill/${skill.slug}`}>
      <div className="skill-card-topline">
        <span className="skill-icon" aria-hidden="true">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={skill.icon ?? ""}
              alt=""
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            fallbackMark
          )}
        </span>
        {skill.category ? (
          <span className="category-pill">{skill.category}</span>
        ) : null}
      </div>
      <h2>{skill.name}</h2>
      <p>{skill.summary || "暂无简介"}</p>
      <div className="skill-card-meta">
        <time dateTime={skill.createdAt}>{formatDate(skill.createdAt)}</time>
        <span aria-hidden="true">查看详情</span>
      </div>
    </Link>
  );
}
