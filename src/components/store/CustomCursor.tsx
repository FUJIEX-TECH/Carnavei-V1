"use client";
import { useEffect } from "react";

export function CustomCursor() {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    document.body.appendChild(cursor);

    const onMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [role='button']")) {
        cursor.classList.add("cursor-hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      if (!(e.relatedTarget as HTMLElement | null)?.closest("a, button, [role='button']")) {
        cursor.classList.remove("cursor-hover");
      }
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cursor.remove();
    };
  }, []);

  return null;
}
