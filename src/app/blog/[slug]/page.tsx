import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostMeta } from "@/components/PostList";
import { TagList } from "@/components/TagList";
import { getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [site.author],
      tags: post.tags,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) notFound();

  const post = posts[index];
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const { default: Content } = await import(
    `../../../../content/posts/${slug}.mdx`
  );

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-10 px-5 py-16">
      <header className="flex flex-col gap-4">
        <PostMeta post={post} />
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <TagList tags={post.tags} />
      </header>

      {post.cover && (
        <Image
          src={post.cover}
          alt=""
          width={0}
          height={0}
          sizes="(max-width: 768px) 100vw, 672px"
          preload
          className="h-auto w-full rounded-3xl"
        />
      )}

      <div className="prose max-w-none prose-img:rounded-lg">
        <Content />
      </div>

      <nav className="grid gap-4 border-t border-border pt-8 text-sm sm:grid-cols-2">
        {older && (
          <Link href={`/blog/${older.slug}`} className="group flex flex-col gap-1">
            <span className="text-muted">← Stariji post</span>
            <span className="group-hover:text-accent">{older.title}</span>
          </Link>
        )}
        {newer && (
          <Link
            href={`/blog/${newer.slug}`}
            className="group flex flex-col gap-1 sm:col-start-2 sm:text-right"
          >
            <span className="text-muted">Noviji post →</span>
            <span className="group-hover:text-accent">{newer.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
