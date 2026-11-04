import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useLang } from "@/features/shell/lang";
import { plural, translate } from "./copy";
import {
  difficultyCounts,
  hasActiveQuery,
  lengthCounts,
  regionCounts,
  sheetFilterCount,
  type DifficultyKey,
  type LengthKey,
  type RegionKey,
  type RouteQuery,
  type SortKey,
} from "./filter";
import type { RouteListItem } from "./model";

const difficulties: Array<"all" | DifficultyKey> = ["all", "easy", "moderate", "challenging"];
const regions: RegionKey[] = ["east", "west", "central"];
const lengths: LengthKey[] = ["short", "mid", "long"];
const sorts: SortKey[] = ["recommended", "shortest", "longest", "easiest"];

const lengthKey = {
  short: "routes.filters.lengthShort",
  mid: "routes.filters.lengthMid",
  long: "routes.filters.lengthLong",
} as const;

interface RouteFiltersProps {
  items: RouteListItem[];
  query: RouteQuery;
  shown: number;
  onChange: (query: RouteQuery) => void;
  defaultOpen?: boolean;
}

export function RouteFilters({ items, query, shown, onChange, defaultOpen = false }: RouteFiltersProps) {
  const { lang } = useLang();
  const t = (path: string, vars?: Record<string, string | number>) => translate(lang, path, vars);
  const counts = difficultyCounts(items, query);
  const regionsN = regionCounts(items, query);
  const lengthsN = lengthCounts(items, query);
  const sheetCount = sheetFilterCount(query);
  const [sheetOpen, setSheetOpen] = useState(defaultOpen);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const clear = () => onChange({ difficulty: "all", regions: [], length: "all", sort: "recommended" });

  const setDifficulty = (difficulty: RouteQuery["difficulty"]) => onChange({ ...query, difficulty });
  const toggleRegion = (region: RegionKey) => {
    const next = query.regions.includes(region)
      ? query.regions.filter((item) => item !== region)
      : [...query.regions, region];
    onChange({ ...query, regions: next });
  };
  const toggleLength = (length: LengthKey) => onChange({ ...query, length: query.length === length ? "all" : length });

  const regionChip =
    query.regions.length === 1 ? `${t("routes.filters.region")} · ${t(`region.${query.regions[0]}`)}` : t("routes.filters.region");
  const lengthChip =
    query.length === "all" ? t("routes.filters.length") : `${t("routes.filters.length")} · ${t(lengthKey[query.length])}`;

  return (
    <div className="sticky top-14 z-sticky md:top-16">
      <div className="relative left-1/2 w-screen -translate-x-1/2 border-b border-border bg-background/95 py-2 backdrop-blur">
      <div className="mx-auto flex w-full max-w-content flex-wrap items-center gap-2 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto md:flex-none" role="group" aria-label={t("routes.filters.difficulty")}>
          {difficulties.map((key) => (
            <Chip
              key={key}
              pressed={query.difficulty === key}
              disabled={key !== "all" && ! (query.difficulty === key) && counts[key] === 0}
              onClick={() => setDifficulty(key)}
              label={key === "all" ? t("routes.filters.all") : t(`difficulty.${key}`)}
              count={counts[key]}
            />
          ))}
        </div>

        <MenuChip label={regionChip}>
          {regions.map((region) => (
            <Chip
              key={region}
              pressed={query.regions.includes(region)}
              onClick={() => toggleRegion(region)}
              label={t(`region.${region}`)}
              count={regionsN[region]}
              icon={query.regions.includes(region) ? <Check className="h-3.5 w-3.5" /> : undefined}
            />
          ))}
        </MenuChip>
        <MenuChip label={lengthChip}>
          {lengths.map((length) => (
            <Chip
              key={length}
              pressed={query.length === length}
              onClick={() => toggleLength(length)}
              label={t(lengthKey[length])}
              count={lengthsN[length]}
            />
          ))}
        </MenuChip>
        <MenuChip label={`${t("routes.sort.label")}: ${t(`routes.sort.${query.sort}`)}`} className="md:ml-auto">
          {sorts.map((sort) => (
            <label key={sort} className="flex min-h-11 cursor-pointer items-center gap-3 px-1 text-sm">
              <input
                type="radio"
                name="route-sort-desktop"
                className="h-5 w-5 accent-[hsl(var(--primary))]"
                checked={query.sort === sort}
                onChange={() => onChange({ ...query, sort })}
              />
              {t(`routes.sort.${sort}`)}
            </label>
          ))}
        </MenuChip>

        <button
          ref={openButtonRef}
          type="button"
          className="inline-flex h-11 shrink-0 items-center md:hidden"
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen(true)}
        >
          <span className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-input px-3.5 text-sm font-medium">
            <SlidersHorizontal aria-hidden className="h-4 w-4" />
            {t("routes.filters.open")}
            {sheetCount > 0 && (
              <span className="inline-grid h-5 min-w-5 place-items-center rounded-pill bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                {sheetCount}
              </span>
            )}
          </span>
        </button>
      </div>
      </div>

      {sheetOpen &&
        createPortal(
          <FilterSheet
            query={query}
            shown={shown}
            counts={counts}
            regionsN={regionsN}
            lengthsN={lengthsN}
            onChange={onChange}
            onClear={clear}
            onClose={() => {
              setSheetOpen(false);
              openButtonRef.current?.focus();
            }}
          />,
          document.body,
        )}
      {hasActiveQuery(query) && (
        <button type="button" className="sr-only" onClick={clear}>
          {t("routes.filters.clear")}
        </button>
      )}
    </div>
  );
}

