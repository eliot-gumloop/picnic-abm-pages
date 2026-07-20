"use client";

import { useEffect, useRef, useState } from "react";
import { SnackPicker } from "@/components/SnackPicker";
import { ClaimForm } from "@/components/ClaimForm";
import type { SnackId } from "@/lib/snacks";

const HERO_VIDEO_SRC = "/picnic-food-video.mp4";
/** Snacks appear as soon as the user begins scrolling */
const SNACK_REVEAL_PROGRESS = 0.012;
/** Ignore seeks smaller than ~1 frame at 30fps */
const SEEK_EPS = 1 / 28;
/** Coast friction after scroll stops (closer to 1 = longer glide) */
const COAST_FRICTION = 0.935;
const COAST_MIN_VELOCITY = 0.00012;
/** Video must fully finish before leaving the hero scrub range */
const VIDEO_COMPLETE = 0.995;

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

function getHeroScrollMax(wrap: HTMLElement): number {
  return Math.max(0, wrap.offsetTop + wrap.offsetHeight - window.innerHeight);
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
  const [showScrollPrompt, setShowScrollPrompt] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showSnacks, setShowSnacks] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const wrap = wrapRef.current;
    if (!video || !wrap) return;

    document.documentElement.classList.remove("picnic-scroll-lock");
    document.body.classList.remove("picnic-scroll-lock");

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.pause();

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;

    const durationRef = { current: 0 };
    const scrollProgressRef = { current: 0 };
    const videoProgressRef = { current: 0 };
    const velocityRef = { current: 0 };
    const lastScrollPRef = { current: 0 };
    const lastScrollTimeRef = { current: performance.now() };
    const isScrollingRef = { current: false };
    const isSeekingRef = { current: false };
    const needsSeekRef = { current: false };
    const videoDoneRef = { current: reduced };
    const rafRef = { current: 0 };
    let scrollStopTimer = 0;
    let clamping = false;

    const publishProgress = (progress: number) => {
      wrap.style.setProperty("--scroll-p", progress.toFixed(4));
    };

    const isVideoDone = () =>
      reduced || videoProgressRef.current >= VIDEO_COMPLETE;

    const revealFromProgress = (progress: number) => {
      if (progress > 0.01) setShowScrollPrompt(false);
      if (progress >= SNACK_REVEAL_PROGRESS || reduced) {
        setShowSnacks(true);
        setShowScrollIndicator(false);
      }
    };

    const clampToHeroIfNeeded = () => {
      if (videoDoneRef.current || reduced) return;
      const max = getHeroScrollMax(wrap);
      if (window.scrollY > max + 0.5) {
        clamping = true;
        window.scrollTo(0, max);
        requestAnimationFrame(() => {
          clamping = false;
        });
      }
    };

    const seekToProgress = () => {
      if (!durationRef.current || isSeekingRef.current) return;

      const progress = videoProgressRef.current;
      const targetTime = Math.min(
        durationRef.current - 0.04,
        Math.max(0, progress * durationRef.current),
      );

      if (Math.abs(video.currentTime - targetTime) < SEEK_EPS) {
        needsSeekRef.current = false;
        return;
      }

      isSeekingRef.current = true;
      needsSeekRef.current = false;

      const finish = () => {
        video.removeEventListener("seeked", finish);
        window.clearTimeout(fallback);
        isSeekingRef.current = false;
        if (needsSeekRef.current) seekToProgress();
      };

      const fallback = window.setTimeout(finish, 120);
      video.addEventListener("seeked", finish);

      try {
        if (typeof video.fastSeek === "function") {
          video.fastSeek(targetTime);
        } else {
          video.currentTime = targetTime;
        }
      } catch {
        window.clearTimeout(fallback);
        video.removeEventListener("seeked", finish);
        isSeekingRef.current = false;
      }
    };

    const markDoneIfReady = () => {
      if (!videoDoneRef.current && isVideoDone()) {
        videoDoneRef.current = true;
        videoProgressRef.current = 1;
        scrollProgressRef.current = 1;
        publishProgress(1);
      }
    };

    const tick = () => {
      if (!isScrollingRef.current && !reduced) {
        if (Math.abs(velocityRef.current) > COAST_MIN_VELOCITY) {
          scrollProgressRef.current = Math.min(
            1,
            Math.max(0, scrollProgressRef.current + velocityRef.current),
          );
          velocityRef.current *= COAST_FRICTION;
          if (
            (scrollProgressRef.current <= 0 && velocityRef.current < 0) ||
            (scrollProgressRef.current >= 1 && velocityRef.current > 0)
          ) {
            velocityRef.current = 0;
          }
        } else {
          velocityRef.current = 0;
        }
      }

      // At the end of the scrub range, drive video fully to completion
      const atHeroEnd = getScrollProgress(wrap) >= 0.995;
      if (atHeroEnd && !reduced) {
        scrollProgressRef.current = 1;
      }

      const target = scrollProgressRef.current;
      let current = videoProgressRef.current;
      const delta = Math.abs(target - current);
      const alpha = reduced
        ? 1
        : atHeroEnd
          ? 0.35
          : delta > 0.1
            ? 0.28
            : delta > 0.03
              ? 0.18
              : 0.12;
      const next = current + (target - current) * alpha;

      const stillCoasting = Math.abs(velocityRef.current) > COAST_MIN_VELOCITY;
      const stillEasing = Math.abs(next - current) > 0.00025 || current !== target;

      if (stillEasing || stillCoasting) {
        videoProgressRef.current = stillEasing ? next : target;
        current = videoProgressRef.current;
        publishProgress(current);
        revealFromProgress(current);
        markDoneIfReady();
        clampToHeroIfNeeded();
        needsSeekRef.current = true;
        if (!isSeekingRef.current) seekToProgress();
        rafRef.current = requestAnimationFrame(tick);
      } else {
        videoProgressRef.current = target;
        publishProgress(target);
        revealFromProgress(target);
        markDoneIfReady();
        clampToHeroIfNeeded();
        needsSeekRef.current = true;
        if (!isSeekingRef.current) seekToProgress();
        rafRef.current = 0;
      }
    };

    const requestTick = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const updateFromScroll = () => {
      if (clamping) return;

      clampToHeroIfNeeded();

      const now = performance.now();
      const next = reduced ? 1 : getScrollProgress(wrap);
      const dt = Math.max(8, now - lastScrollTimeRef.current);
      const rawVelocity = ((next - lastScrollPRef.current) / dt) * 16;

      velocityRef.current = velocityRef.current * 0.35 + rawVelocity * 0.65;
      velocityRef.current = Math.max(-0.045, Math.min(0.045, velocityRef.current));

      scrollProgressRef.current = next;
      lastScrollPRef.current = next;
      lastScrollTimeRef.current = now;
      isScrollingRef.current = true;

      window.clearTimeout(scrollStopTimer);
      scrollStopTimer = window.setTimeout(() => {
        isScrollingRef.current = false;
        requestTick();
      }, 90);

      revealFromProgress(next);
      requestTick();
    };

    const onLoaded = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      durationRef.current = video.duration;
      video.pause();
      updateFromScroll();
    };

    const onWheel = (event: WheelEvent) => {
      if (videoDoneRef.current || reduced) return;
      if (event.deltaY <= 0) return;
      const max = getHeroScrollMax(wrap);
      if (window.scrollY >= max - 1) {
        event.preventDefault();
        scrollProgressRef.current = 1;
        requestTick();
      }
    };

    const touchStartY = { current: 0 };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY.current = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (videoDoneRef.current || reduced) return;
      const y = event.touches[0]?.clientY ?? touchStartY.current;
      const goingDown = y < touchStartY.current - 4;
      if (!goingDown) return;
      const max = getHeroScrollMax(wrap);
      if (window.scrollY >= max - 1) {
        event.preventDefault();
        scrollProgressRef.current = 1;
        requestTick();
      }
    };

    if (reduced) {
      setShowScrollPrompt(false);
      setShowScrollIndicator(false);
      setShowSnacks(true);
      scrollProgressRef.current = 1;
      videoProgressRef.current = 1;
      videoDoneRef.current = true;
      publishProgress(1);
    }

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("loadeddata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    let scrollRaf = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(updateFromScroll);
    };

    const onMediaChange = () => {
      reduced = media.matches;
      if (reduced) {
        setShowScrollPrompt(false);
        setShowScrollIndicator(false);
        setShowSnacks(true);
        scrollProgressRef.current = 1;
        videoProgressRef.current = 1;
        velocityRef.current = 0;
        videoDoneRef.current = true;
      }
      updateFromScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", updateFromScroll);
    media.addEventListener("change", onMediaChange);
    updateFromScroll();

    return () => {
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(scrollRaf);
      window.clearTimeout(scrollStopTimer);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("loadeddata", onLoaded);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", updateFromScroll);
      media.removeEventListener("change", onMediaChange);
    };
  }, []);

  return (
    <div className="scroll-hero-wrap" ref={wrapRef}>
      <div className="scroll-hero-sticky">
        <div className="scroll-hero-atmosphere" aria-hidden="true" />
        <div className="scroll-hero-content">
          <h1 className="hero-title">
            <span className="hero-greet">Hi {greetingName},</span>
            <span className="hero-line2">
              We want to send you a <span className="hl-accent">picnic basket</span>
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

          <div className={`claim-after-snacks${showSnacks ? " is-visible" : ""}`}>
            {showSnacks && <ClaimForm selectedSnacks={selectedSnacks} />}
          </div>
        </div>
      </div>
    </div>
  );
}

