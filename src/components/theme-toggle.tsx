"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );

  const label = mounted
    ? resolvedTheme === "dark"
      ? "切换到浅色模式"
      : "切换到深色模式"
    : "切换明暗主题";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <svg
        className="theme-glyph theme-glyph-sun"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="theme-stroke"
          pathLength="100"
          d="M15.5 9.3c3.7-.4 7.1 2.4 7 6.3.2 3.9-2.6 6.8-6.3 7-3.9.2-7-2.5-7.1-6.3-.2-3.6 2.5-6.7 6.4-7Z"
        />
        <g className="theme-rays">
          <path
            className="theme-stroke"
            pathLength="100"
            d="m15.4 2.7.3 3.1m.4 20 .3 3.2"
          />
          <path
            className="theme-stroke"
            pathLength="100"
            d="m25.3 6.3-2.1 2.3M8.6 23.5l-2.2 2"
          />
          <path
            className="theme-stroke"
            pathLength="100"
            d="m29 15.2-3 .4M5.8 16.1l-3.1-.2"
          />
          <path
            className="theme-stroke"
            pathLength="100"
            d="m25.8 25.1-2.4-2M8.3 8.6 6.1 6.2"
          />
        </g>
      </svg>
      <svg
        className="theme-glyph theme-glyph-moon"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="theme-stroke"
          pathLength="100"
          d="M20 4.8C13.2 4.1 6 10 6.4 17.8c.3 4.1 2.7 7.6 6.2 9 3.2 1.5 6.3 1.1 8.7-.2 3.1-1.4 4.7-3.8 5.5-6.8-4.4 2.2-9.2.9-11.5-2.8-2.6-4-.9-8.9 4.7-12.2Z"
        />
      </svg>
    </button>
  );
}
