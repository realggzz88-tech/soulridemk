import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import BikerLogo from "@/components/BikerLogo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { count: favoritesCount } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
      style={{
        background: scrolled 
          ? 'linear-gradient(180deg, hsl(200 20% 8% / 0.98) 0%, hsl(180 15% 10% / 0.95) 100%)' 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(140 15% 25% / 0.3)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <BikerLogo size={42} />
            <span 
              className="text-xl font-bold tracking-wider hidden sm:block"
              style={{
                fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
                color: 'hsl(40 30% 94%)',
                textShadow: '1px 1px 2px hsl(0 0% 0% / 0.5)',
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
                className="relative py-2 text-sm font-medium transition-all duration-300 tracking-wide"
                style={{
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                  color: isActive(link.to) ? 'hsl(40 30% 94%)' : 'hsl(40 15% 65%)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'hsl(40 30% 88%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'hsl(40 15% 65%)';
                  }
                }}
              >
                {link.label}
                {isActive(link.to) && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'hsl(140 22% 42%)' }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Favorites */}
            <Link
              to="/spots"
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
              style={{
                background: favoritesCount > 0 ? 'hsl(140 22% 42% / 0.15)' : 'transparent',
              }}
              title={favoritesCount > 0 ? `${favoritesCount} saved spots` : "No saved spots"}
            >
              <Heart 
                size={20} 
                className={cn(
                  "transition-all duration-300",
                  favoritesCount > 0 && "fill-current"
                )}
                style={{ color: favoritesCount > 0 ? 'hsl(140 22% 48%)' : 'hsl(40 15% 55%)' }}
              />
              {favoritesCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full"
                  style={{ 
                    background: 'hsl(20 45% 38%)',
                    color: 'hsl(40 30% 94%)',
                    fontFamily: "'Special Elite', 'Courier New', monospace",
                    fontSize: '10px',
                  }}
                >
                  {favoritesCount}
                </span>
              )}
            </Link>
            
            {/* Auth buttons */}
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium transition-colors duration-300 tracking-wide"
                  style={{ 
                    color: 'hsl(40 15% 60%)',
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(40 30% 88%)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(40 15% 60%)'}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 tracking-wide vintage-button"
                  style={{
                    background: 'linear-gradient(135deg, hsl(20 45% 35%) 0%, hsl(25 40% 42%) 100%)',
                    color: 'hsl(40 30% 94%)',
                    fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
                    boxShadow: 'inset 0 1px 0 hsl(40 30% 60% / 0.2), 0 2px 8px hsl(0 0% 0% / 0.4)',
                    border: '1px solid hsl(20 35% 28%)',
                  }}
                >
                  Join
                </Link>
              </div>
            ) : (
              <UserMenu />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link
              to="/spots"
              className="flex items-center gap-1 text-sm"
              style={{ color: favoritesCount > 0 ? 'hsl(140 22% 48%)' : 'hsl(40 15% 55%)' }}
            >
              <Heart 
                size={18} 
                className={cn(favoritesCount > 0 && "fill-current")}
              />
              {favoritesCount > 0 && (
                <span className="font-medium" style={{ fontFamily: "'Special Elite', monospace" }}>
                  {favoritesCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors rounded-lg"
              style={{ 
                color: 'hsl(40 30% 94%)',
                background: isOpen ? 'hsl(140 22% 42% / 0.1)' : 'transparent',
              }}
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
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div 
            className="flex flex-col gap-1 pt-4 mt-4"
            style={{ borderTop: '1px solid hsl(140 15% 25% / 0.3)' }}
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 tracking-wide"
                style={{
                  color: isActive(link.to) ? 'hsl(40 30% 94%)' : 'hsl(40 15% 60%)',
                  background: isActive(link.to) ? 'hsl(140 22% 42% / 0.15)' : 'transparent',
                  fontFamily: "'Libre Baskerville', Georgia, serif",
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            {!user && (
              <div className="flex gap-3 mt-3 px-4">
                <Link
                  to="/login"
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-center transition-all duration-200 tracking-wide"
                  style={{
                    color: 'hsl(40 15% 65%)',
                    border: '1px solid hsl(140 15% 25% / 0.4)',
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-center tracking-wide"
                  style={{
                    background: 'linear-gradient(135deg, hsl(20 45% 35%) 0%, hsl(25 40% 42%) 100%)',
                    color: 'hsl(40 30% 94%)',
                    fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
                  }}
                >
                  Join
                </Link>
              </div>
            )}
            
            {user && (
              <div className="pt-3 mt-3" style={{ borderTop: '1px solid hsl(140 15% 25% / 0.3)' }}>
                <UserMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
