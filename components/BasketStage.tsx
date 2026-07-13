"use client";

import { KeyboardEvent } from "react";
import { MousePointerClick } from "lucide-react";

type BasketStageProps = {
  closedSrc: string;
  openSrc: string;
  onOpen: () => void;
  isOpen: boolean;
};

export function BasketStage({ closedSrc, openSrc, onOpen, isOpen }: BasketStageProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  }

  return (
    <div
      className={`basket-stage${isOpen ? " is-open" : ""}`}
      id="basketStage"
      role="button"
      tabIndex={0}
      aria-label="Open the picnic basket"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="basket-img basket-closed" id="imgClosed" src={closedSrc} alt="Closed picnic basket" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="basket-img basket-open" id="imgOpen" src={openSrc} alt="Open picnic basket" />
      <div className="open-hint" id="openHint">
        <MousePointerClick size={15} />
        Click to open
      </div>
    </div>
  );
}
