"use client";

import { useEffect } from "react";

export function ImageDragGuard() {
  useEffect(() => {
    function preventImageDrag(event: DragEvent) {
      if (
        event.target instanceof Element &&
        (event.target.closest("img") ||
          event.target.closest("a")?.querySelector("img"))
      ) {
        event.preventDefault();
      }
    }

    document.addEventListener("dragstart", preventImageDrag, true);
    return () => document.removeEventListener("dragstart", preventImageDrag, true);
  }, []);

  return null;
}
