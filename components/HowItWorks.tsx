import { BlobBullet, type BlobKind } from "@/components/BlobBullet";

const STEPS: { blob: BlobKind; title: string; detail: string }[] = [
  { blob: "clover", title: "Describe the job", detail: "Plain language, no engineering." },
  { blob: "triangle", title: "Agent runs it", detail: "Across your connected tools." },
  { blob: "square", title: "Save it as a skill", detail: "Share it with the whole team." },
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
              <BlobBullet kind={step.blob} size={28} />
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
