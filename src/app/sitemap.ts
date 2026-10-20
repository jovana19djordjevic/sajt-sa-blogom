import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  return [
    { url: site.url },
    { url: `${site.url}/blog`, lastModified: posts[0]?.date },
    { url: `${site.url}/o-meni` },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.date,
    })),
    ...tags.map((tag) => ({ url: `${site.url}/blog/tag/${tag.slug}` })),
  ];
}
