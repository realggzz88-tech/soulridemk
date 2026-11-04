import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Compass, MapPin } from "lucide-react";
import { routes } from "@/data/routes";
import Seo from "@/components/Seo";
import { routesSeo } from "@/lib/seo";

const RoutesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div
      className="min-h-screen pt-24 sm:pt-28 pb-16"
      style={{ backgroundColor: "hsl(20 15% 8%)" }}
    >
      <Seo title={routesSeo.title} description={routesSeo.description} path={routesSeo.path} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{
              background: "hsl(15 70% 50% / 0.12)",
              border: "1px solid hsl(15 70% 50% / 0.25)",
            }}
          >
            <Compass className="h-4 w-4" style={{ color: "hsl(15 70% 55%)" }} />
            <span
              className="text-xs uppercase tracking-[0.2em] font-medium"
              style={{ color: "hsl(15 70% 60%)" }}
            >
              Soul Routes
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
            style={{ color: "hsl(0 0% 100%)" }}
          >
            Истражи ги сите рути
          </h1>
          <p className="text-lg max-w-2xl mx-auto font-script" style={{ color: "hsl(30 15% 65%)" }}>
            {routes.length} рути низ Северна Македонија
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Link
              key={route.id}
              to={`/routes/${route.id}`}
              className="group relative h-[260px] rounded-xl overflow-hidden border border-border/30 hover:border-earth-green/50 transition-all duration-300"
            >
              <img
                src={route.mainImage}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-xs px-2 py-1 rounded-full bg-soul-amber/80 text-primary-foreground mb-2 inline-block">
                  {route.region}
                </span>
                <h2 className="font-display text-lg tracking-wide text-foreground group-hover:text-soul-amber transition-colors">
                  {route.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{route.poeticTagline}"</p>
                <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {route.distance}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {route.duration}
                  </span>
                  <span>{route.difficulty}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;
