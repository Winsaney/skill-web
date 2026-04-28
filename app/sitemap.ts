import type { MetadataRoute } from "next";
import { getPublishedSkills } from "@/lib/notion";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const skills = await getPublishedSkills();

  return [
    {
      url: siteUrl,
      lastModified: new Date()
    },
    ...skills.map((skill) => ({
      url: `${siteUrl}/skill/${skill.slug}`,
      lastModified: new Date(skill.createdAt)
    }))
  ];
}
