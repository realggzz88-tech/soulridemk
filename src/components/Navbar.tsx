import { Link, useLocation } from "react-router-dom";
import { Heart, Home, MapPin, Route, User } from "lucide-react";
import { useLang } from "@/features/shell/lang";
import { translate, type Lang } from "@/features/routes/copy";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";

const tabs = [
  { to: "/", key: "nav.home", icon: Home, end: true },
  { to: "/spots", key: "nav.spots", icon: MapPin, end: false },
  { to: "/routes", key: "nav.routes", icon: Route, end: false },
  { to: "/favorites", key: "nav.favourites", icon: Heart, end: false },
  { to: "/profile", key: "nav.profile", icon: User, end: false },
] as const;

const desktopLinks = tabs.slice(0, 4);

function active(pathname: string, to: string, end: boolean) {
  if (end) return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

const Navbar = () => {
  const { lang, setLang } = useLang();
  const { user } = useAuth();
  const { pathname } = useLocation();
  const t = (path: string) => translate(lang, path);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[80] focus:inline-flex focus:h-11 focus:items-center focus:rounded-lg focus:bg-primary focus:px-4 focus:font-semibold focus:text-primary-foreground"
      >
        {t("nav.skip")}
      </a>
      <header className="sticky top-0 z-header flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:hidden">
        <Link to="/" className="inline-flex min-h-11 items-center font-display text-xl font-extrabold tracking-tight text-foreground">
          Soul<span className="text-primary">Ride</span>
        </Link>
        <LangSwitch lang={lang} setLang={setLang} label={t("nav.language")} className="ml-auto" />
      </header>

      <header className="sticky top-0 z-header hidden h-16 border-b border-border bg-background/95 backdrop-blur md:block">
        <div className="mx-auto flex h-full max-w-content items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex min-h-11 items-center font-display text-xl font-extrabold tracking-tight text-foreground">
            Soul<span className="text-primary">Ride</span>
          </Link>
          <nav className="flex gap-1" aria-label={t("nav.primary")}>
            {desktopLinks.map((link) => {
              const on = active(pathname, link.to, link.end);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={on ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium ${
                    on ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <LangSwitch lang={lang} setLang={setLang} label={t("nav.language")} />
            {user ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                aria-label={t("nav.profile")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground"
              >
                <User aria-hidden className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-header grid h-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom))] grid-cols-5 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="Главна навигација"
      >
        {tabs.map((tab) => {
          const on = active(pathname, tab.to, tab.end);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              aria-current={on ? "page" : undefined}
              className={`relative flex min-h-11 flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                on ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {on && <span className="absolute inset-x-1/4 top-0 h-[3px] rounded-b bg-primary" />}
              <Icon aria-hidden className="h-6 w-6" strokeWidth={2} />
              <span>{t(tab.key)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

function LangSwitch({
  lang,
  setLang,
  label,
  className = "",
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex overflow-hidden rounded-pill border border-input ${className}`} role="group" aria-label={label}>
      {(["mk", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`inline-flex h-9 min-w-9 items-center justify-center px-2.5 text-[13px] font-semibold uppercase ${
            lang === code ? "bg-secondary text-foreground" : "text-muted-foreground"
          }`}
        >
          {code === "mk" ? "MK" : "EN"}
        </button>
      ))}
    </div>
  );
}

export default Navbar;
