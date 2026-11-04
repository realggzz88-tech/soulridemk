import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";
import ShareButtons from "./ShareButtons";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "#", label: "Е-пошта" },
  ];

  return (
    <footer 
      className="relative overflow-hidden"
      style={{ 
        backgroundColor: 'hsl(20 15% 7%)',
        borderTop: '1px solid hsl(25 15% 15%)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-flex min-h-11 items-center">
              <span 
                className="text-2xl font-bold tracking-tight"
                style={{ color: 'hsl(0 0% 100%)' }}
              >
                Soul<span style={{ color: 'hsl(15 70% 55%)' }}>Ride</span>
              </span>
            </Link>
            <p 
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'hsl(36 18% 78%)' }}
            >
              Каде секој завој шепоти авантура и секој хоризонт ја повикува талкачката душа.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'hsl(170 60% 55%)' }}
            >
              Истражи
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/", label: "Почетна" },
                { to: "/spots", label: "Откријте места" },
                { to: "/chat", label: "Заедница" },
                { to: "/about", label: "Нашата приказна" },
              ].map(link => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="inline-flex min-h-11 items-center text-sm transition-colors duration-300"
                  style={{ color: 'hsl(36 18% 78%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(0 0% 100%)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(36 18% 78%)'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'hsl(170 60% 55%)' }}
            >
              Поврзи се
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300"
                  style={{
                    backgroundColor: 'hsl(20 15% 12%)',
                    border: '1px solid hsl(25 15% 18%)',
                    color: 'hsl(36 18% 78%)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(15 70% 50% / 0.15)';
                    e.currentTarget.style.color = 'hsl(15 70% 60%)';
                    e.currentTarget.style.borderColor = 'hsl(15 70% 50% / 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(20 15% 12%)';
                    e.currentTarget.style.color = 'hsl(36 18% 78%)';
                    e.currentTarget.style.borderColor = 'hsl(25 15% 18%)';
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div 
              className="flex items-start gap-2 text-sm mt-4"
              style={{ color: 'hsl(36 18% 78%)' }}
            >
              <MapPin size={16} style={{ color: 'hsl(15 70% 55%)' }} className="mt-0.5 shrink-0" />
              <span>Охрид, Северна Македонија</span>
            </div>
          </div>

          {/* Share */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'hsl(170 60% 55%)' }}
            >
              Сподели го патувањето
            </h4>
            <ShareButtons variant="compact" />
            <p 
              className="text-xs mt-2"
              style={{ color: 'hsl(30 10% 50%)' }}
            >
              Покани пријатели истражувачи да се приклучат
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8"
          style={{ borderTop: '1px solid hsl(25 15% 15%)' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p 
              className="text-lg font-script"
              style={{ color: 'hsl(30 15% 55%)' }}
            >
              "Гуми на патот, душа на волја"
            </p>
            <p 
              className="text-sm"
              style={{ color: 'hsl(36 18% 78%)' }}
            >
              © {new Date().getFullYear()} SoulRide. Создадено со душа во Северна Македонија.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
