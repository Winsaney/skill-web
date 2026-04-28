import { pinyin } from "pinyin-pro";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

function getRichText(page: PageObjectResponse, key: string) {
  const property = page.properties[key];

  if (!property || property.type !== "rich_text") {
    return "";
  }

  return property.rich_text.map((item) => item.plain_text).join("").trim();
}

function getTitle(page: PageObjectResponse) {
  const property = page.properties.Name;

  if (!property || property.type !== "title") {
    return "";
  }

  return property.title.map((item) => item.plain_text).join("").trim();
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateSlugFromName(name: string) {
  const pinyinText = pinyin(name, {
    toneType: "none",
    type: "array"
  }).join(" ");

  return normalizeSlug(pinyinText) || "untitled-skill";
}

export function generateSlug(page: PageObjectResponse) {
  const customSlug = getRichText(page, "Slug");

  if (customSlug) {
    return normalizeSlug(customSlug);
  }

  return generateSlugFromName(getTitle(page));
}
