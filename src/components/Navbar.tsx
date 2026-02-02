import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { count: favoritesCount } = useFavorites();
  const { user } = useAuth();

  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/spots", label: "Explore Spots" },
    { to: "/chat", label: "Community" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-background/90 backdrop-blur-lg border-b border-border/40 shadow-lg" 
          : "bg-background/70 backdrop-blur-md border-b border-border/20"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with glow */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <span className="font-display text-2xl tracking-widest logo-glow">
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
                  "nav-link text-muted-foreground hover:text-foreground tracking-wider",
                  isActive(link.to) && "text-foreground after:w-full"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Favorites link */}
            <Link
              to="/spots"
              className={cn(
                "relative flex items-center gap-1.5 text-sm transition-all duration-300 group/fav",
                favoritesCount > 0 
                  ? "text-soul-amber" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={favoritesCount > 0 ? `${favoritesCount} saved spots` : "No saved spots"}
            >
              <Heart 
                size={18} 
                className={cn(
                  "transition-all duration-300",
                  favoritesCount > 0 && "fill-soul-amber group-hover/fav:scale-110"
                )}
                style={{
                  filter: favoritesCount > 0 ? "drop-shadow(0 0 6px hsl(32 85% 52% / 0.5))" : undefined
                }}
              />
              {favoritesCount > 0 && (
                <span className="font-medium tracking-wide">{favoritesCount}</span>
              )}
            </Link>
            
            {/* User Menu */}
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/spots"
              className={cn(
                "flex items-center gap-1 text-sm",
                favoritesCount > 0 ? "text-soul-amber" : "text-muted-foreground"
              )}
            >
              <Heart 
                size={16} 
                className={cn(favoritesCount > 0 && "fill-soul-amber")}
              />
              {favoritesCount > 0 && (
                <span className="font-medium">{favoritesCount}</span>
              )}
            </Link>
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
