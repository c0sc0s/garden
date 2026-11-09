import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getPosts } from "@/lib/posts";
import { getGamePosts } from "@/lib/games";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    "",
    "/blog",
    "/thoughts",
    "/games",
    ...(await getGamePosts(false)).map((post) => `/games/${post.slug}`),
    ...getPosts()
      .filter((post) => !post.draft)
      .map((post) => `/blog/${post.slug}`),
  ].map((route) => ({ url: new URL(route, site.url).href }));
}
