import type { PicnicData } from "@/lib/picnic-data";

type ProofFooterProps = {
  data: PicnicData;
};

export function ProofFooter({ data }: ProofFooterProps) {
  return (
    <footer className="proof">
      <div className="proof-row" id="proofRow">
        {data.proof.map(([logoKey, value, label]) => (
          <div className="proof-item" key={logoKey + label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.logos[logoKey]} alt={logoKey} />
            <span>
              <span className="proof-v">{value}</span>{" "}
              <span className="proof-l">{label}</span>
            </span>
          </div>
        ))}
      </div>
    </footer>
  );
}
