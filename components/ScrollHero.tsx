"use client";

import { useEffect, useRef, useState } from "react";
import { SnackPicker } from "@/components/SnackPicker";
import type { SnackId } from "@/lib/snacks";

const HERO_VIDEO_SRC = "/picnic-food-video.mp4";
const SNACK_REVEAL_PROGRESS = 0.72;

type ScrollHeroProps = {
  greetingName: string;
  selectedSnacks: SnackId[];
  onSnacksChange: (selected: SnackId[]) => void;
};

function getScrollProgress(wrap: HTMLElement): number {
  const start = wrap.offsetTop;
  const end = start + wrap.offsetHeight - window.innerHeight;
  const range = end - start;
  if (range <= 0) return 0;
  return Math.min(1, Math.max(0, (window.scrollY - start) / range));
}

function ScrollMouseIndicator() {
  return (
    <div className="scroll-mouse-indicator" aria-hidden="true">
      <span className="scroll-mouse-dot" />
    </div>
  );
}

export function ScrollHero({
  greetingName,
  selectedSnacks,
  onSnacksChange,
}: ScrollHeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotionRef = useRef(false);
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showSnacks, setShowSnacks] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.pause();

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = media.matches;
    if (media.matches) {
      setShowScrollPrompt(false);
      setShowScrollIndicator(false);
      setShowSnacks(true);
    }

    const performSeek = () => {
      if (!video || !durationRef.current || isSeekingRef.current) return;

      const target = targetTimeRef.current;
      if (Math.abs(video.currentTime - target) < 0.035) return;

      isSeekingRef.current = true;

      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        window.clearTimeout(fallback);
        isSeekingRef.current = false;
        if (Math.abs(video.currentTime - targetTimeRef.current) > 0.035) {
          performSeek();
        }
      };

      const fallback = window.setTimeout(onSeeked, 150);
      video.addEventListener("seeked", onSeeked);

      try {
        video.currentTime = target;
      } catch {
        window.clearTimeout(fallback);
        video.removeEventListener("seeked", onSeeked);
        isSeekingRef.current = false;
      }
    };

    const scrubToProgress = (progress: number) => {
      const duration = durationRef.current;
      if (!duration || !Number.isFinite(duration)) return;

      const targetTime = Math.min(duration - 0.05, Math.max(0, progress * duration));
      targetTimeRef.current = targetTime;

      if (!isSeekingRef.current) {
        performSeek();
      }
    };

    const update = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      const progress = reducedMotionRef.current ? 0 : getScrollProgress(wrap);

      if (progress > 0.015) setShowScrollPrompt(false);
      if (progress >= SNACK_REVEAL_PROGRESS || reducedMotionRef.current) {
        setShowSnacks(true);
        setShowScrollIndicator(false);
      }

      scrubToProgress(progress);
    };

    const onLoaded = () => {
      durationRef.current = video.duration;
      video.pause();
      update();
    };

    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("loadedmetadata", onLoaded);
    if (video.readyState >= 2) onLoaded();

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    media.addEventListener("change", () => {
      reducedMotionRef.current = media.matches;
      if (media.matches) {
        setShowScrollPrompt(false);
        setShowScrollIndicator(false);
        setShowSnacks(true);
      }
      update();
    });

    update();

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("loadedmetadata", onLoaded);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="scroll-hero-wrap" ref={wrapRef}>
      <div className="scroll-hero-sticky">
        <div className="scroll-hero-content">
          <h1 className="hero-title">
            <span className="hero-greet">Hi {greetingName},</span>
            <span className="hero-line2">
              We want to send you a <span className="hl-pink">picnic basket</span>
            </span>
          </h1>

          <div className={`scroll-hero-scroll-prompt${showScrollPrompt ? "" : " is-hidden"}`}>
            <span>Scroll to pick your snacks</span>
          </div>

          <div className="scroll-hero-video-box">
            <video
              ref={videoRef}
              className="scroll-hero-video"
              src={HERO_VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
            />
            <div className="scroll-hero-gradient" />
            {showScrollIndicator && (
              <div className="scroll-hero-video-indicator">
                <ScrollMouseIndicator />
              </div>
            )}
          </div>

          <div className={`snack-picker-wrap${showSnacks ? " is-visible" : ""}`}>
            {showSnacks && (
              <SnackPicker selected={selectedSnacks} onChange={onSnacksChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
