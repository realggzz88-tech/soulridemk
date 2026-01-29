import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { count: favoritesCount } = useFavorites();

  const links = [
    { to: "/", label: "Home" },
    { to: "/spots", label: "Explore Spots" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <span className="font-display text-2xl tracking-widest text-foreground group-hover:text-earth-green-glow transition-colors duration-300">
              SOULRIDE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "nav-link text-muted-foreground hover:text-foreground",
                  isActive(link.to) && "text-foreground after:w-full"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Favorites indicator */}
            {favoritesCount > 0 && (
              <Link
                to="/spots"
                className="relative flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                title={`${favoritesCount} saved spots`}
              >
                <Heart size={18} className="text-soul-amber fill-soul-amber" />
                <span className="text-soul-amber font-medium">{favoritesCount}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {favoritesCount > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <Heart size={16} className="text-soul-amber fill-soul-amber" />
                <span className="text-soul-amber font-medium">{favoritesCount}</span>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            isOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium tracking-wider uppercase transition-all duration-200",
                  isActive(link.to)
                    ? "bg-earth-green/20 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
