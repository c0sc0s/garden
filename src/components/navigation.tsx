"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

const links = [
  ["/", "ABOUT ME"],
  ["/blog", "BLOG"],
  ["/thoughts", "THOUGHTS"],
  ["/games", "GAMES"],
] as const;

export function Navigation() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const waveRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const wave = waveRef.current;
    if (!nav || !wave) return;

    function positionWave() {
      if (!nav || !wave) return;
      const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
      wave.style.opacity = active ? "1" : "0";
      if (!active) return;
      const bounds = active.getBoundingClientRect();
      const parent = nav.getBoundingClientRect();
      const inset = window.matchMedia("(max-width: 860px)").matches ? -11 : 2;
      wave.style.width = `${bounds.width}px`;
      wave.style.transform = `translate(${bounds.left - parent.left}px, ${bounds.bottom - parent.top + inset}px)`;
    }

    let flowTimer: ReturnType<typeof setTimeout> | undefined;
    if (wave.dataset.ready === "true") {
      wave.classList.remove("is-flowing");
      // Restart the water ripple when switching again before it has settled.
      void wave.getBoundingClientRect();
      wave.classList.add("is-flowing");
      flowTimer = setTimeout(() => wave.classList.remove("is-flowing"), 640);
    }
    positionWave();
    // Place the initial wave before enabling motion, then retain it across routes.
    const frame = requestAnimationFrame(() => {
      wave.dataset.ready = "true";
    });
    const observer = new ResizeObserver(positionWave);
    observer.observe(nav);
    nav.querySelectorAll("a").forEach((link) => observer.observe(link));
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(flowTimer);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <nav ref={navRef} aria-label="主导航">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={
            (href === "/" ? pathname === "/" : pathname.startsWith(href))
              ? "page"
              : undefined
          }
        >
          {label}
        </Link>
      ))}
      <svg
        ref={waveRef}
        className="nav-wave"
        viewBox="0 0 100 10"
        fill="none"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="none"
      >
        <path d="M-48 5Q-36 1-24 5T0 5T24 5T48 5T72 5T96 5T120 5T144 5T168 5" />
      </svg>
    </nav>
  );
}
