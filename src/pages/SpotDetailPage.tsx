import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Lightbulb } from "lucide-react";
import { spots } from "@/data/spots";
import ImageCarousel from "@/components/ImageCarousel";

const SpotDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const spot = spots.find((s) => s.id === id);

  if (!spot) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">Spot Not Found</h1>
          <Link to="/spots" className="text-earth-green-glow hover:underline">
            Back to all spots
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to="/spots"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Spots</span>
        </Link>
      </div>

      {/* Image Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ImageCarousel images={spot.images} title={spot.title} />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {spot.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-6">
          {spot.title}
        </h1>

        {/* Description */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          <p className="text-foreground/90 leading-relaxed text-lg">
            {spot.longDescription}
          </p>
        </div>

        {/* Rider Tips */}
        <div className="spot-card p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-soul-amber/20">
              <Lightbulb className="w-5 h-5 text-soul-amber" />
            </div>
            <h2 className="font-display text-2xl tracking-wide">RIDER TIPS</h2>
          </div>
          <ul className="space-y-4">
            {spot.riderTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-earth-green-glow mt-1">•</span>
                <span className="text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Map Placeholder */}
        <div className="spot-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-earth-green/20">
              <MapPin className="w-5 h-5 text-earth-green-glow" />
            </div>
            <h2 className="font-display text-2xl tracking-wide">LOCATION</h2>
          </div>
          <div className="aspect-[16/9] rounded-lg bg-muted flex items-center justify-center border border-border/50">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Interactive map coming soon</p>
              <p className="text-xs mt-1">Macedonia • Balkans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotDetailPage;
