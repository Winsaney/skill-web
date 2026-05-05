"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";
import type { Skill } from "@/types";

const skillDateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

type SkillCardProps = {
  skill: Skill;
};

function formatDate(value: string) {
  return skillDateFormatter.format(new Date(value));
}

function SkillCardComponent({ skill }: SkillCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(skill.icon && !imageFailed);
  const fallbackMark = skill.name.slice(0, 1).toUpperCase();

  return (
    <Link
      className="skill-card"
      data-category={skill.category || undefined}
      href={`/skill/${skill.slug}`}
    >
      <div className="skill-card-topline">
        <span className="skill-icon" aria-hidden="true">
          {showImage ? (
            <Image
              alt=""
              height={40}
              loading="lazy"
              onError={() => setImageFailed(true)}
              src={skill.icon ?? ""}
              unoptimized
              width={40}
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
        <span className="skill-card-arrow" aria-hidden="true">
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export const SkillCard = memo(SkillCardComponent);
