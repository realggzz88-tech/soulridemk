import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
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
    { to: "/", label: "Почетна" },
    { to: "/spots", label: "Истражи" },
    { to: "/chat", label: "Заедница" },
    { to: "/about", label: "За нас" },
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
          ? 'hsl(20 15% 8% / 0.95)' 
          : 'linear-gradient(180deg, hsl(20 15% 8% / 0.8) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(25 15% 18% / 0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            {/* Simple text logo */}
            <span 
              className="text-2xl font-bold tracking-tight"
              style={{ color: 'hsl(0 0% 100%)' }}
            >
              Soul<span style={{ color: 'hsl(15 70% 55%)' }}>Ride</span>
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
                  color: isActive(link.to) ? 'hsl(170 60% 55%)' : 'hsl(0 0% 100% / 0.7)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'hsl(0 0% 100%)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'hsl(0 0% 100% / 0.7)';
                  }
                }}
              >
                {link.label}
                {isActive(link.to) && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: 'hsl(170 60% 55%)' }}
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
                background: favoritesCount > 0 ? 'hsl(15 70% 50% / 0.15)' : 'transparent',
              }}
              title={favoritesCount > 0 ? `${favoritesCount} зачувани места` : "Нема зачувани места"}
            >
              <Heart 
                size={20} 
                className={cn(
                  "transition-all duration-300",
                  favoritesCount > 0 && "fill-current"
                )}
                style={{ color: favoritesCount > 0 ? 'hsl(15 70% 55%)' : 'hsl(0 0% 100% / 0.6)' }}
              />
              {favoritesCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full"
                  style={{ 
                    background: 'hsl(15 70% 50%)',
                    color: 'hsl(0 0% 100%)',
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
                  className="text-sm font-medium transition-colors duration-300"
                  style={{ color: 'hsl(0 0% 100% / 0.7)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(0 0% 100%)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(0 0% 100% / 0.7)'}
                >
                  Најави се
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, hsl(15 70% 50%) 0%, hsl(25 75% 55%) 100%)',
                    color: 'hsl(0 0% 100%)',
                    boxShadow: '0 4px 12px hsl(15 70% 45% / 0.3)',
                  }}
                >
                  Регистрирај се
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
              style={{ color: favoritesCount > 0 ? 'hsl(15 70% 55%)' : 'hsl(0 0% 100% / 0.6)' }}
            >
              <Heart 
                size={18} 
                className={cn(favoritesCount > 0 && "fill-current")}
              />
              {favoritesCount > 0 && (
                <span className="font-medium">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 transition-colors rounded-lg"
              style={{ 
                color: 'hsl(0 0% 100%)',
                background: isOpen ? 'hsl(0 0% 100% / 0.1)' : 'transparent',
              }}
              aria-label="Отвори мени"
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
            style={{ borderTop: '1px solid hsl(25 15% 20% / 0.5)' }}
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive(link.to) ? 'hsl(170 60% 55%)' : 'hsl(0 0% 100% / 0.7)',
                  background: isActive(link.to) ? 'hsl(170 60% 50% / 0.1)' : 'transparent',
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
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-center transition-all duration-200"
                  style={{
                    color: 'hsl(0 0% 100% / 0.7)',
                    border: '1px solid hsl(25 15% 25%)',
                  }}
                >
                  Најави се
                </Link>
                <Link
                  to="/signup"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-center"
                  style={{
                    background: 'linear-gradient(135deg, hsl(15 70% 50%) 0%, hsl(25 75% 55%) 100%)',
                    color: 'hsl(0 0% 100%)',
                  }}
                >
                  Регистрирај се
                </Link>
              </div>
            )}
            
            {user && (
              <div className="pt-3 mt-3" style={{ borderTop: '1px solid hsl(25 15% 20% / 0.5)' }}>
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
