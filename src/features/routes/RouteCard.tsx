import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ImageOff, MapPin, Mountain } from "lucide-react";
import { useLang } from "@/features/shell/lang";
import { translate } from "./copy";
import { cardLabel, difficultyLabel, formatDuration, formatStats, regionLabel, routeTagline, routeTitle, surfaceLabel } from "./format";
import type { RouteListItem } from "./model";

const lines: Record<string, string> = {
  "eastern-waterfalls-loop": "2,22 12,14 20,18 30,6 42,10",
  "western-lakes-tour": "2,8 12,20 22,12 32,22 42,6",
  "central-canyon-ride": "2,6 14,10 22,22 34,16 42,24",
  "northern-mountain-pass": "2,24 8,8 16,20 24,6 32,18 42,10",
  "southern-winery-escape": "2,14 14,12 26,16 42,12",
  "pelister-peaks-hike": "2,22 12,6 22,16 30,10 42,20",
  "prespa-hidden-shores": "2,12 10,22 20,14 30,20 42,8",
};

const focal: Record<string, string> = {
  "eastern-waterfalls-loop": "50% 45%",
  "western-lakes-tour": "50% 60%",
  "central-canyon-ride": "50% 50%",
  "northern-mountain-pass": "50% 40%",
  "southern-winery-escape": "50% 50%",
  "pelister-peaks-hike": "50% 55%",
  "prespa-hidden-shores": "50% 50%",
};

const dot: Record<RouteListItem["difficulty"], string> = {
  Easy: "bg-difficulty-easy",
  Moderate: "bg-difficulty-moderate",
  Challenging: "bg-difficulty-challenging",
};

interface RouteCardProps {
  item: RouteListItem;
  priority?: boolean;
  forceFail?: boolean;
}

export function RouteCard({ item, priority = false, forceFail = false }: RouteCardProps) {
  const { lang } = useLang();
  const [failed, setFailed] = useState(forceFail);
  const title = routeTitle(lang, item.id);
  const unavailable = translate(lang, "common.photoUnavailable");
  const src = `${import.meta.env.BASE_URL}img/routes/${item.id}.jpg`;
  const showFail = failed || forceFail;

  return (
    <Link
      to={`/routes/${item.id}`}
      aria-label={cardLabel(lang, item)}
      className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm outline-none transition-shadow duration-base ease-out hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-hero bg-muted">
        {showFail ? (
          <div
            role="img"
            aria-label={`${unavailable}. ${title}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground"
            style={{
              background:
                "repeating-linear-gradient(135deg, hsl(var(--muted)) 0 12px, hsl(var(--secondary)) 12px 24px)",
            }}
          >
            <ImageOff aria-hidden className="h-6 w-6" />
            <span className="px-4 text-center text-[13px] font-medium">{unavailable}</span>
          </div>
        ) : (
          <img
            src={src}
            alt={title}
            width={800}
            height={450}
            decoding="async"
            loading={priority ? "eager" : "lazy"}
            {...(priority ? { fetchpriority: "high" } : { fetchpriority: "auto" })}
            sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw"
            onError={() => setFailed(true)}
            style={{ objectPosition: focal[item.id] ?? "50% 50%" }}
            className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-base motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-scrim/55 to-transparent to-40%" />
        <div className="absolute left-3 top-3 z-[1] flex max-w-[70%] gap-1.5">
          <span className="inline-flex h-6 items-center gap-1 rounded-pill bg-scrim/70 px-2.5 text-xs font-semibold text-foreground">
            <span aria-hidden className={`h-2 w-2 rounded-full ${dot[item.difficulty]}`} />
            {difficultyLabel(lang, item.difficulty)}
          </span>
          <span className="inline-flex h-6 items-center gap-1 rounded-pill bg-scrim/70 px-2.5 text-xs font-semibold text-foreground">
            <Clock aria-hidden className="h-3.5 w-3.5" />
            {formatDuration(lang, item)}
          </span>
        </div>
        <svg aria-hidden viewBox="0 0 44 28" className="absolute right-3 top-2.5 z-[1] h-7 w-11">
          <polyline
            points={lines[item.id]}
            fill="none"
            stroke="hsl(var(--map-route-casing))"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={lines[item.id]}
            fill="none"
            stroke="hsl(var(--map-route))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h2 className="font-display text-xl font-bold leading-snug text-foreground">{title}</h2>
        <p className="line-clamp-2 text-sm text-muted-foreground">{routeTagline(lang, item.id)}</p>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex h-6 items-center gap-1 rounded-pill bg-region-bg px-2.5 text-xs font-semibold text-region">
            <MapPin aria-hidden className="h-3.5 w-3.5" />
            {regionLabel(lang, item.region)}
          </span>
          <span className="inline-flex h-6 items-center gap-1 rounded-pill bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground">
            <Mountain aria-hidden className="h-3.5 w-3.5" />
            {surfaceLabel(lang, item.surface)}
          </span>
        </div>
        <p className="mt-0.5 whitespace-nowrap border-t border-border pt-2.5 font-mono text-[13px] text-muted-foreground">
          {formatStats(lang, item)}
        </p>
      </div>
    </Link>
  );
}
