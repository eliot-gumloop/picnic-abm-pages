import picnicJson from "@/data/picnic.json";

export type UseCaseOutput =
  | { type: "rows"; rows: [string, string][] }
  | { type: "stat"; stat: string; sub: string }
  | { type: "quotes"; to: string; quotes: string[] }
  | { type: "qa"; q: string; a: string }
  | { type: "cta"; label: string }
  | { type: "note"; note: string };

export type UseCase = {
  title: string;
  tag: string;
  desc: string;
  uses: string[];
  output?: UseCaseOutput;
  link?: string;
};

export type PicnicData = {
  logos: Record<string, string>;
  closed: string;
  open: string;
  tools: [string, string[]][];
  usecases: Record<string, UseCase>;
  proof: [string, string, string][];
};

export function getPicnicData(): PicnicData {
  return picnicJson as unknown as PicnicData;
}

export const FRAME_COUNT = 270;

export function framePath(index: number): string {
  const num = Math.min(Math.max(index + 1, 1), FRAME_COUNT);
  return `/frames/ezgif-frame-${String(num).padStart(3, "0")}.jpg`;
}
