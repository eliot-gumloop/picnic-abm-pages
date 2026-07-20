"use client";

import { FormEvent, useState } from "react";
import { PartyPopper } from "lucide-react";
import { SNACK_OPTIONS, type SnackId } from "@/lib/snacks";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ClaimFormProps = {
  selectedSnacks: SnackId[];
};

export function ClaimForm({ selectedSnacks }: ClaimFormProps) {
  const [status, setStatus] = useState<{ type: "err" | ""; message: string }>({
    type: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const snackLabels = SNACK_OPTIONS.filter((s) => selectedSnacks.includes(s.id)).map(
    (s) => s.label,
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      address: (form.elements.namedItem("address") as HTMLTextAreaElement).value.trim(),
      snacks: snackLabels,
    };

    if (!payload.name || !payload.email || !payload.address) {
      setStatus({ type: "err", message: "Please fill in every field." });
      return;
    }
    if (!EMAIL_RE.test(payload.email)) {
      setStatus({ type: "err", message: "Please enter a valid email address." });
      return;
    }
    if (payload.snacks.length === 0) {
      setStatus({ type: "err", message: "Please choose at least one snack above." });
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      setDone(true);
      setSubmitting(false);
    }, 600);
  }

  if (done) {
    return (
      <section className="claim-section" id="claimPanel">
        <div className="card form-card form-done">
          <span className="form-done-icon" aria-hidden="true">
            <PartyPopper size={24} strokeWidth={2} />
          </span>
          <h3>Your picnic basket is on its way!</h3>
          <p>More info from Gumloop and the shipping details will be sent ASAP.</p>
          {snackLabels.length > 0 && (
            <p className="form-snack-summary">Your picks: {snackLabels.join(", ")}</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="claim-section" id="claimPanel">
      <form className="card form-card form-card-compact" id="basketForm" noValidate onSubmit={handleSubmit}>
        <h2 className="claim-title">Drop your details here</h2>
        {snackLabels.length > 0 && (
          <p className="form-snack-summary">Snacks: {snackLabels.join(", ")}</p>
        )}
        <label className="field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className="field">
          <span>Work Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="field">
          <span>Preferred Shipping Address</span>
          <textarea name="address" rows={2} autoComplete="street-address" required />
        </label>
        <button type="submit" className="cta-btn cta-btn-compact" id="submitBtn" disabled={submitting}>
          <span className="btn-label">{submitting ? "Sending…" : "Send me a basket"}</span>
        </button>
        {status.message && (
          <p className={`form-status ${status.type}`} id="formStatus">
            {status.message}
          </p>
        )}
      </form>
    </section>
  );
}
