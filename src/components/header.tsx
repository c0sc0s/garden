"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Navigation } from "./navigation";
export function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function updateScrollState() {
      if (headerRef.current) {
        headerRef.current.dataset.scrolled = String(window.scrollY > 12);
      }
    }
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header ref={headerRef} className="site-header">
      <Link
        className="fish-brand"
        href="/"
        aria-label="Garden 首页"
        draggable={false}
      >
        <span className="fish-sprite" aria-hidden="true" />
      </Link>
      <Navigation />
      <ThemeToggle />
    </header>
  );
}
