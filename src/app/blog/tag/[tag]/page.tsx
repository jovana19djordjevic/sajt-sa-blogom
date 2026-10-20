import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostList } from "@/components/PostList";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag: tag.slug }));
}

async function findTag(slug: string) {
  const tags = await getAllTags();
  return tags.find((tag) => tag.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const tag = await findTag((await params).tag);
  if (!tag) return {};
  return {
    title: `#${tag.name}`,
    description: `Postovi sa tagom #${tag.name}.`,
  };
}

export default async function TagPage({ params }: PageProps<"/blog/tag/[tag]">) {
  const tag = await findTag((await params).tag);
  if (!tag) notFound();

  const posts = await getPostsByTag(tag.slug);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-16 sm:py-24">
      <header className="flex flex-col gap-2">
        <Link href="/blog" className="text-sm text-muted hover:text-foreground">
          ← Svi postovi
        </Link>
        <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-none tracking-tight">#{tag.name}</h1>
      </header>
      <PostList posts={posts} />
    </div>
  );
}
