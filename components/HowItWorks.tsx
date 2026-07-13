export function HowItWorks({ shown = true }: { shown?: boolean }) {
  return (
    <section className={`reveal how-section${shown ? " shown" : ""}`} id="howSection">
      <div className="section-head">
        <span className="num-chip">01</span>
        <h2 className="section-title">What is Gumloop</h2>
      </div>
      <p className="section-note">
        Gumloop lets you build agents that automate work across your stack.
      </p>
      <div className="how-flow how-flow-stack">
        <div className="flow-step">
          <span className="flow-num">1</span>
          <div>
            <div className="flow-t">Describe the job</div>
            <div className="flow-d">Plain language, no engineering.</div>
          </div>
        </div>
        <div className="flow-step">
          <span className="flow-num">2</span>
          <div>
            <div className="flow-t">Agent runs it</div>
            <div className="flow-d">Across your connected tools.</div>
          </div>
        </div>
        <div className="flow-step">
          <span className="flow-num">3</span>
          <div>
            <div className="flow-t">Save it as a skill</div>
            <div className="flow-d">Share it with the whole team.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
