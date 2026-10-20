import Link from "next/link";
import { HeroCamera } from "@/components/HeroCamera";
import { Newsletter } from "@/components/Newsletter";
import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";

const LATEST_COUNT = 6;

export default async function Home() {
  const posts = (await getAllPosts()).slice(0, LATEST_COUNT);

  return (
    <>
      <HeroCamera />

      <Newsletter />

      <section className="bg-soft-white text-green">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 py-24 sm:py-32">
          <header className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <p className="w-fit rounded-full bg-orange px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
                Moda
              </p>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-tight">
                Garderoba koja priča priču
              </h2>
            </div>
            <p className="text-lg leading-relaxed opacity-80">
              Moda nije spisak pravila, već način da bez reči kažeš ko si. Ovde
              pišem o kombinacijama koje funkcionišu, o bojama koje se slažu i o
              komadima koji vrede svakog dinara, od opuštenih vikend izdanja do
              savršeno skrojenog odela.
            </p>
          </header>

          <PostList posts={posts} />

          <Link
            href="/blog"
            className="w-fit rounded-full bg-green px-6 py-3 font-semibold text-soft-white transition-transform hover:-translate-y-0.5"
          >
            Svi postovi →
          </Link>
        </div>
      </section>
    </>
  );
}
