import type { UseCaseOutput } from "@/lib/picnic-data";
import {
  ArrowUpRight,
  CalendarCheck,
  Mail,
} from "lucide-react";

function statusClass(value: string) {
  const s = value.toLowerCase();
  if (s === "success" || s === "active") return "ok";
  if (s === "error") return "err";
  if (s === "deploying" || s === "updated") return "warn";
  return "";
}

function tagClass(tag: string) {
  if (tag === "Template") return " tpl";
  if (tag === "Example") return " ex";
  return "";
}

export function UseCaseOutputBlock({ output }: { output: UseCaseOutput }) {
  return (
    <div className="uc-out">
      <div className="out-lbl">Output</div>
      {output.type === "rows" &&
        output.rows.map(([key, value]) => (
          <div className="out-row" key={key}>
            <span className="k">{key}</span>
            <span className={`v ${statusClass(value)}`}>{value}</span>
          </div>
        ))}
      {output.type === "stat" && (
        <>
          <div className="out-stat">{output.stat}</div>
          <div className="k" style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
            {output.sub}
          </div>
        </>
      )}
      {output.type === "quotes" && (
        <>
          <div className="k" style={{ fontSize: 11.5, marginBottom: 4 }}>
            To: {output.to}
          </div>
          {output.quotes.map((quote) => (
            <div className="out-quote" key={quote}>
              &ldquo;{quote}&rdquo;
            </div>
          ))}
        </>
      )}
      {output.type === "qa" && (
        <div className="out-qa">
          <div className="q">{output.q}</div>
          <div className="a">{output.a}</div>
        </div>
      )}
      {output.type === "cta" && (
        <span className="out-cta">
          <CalendarCheck size={15} />
          {output.label}
        </span>
      )}
      {output.type === "note" && (
        <span className="out-note">
          <Mail size={15} />
          {output.note}
        </span>
      )}
    </div>
  );
}

export function UsesRow({ uses, logos }: { uses: string[]; logos: Record<string, string> }) {
  return (
    <div className="uc-uses">
      <span className="lbl">Uses</span>
      {uses.map((use) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={use} src={logos[use]} alt={use} title={use} />
      ))}
    </div>
  );
}

export { tagClass, statusClass };

export function TemplateLink({ href }: { href: string }) {
  return (
    <a className="uc-link" href={href} target="_blank" rel="noopener noreferrer">
      View template
      <ArrowUpRight size={14} />
    </a>
  );
}
