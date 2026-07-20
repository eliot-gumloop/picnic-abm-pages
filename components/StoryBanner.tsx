"use client";

import { useEffect, useRef } from "react";

export function StoryBanner() {
  const rootRef = useRef<HTMLElement>(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedRef.current = media.matches;

    const publish = (x: number, y: number) => {
      root.style.setProperty("--mx", x.toFixed(4));
      root.style.setProperty("--my", y.toFixed(4));
      root.style.setProperty("--mx-px", `${(x * 100).toFixed(2)}%`);
      root.style.setProperty("--my-px", `${(y * 100).toFixed(2)}%`);
    };

    publish(0.5, 0.5);

    const tick = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      const alpha = reducedRef.current ? 1 : 0.12;
      c.x += (t.x - c.x) * alpha;
      c.y += (t.y - c.y) * alpha;
      publish(c.x, c.y);

      if (Math.abs(t.x - c.x) > 0.0008 || Math.abs(t.y - c.y) > 0.0008) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };

    const requestTick = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const setFromEvent = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      targetRef.current = {
        x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
      };
      root.dataset.active = "true";
      requestTick();
    };

    const onPointerEnter = (event: PointerEvent) => setFromEvent(event);
    const onPointerMove = (event: PointerEvent) => setFromEvent(event);
    const onPointerLeave = () => {
      root.dataset.active = "false";
      targetRef.current = { x: 0.5, y: 0.5 };
      requestTick();
    };

    const onMedia = () => {
      reducedRef.current = media.matches;
      root.classList.toggle("is-reduced-motion", media.matches);
    };
    onMedia();

    root.addEventListener("pointerenter", onPointerEnter);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    media.addEventListener("change", onMedia);

    return () => {
      cancelAnimationFrame(rafRef.current);
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      media.removeEventListener("change", onMedia);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="story-intro story-intro-color"
      id="story"
      data-active="false"
    >
      <div className="story-aurora" aria-hidden="true">
        <span className="story-blob story-blob-a" />
        <span className="story-blob story-blob-b" />
        <span className="story-blob story-blob-c" />
        <span className="story-blob story-blob-d" />
        <span className="story-blob story-blob-cursor" />
        <span className="story-sheen" />
      </div>
      <p className="handwrite story-only-copy">
        How Gumloop helps you keep your tools in one basket
      </p>
    </section>
  );
}
