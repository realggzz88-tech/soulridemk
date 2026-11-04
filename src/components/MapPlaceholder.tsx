interface MapPlaceholderProps {
  onActivate: () => void;
  className?: string;
  busy?: boolean;
}

export function MapPlaceholder({
  onActivate,
  className = "h-56",
  busy = false,
}: MapPlaceholderProps) {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden ${className}`}
      style={{
        background: "hsl(200 20% 8%)",
        border: "1px solid hsl(25 15% 18%)",
      }}
      aria-busy={busy}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm" style={{ color: "hsl(40 20% 82%)" }}>
          {busy
            ? "Се вчитува картата…"
            : "Картата се вчитува кога ќе ја отворите или ќе се спуштите до неа."}
        </p>
        {busy ? null : (
          <button type="button" className="btn-primary" onClick={onActivate}>
            Прикажи ја картата
          </button>
        )}
      </div>
    </div>
  );
}
