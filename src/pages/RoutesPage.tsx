import { useEffect, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CircleAlert, RefreshCw, Route, Search } from "lucide-react";
import { useLang } from "@/features/shell/lang";
import { RouteCard } from "@/features/routes/RouteCard";
import { RouteFilters } from "@/features/routes/RouteFilters";
import { plural, translate } from "@/features/routes/copy";
import { applyRouteQuery, hasActiveQuery, paramsFromQuery, queryFromParams, type RouteQuery } from "@/features/routes/filter";
import type { RouteListItem } from "@/features/routes/model";
import { loadRouteList as loadDefault } from "@/features/routes/source";
import { RouteMapPanel } from "@/features/routes/RouteMapPanel";

interface RoutesPageProps {
  loadRouteList?: () => Promise<RouteListItem[]>;
}

const RoutesPage = ({ loadRouteList = loadDefault }: RoutesPageProps) => {
  const { lang } = useLang();
  const t = (path: string, vars?: Record<string, string | number>) => translate(lang, path, vars);
  const [params, setParams] = useSearchParams();
  const query = queryFromParams(params);
  const preview = params.get("state");
  const mapOn = params.get("map") === "1";
  const [items, setItems] = useState<RouteListItem[] | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? null;
    document.title = translate(lang, "routes.meta.title");
    meta?.setAttribute("content", translate(lang, "routes.meta.description"));
    return () => {
      document.title = previousTitle;
      if (previousDescription !== null) meta?.setAttribute("content", previousDescription);
    };
  }, [lang]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    loadRouteList()
      .then((next) => {
        if (cancelled) return;
        setItems(next);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [loadRouteList, attempt]);

  const updateQuery = (next: RouteQuery) => {
    const nextParams = paramsFromQuery(next);
    if (mapOn) nextParams.set("map", "1");
    setParams(nextParams, { replace: true });
  };

  const showError = status === "error" || preview === "error";
  const showLoading = !showError && (status === "loading" || preview === "loading");
  const visible = items ? applyRouteQuery(items, query) : [];
  const total = items?.length ?? 0;
  const countText = showLoading
    ? t("routes.loading")
    : items && hasActiveQuery(query)
      ? t("routes.countFiltered", { shown: visible.length, total })
      : items
        ? plural(lang, "routes.count", total)
        : "";

  return (
    <div className={`bg-background ${mapOn ? "xl:pr-0" : ""}`}>
      <div className="mx-auto w-full max-w-content px-4 sm:px-6 lg:px-8">
        <header className="pb-4 pt-6 md:pb-6 md:pt-10">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-primary">
            <Route aria-hidden className="h-4 w-4" />
            {t("routes.overline")}
          </p>
          <h1 className="mt-1.5 text-balance font-display text-[31px] font-extrabold leading-[1.15] text-foreground lg:text-[44px]">
            {t("routes.title")}
          </h1>
          <p className="mt-1 font-script text-[22px] leading-tight text-accent">{t("routes.tagline")}</p>
          <p aria-live="polite" aria-atomic="true" className="mt-1 min-h-6 text-sm text-muted-foreground">
            {showError ? "" : countText}
          </p>
        </header>

        {!showError && (showLoading || (items && items.length > 0)) && (
          <RouteFilters
            items={items ?? []}
            query={query}
            shown={visible.length}
            onChange={updateQuery}
            defaultOpen={params.get("sheet") === "1"}
          />
        )}

        <div className={mapOn ? "xl:grid xl:grid-cols-12 xl:gap-6" : ""}>
          <div className={mapOn ? "xl:col-span-7" : ""}>
            {showLoading && <RouteSkeletons label={t("routes.loading")} />}
            {showError && (
              <StatusBlock
                icon={
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-destructive">
                    <CircleAlert aria-hidden className="h-7 w-7" />
                  </span>
                }
                title={t("common.error.title")}
                body={t("routes.errorBody")}
                alert
              >
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-glow"
                  onClick={() => setAttempt((value) => value + 1)}
                >
                  <RefreshCw aria-hidden className="h-4 w-4" />
                  {t("common.error.retry")}
                </button>
                <Link
                  to="/"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-input px-5 text-[15px] font-semibold"
                >
                  {t("common.error.home")}
                </Link>
              </StatusBlock>
            )}
            {!showLoading && !showError && items && items.length === 0 && (
              <StatusBlock
                icon={
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground">
                    <Search aria-hidden className="h-7 w-7" />
                  </span>
                }
                title={t("routes.none.title")}
              >
                <Link to="/spots" className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-glow">
                  {t("routes.none.action")}
                </Link>
              </StatusBlock>
            )}
            {!showLoading && !showError && items && items.length > 0 && visible.length === 0 && (
              <StatusBlock
                icon={
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground">
                    <Search aria-hidden className="h-7 w-7" />
                  </span>
                }
                title={t("routes.empty.title")}
                body={t("routes.empty.body")}
              >
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-glow"
                  onClick={() => updateQuery({ difficulty: "all", regions: [], length: "all", sort: "recommended" })}
                >
                  {t("routes.empty.action")}
                </button>
              </StatusBlock>
            )}
            {!showLoading && !showError && visible.length > 0 && (
              <ul className={`grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:gap-6 md:py-6 ${mapOn ? "xl:grid-cols-2" : "lg:grid-cols-3"} motion-safe:animate-fade-in`}>
                {visible.map((item, index) => (
                  <li key={item.id}>
                    <RouteCard item={item} priority={index === 0} forceFail={preview === "imgfail" && (index === 1 || index === 4)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          {mapOn && !showError && <RouteMapPanel className="mt-6 hidden xl:col-span-5 xl:mt-6 xl:block" />}
        </div>
      </div>
    </div>
  );
};

function RouteSkeletons({ label }: { label: string }) {
  return (
    <div aria-busy="true" className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:gap-6 md:py-6 lg:grid-cols-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} aria-hidden className={`overflow-hidden rounded-lg border border-border bg-card ${index >= 3 ? "hidden lg:block" : ""}`}>
          <div className="aspect-[16/9] skeleton-bar motion-safe:animate-shimmer" />
          <div className="space-y-2 p-4">
            <div className="skeleton-bar h-5 w-3/5 rounded-md" />
            <div className="skeleton-bar h-4 w-4/5 rounded-md" />
            <div className="flex gap-2">
              <div className="skeleton-bar h-6 w-16 rounded-pill" />
              <div className="skeleton-bar h-6 w-20 rounded-pill" />
            </div>
            <div className="skeleton-bar h-4 w-1/2 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBlock({
  icon,
  title,
  body,
  children,
  alert,
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  children?: ReactNode;
  alert?: boolean;
}) {
  return (
    <div role={alert ? "alert" : undefined} className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-14 text-center">
      {icon}
      <h2 className="font-display text-[22px] font-bold text-foreground">{title}</h2>
      {body && <p className="max-w-sm text-[15px] text-muted-foreground">{body}</p>}
      <div className="mt-2 flex flex-col items-center gap-2">{children}</div>
    </div>
  );
}

export default RoutesPage;
