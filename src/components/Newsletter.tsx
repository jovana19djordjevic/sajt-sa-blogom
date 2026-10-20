"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/newsletter";

const initialState: SubscribeState = { status: "idle" };

export function Newsletter() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);

  return (
    <section className="bg-lime text-green">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="flex flex-col gap-5">
          <p className="w-fit rounded-full bg-green px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-lime">
            Newsletter
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.75rem)] font-extrabold leading-[0.95] tracking-tight">
            Stil, direktno u tvoj inbox.
          </h2>
          <p className="max-w-lg text-lg leading-relaxed opacity-80">
            Jednom mesečno: novi postovi, kombinacije koje vredi probati i
            komadi koje trenutno nosim. Bez spama, odjava jednim klikom.
          </p>
        </div>

        {state.status === "done" ? (
          <div
            role="status"
            className="flex flex-col gap-3 rounded-3xl bg-green p-8 text-soft-white sm:p-10"
          >
            <p className="font-display text-3xl font-extrabold tracking-tight text-lime">
              Hvala ti!
            </p>
            <p className="leading-relaxed text-soft-white/85">
              Prijava je uspela. Prvi newsletter stiže uskoro.
            </p>
          </div>
        ) : (
          <form
            action={formAction}
            className="flex flex-col gap-4 rounded-3xl bg-green p-6 sm:p-8"
          >
            <label
              htmlFor="newsletter-email"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-mint"
            >
              Tvoja email adresa
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="ime@primer.com"
                aria-invalid={state.status === "error" || undefined}
                aria-describedby={
                  state.status === "error" ? "newsletter-error" : undefined
                }
                className="min-w-0 flex-1 rounded-full border border-border bg-soft-white px-5 py-3 text-green placeholder:text-green/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
              />
              <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-orange px-6 py-3 font-semibold text-green transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
              >
                {pending ? "Šaljem…" : "Prijavi se"}
              </button>
            </div>
            {state.status === "error" && (
              <p
                id="newsletter-error"
                role="alert"
                className="text-sm font-semibold text-orange"
              >
                {state.message}
              </p>
            )}
            <p className="text-sm text-muted">
              Tvoju adresu koristim samo za newsletter i nikome je ne dajem.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
