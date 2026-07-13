export const SNACK_OPTIONS = [
  { id: "fig-olive-crisps", label: "Fig and Olive Crisps" },
  { id: "local-honey", label: "Local Honey" },
  { id: "cookie-butter", label: "Cookie Butter" },
  { id: "chocolate-almonds", label: "Chocolate-Covered Almonds" },
] as const;

export type SnackId = (typeof SNACK_OPTIONS)[number]["id"];

export const MAX_SNACKS = 4;
