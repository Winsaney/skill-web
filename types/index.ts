import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionBlock = BlockObjectResponse & {
  children?: NotionBlock[];
  database?: EmbeddedNotionDatabase;
};

export interface EmbeddedNotionDatabase {
  title: string;
  columns: string[];
  rows: Record<string, string>[];
}

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
