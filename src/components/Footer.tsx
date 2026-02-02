import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";
import ShareButtons from "./ShareButtons";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer 
      className="relative overflow-hidden grain-overlay"
      style={{ 
        backgroundColor: 'hsl(200 20% 8%)',
        borderTop: '1px solid hsl(140 15% 25% / 0.3)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              <span 
                className="text-2xl font-extrabold tracking-wider"
                style={{ 
                  fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
                  color: 'hsl(40 30% 94%)',
                  textShadow: '2px 2px 4px hsl(0 0% 0% / 0.5)',
                }}
              >
                SoulRide
              </span>
            </Link>
            <p 
              className="text-sm leading-relaxed max-w-xs"
              style={{ 
                color: 'hsl(40 15% 55%)',
                fontFamily: "'Libre Baskerville', Georgia, serif",
                lineHeight: '1.7',
              }}
            >
              Where every curve whispers adventure and every horizon beckons the wandering soul.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ 
                color: 'hsl(140 22% 48%)',
                fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              }}
            >
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/", label: "Home" },
                { to: "/spots", label: "Discover Spots" },
                { to: "/chat", label: "Community" },
                { to: "/about", label: "Our Story" },
              ].map(link => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-sm transition-colors duration-300"
                  style={{ 
                    color: 'hsl(40 15% 55%)',
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(40 30% 88%)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(40 15% 55%)'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ 
                color: 'hsl(140 22% 48%)',
                fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              }}
            >
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'hsl(180 15% 12%)',
                    border: '1px solid hsl(140 15% 25% / 0.3)',
                    color: 'hsl(40 15% 55%)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(140 22% 42% / 0.2)';
                    e.currentTarget.style.color = 'hsl(140 22% 55%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(180 15% 12%)';
                    e.currentTarget.style.color = 'hsl(40 15% 55%)';
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div 
              className="flex items-start gap-2 text-sm mt-4"
              style={{ color: 'hsl(40 15% 55%)' }}
            >
              <MapPin size={16} style={{ color: 'hsl(20 45% 45%)' }} className="mt-0.5 shrink-0" />
              <span style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                Ohrid, North Macedonia
              </span>
            </div>
          </div>

          {/* Share */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ 
                color: 'hsl(140 22% 48%)',
                fontFamily: "'Bitter', 'Rockwell', Georgia, serif",
              }}
            >
              Share the Journey
            </h4>
            <ShareButtons variant="compact" />
            <p 
              className="text-xs mt-2"
              style={{ 
                color: 'hsl(40 15% 50%)',
                fontFamily: "'Special Elite', 'Courier New', monospace",
              }}
            >
              Invite fellow explorers to join
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8"
          style={{ borderTop: '1px solid hsl(140 15% 25% / 0.3)' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p 
              className="text-sm italic"
              style={{ 
                color: 'hsl(20 45% 50%)',
                fontFamily: "'Caveat', 'Brush Script MT', cursive",
                fontSize: '1rem',
              }}
            >
              "Keep the rubber side down, ride with soul"
            </p>
            <p 
              className="text-sm"
              style={{ 
                color: 'hsl(40 15% 45%)',
                fontFamily: "'Special Elite', 'Courier New', monospace",
                fontSize: '0.75rem',
              }}
            >
              © {new Date().getFullYear()} SoulRide. Crafted with soul in North Macedonia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
