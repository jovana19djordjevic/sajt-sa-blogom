import Image from "next/image";
import Link from "next/link";
import { formatDate, type Post } from "@/lib/posts";

// Palette colors for the tag chip on each card, used in rotation
const CHIP_COLORS = ["bg-orange", "bg-ice", "bg-mint", "bg-lime"];

export function PostMeta({ post }: { post: Post }) {
  return (
    <p className="text-sm opacity-70">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {" · "}
      {post.readingTime} min čitanja
      {post.draft && <span className="ml-2 text-orange">(nacrt)</span>}
    </p>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <li>
      <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mint/20">
          {post.cover && (
            <Image
              src={post.cover}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          {post.tags[0] && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-green ${CHIP_COLORS[index % CHIP_COLORS.length]}`}
            >
              {post.tags[0]}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <PostMeta post={post} />
          <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
              {post.title}
            </span>
          </h3>
          {post.description && (
            <p className="leading-relaxed opacity-75">{post.description}</p>
          )}
        </div>
      </Link>
    </li>
  );
}

/** Card grid of posts. Text color is inherited, so it works on light and dark sections. */
export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="opacity-70">Još nema objavljenih postova.</p>;
  }

  return (
    <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} index={index} />
      ))}
    </ul>
  );
}
