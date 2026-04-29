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
    <Link className="skill-card" href={`/skill/${skill.slug}`}>
      <div className="skill-card-topline">
        <span className="skill-icon" aria-hidden="true">
          {showImage ? (
            <Image
              alt=""
              height={38}
              loading="lazy"
              onError={() => setImageFailed(true)}
              src={skill.icon ?? ""}
              unoptimized
              width={38}
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

export const SkillCard = memo(SkillCardComponent);
