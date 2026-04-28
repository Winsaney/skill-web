import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[];
};

export interface SkillContentSection {
  title: string;
  body: string[];
  code?: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
  icon: string | null;
  githubUrl: string | null;
  xhsUrl: string | null;
  createdAt: string;
  status?: string;
  content?: NotionBlock[] | null;
  demoSections?: SkillContentSection[];
}
