import { site } from "@/lib/site";

export async function Footer() {
  // Cached so the current year doesn't make every page dynamic.
  "use cache";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-sm text-muted">
        <p>
          © {year} {site.author}
        </p>
        <ul className="flex gap-4">
          {site.social.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="/rss.xml" className="hover:text-foreground">
              RSS
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
