import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** SPEC §11 — robots.txt 기본 생성 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
