import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Heart, Leaf } from "lucide-react";
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
        scrolled ? "py-2" : "py-4"
      )}
      style={{
        background: scrolled 
          ? 'hsl(200 12% 12% / 0.92)' 
          : 'linear-gradient(180deg, hsl(200 15% 10% / 0.7) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(160 15% 25% / 0.15)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo with organic feel */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <Leaf 
              size={20} 
              className="transition-transform duration-300 group-hover:rotate-12"
              style={{ color: 'hsl(160 30% 50%)' }}
            />
            <span 
              className="text-xl sm:text-2xl font-serif tracking-wide"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: 'hsl(45 20% 90%)',
              }}
            >
              SoulRide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative py-2 text-sm font-medium tracking-wide transition-all duration-300",
                  isActive(link.to) 
                    ? "" 
                    : "hover:opacity-100"
                )}
                style={{
                  color: isActive(link.to) ? 'hsl(45 20% 92%)' : 'hsl(45 15% 70%)',
                }}
              >
                {link.label}
                {isActive(link.to) && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, hsl(160 30% 45%), hsl(25 40% 55%))',
                    }}
                  />
                )}
              </Link>
            ))}
            
            {/* Favorites link */}
            <Link
              to="/spots"
              className={cn(
                "relative flex items-center gap-1.5 text-sm transition-all duration-300 group/fav"
              )}
              style={{
                color: favoritesCount > 0 ? 'hsl(25 45% 58%)' : 'hsl(45 15% 65%)',
              }}
              title={favoritesCount > 0 ? `${favoritesCount} saved spots` : "No saved spots"}
            >
              <Heart 
                size={18} 
                className={cn(
                  "transition-all duration-300",
                  favoritesCount > 0 && "fill-current group-hover/fav:scale-110"
                )}
              />
              {favoritesCount > 0 && (
                <span className="font-medium">{favoritesCount}</span>
              )}
            </Link>
            
            {/* User Menu */}
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/spots"
              className="flex items-center gap-1 text-sm"
              style={{
                color: favoritesCount > 0 ? 'hsl(25 45% 58%)' : 'hsl(45 15% 65%)',
              }}
            >
              <Heart 
                size={16} 
                className={cn(favoritesCount > 0 && "fill-current")}
              />
              {favoritesCount > 0 && (
                <span className="font-medium">{favoritesCount}</span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors"
              style={{ color: 'hsl(45 15% 80%)' }}
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
                  "px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200"
                )}
                style={{
                  color: isActive(link.to) ? 'hsl(45 20% 92%)' : 'hsl(45 15% 70%)',
                  background: isActive(link.to) 
                    ? 'linear-gradient(90deg, hsl(160 25% 25% / 0.3), hsl(25 35% 30% / 0.2))'
                    : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile User Menu */}
            <div className="pt-2 mt-2" style={{ borderTop: '1px solid hsl(160 15% 25% / 0.2)' }}>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
