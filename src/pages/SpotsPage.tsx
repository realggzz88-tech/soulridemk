import { spots } from "@/data/spots";
import SpotCard from "@/components/SpotCard";

const SpotsPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-4 animate-fade-up">
            EXPLORE SPOTS
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-up opacity-0" style={{ animationDelay: "0.1s" }}>
            Handpicked destinations where the road becomes poetry and every turn reveals a new verse
          </p>
        </div>

        {/* Spots Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {spots.map((spot, index) => (
            <div
              key={spot.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <SpotCard spot={spot} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotsPage;
