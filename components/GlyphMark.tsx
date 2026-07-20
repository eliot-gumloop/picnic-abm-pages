export const GLYPH_LIBRARY = {
  cloud: "/glyphs/Cloud.svg",
  triangle: "/glyphs/Triangle.svg",
  square: "/glyphs/Square.svg",
  fire: "/glyphs/Fire.svg",
  gumdrop: "/glyphs/Gumdrop.svg",
  hex: "/glyphs/Hex.svg",
  loop: "/glyphs/Loop.svg",
  original: "/glyphs/Original.svg",
  pod: "/glyphs/Pod.svg",
  scoop: "/glyphs/Scoop.svg",
  wobble: "/glyphs/Wobble.svg",
} as const;

export type GlyphId = keyof typeof GLYPH_LIBRARY;

type GlyphMarkProps = {
  id: GlyphId;
  size?: number;
  className?: string;
  alt?: string;
};

/** Official Gumloop glyph from the Bnw character library */
export function GlyphMark({ id, size = 28, className = "", alt = "" }: GlyphMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`glyph-mark ${className}`}
      src={GLYPH_LIBRARY[id]}
      width={size}
      height={size}
      alt={alt}
      draggable={false}
      aria-hidden={alt ? undefined : true}
    />
  );
}
