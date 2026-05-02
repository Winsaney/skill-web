import type { NotionBlock, Skill, SkillContentSection } from "@/types";

export type SkillSectionNavItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export function sectionIdFromBlock(block: Pick<NotionBlock, "id">) {
  return `section-${block.id}`;
}

export function sectionIdFromIndex(index: number) {
  return `section-${index + 1}`;
}

function richTextPlainText(items: Array<{ plain_text: string }>) {
  return items.map((item) => item.plain_text).join("").trim();
}

function headingText(block: NotionBlock) {
  switch (block.type) {
    case "heading_1":
      return richTextPlainText(block.heading_1.rich_text);
    case "heading_2":
      return richTextPlainText(block.heading_2.rich_text);
    case "heading_3":
      return richTextPlainText(block.heading_3.rich_text);
    default:
      return "";
  }
}

function headingLevel(block: NotionBlock): SkillSectionNavItem["level"] {
  return block.type === "heading_3" ? 3 : 2;
}

function collectNotionSections(blocks: NotionBlock[]) {
  const sections: SkillSectionNavItem[] = [];

  for (const block of blocks) {
    if (
      block.type === "heading_1" ||
      block.type === "heading_2" ||
      block.type === "heading_3"
    ) {
      const title = headingText(block);

      if (title) {
        sections.push({
          id: sectionIdFromBlock(block),
          title,
          level: headingLevel(block)
        });
      }
    }

    if (block.children?.length) {
      sections.push(...collectNotionSections(block.children));
    }
  }

  return sections;
}

function collectFallbackSections(sections: SkillContentSection[] = []) {
  return sections
    .map((section, index) => ({
      id: sectionIdFromIndex(index),
      title: section.title.trim(),
      level: 2 as const
    }))
    .filter((section) => section.title.length > 0);
}

export function getSkillSections(skill: Skill) {
  if (Array.isArray(skill.content)) {
    return collectNotionSections(skill.content);
  }

  return collectFallbackSections(skill.demoSections);
}

export function getRelatedSkills(
  currentSkill: Skill,
  skills: Skill[],
  limit = 5
) {
  const sameCategory = currentSkill.category
    ? skills.filter(
        (skill) =>
          skill.slug !== currentSkill.slug &&
          skill.category === currentSkill.category
      )
    : [];
  const categorySlugs = new Set(sameCategory.map((skill) => skill.slug));
  const fallbackSkills = skills.filter(
    (skill) =>
      skill.slug !== currentSkill.slug && !categorySlugs.has(skill.slug)
  );

  return [...sameCategory, ...fallbackSkills].slice(0, limit);
}
