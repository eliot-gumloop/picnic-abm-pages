import { GlyphMark, type GlyphId } from "@/components/GlyphMark";

const STEPS: { glyph: GlyphId; title: string; detail: string }[] = [
  { glyph: "cloud", title: "Describe the job", detail: "Plain language, no engineering." },
  { glyph: "triangle", title: "Agent runs it", detail: "Across your connected tools." },
  { glyph: "square", title: "Save it as a skill", detail: "Share it with the whole team." },
];

export function HowItWorks({ shown = true }: { shown?: boolean }) {
  return (
    <section className={`reveal how-section${shown ? " shown" : ""}`} id="howSection">
      <p className="section-label">
        <span className="section-label-num">01</span>
      </p>
      <h2 className="section-title">What is Gumloop</h2>
      <p className="section-note section-note-flush">
        Gumloop lets you build agents that automate work across your stack.
      </p>
      <div className="how-flow how-flow-stack">
        {STEPS.map((step, index) => (
          <div className={`flow-step flow-step-accent-${index + 1}`} key={step.title}>
            <span className="flow-blob" aria-hidden="true">
              <GlyphMark id={step.glyph} size={32} />
            </span>
            <div>
              <div className="flow-t">{step.title}</div>
              <div className="flow-d">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
