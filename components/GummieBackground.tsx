const GLYPHS = [
  { src: "/colored/2.svg", className: "gummie-bg-item gummie-bg-1" },
  { src: "/colored/8.svg", className: "gummie-bg-item gummie-bg-2" },
  { src: "/colored/9.svg", className: "gummie-bg-item gummie-bg-3" },
  { src: "/colored/5.svg", className: "gummie-bg-item gummie-bg-4" },
] as const;

/** Large, very faint official Colored glyphs behind page content */
export function GummieBackground() {
  return (
    <div className="gummie-bg" aria-hidden="true">
      {GLYPHS.map((glyph) => (
        <img
          key={glyph.className}
          className={glyph.className}
          src={glyph.src}
          alt=""
          draggable={false}
        />
      ))}
    </div>
  );
}
