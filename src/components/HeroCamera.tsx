"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

// Where the taking (lower) lens sits in public/video/kamera.mp4, as fractions
// of the frame, and the diameter of its glass as a fraction of the frame width.
const LENS = { x: 0.478, y: 0.507, size: 0.093 };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
/** Progress of t within [start, end], mapped to 0..1. */
const range = (t: number, start: number, end: number) =>
  clamp((t - start) / (end - start));
const easeInOut = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;

/**
 * Scroll-driven hero: a video of a camera being wound zooms into the lens on
 * scroll, the background image opens up inside the lens until it fills the
 * screen, and then the closing text appears.
 */
export function HeroCamera() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const card = cardRef.current!;
    const video = videoRef.current!;
    const image = imageRef.current!;
    const intro = introRef.current!;
    const outro = outroRef.current!;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const t = reducedMotion.matches || scrollable <= 0
        ? 1
        : clamp(-rect.top / scrollable);

      // Lens position inside the sticky viewport (the card's offset parent).
      const width = card.offsetWidth;
      const height = card.offsetHeight;
      const lensX = card.offsetLeft + width * LENS.x;
      const lensY = card.offsetTop + height * LENS.y;
      const lensRadius = (width * LENS.size) / 2;
      const farthestCorner = Math.hypot(
        Math.max(lensX, window.innerWidth - lensX),
        Math.max(lensY, window.innerHeight - lensY),
      );

      // Zoom exponentially so the approach feels even, until the lens glass
      // covers the whole screen.
      const zoom = easeInOut(range(t, 0.06, 0.72));
      const scale = (farthestCorner / lensRadius) ** zoom;
      card.style.transformOrigin = `${width * LENS.x}px ${height * LENS.y}px`;
      card.style.transform = `scale(${scale})`;

      // The image opens up inside the lens and grows with it.
      const reveal = range(t, 0.28, 0.5);
      image.style.opacity = String(reveal);
      image.style.clipPath = `circle(${lensRadius * scale}px at ${lensX}px ${lensY}px)`;
      image.style.transform = `scale(${1.25 - 0.25 * range(t, 0.3, 1)})`;

      intro.style.opacity = String(1 - range(t, 0.02, 0.16));

      const outroIn = range(t, 0.74, 0.9);
      outro.style.opacity = String(outroIn);
      outro.style.transform = `translateY(${(1 - outroIn) * 32}px)`;
      outro.style.pointerEvents = outroIn > 0.5 ? "auto" : "none";

      // Keep the winding loop playing at the top; freeze it while zooming so
      // the lens doesn't drift away from the zoom point.
      if (t > 0.04 || reducedMotion.matches) {
        if (!video.paused) video.pause();
      } else if (video.paused) {
        video.play().catch(() => {});
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Uvod"
      className="relative h-[380svh] motion-reduce:h-svh"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-green">
        {/* Video of the camera; zooms into the lower lens on scroll */}
        <div
          ref={cardRef}
          className="relative aspect-[9/16] h-[min(72svh,150vw)] overflow-hidden rounded-[2rem] bg-black shadow-2xl will-change-transform"
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/video/kamera.mp4"
            poster="/video/kamera-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
        </div>

        {/* Background image, revealed through the lens */}
        <div
          ref={imageRef}
          className="absolute inset-0 opacity-0 will-change-[clip-path,transform]"
          style={{ clipPath: "circle(0px at 50% 50%)" }}
        >
          <Image
            src="/images/hero/casopisi.jpg"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green via-green/40 to-green/10" />
        </div>

        {/* Opening words around the camera */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-0 mx-auto flex max-w-6xl flex-col items-center justify-between px-5 py-5 text-center lg:flex-row lg:py-0"
        >
          <h1 className="contents font-display font-extrabold tracking-tight">
            <span className="text-[clamp(2.5rem,5.5vw,5.5rem)] leading-none text-soft-white">
              Moda
            </span>
            <span className="text-[clamp(2.5rem,5.5vw,5.5rem)] leading-none text-lime lg:text-right">
              kroz <br className="hidden lg:block" />
              objektiv
            </span>
          </h1>
          <p className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-muted lg:block">
            Skroluj ↓
          </p>
        </div>

        {/* Closing text over the background image */}
        <div
          ref={outroRef}
          className="absolute inset-x-0 bottom-0 opacity-0"
          style={{ pointerEvents: "none" }}
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 pb-16 sm:pb-24">
            <p className="rounded-full bg-lime px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-green">
              Blog o modi i stilu
            </p>
            <p className="max-w-3xl font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[0.95] tracking-tight text-soft-white">
              Stil se vidi u detaljima.
            </p>
            <p className="max-w-xl text-lg leading-relaxed text-soft-white/85">
              Trendovi, kombinacije i saveti za garderobu koja priča tvoju
              priču, bez pravila koja sputavaju.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="rounded-full bg-lime px-6 py-3 font-semibold text-green transition-transform hover:-translate-y-0.5"
              >
                Čitaj blog
              </Link>
              <Link
                href="/o-meni"
                className="rounded-full border border-soft-white/40 px-6 py-3 font-semibold text-soft-white transition-colors hover:border-soft-white hover:bg-soft-white/10"
              >
                O meni
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
