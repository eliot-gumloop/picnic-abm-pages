"use client";

import { useState } from "react";
import type { PicnicData } from "@/lib/picnic-data";
import type { SnackId } from "@/lib/snacks";
import { ScrollHero } from "@/components/ScrollHero";
import { ClaimForm } from "@/components/ClaimForm";
import { ToolsOrbit } from "@/components/ToolsOrbit";
import { HowItWorks } from "@/components/HowItWorks";
import { ProofFooter } from "@/components/ProofFooter";

type PicnicPageProps = {
  greetingName: string;
  data: PicnicData;
};

export function PicnicPage({ greetingName, data }: PicnicPageProps) {
  const [selectedSnacks, setSelectedSnacks] = useState<SnackId[]>([]);

  return (
    <>
      <ScrollHero
        greetingName={greetingName}
        selectedSnacks={selectedSnacks}
        onSnacksChange={setSelectedSnacks}
      />

      <div className="post-hero">
        <div className="page content-stack">
          <ClaimForm selectedSnacks={selectedSnacks} />

          <section className="story-intro" id="story">
            <p className="handwrite story-only-copy">
              how Gumloop helps you keep your tools in one basket
            </p>
          </section>

          <HowItWorks shown />
          <ToolsOrbit data={data} shown chipNumber="02" />
          <ProofFooter data={data} />
        </div>
      </div>
    </>
  );
}
