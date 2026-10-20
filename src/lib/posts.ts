import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { site } from "@/lib/site";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const WORDS_PER_MINUTE = 200;

export type Post = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover?: string;
  draft: boolean;
  readingTime: number;
};

function toDateString(value: unknown): string {
  // YAML parses unquoted dates (2026-10-20) into Date objects.
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

async function readPost(file: string): Promise<Post> {
  const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: String(data.title ?? ""),
    date: toDateString(data.date),
    description: String(data.description ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    draft: data.draft === true,
    readingTime: readingTime(content),
  };
}

/** All published posts, newest first. Drafts are visible only in development. */
export async function getAllPosts(): Promise<Post[]> {
  "use cache";
  const files = (await fs.readdir(POSTS_DIR)).filter((f) => /\.mdx?$/.test(f));
  const posts = await Promise.all(files.map(readPost));
  return posts
    .filter((post) => !post.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}

/** URL form of a tag: "Lično Iskustvo" -> "licno-iskustvo". */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Every tag with the number of posts using it, most used first. */
export async function getAllTags(): Promise<{ name: string; slug: string; count: number }[]> {
  const posts = await getAllPosts();
  const tags = new Map<string, { name: string; slug: string; count: number }>();
  for (const tag of posts.flatMap((post) => post.tags)) {
    const slug = tagSlug(tag);
    const entry = tags.get(slug) ?? { name: tag, slug, count: 0 };
    entry.count++;
    tags.set(slug, entry);
  }
  return [...tags.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, site.locale),
  );
}

export async function getPostsByTag(slug: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags.some((tag) => tagSlug(tag) === slug));
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat(site.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
