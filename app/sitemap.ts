import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** SPEC §11 — sitemap.xml 기본 생성. 단일 페이지이므로 항목은 `/` 하나. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
