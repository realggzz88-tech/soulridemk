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
          ? 'hsl(222 47% 7% / 0.95)' 
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(222 20% 18%)' : 'none',
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
              className="text-xl font-bold tracking-tight hidden sm:block"
              style={{
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                color: '#F8FAFC',
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
                className="relative py-2 text-sm font-medium transition-all duration-300"
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  color: isActive(link.to) ? '#F8FAFC' : '#94A3B8',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = '#F8FAFC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
              >
                {link.label}
                {isActive(link.to) && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: '#10B981' }}
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
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:bg-white/5"
              title={favoritesCount > 0 ? `${favoritesCount} saved spots` : "No saved spots"}
            >
              <Heart 
                size={20} 
                className={cn(
                  "transition-all duration-300",
                  favoritesCount > 0 && "fill-current"
                )}
                style={{ color: favoritesCount > 0 ? '#10B981' : '#94A3B8' }}
              />
              {favoritesCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full"
                  style={{ 
                    background: '#10B981',
                    color: 'white',
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
                  to="/auth"
                  className="text-sm font-medium transition-colors duration-300"
                  style={{ 
                    color: '#94A3B8',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #00D4B4 100%)',
                    color: 'white',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
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
              style={{ color: favoritesCount > 0 ? '#10B981' : '#94A3B8' }}
            >
              <Heart 
                size={18} 
                className={cn(favoritesCount > 0 && "fill-current")}
              />
              {favoritesCount > 0 && (
                <span className="font-medium">{favoritesCount}</span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors rounded-lg hover:bg-white/5"
              style={{ color: '#F8FAFC' }}
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
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive(link.to) ? '#F8FAFC' : '#94A3B8',
                  background: isActive(link.to) ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            {!user && (
              <div className="flex gap-3 mt-3 px-4">
                <Link
                  to="/auth"
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-center transition-all duration-200"
                  style={{
                    color: '#94A3B8',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-center"
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #00D4B4 100%)',
                    color: 'white',
                  }}
                >
                  Join
                </Link>
              </div>
            )}
            
            {user && (
              <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
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
