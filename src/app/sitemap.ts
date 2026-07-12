import { siteConfig } from "@/data/siteConfig";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteConfig.origin, changeFrequency: "weekly", priority: 1 }];
}
