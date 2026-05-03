import { getPublishedSkills } from "@/lib/notion";
import type { Skill } from "@/types";

export interface SidebarLink {
  label: string;
  href: string;
}

export interface SidebarGroup {
  title: string;
  href: string;
  items: SidebarLink[];
}

export interface SidebarConfig {
  links: SidebarLink[];
  groups: SidebarGroup[];
}

export async function getSidebarConfig(): Promise<SidebarConfig> {
  const skills = await getPublishedSkills();

  const links: SidebarLink[] = [
    { label: "Skills 概览", href: "/" },
    { label: "Skills 规范", href: "/specification" },
    { label: "Agent 工具", href: "/clients" },
  ];

  const categoryMap = new Map<string, Skill[]>();
  for (const skill of skills) {
    if (!skill.category) continue;
    const list = categoryMap.get(skill.category) ?? [];
    list.push(skill);
    categoryMap.set(skill.category, list);
  }

  const groups: SidebarGroup[] = Array.from(categoryMap.entries()).map(
    ([category, categorySkills]) => ({
      title: category,
      href: `/category/${encodeURIComponent(category)}`,
      items: categorySkills.map((s) => ({
        label: s.name,
        href: `/skill/${s.slug}`,
      })),
    })
  );

  return { links, groups };
}