function Chip({
  pressed,
  disabled,
  onClick,
  label,
  count,
  icon,
}: {
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-11 shrink-0 items-center disabled:cursor-not-allowed disabled:opacity-[0.45]"
    >
      <span
        className={
          pressed
            ? "inline-flex h-9 items-center gap-1 rounded-pill border border-primary bg-primary px-3.5 text-sm font-medium text-primary-foreground"
            : "inline-flex h-9 items-center gap-1 rounded-pill border border-input bg-transparent px-3.5 text-sm font-medium text-foreground"
        }
      >
        {icon}
        {label}
        {count !== undefined && <span className="text-xs opacity-75">({count})</span>}
      </span>
    </button>
  );
}

function MenuChip({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`relative hidden md:block ${className}`} ref={ref}>
      <button
        type="button"
        className="inline-flex h-11 items-center"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="inline-flex h-9 items-center gap-1 rounded-pill border border-input px-3.5 text-sm font-medium">
          {label}
          <ChevronDown aria-hidden className="h-4 w-4" />
        </span>
      </button>
      {open && (
        <div className="absolute left-0 z-overlay mt-2 flex min-w-52 flex-col gap-1 rounded-xl border border-border bg-popover p-2 shadow-md">
          {children}
        </div>
      )}
    </div>
  );
}

function FilterSheet({
  query,
  shown,
  counts,
  regionsN,
  lengthsN,
  onChange,
  onClear,
  onClose,
}: {
  query: RouteQuery;
  shown: number;
  counts: Record<"all" | DifficultyKey, number>;
  regionsN: Record<RegionKey, number>;
  lengthsN: Record<LengthKey, number>;
  onChange: (query: RouteQuery) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const t = (path: string, vars?: Record<string, string | number>) => translate(lang, path, vars);
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab" || !ref.current) return;
    const items = [...ref.current.querySelectorAll<HTMLElement>("button, input")].filter((element) => !element.hasAttribute("disabled"));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const toggleRegion = (region: RegionKey) => {
    const next = query.regions.includes(region) ? query.regions.filter((item) => item !== region) : [...query.regions, region];
    onChange({ ...query, regions: next });
  };

  return (
    <div className="fixed inset-0 z-[80] md:hidden" onKeyDown={onKeyDown}>
      <button type="button" className="absolute inset-0 bg-scrim/60" aria-label={t("routes.filters.close")} onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col overflow-hidden rounded-t-[20px] bg-popover text-popover-foreground shadow-lg"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-center border-b border-border px-5 py-2">
          <h2 id={titleId} className="font-display text-lg font-bold">
            {t("routes.filters.label")}
          </h2>
          <button
            type="button"
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg"
            aria-label={t("routes.filters.close")}
            onClick={onClose}
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto">
        <SheetSection title={t("routes.filters.difficulty")}>
          {difficulties.map((key) => (
            <Chip
              key={key}
              pressed={query.difficulty === key}
              onClick={() => onChange({ ...query, difficulty: key })}
              label={key === "all" ? t("routes.filters.all") : t(`difficulty.${key}`)}
              count={counts[key]}
            />
          ))}
        </SheetSection>
        <SheetSection title={t("routes.filters.region")}>
          {regions.map((region) => (
            <Chip
              key={region}
              pressed={query.regions.includes(region)}
              onClick={() => toggleRegion(region)}
              label={t(`region.${region}`)}
              count={regionsN[region]}
              icon={query.regions.includes(region) ? <Check className="h-3.5 w-3.5" /> : undefined}
            />
          ))}
        </SheetSection>
        <SheetSection title={t("routes.filters.length")}>
          {lengths.map((length) => (
            <Chip
              key={length}
              pressed={query.length === length}
              onClick={() => onChange({ ...query, length: query.length === length ? "all" : length })}
              label={t(lengthKey[length])}
              count={lengthsN[length]}
            />
          ))}
        </SheetSection>
        <section className="border-b border-border px-5 py-4">
          <h3 className="mb-2 text-[15px] font-bold">{t("routes.sort.label")}</h3>
          {sorts.map((sort) => (
            <label key={sort} className="flex min-h-11 items-center gap-3 text-[15px]">
              <input
                type="radio"
                name="route-sort-sheet"
                className="h-5 w-5 accent-[hsl(var(--primary))]"
                checked={query.sort === sort}
                onChange={() => onChange({ ...query, sort })}
              />
              {t(`routes.sort.${sort}`)}
            </label>
          ))}
        </section>
        </div>
        <div className="flex gap-2 border-t border-border bg-popover px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button type="button" className="inline-flex h-11 items-center justify-center rounded-lg border border-input px-4 text-[15px] font-semibold" onClick={onClear}>
            {t("routes.filters.clearShort")}
          </button>
          <button type="button" className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-[15px] font-semibold text-primary-foreground shadow-glow" onClick={onClose}>
            {plural(lang, "routes.filters.show", shown)}
          </button>
        </div>
      </div>
    </div>
  );
}

function SheetSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-border px-5 py-4">
      <h3 className="mb-2.5 text-[15px] font-bold">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
}
