/** Stylised stand-in for the Leaflet route map. The v3 mockup draws this SVG; tiles are not requested. */
export function RouteMapPanel({ className = "" }: { className?: string }) {
  const lines = [
    ["M190 150 L170 190 L200 250 L250 300 L270 340", false],
    ["M90 330 L110 380 L130 400", false],
    ["M80 160 L95 210 L85 260", false],
    ["M250 330 L280 370 L320 380", true],
    ["M215 280 L240 330 L262 360", false],
    ["M120 330 L140 360 L130 400", false],
    ["M70 310 L80 360 L100 390 L120 360", false],
  ] as const;

  return (
    <aside className={`sticky top-[7.5rem] h-[calc(100dvh-8.5rem)] overflow-hidden rounded-lg border border-border ${className}`} aria-label="Мапа на рутите">
      <svg viewBox="0 0 400 520" preserveAspectRatio="xMidYMid slice" className="h-full w-full bg-muted">
        <path d="M40 120 L140 60 L260 70 L360 130 L370 300 L330 420 L200 470 L90 430 L30 300Z" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
        <ellipse cx="85" cy="360" rx="16" ry="36" fill="hsl(var(--brand-lake) / 0.45)" />
        <ellipse cx="125" cy="385" rx="13" ry="24" fill="hsl(var(--brand-lake) / 0.45)" />
        <ellipse cx="300" cy="420" rx="12" ry="9" fill="hsl(var(--brand-lake) / 0.45)" />
        {lines.map(([d, hot]) => (
          <g key={d}>
            <path d={d} fill="none" stroke="hsl(var(--map-route-casing))" strokeWidth={hot ? 9 : 6} strokeLinecap="round" />
            <path d={d} fill="none" stroke={hot ? "hsl(var(--accent))" : "hsl(var(--map-route))"} strokeWidth={hot ? 5 : 3} strokeLinecap="round" />
          </g>
        ))}
        <text x="16" y="508" fontSize="11" fill="hsl(var(--muted-foreground))" fontFamily="Inter, sans-serif">
          Leaflet · © OpenStreetMap
        </text>
      </svg>
    </aside>
  );
}
