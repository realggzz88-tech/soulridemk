import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Heart, Globe } from "lucide-react";
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
    { to: "/spots", label: "Explore" },
    { to: "/chat", label: "Community" },
    { to: "/about", label: "About" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "py-2" 
          : "py-4"
      )}
      style={{
        background: scrolled 
          ? 'hsl(0 0% 4% / 0.9)' 
          : 'linear-gradient(180deg, hsl(0 0% 0% / 0.8) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(0 0% 100% / 0.05)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo with premium glow */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <span 
              className="font-display text-2xl tracking-[0.15em]"
              style={{
                background: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(174 50% 65%) 50%, hsl(16 70% 60%) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 15px hsl(174 50% 50% / 0.4))',
              }}
            >
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
                  "relative py-2 text-sm font-medium tracking-[0.1em] uppercase transition-all duration-300",
                  isActive(link.to) 
                    ? "text-white" 
                    : "text-white/60 hover:text-white"
                )}
              >
                {link.label}
                {isActive(link.to) && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, hsl(174 60% 50%), hsl(16 80% 55%))',
                      boxShadow: '0 0 10px hsl(174 60% 50% / 0.5)',
                    }}
                  />
                )}
              </Link>
            ))}
            
            {/* Global Riders indicator */}
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'hsl(0 0% 100% / 0.05)',
                border: '1px solid hsl(0 0% 100% / 0.1)',
                color: 'hsl(174 60% 60%)',
              }}
            >
              <Globe size={12} />
              <span>Global</span>
            </div>
            
            {/* Favorites link */}
            <Link
              to="/spots"
              className={cn(
                "relative flex items-center gap-1.5 text-sm transition-all duration-300 group/fav",
                favoritesCount > 0 
                  ? "text-[hsl(16_80%_60%)]" 
                  : "text-white/60 hover:text-white"
              )}
              title={favoritesCount > 0 ? `${favoritesCount} saved spots` : "No saved spots"}
            >
              <Heart 
                size={18} 
                className={cn(
                  "transition-all duration-300",
                  favoritesCount > 0 && "fill-[hsl(16_80%_60%)] group-hover/fav:scale-110"
                )}
                style={{
                  filter: favoritesCount > 0 ? "drop-shadow(0 0 8px hsl(16 80% 55% / 0.5))" : undefined
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
                favoritesCount > 0 ? "text-[hsl(16_80%_60%)]" : "text-white/60"
              )}
            >
              <Heart 
                size={16} 
                className={cn(favoritesCount > 0 && "fill-[hsl(16_80%_60%)]")}
              />
              {favoritesCount > 0 && (
                <span className="font-medium">{favoritesCount}</span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors"
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
            isOpen ? "max-h-80 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium tracking-[0.1em] uppercase transition-all duration-200",
                  isActive(link.to)
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
                style={isActive(link.to) ? {
                  background: 'linear-gradient(90deg, hsl(174 60% 30% / 0.3), hsl(16 70% 40% / 0.2))',
                } : {}}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile User Menu */}
            <div className="pt-2 border-t border-white/10 mt-2">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
