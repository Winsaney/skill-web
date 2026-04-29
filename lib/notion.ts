import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  PageObjectResponse,
  QueryDatabaseResponse
} from "@notionhq/client/build/src/api-endpoints";
import { unstable_cache } from "next/cache";
import { demoSkills } from "@/lib/demo-data";
import { transformNotionPage } from "@/lib/transform";
import type { NotionBlock, Skill } from "@/types";

const notionToken = process.env.NOTION_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;
const NOTION_RETRY_ATTEMPTS = 3;
const NOTION_RETRY_DELAY_MS = 450;

function hasNotionConfig() {
  return Boolean(notionToken && notionDatabaseId);
}

function createNotionClient() {
  return new Client({ auth: notionToken });
}

function isPageObjectResponse(
  result: QueryDatabaseResponse["results"][number]
): result is PageObjectResponse {
  return "properties" in result && result.object === "page";
}

function isBlockObjectResponse(
  result: PartialBlockObjectResponse | BlockObjectResponse
): result is BlockObjectResponse {
  return "type" in result && "has_children" in result;
}

function sortByCreatedAtDesc(skills: Skill[]) {
  return [...skills].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableNotionError(error: unknown) {
  const { code, status } = error as { code?: string; status?: number };

  return (
    status === 429 ||
    Boolean(status && status >= 500) ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED" ||
    code === "ENOTFOUND"
  );
}

async function withNotionRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= NOTION_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === NOTION_RETRY_ATTEMPTS || !isRetryableNotionError(error)) {
        throw error;
      }

      await delay(NOTION_RETRY_DELAY_MS * attempt);
    }
  }

  throw lastError;
}

async function getBlockChildren(
  notion: Client,
  blockId: string
): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let startCursor: string | undefined;

  do {
    const response = await withNotionRetry(() =>
      notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: startCursor
      })
    );

    for (const block of response.results.filter(isBlockObjectResponse)) {
      const nextBlock: NotionBlock = { ...block };

      if (block.has_children) {
        nextBlock.children = await getBlockChildren(notion, block.id);
      }

      blocks.push(nextBlock);
    }

    startCursor = response.next_cursor ?? undefined;
  } while (startCursor);

  return blocks;
}

async function getPublishedSkillsFromNotion(): Promise<Skill[]> {
  const notion = createNotionClient();
  const results: QueryDatabaseResponse["results"] = [];
  let startCursor: string | undefined;

  do {
    const response = await withNotionRetry(() =>
      notion.databases.query({
        database_id: notionDatabaseId!,
        page_size: 100,
        start_cursor: startCursor,
        filter: {
          property: "Status",
          select: {
            equals: "Published"
          }
        },
        sorts: [
          {
            property: "Created At",
            direction: "descending"
          }
        ]
      })
    );

    results.push(...response.results);
    startCursor = response.next_cursor ?? undefined;
  } while (startCursor);

  return results
    .filter(isPageObjectResponse)
    .map(transformNotionPage)
    .filter((skill) => skill.status === "Published");
}

const getCachedPublishedSkillsFromNotion = unstable_cache(
  getPublishedSkillsFromNotion,
  ["published-skills"],
  { revalidate: 3600 }
);

export async function getPublishedSkills(): Promise<Skill[]> {
  if (!hasNotionConfig()) {
    return sortByCreatedAtDesc(demoSkills);
  }

  return getCachedPublishedSkillsFromNotion();
}

export async function getSkillBySlug(
  slug: string,
  options: { includeContent?: boolean } = {}
): Promise<Skill | null> {
  const skills = await getPublishedSkills();
  const skill = skills.find((item) => item.slug === slug);

  if (!skill) {
    return null;
  }

  if (!hasNotionConfig() || options.includeContent === false) {
    return skill;
  }

  const notion = createNotionClient();
  const content = await getBlockChildren(notion, skill.id);

  return {
    ...skill,
    content
  };
}

export async function getAdjacentSkills(slug: string) {
  const skills = await getPublishedSkills();
  const currentIndex = skills.findIndex((skill) => skill.slug === slug);

  return {
    previous: currentIndex > 0 ? skills[currentIndex - 1] : null,
    next:
      currentIndex >= 0 && currentIndex < skills.length - 1
        ? skills[currentIndex + 1]
        : null
  };
}
