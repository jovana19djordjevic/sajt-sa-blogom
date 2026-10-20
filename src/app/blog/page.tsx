import type { Metadata } from "next";
import { PostList } from "@/components/PostList";
import { TagList } from "@/components/TagList";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Svi postovi na blogu.",
};

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-16 sm:py-24">
      <header className="flex flex-col gap-4">
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-none tracking-tight">Blog</h1>
        <TagList
          tags={tags.map((tag) => tag.name)}
          counts={Object.fromEntries(tags.map((tag) => [tag.name, tag.count]))}
        />
      </header>
      <PostList posts={posts} />
    </div>
  );
}
