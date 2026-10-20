import Link from "next/link";
import { tagSlug } from "@/lib/posts";

export function TagList({
  tags,
  counts,
}: {
  tags: string[];
  counts?: Record<string, number>;
}) {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/blog/tag/${tagSlug(tag)}`}
            className="inline-block rounded-full border border-border px-3 py-0.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            #{tag}
            {counts?.[tag] !== undefined && ` (${counts[tag]})`}
          </Link>
        </li>
      ))}
    </ul>
  );
}
