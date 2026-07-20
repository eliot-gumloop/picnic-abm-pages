import type { PicnicData } from "@/lib/picnic-data";

type ProofFooterProps = {
  data: PicnicData;
};

/** Optical cap-height calibration — SVGs have different internal padding */
const PROOF_LOGO_HEIGHT: Record<string, string> = {
  Instacart: "15px",
  Gusto: "20px",
  Samsara: "22px",
  Shopify: "21px",
};

export function ProofFooter({ data }: ProofFooterProps) {
  return (
    <footer className="proof">
      <div className="proof-row" id="proofRow">
        {data.proof.map(([logoKey, value, label]) => (
          <div className="proof-item" key={logoKey + label}>
            <span className="proof-logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="proof-logo"
                src={data.logos[logoKey]}
                alt={logoKey}
                style={{ height: PROOF_LOGO_HEIGHT[logoKey] ?? "16px" }}
              />
            </span>
            <span className="proof-copy">
              <span className="proof-v">{value}</span>
              <span className="proof-l">{label}</span>
            </span>
          </div>
        ))}
      </div>
    </footer>
  );
}
