"use client";

import { Check } from "lucide-react";
import { MAX_SNACKS, SNACK_OPTIONS, type SnackId } from "@/lib/snacks";

type SnackPickerProps = {
  selected: SnackId[];
  onChange: (selected: SnackId[]) => void;
};

export function SnackPicker({ selected, onChange }: SnackPickerProps) {
  function toggle(id: SnackId) {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
      return;
    }
    if (selected.length >= MAX_SNACKS) return;
    onChange([...selected, id]);
  }

  return (
    <div className="snack-picker" role="group" aria-label="Choose picnic snacks">
      <p className="snack-picker-label">Pick your snacks</p>
      <div className="snack-grid">
        {SNACK_OPTIONS.map((snack) => {
          const isSelected = selected.includes(snack.id);
          const isDisabled = !isSelected && selected.length >= MAX_SNACKS;

          return (
            <button
              key={snack.id}
              type="button"
              className={`snack-option${isSelected ? " is-selected" : ""}`}
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => toggle(snack.id)}
            >
              <span className="snack-check" aria-hidden="true">
                {isSelected && <Check size={14} strokeWidth={3} />}
              </span>
              <span className="snack-name">{snack.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
