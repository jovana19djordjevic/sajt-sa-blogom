import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

const components: MDXComponents = {
  // Images from Markdown: ![opis](/images/posts/slug/slika.jpg)
  img: ({ src, alt }) => (
    <Image
      src={String(src)}
      alt={alt ?? ""}
      width={0}
      height={0}
      sizes="(max-width: 768px) 100vw, 672px"
      className="h-auto w-full rounded-3xl"
    />
  ),
  // Internal links use client-side navigation, external ones open in a new tab.
  a: ({ href = "", children, ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} {...props}>
        {children}
      </Link>
    ) : href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ) : (
      <a href={href} {...props}>
        {children}
      </a>
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
