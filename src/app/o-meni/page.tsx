import type { Metadata } from "next";
import About from "../../../content/o-meni.mdx";

export const metadata: Metadata = {
  title: "O meni",
  description: "Nekoliko reči o meni.",
};

export default function AboutPage() {
  return (
    <div className="prose mx-auto max-w-2xl px-5 py-16 prose-img:rounded-3xl">
      <About />
    </div>
  );
}
