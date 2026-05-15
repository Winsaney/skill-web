import { NextResponse } from "next/server";
import { getPublishedSkills } from "@/lib/notion";

export const dynamic = "force-dynamic";

export interface SearchResult {
  type: "skill" | "doc";
  title: string;
  description: string;
  href: string;
  category?: string;
  icon?: string | null;
}

const STATIC_DOCS: SearchResult[] = [
  {
    type: "doc",
    title: "Agent Skills 概览",
    description: "了解 Agent Skills 的核心概念、设计理念与工作原理。",
    href: "/about",
    category: "文档"
  },
  {
    type: "doc",
    title: "Skill 格式规范",
    description: "完整的 Skill 文件格式规范，包括必填字段、元数据和内容结构。",
    href: "/specification",
    category: "文档"
  },
  {
    type: "doc",
    title: "支持的 Agent 工具",
    description: "查看目前支持 Agent Skills 格式的 AI 工具与平台列表。",
    href: "/clients",
    category: "文档"
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  const q = query.toLowerCase();

  // Search static docs
  const docResults = STATIC_DOCS.filter(
    (doc) =>
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      (doc.category?.toLowerCase().includes(q) ?? false)
  );

  // Search skills
  const skills = await getPublishedSkills();
  const skillResults: SearchResult[] = skills
    .filter(
      (skill) =>
        skill.name.toLowerCase().includes(q) ||
        skill.summary.toLowerCase().includes(q) ||
        skill.category.toLowerCase().includes(q)
    )
    .slice(0, 10)
    .map((skill) => ({
      type: "skill" as const,
      title: skill.name,
      description: skill.summary,
      href: `/skill/${skill.slug}`,
      category: skill.category,
      icon: skill.icon
    }));

  const results: SearchResult[] = [...docResults, ...skillResults];

  return NextResponse.json({ results });
}
