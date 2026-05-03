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
import type { EmbeddedNotionDatabase, NotionBlock, Skill } from "@/types";

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

type PageProperty = PageObjectResponse["properties"][string];

function richTextPlainText(items: Array<{ plain_text: string }>) {
  return items.map((item) => item.plain_text).join("").trim();
}

function dateText(date: { start: string; end: string | null } | null) {
  if (!date) {
    return "";
  }

  return date.end ? `${date.start} - ${date.end}` : date.start;
}

function formulaText(property: Extract<PageProperty, { type: "formula" }>["formula"]) {
  switch (property.type) {
    case "boolean":
      return property.boolean ? "Yes" : "No";
    case "date":
      return dateText(property.date);
    case "number":
      return property.number?.toString() ?? "";
    case "string":
      return property.string ?? "";
  }
}

function propertyText(property: PageProperty): string {
  switch (property.type) {
    case "checkbox":
      return property.checkbox ? "Yes" : "No";
    case "created_by":
      return "name" in property.created_by
        ? property.created_by.name ?? ""
        : property.created_by.id;
    case "last_edited_by":
      return "name" in property.last_edited_by
        ? property.last_edited_by.name ?? ""
        : property.last_edited_by.id;
    case "email":
      return property.email ?? "";
    case "phone_number":
      return property.phone_number ?? "";
    case "url":
      return property.url ?? "";
    case "created_time":
      return property.created_time;
    case "last_edited_time":
      return property.last_edited_time;
    case "number":
      return property.number?.toString() ?? "";
    case "date":
      return dateText(property.date);
    case "files":
      return property.files.map((file) => file.name).join(", ");
    case "formula":
      return formulaText(property.formula);
    case "multi_select":
      return property.multi_select.map((option) => option.name).join(", ");
    case "people":
      return property.people
        .map((person) => ("name" in person ? person.name ?? "" : person.id))
        .join(", ");
    case "relation":
      return property.relation.map((relation) => relation.id).join(", ");
    case "rich_text":
      return richTextPlainText(property.rich_text);
    case "rollup":
      if (property.rollup.type === "date") {
        return dateText(property.rollup.date);
      }

      if (property.rollup.type === "number") {
        return property.rollup.number?.toString() ?? "";
      }

      return property.rollup.array
        .map((item) => {
          if (item.type === "number") {
            return item.number?.toString() ?? "";
          }

          if (item.type === "date") {
            return dateText(item.date);
          }

          if (item.type === "select") {
            return item.select?.name ?? "";
          }

          if (item.type === "status") {
            return item.status?.name ?? "";
          }

          if (item.type === "multi_select") {
            return item.multi_select.map((option) => option.name).join(", ");
          }

          if (item.type === "checkbox") {
            return item.checkbox ? "Yes" : "No";
          }

          if (item.type === "files") {
            return item.files.map((file) => file.name).join(", ");
          }

          if (item.type === "url") {
            return item.url ?? "";
          }

          if (item.type === "email") {
            return item.email ?? "";
          }

          if (item.type === "phone_number") {
            return item.phone_number ?? "";
          }

          return "";
        })
        .filter(Boolean)
        .join(", ");
    case "select":
      return property.select?.name ?? "";
    case "status":
      return property.status?.name ?? "";
    case "title":
      return richTextPlainText(property.title);
    case "unique_id":
      return [property.unique_id.prefix, property.unique_id.number].filter(Boolean).join("-");
    case "button":
    case "verification":
      return "";
  }
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

async function getEmbeddedDatabase(
  notion: Client,
  databaseId: string,
  title: string
): Promise<EmbeddedNotionDatabase | undefined> {
  try {
    const results: QueryDatabaseResponse["results"] = [];
    let startCursor: string | undefined;

    do {
      const response = await withNotionRetry(() =>
        notion.databases.query({
          database_id: databaseId,
          page_size: 100,
          start_cursor: startCursor
        })
      );

      results.push(...response.results);
      startCursor = response.next_cursor ?? undefined;
    } while (startCursor);

    const pages = results.filter(isPageObjectResponse);
    const columns = Array.from(
      new Set(pages.flatMap((page) => Object.keys(page.properties)))
    );

    return {
      title,
      columns,
      rows: pages.map((page) =>
        Object.fromEntries(
          columns.map((column) => [
            column,
            page.properties[column] ? propertyText(page.properties[column]) : ""
          ])
        )
      )
    };
  } catch (error) {
    console.warn(`Unable to load embedded Notion database ${databaseId}`, error);
    return undefined;
  }
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

      if (block.type === "child_database") {
        nextBlock.database = await getEmbeddedDatabase(
          notion,
          block.id,
          block.child_database.title
        );
      }

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
