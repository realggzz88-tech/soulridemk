import { useState, type CSSProperties } from "react";
import { variantSrc } from "@/lib/content/present";
import type { Photo } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const FALLBACK_SRC = `${import.meta.env.BASE_URL}image-fallback.svg`;

const SIZES = {
  card: "(min-width:1280px) 400px, (min-width:640px) 50vw, 100vw",
  hero: "100vw",
  gallery: "(min-width:1024px) 80vw, 100vw",
  thumb: "80px",
} as const;

export type SmartImageVariant = keyof typeof SIZES;

function srcSet(photo: Photo) {
  return photo.widths.map((width) => `${variantSrc(photo, width, "webp")} ${width}w`).join(", ");
}

function creditParts(photo: Photo) {
  const credit = photo.credit;
  if (!credit) return null;
  if ("own" in credit) return { author: credit.author, license: "Own", licenseUrl: "", sourceUrl: "", modified: false };
  return credit;
}

export function PhotoCredit({ photo, className }: { photo: Photo; className?: string }) {
  const credit = creditParts(photo);
  if (!credit) return null;
  return (
    <span className={className}>
      © {credit.author}
      {credit.licenseUrl ? (
        <>
          {" · "}
          <a href={credit.licenseUrl} className="underline" target="_blank" rel="noopener noreferrer">
            {credit.license}
          </a>
        </>
      ) : null}
      {credit.modified ? " · resized" : ""}
      {credit.sourceUrl ? (
        <>
          {" · "}
          <a href={credit.sourceUrl} className="underline" target="_blank" rel="noopener noreferrer">
            Извор
          </a>
        </>
      ) : null}
    </span>
  );
}

interface SmartImageProps {
  photo?: Photo | null;
  /** Overrides the primary (Macedonian) alt when the surrounding text is a better name. */
  alt?: string;
  variant?: SmartImageVariant;
  /** The home hero only. Every other image stays lazy and may fade in. */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  showCredit?: boolean;
}

export function SmartImage({
  photo,
  alt,
  variant = "card",
  priority = false,
  className,
  imgClassName,
  imgStyle,
  showCredit = false,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(priority);
  const [creditOpen, setCreditOpen] = useState(false);
  const primaryAlt = alt || photo?.alt.mk || photo?.alt.en || "";
  const showLabel = variant !== "thumb";

  if (!photo || failed || photo.widths.length === 0) {
    return (
      <div
        role="img"
        aria-label={primaryAlt || "Photo unavailable"}
        className={cn(
          "relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-muted bg-gradient-to-br from-muted to-secondary text-muted-foreground",
          className,
        )}
      >
        <img src={FALLBACK_SRC} alt="" aria-hidden loading="lazy" className="w-[40%] max-w-24 object-contain opacity-60" />
        {showLabel ? (
          <span className="px-3 text-center text-xs leading-snug">
            Фотографијата не е достапна
            <span className="mt-0.5 block">Photo unavailable</span>
          </span>
        ) : null}
      </div>
    );
  }

  const position = `${photo.focal.x * 100}% ${photo.focal.y * 100}%`;

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden bg-muted", className)}
      style={{ backgroundColor: photo.dominantColor }}
    >
      {photo.lqip ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 scale-105 bg-cover bg-center blur-md"
          style={{ backgroundImage: `url("${photo.lqip}")` }}
        />
      ) : null}
      <picture>
        <img
          src={variantSrc(photo, 800, "webp")}
          srcSet={srcSet(photo)}
          sizes={SIZES[variant]}
          alt={primaryAlt}
          data-alt-en={photo.alt.en}
          width={photo.width}
          height={photo.height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (import.meta.env.DEV) console.warn("[SoulRide] image failed", photo.key);
            setFailed(true);
          }}
          className={cn(
            "relative h-full w-full object-cover",
            !priority && "motion-safe:transition-opacity motion-safe:duration-200",
            !priority && !loaded && "motion-safe:opacity-0",
            imgClassName,
          )}
          style={{ objectPosition: position, ...imgStyle }}
        />
      </picture>
      {showCredit && photo.credit ? (
        <div className="absolute bottom-3 left-3 z-10 max-w-[calc(100%-1.5rem)]">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-sm text-white backdrop-blur-sm"
            aria-label="Автор на фотографијата"
            aria-expanded={creditOpen}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setCreditOpen((open) => !open);
            }}
          >
            ⓘ
          </button>
          {creditOpen ? (
            <p className="mt-2 rounded-md bg-black/75 px-3 py-2 text-xs text-white">
              <PhotoCredit photo={photo} />
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
