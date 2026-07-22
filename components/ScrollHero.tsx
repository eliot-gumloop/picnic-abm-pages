"use client";

import { useEffect, useRef, useState } from "react";
import { SnackPicker } from "@/components/SnackPicker";
import { ClaimForm } from "@/components/ClaimForm";
import type { SnackId } from "@/lib/snacks";

const HERO_VIDEO_SRC = "/picnic-food-video.mp4";
const HERO_VIDEO_POSTER = "/picnic-food-poster.jpg";
/** Snacks appear as soon as the user begins scrolling */
const SNACK_REVEAL_PROGRESS = 0.012;
/** Ignore seeks smaller than ~1 frame at 30fps */
const SEEK_EPS = 1 / 28;
/** Video must fully finish before the page can scroll past the hero */
const VIDEO_COMPLETE = 0.995;
/** How many gesture pixels map to a full 0→1 scrub (higher = more scrolling) */
const SCRUB_PIXELS = 2800;
/** Max scrub speed on the first pass — extra flick energy is banked until the ending frame */
const MAX_PROGRESS_PER_SECOND = 0.32;
/** Scrub reverse should feel responsive after the first unlock */
const MAX_REVERSE_PER_SECOND = 2.2;
/** After a small reverse near the end, require a clear downward flick to leave */
const REEXIT_BANK_PX = 56;
/** If scrub is still above this, downward scroll exits; below it, re-scrub forward */
const REEXIT_MIN_PROGRESS = 0.72;
/** After unlock, ease toward snacks at most this many px/sec */
const SNACKS_SETTLE_PX_PER_SECOND = 420;
const SNACKS_SETTLE_EPS = 1.5;

type ScrollHeroProps = {
  greetingName: string;
  selectedSnacks: SnackId[];
  onSnacksChange: (selected: SnackId[]) => void;
};

