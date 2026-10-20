import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-5 py-24">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">
        Stranica nije pronađena
      </h1>
      <p className="text-muted">
        Stranica koju tražiš ne postoji ili je premeštena.
      </p>
      <Link href="/" className="text-accent hover:underline">
        ← Nazad na početnu
      </Link>
    </div>
  );
}
