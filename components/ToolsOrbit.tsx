"use client";

import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type { PicnicData } from "@/lib/picnic-data";
import { BrandMark } from "@/components/BrandMark";
import {
  tagClass,
  TemplateLink,
  UsesRow,
  UseCaseOutputBlock,
} from "@/components/use-case-parts";

type ToolsOrbitProps = {
  data: PicnicData;
  shown?: boolean;
  chipNumber?: string;
};

const R = 39;

function orbitPos(i: number, count: number) {
  const ang = (-90 + i * (360 / count)) * (Math.PI / 180);
  const x = Number((50 + R * Math.cos(ang)).toFixed(2));
  const y = Number((50 + R * Math.sin(ang)).toFixed(2));
  return { x, y };
}

export function ToolsOrbit({ data, shown = true, chipNumber = "01" }: ToolsOrbitProps) {
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [modal, setModal] = useState<{ name: string; ids: string[] } | null>(null);

  const openModal = useCallback((name: string, ids: string[]) => {
    setModal({ name, ids });
    setHighlightIdx(data.tools.findIndex(([toolName]) => toolName === name));
  }, [data.tools]);

  const closeModal = useCallback(() => {
    setModal(null);
    setHighlightIdx(-1);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && modal) closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal, closeModal]);

  return (
    <>
      <section className={`reveal${shown ? " shown" : ""}`} id="toolsSection">
        <div className="section-head">
          <p className="section-label">
            <span className="section-label-num">{chipNumber}</span>
          </p>
          <h2 className="section-title">Everything Gumloop packs</h2>
        </div>
        <p className="section-note section-note-flush">
          Your whole stack connects to Gumloop.{" "}
          <span className="section-note-accent">Tap any tool.</span>
        </p>
        <div className="orbit" id="orbit">
          <svg className="orbit-lines" id="orbitLines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {data.tools.map(([name, _ids], i) => {
              const { x, y } = orbitPos(i, data.tools.length);
              return (
                <line
                  key={name}
                  x1={50}
                  y1={50}
                  x2={x}
                  y2={y}
                  data-idx={i}
                  className={highlightIdx === i ? "on" : undefined}
                />
              );
            })}
          </svg>
          <div className="orbit-center" id="orbitCenter" aria-label="Gumloop">
            <BrandMark size={44} />
          </div>
          {data.tools.map(([name, ids], i) => {
            const { x, y } = orbitPos(i, data.tools.length);

            function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(name, ids);
              }
            }

            return (
              <div
                key={name}
                className={`orbit-tile${name === "Salesforce" ? " pulse-ring" : ""}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                tabIndex={0}
                role="button"
                aria-label={`${name}, see use cases`}
                onClick={() => openModal(name, ids)}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => setHighlightIdx(i)}
                onMouseLeave={() => {
                  if (!modal) setHighlightIdx(-1);
                }}
                onFocus={() => setHighlightIdx(i)}
                onBlur={() => {
                  if (!modal) setHighlightIdx(-1);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.logos[name]} alt={name} />
                <span className="tt-label">{name}</span>
              </div>
            );
          })}
        </div>
        <div className="more-wrap">
          <a className="more-link big" href="https://www.gumloop.com/mcp" target="_blank" rel="noopener noreferrer">
            And 200+ others
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      <div
        className={`modal-overlay${modal ? " open" : ""}`}
        id="modalOverlay"
        aria-hidden={!modal}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        {modal && (
          <div className="modal" id="modal" role="dialog" aria-modal="true">
            <button className="modal-close" id="modalClose" aria-label="Close" onClick={closeModal}>
              <X size={16} />
            </button>
            <div className="modal-head" id="modalHead">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.logos[modal.name]} alt={modal.name} />
              <div>
                <div className="mh-title">{modal.name}</div>
                <div className="mh-sub">
                  Three things your team can build with {modal.name} in the basket
                </div>
              </div>
            </div>
            <div className="modal-body" id="modalBody">
              {modal.ids.map((id) => {
                const useCase = data.usecases[id];
                return (
                  <div className={`uc-card${useCase.output ? "" : " no-out"}`} key={id}>
                    <div className="uc-top">
                      <span className="uc-title">{useCase.title}</span>
                      <span className={`uc-tag${tagClass(useCase.tag)}`}>{useCase.tag}</span>
                    </div>
                    <p className="uc-desc">{useCase.desc}</p>
                    <UsesRow uses={useCase.uses} logos={data.logos} />
                    {useCase.output ? (
                      <UseCaseOutputBlock output={useCase.output} />
                    ) : useCase.link ? (
                      <TemplateLink href={useCase.link} />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
