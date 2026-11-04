import { lazy, Suspense, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Lightbulb, Navigation, Route, Cloud } from "lucide-react";
import { spots } from "@/data/spots";
import ImageCarousel from "@/components/ImageCarousel";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButtons from "@/components/ShareButtons";
import WeatherWidget from "@/components/WeatherWidget";
import StartDrivingButton from "@/components/StartDrivingButton";
import { DeferMount } from "@/components/DeferMount";
import { MapPlaceholder } from "@/components/MapPlaceholder";
import Seo from "@/components/Seo";
import { spotSeo } from "@/lib/seo";

const SpotDetailMap = lazy(() =>
  import("@/components/SpotMap").then((module) => ({ default: module.SpotDetailMap })),
);
const ScenicRoute = lazy(() => import("@/components/ScenicRoute"));

const SpotDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const spot = spots.find((s) => s.id === id);
  const [showRideSummary, setShowRideSummary] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [id]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      // Add highlight effect
      element.classList.add("ring-2", "ring-soul-amber/50");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-soul-amber/50");
      }, 2000);
    }
    setShowRideSummary(true);
  };

  if (!spot) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Seo
          title="Местото не е пронајдено"
          description="Ова место го нема во SoulRide. Врати се на списокот и избери друго место за возење во Македонија."
          path={`/spots/${id ?? ""}`}
          noindex
        />
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4 tracking-wider">Spot Not Found</h1>
          <Link to="/spots" className="text-earth-green-glow hover:underline tracking-wide">
            Back to all spots
          </Link>
        </div>
      </div>
    );
  }

  // Generate ride summary
  const rideSummary = `Soulride to ${spot.title}: ~${Math.floor(20 + Math.random() * 80)} km of twisty beauty from Ohrid. ${spot.tags.includes("twisty") ? "Expect hairpins and curves that awaken your spirit." : "A scenic journey through Macedonia's hidden landscapes."}`;

  const meta = spotSeo(spot);

  return (
    <div className="min-h-screen pt-20 grain-overlay" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <Seo title={meta.title} description={meta.description} path={meta.path} />
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <Link
          to="/spots"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tracking-wide text-sm sm:text-base"
        >
          <ArrowLeft size={18} />
          <span>Back to Spots</span>
        </Link>
      </div>

      {/* Image Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ImageCarousel 
          images={spot.images} 
          title={spot.title} 
          poeticTagline={spot.poeticTagline}
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <FavoriteButton spotId={spot.id} size="lg" showLabel />
          
          <button
            onClick={() => scrollToSection("ride-planning")}
            className="group inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl bg-soul-amber/20 border border-soul-amber/30 text-soul-amber hover:bg-soul-amber/30 hover:shadow-[0_0_25px_hsl(var(--amber-soul)/0.4)] transition-all duration-300 tracking-wide text-sm sm:text-base"
          >
            <Navigation size={16} className="sm:w-[18px] sm:h-[18px] group-hover:animate-pulse" style={{ filter: 'drop-shadow(0 0 6px hsl(32 85% 52% / 0.5))' }} />
            <span className="font-medium hidden sm:inline">Route from Your Location</span>
            <span className="font-medium sm:hidden">Plan Route</span>
          </button>

          <ShareButtons variant="compact" spotName={spot.title} />
        </div>

        {/* Weather Widget */}
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <Cloud size={18} className="text-mountain-blue" style={{ filter: "drop-shadow(0 0 6px hsl(215 50% 55% / 0.5))" }} />
            <h3 className="font-display text-lg tracking-wide">CURRENT CONDITIONS</h3>
          </div>
          <WeatherWidget 
            lat={spot.coordinates.lat} 
            lng={spot.coordinates.lng} 
            spotName={spot.title}
          />
        </div>

        {/* Quick Info Note */}
        <div className="mb-8 p-4 rounded-xl bg-muted/20 border border-border/30">
          <p className="text-sm text-muted-foreground tracking-wide">
            <span className="text-soul-amber font-medium">📍 Plan your ride:</span>{" "}
            Uses your GPS location as start point. No permission? Falls back to Skopje center.
          </p>
        </div>
        {/* Ride Summary - Shows when Plan Ride is clicked */}
        {showRideSummary && (
          <div className="mb-8 p-5 rounded-xl bg-mountain-blue/20 border border-mountain-blue/30 animate-fade-up">
            <div className="flex items-start gap-3">
              <Route size={20} className="text-soul-amber mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-display text-lg tracking-wide mb-2 text-soul-amber">RIDE PREVIEW</h3>
                <p className="text-foreground/90 leading-relaxed tracking-wide">{rideSummary}</p>
                <p className="text-xs text-muted-foreground mt-2 italic tracking-wide">
                  Preview twisty beauty – for real GPS, export to OsmAnd or use phone apps
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Poetic Tagline */}
        <p className="text-earth-green-glow italic text-lg mb-4 font-light tracking-wide">
          "{spot.poeticTagline}"
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {spot.tags.map((tag) => (
            <span key={tag} className="tag-pill tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider mb-4 sm:mb-6 text-gradient-subtle">
          {spot.title}
        </h1>

        {/* Description */}
        <div className="prose prose-invert prose-lg max-w-none mb-8 sm:mb-12">
          <p className="text-foreground/90 leading-relaxed text-lg tracking-wide">
            {spot.longDescription}
          </p>
        </div>

        {/* Rider Tips - Part of ride planning section */}
        <div id="ride-planning" className="scroll-mt-24 transition-all duration-500 rounded-xl">
          <div className="spot-card p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-soul-amber/20">
                <Lightbulb className="w-5 h-5 text-soul-amber" />
              </div>
              <h2 className="font-display text-2xl tracking-wider">RIDER TIPS</h2>
            </div>
            <ul className="space-y-4">
              {spot.riderTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-earth-green-glow mt-1">•</span>
                  <span className="text-muted-foreground tracking-wide">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Map Section */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-earth-green/20">
                <MapPin className="w-5 h-5 text-earth-green-glow" />
              </div>
              <h2 className="font-display text-2xl tracking-wider">LOCATION</h2>
            </div>
            <DeferMount
              fallback={(activate) => (
                <MapPlaceholder onActivate={activate} className="h-56 sm:h-64 md:h-96" />
              )}
            >
              <Suspense fallback={<MapPlaceholder busy onActivate={() => undefined} className="h-56 sm:h-64 md:h-96" />}>
                <SpotDetailMap spot={spot} />
              </Suspense>
            </DeferMount>
            
            {/* Prominent Start Driving Button */}
            <div className="flex justify-center py-4">
              <StartDrivingButton
                destinationLat={spot.coordinates.lat}
                destinationLng={spot.coordinates.lng}
                destinationName={spot.title}
                variant="hero"
              />
            </div>
            
            <p className="text-sm text-muted-foreground text-center tracking-wide">
              Coordinates: {spot.coordinates.lat.toFixed(2)}°N, {spot.coordinates.lng.toFixed(2)}°E • Macedonia, Balkans
            </p>
          </div>

          {/* Scenic Route Planner */}
          <div className="mb-12">
            <DeferMount
              fallback={(activate) => (
                <MapPlaceholder onActivate={activate} className="min-h-80 md:min-h-[450px]" />
              )}
            >
              <Suspense
                fallback={<MapPlaceholder busy onActivate={() => undefined} className="min-h-80 md:min-h-[450px]" />}
              >
                <ScenicRoute spot={spot} />
              </Suspense>
            </DeferMount>
          </div>
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-border/30">
          <ShareButtons title={spot.title} spotName={spot.title} />
        </div>
      </div>
    </div>
  );
};

export default SpotDetailPage;
