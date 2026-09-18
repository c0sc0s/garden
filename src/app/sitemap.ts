import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPosts } from "@/lib/posts";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/blog",
    "/thoughts",
    ...getPosts()
      .filter((post) => !post.draft)
      .map((post) => `/blog/${post.slug}`),
  ].map((route) => ({ url: new URL(route, site.url).href }));
}