function prefersTouchHero() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
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

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";
    video.pause();

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;

    const publishProgress = (progress: number) => {
      wrap.style.setProperty("--scroll-p", progress.toFixed(4));
    };

    const getSnacksCenterScrollY = () => {
      const el =
        wrap.querySelector<HTMLElement>(".snack-picker-wrap") ||
        wrap.querySelector<HTMLElement>(".snack-picker");
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const absoluteCenter = rect.top + window.scrollY + rect.height / 2;
      return Math.max(0, absoluteCenter - window.innerHeight / 2);
    };

    /* ------------------------------------------------------------------ */
    /* Touch / phone: first swipe → play video + show snacks; then normal */
    /* scroll. Video freezes on end frame when done (wherever you are).   */
    /* Desktop scrub path below is unchanged.                             */
    /* ------------------------------------------------------------------ */
    if (prefersTouchHero()) {
      let played = false;
      let finished = false;
      const touchStartY = { current: 0 };
      /** Pixels of downward swipe required to count as the activating scroll */
      const ACTIVATE_SWIPE_PX = 28;

      const revealSnacks = () => {
        setShowScrollPrompt(false);
        setShowScrollIndicator(false);
        setShowSnacks(true);
      };

      const freezeEndFrame = () => {
        video.pause();
        if (Number.isFinite(video.duration) && video.duration > 0) {
          const end = Math.max(0, video.duration - 0.05);
          if (Math.abs(video.currentTime - end) > 0.04) {
            try {
              video.currentTime = end;
            } catch {
              /* ignore */
            }
          }
        }
        publishProgress(1);
      };

      const finishPlayback = () => {
        if (finished) return;
        finished = true;
        // Keep snacks visible; only lock the video on the end frame.
        freezeEndFrame();
        setShowSnacks(true);
      };

      const startPlayback = () => {
        if (played || reduced) return;
        played = true;
        // Opening → video playing with snacks list below.
        revealSnacks();
        video.muted = true;
        video.playsInline = true;

        const attempt = video.play();
        if (attempt && typeof attempt.then === "function") {
          attempt.catch(() => {
            finishPlayback();
          });
        }
      };

      const onTimeUpdate = () => {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        const p = Math.min(1, Math.max(0, video.currentTime / video.duration));
        publishProgress(p);
        if (p >= VIDEO_COMPLETE) finishPlayback();
      };

      const onEnded = () => {
        finishPlayback();
      };

      const onTouchStart = (event: TouchEvent) => {
        touchStartY.current = event.touches[0]?.clientY ?? 0;
      };

      const onTouchMove = (event: TouchEvent) => {
        if (reduced) return;

        // After the first activating swipe, never intercept — native page scroll.
        if (played) return;

        const y = event.touches[0]?.clientY ?? touchStartY.current;
        const deltaY = touchStartY.current - y; // finger up = scroll down

        if (deltaY <= 0) return;

        // Hold the opening screen still until activation.
        if (event.cancelable) event.preventDefault();

        if (deltaY >= ACTIVATE_SWIPE_PX) {
          window.scrollTo(0, 0);
          startPlayback();
        }
      };

      const onScroll = () => {
        // After the video ends, stay on the end frame even if they scroll away/back.
        if (finished) freezeEndFrame();
      };

      const onMediaChange = () => {
        reduced = media.matches;
        if (reduced) {
          revealSnacks();
          publishProgress(1);
          video.pause();
        }
      };

      document.documentElement.classList.remove("picnic-scroll-lock");
      document.body.classList.remove("picnic-scroll-lock");
      wrap.classList.remove("is-scrubbing");
      publishProgress(0);

      if (reduced) {
        revealSnacks();
        publishProgress(1);
      }

      video.addEventListener("timeupdate", onTimeUpdate);
      video.addEventListener("ended", onEnded);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("scroll", onScroll, { passive: true });
      media.addEventListener("change", onMediaChange);

      return () => {
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.removeEventListener("ended", onEnded);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("scroll", onScroll);
        media.removeEventListener("change", onMediaChange);
      };
    }

    /* ------------------------------------------------------------------ */
    /* Desktop / fine pointer: existing scrub-lock experience (unchanged) */
    /* ------------------------------------------------------------------ */

    const durationRef = { current: 0 };
    const progressRef = { current: 0 };
    const isSeekingRef = { current: false };
    const needsSeekRef = { current: false };
    const videoUnlockedRef = { current: false };
    /** True once the ending frame has been reached */
    const animationCompleteRef = { current: reduced };
    /** True once page scroll is allowed */
    const pageReleasedRef = { current: reduced };
    /** After the first successful unlock, reverse is fast and shallow re-exit is instant */
    const hasCompletedOnceRef = { current: reduced };
    /** True after reversing far enough that the next down pass should re-scrub the video */
    const replayScrubRef = { current: false };
    /** After unlock, ease banked energy down only until snacks are centered */
    const settleToSnacksRef = { current: false };
    /** Gesture pixels waiting to be applied (scrub first, then snacks settle) */
    const bankRef = { current: 0 };
    /** -1 scroll up / reverse, +1 scroll down / forward */
    const gestureDirRef = { current: 0 };
    const lastDrainTimeRef = { current: performance.now() };
    const rafRef = { current: 0 };
    const seekGenRef = { current: 0 };
    let seekFallbackTimer = 0;

    const setPageLocked = (locked: boolean) => {
      document.documentElement.classList.toggle("picnic-scroll-lock", locked);
      document.body.classList.toggle("picnic-scroll-lock", locked);
      wrap.classList.toggle("is-scrubbing", locked);
    };

    const unlockVideoForScrub = () => {
      if (videoUnlockedRef.current) return;
      videoUnlockedRef.current = true;
      video.muted = true;
      const playAttempt = video.play();
      const settle = () => {
        video.pause();
        needsSeekRef.current = true;
        if (!isSeekingRef.current) seekToProgress();
      };
      if (playAttempt && typeof playAttempt.then === "function") {
        playAttempt.then(settle).catch(() => {
          videoUnlockedRef.current = false;
        });
      } else {
        settle();
      }
    };

    const revealFromProgress = (progress: number) => {
      if (progress > 0.01) setShowScrollPrompt(false);
      if (progress >= SNACK_REVEAL_PROGRESS || reduced) {
        setShowSnacks(true);
        setShowScrollIndicator(false);
      }
    };

    const frameAtEnd = () => {
      if (!durationRef.current) return false;
      return video.currentTime >= durationRef.current - 0.08;
    };

    const desiredTimeForProgress = (progress: number) => {
      if (!durationRef.current) return 0;
      return Math.min(
        durationRef.current - 0.04,
        Math.max(0, progress * durationRef.current),
      );
    };

    const seekToProgress = () => {
      if (!durationRef.current || isSeekingRef.current) return;

      const progress = progressRef.current;
      const targetTime = desiredTimeForProgress(progress);

      if (Math.abs(video.currentTime - targetTime) < SEEK_EPS) {
        needsSeekRef.current = false;
        maybeCompleteAndRelease();
        return;
      }

      isSeekingRef.current = true;
      needsSeekRef.current = false;
      const seekGen = ++seekGenRef.current;

      const finish = () => {
        video.removeEventListener("seeked", finish);
        if (seekGen !== seekGenRef.current) return;
        window.clearTimeout(seekFallbackTimer);
        isSeekingRef.current = false;

        // Progress may have moved while this seek was in flight — land on the live target.
        const liveTarget = desiredTimeForProgress(progressRef.current);
        if (Math.abs(video.currentTime - liveTarget) > SEEK_EPS) {
          needsSeekRef.current = true;
          seekToProgress();
          return;
        }

        maybeCompleteAndRelease();
        if (needsSeekRef.current) seekToProgress();
      };

      window.clearTimeout(seekFallbackTimer);
      seekFallbackTimer = window.setTimeout(finish, 160);
      video.addEventListener("seeked", finish);

      try {
        if (typeof video.fastSeek === "function") {
          video.fastSeek(targetTime);
        } else {
          video.currentTime = targetTime;
        }
      } catch {
        window.clearTimeout(seekFallbackTimer);
        video.removeEventListener("seeked", finish);
        isSeekingRef.current = false;
      }
    };

    const syncFromProgress = () => {
      const progress = progressRef.current;
      publishProgress(progress);
      revealFromProgress(progress);
      needsSeekRef.current = true;
      if (!isSeekingRef.current) seekToProgress();
      if (window.scrollY > 0 && !pageReleasedRef.current) {
        window.scrollTo(0, 0);
      }
    };

    const releasePage = () => {
      if (pageReleasedRef.current) return;
      pageReleasedRef.current = true;
      animationCompleteRef.current = true;
      hasCompletedOnceRef.current = true;
      progressRef.current = 1;
      publishProgress(1);
      setPageLocked(false);
    };

    const reengageScrub = () => {
      pageReleasedRef.current = false;
      animationCompleteRef.current = false;
      settleToSnacksRef.current = false;
      // Shallow reverse can still instant-exit; deep reverse opts into a full replay.
      replayScrubRef.current = false;
      setPageLocked(true);
      window.scrollTo(0, 0);
    };

    /** Jump back to the ending and unlock so the user isn't trapped re-scrubbing. */
    const exitScrubToPage = (pageScrollPx = 0) => {
      progressRef.current = 1;
      publishProgress(1);
      revealFromProgress(1);
      bankRef.current = 0;
      settleToSnacksRef.current = false;
      replayScrubRef.current = false;
      animationCompleteRef.current = true;
      needsSeekRef.current = true;
      if (!isSeekingRef.current) seekToProgress();
      releasePage();
      if (pageScrollPx > 0) window.scrollBy(0, pageScrollPx);
    };

    /** When scrub + ending frame are done, unlock; banked energy eases to snacks. */
    const maybeCompleteAndRelease = () => {
      if (reduced || pageReleasedRef.current) return;
      if (progressRef.current < VIDEO_COMPLETE || !frameAtEnd()) return;

      progressRef.current = 1;
      publishProgress(1);
      animationCompleteRef.current = true;
      replayScrubRef.current = false;
      releasePage();
      // Only use leftover downward bank to settle snacks into view — not free-coast.
      if (bankRef.current > SNACKS_SETTLE_EPS) {
        settleToSnacksRef.current = true;
      } else {
        bankRef.current = 0;
        settleToSnacksRef.current = false;
      }
      requestDrain();
    };

    const requestDrain = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(drainBank);
    };

    /**
     * Drain banked gesture pixels:
     * 1) into the video scrub (rate-limited) while locked
     * 2) after unlock, slowly center the snacks list (no free page coast)
     */
    const drainBank = () => {
      rafRef.current = 0;
      if (reduced) {
        bankRef.current = 0;
        settleToSnacksRef.current = false;
        return;
      }

      const now = performance.now();
      const dt = Math.max(1, now - lastDrainTimeRef.current);
      lastDrainTimeRef.current = now;

      let bank = bankRef.current;

      // Re-enter scrub when scrolling up at the top of the page.
      if (pageReleasedRef.current && window.scrollY <= 1 && bank < 0) {
        settleToSnacksRef.current = false;
        reengageScrub();
      }

      if (!pageReleasedRef.current) {
        // Near the ending after a short reverse: downward flick leaves the hero.
        // After a deep reverse: play the scrub forward again (don't skip to the end).
        if (
          hasCompletedOnceRef.current &&
          !replayScrubRef.current &&
          gestureDirRef.current > 0 &&
          bank > REEXIT_BANK_PX &&
          progressRef.current >= REEXIT_MIN_PROGRESS
        ) {
          const leftover = Math.min(bank, window.innerHeight * 0.4);
          exitScrubToPage(leftover);
          return;
        }

        const rate =
          bank < 0 ? MAX_REVERSE_PER_SECOND : MAX_PROGRESS_PER_SECOND;
        const maxProgressStep = (rate * dt) / 1000;
        const maxPixels = maxProgressStep * SCRUB_PIXELS;
        let take = bank;
        if (take > maxPixels) take = maxPixels;
        if (take < -maxPixels) take = -maxPixels;

        const prev = progressRef.current;
        const next = Math.min(1, Math.max(0, prev + take / SCRUB_PIXELS));
        const usedProgress = next - prev;
        const usedPixels = usedProgress * SCRUB_PIXELS;

        progressRef.current = next;
        bank -= usedPixels;
        bankRef.current = bank;

        if (next < VIDEO_COMPLETE) {
          animationCompleteRef.current = false;
        }
        if (next < REEXIT_MIN_PROGRESS) {
          replayScrubRef.current = true;
        }

        syncFromProgress();

        if (Math.abs(bankRef.current) > 0.01 || progressRef.current < VIDEO_COMPLETE || !frameAtEnd()) {
          requestDrain();
        }
        return;
      }

      // Page unlocked with banked energy: ease until snacks are vertically centered.
      if (!settleToSnacksRef.current || bank <= 0) {
        bankRef.current = 0;
        settleToSnacksRef.current = false;
        return;
      }

      const target = getSnacksCenterScrollY();
      const dist = target - window.scrollY;
      if (dist <= SNACKS_SETTLE_EPS) {
        bankRef.current = 0;
        settleToSnacksRef.current = false;
        return;
      }

      const maxStep = (SNACKS_SETTLE_PX_PER_SECOND * dt) / 1000;
      const step = Math.min(dist, maxStep);
      window.scrollBy(0, step);
      // Consume bank so a huge flick still only settles to snacks.
      bankRef.current = Math.max(0, bank - step);

      if (target - window.scrollY > SNACKS_SETTLE_EPS) {
        requestDrain();
      } else {
        bankRef.current = 0;
        settleToSnacksRef.current = false;
      }
    };

    /** Queue gesture energy; scrub consumes it first, page gets the rest after the ending frame. */
    const queueGestureDelta = (deltaY: number) => {
      if (reduced || Math.abs(deltaY) < 0.01) return false;

      unlockVideoForScrub();
      gestureDirRef.current = deltaY > 0 ? 1 : -1;

      if (pageReleasedRef.current) {
        // Only intercept when reversing back into the hero at the top.
        if (!(window.scrollY <= 1 && (deltaY < 0 || bankRef.current < 0))) {
          return false;
        }
      }

      bankRef.current += deltaY;
      requestDrain();
      return true;
    };

    const onLoaded = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      durationRef.current = video.duration;
      unlockVideoForScrub();
      video.pause();
      syncFromProgress();
    };

    const onWheel = (event: WheelEvent) => {
      if (reduced) return;
      const consumed = queueGestureDelta(event.deltaY);
      if (consumed) event.preventDefault();
    };

    const onWindowScroll = () => {
      if (pageReleasedRef.current || reduced) return;
      if (window.scrollY > 0) window.scrollTo(0, 0);
    };

    const touchLastY = { current: 0 };
    const onTouchStart = (event: TouchEvent) => {
      touchLastY.current = event.touches[0]?.clientY ?? 0;
      unlockVideoForScrub();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (reduced) return;
      const y = event.touches[0]?.clientY ?? touchLastY.current;
      const deltaY = touchLastY.current - y;
      touchLastY.current = y;
      const consumed = queueGestureDelta(deltaY);
      if (consumed && event.cancelable) event.preventDefault();
    };

    const onMediaChange = () => {
      reduced = media.matches;
      if (reduced) {
        setShowScrollPrompt(false);
        setShowScrollIndicator(false);
        setShowSnacks(true);
        progressRef.current = 1;
        animationCompleteRef.current = true;
        pageReleasedRef.current = true;
        bankRef.current = 0;
        publishProgress(1);
        setPageLocked(false);
      } else if (!pageReleasedRef.current) {
        setPageLocked(true);
      }
    };

    if (reduced) {
      setShowScrollPrompt(false);
      setShowScrollIndicator(false);
      setShowSnacks(true);
      progressRef.current = 1;
      publishProgress(1);
      setPageLocked(false);
    } else {
      setPageLocked(true);
      window.scrollTo(0, 0);
      publishProgress(0);
    }

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("loadeddata", onLoaded);
    if (video.readyState >= 1) onLoaded();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onWindowScroll, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    media.addEventListener("change", onMediaChange);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(seekFallbackTimer);
      setPageLocked(false);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("loadeddata", onLoaded);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      media.removeEventListener("change", onMediaChange);
    };
  }, []);

  return (
    <div className="scroll-hero-wrap" ref={wrapRef}>
      <div className="scroll-hero-scrub">
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
                poster={HERO_VIDEO_POSTER}
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
    </div>
  );
}
