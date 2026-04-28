import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { generateSlug } from "@/lib/slug";
import type { Skill } from "@/types";

type PageProperty = PageObjectResponse["properties"][string];

function plainTitle(property: PageProperty | undefined) {
  if (!property || property.type !== "title") {
    return "";
  }

  return property.title.map((item) => item.plain_text).join("").trim();
}

function plainRichText(property: PageProperty | undefined) {
  if (!property || property.type !== "rich_text") {
    return "";
  }

  return property.rich_text.map((item) => item.plain_text).join("").trim();
}

function selectName(property: PageProperty | undefined) {
  if (!property || property.type !== "select") {
    return "";
  }

  return property.select?.name ?? "";
}

function categoryName(property: PageProperty | undefined) {
  if (!property) {
    return "";
  }

  if (property.type === "select") {
    return property.select?.name ?? "";
  }

  if (property.type === "multi_select") {
    return property.multi_select[0]?.name ?? "";
  }

  return "";
}

function urlValue(property: PageProperty | undefined) {
  if (!property || property.type !== "url") {
    return null;
  }

  if (!property.url) {
    return null;
  }

  const urlMatch = property.url.match(/https?:\/\/[^\s]+/);

  return urlMatch?.[0] ?? null;
}

function iconUrl(property: PageProperty | undefined) {
  if (!property || property.type !== "files") {
    return null;
  }

  const file = property.files[0];

  if (!file) {
    return null;
  }

  if ("file" in file) {
    return file.file.url;
  }

  return file.external.url;
}

function createdTime(property: PageProperty | undefined, page: PageObjectResponse) {
  if (!property || property.type !== "created_time") {
    return page.created_time;
  }

  return property.created_time;
}

export function transformNotionPage(page: PageObjectResponse): Skill {
  return {
    id: page.id,
    name: plainTitle(page.properties.Name),
    status: selectName(page.properties.Status),
    category: categoryName(page.properties.Category),
    summary: plainRichText(page.properties.Summary),
    slug: generateSlug(page),
    icon: iconUrl(page.properties.Icon),
    githubUrl:
      urlValue(page.properties["GitHub URL"]) ??
      urlValue(page.properties["Github URL"]),
    xhsUrl: urlValue(page.properties["XHS URL"]),
    createdAt: createdTime(page.properties["Created At"], page)
  };
}
