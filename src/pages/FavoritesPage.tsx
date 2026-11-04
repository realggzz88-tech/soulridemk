import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/use-favorites";
import { spots } from "@/data/spots";

const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const saved = spots.filter((spot) => favorites.includes(spot.id));

  return (
    <div className="mx-auto w-full max-w-content px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-[31px] font-extrabold text-foreground">Омилени</h1>
      {saved.length === 0 ? (
        <div className="mt-10 flex max-w-md flex-col items-start gap-4">
          <p className="text-muted-foreground">Немаш зачувани места.</p>
          <Link to="/spots" className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-[15px] font-semibold text-primary-foreground">
            Види места
          </Link>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {saved.map((spot) => (
            <li key={spot.id}>
              <Link to={`/spots/${spot.id}`} className="inline-flex min-h-11 items-center text-foreground underline-offset-4 hover:underline">
                {spot.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoritesPage;
