import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Lightbulb, Navigation, Route } from "lucide-react";
import { spots } from "@/data/spots";
import ImageCarousel from "@/components/ImageCarousel";
import { SpotDetailMap } from "@/components/SpotMap";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButtons from "@/components/ShareButtons";
import ScenicRoute from "@/components/ScenicRoute";
import { useState } from "react";

const SpotDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const spot = spots.find((s) => s.id === id);
  const [showRideSummary, setShowRideSummary] = useState(false);

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

  return (
    <div className="min-h-screen pt-20">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to="/spots"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors tracking-wide"
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <FavoriteButton spotId={spot.id} size="lg" showLabel />
          
          <button
            onClick={() => scrollToSection("ride-planning")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-earth-green/20 border border-earth-green/30 text-earth-green-glow hover:bg-earth-green/30 hover:shadow-[0_0_25px_hsl(var(--earth-green)/0.3)] transition-all duration-300 tracking-wide"
          >
            <Navigation size={18} />
            <span className="font-medium">Plan This Ride</span>
          </button>

          <ShareButtons variant="compact" spotName={spot.title} />
        </div>

        {/* Ride Summary - Shows when Plan Ride is clicked */}
        {showRideSummary && (
          <div className="mb-8 p-5 rounded-xl bg-mountain-blue/20 border border-mountain-blue/30 animate-fade-up">
            <div className="flex items-start gap-3">
              <Route size={20} className="text-soul-amber mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-display text-lg tracking-wide mb-2 text-soul-amber">RIDE SUMMARY</h3>
                <p className="text-foreground/90 leading-relaxed tracking-wide">{rideSummary}</p>
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
        <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-6 text-gradient-subtle">
          {spot.title}
        </h1>

        {/* Description */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
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
            <SpotDetailMap spot={spot} />
            <p className="text-sm text-muted-foreground text-center tracking-wide">
              Coordinates: {spot.coordinates.lat.toFixed(2)}°N, {spot.coordinates.lng.toFixed(2)}°E • Macedonia, Balkans
            </p>
          </div>

          {/* Scenic Route Planner */}
          <div className="mb-12">
            <ScenicRoute spot={spot} />
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
