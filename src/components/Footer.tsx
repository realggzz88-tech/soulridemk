import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, MapPin } from "lucide-react";
import ShareButtons from "./ShareButtons";

const tealColor = 'hsl(160 84% 50%)';
const cardBg = 'hsl(222 40% 10%)';
const borderColor = 'hsl(222 20% 18%)';
const pageBg = 'hsl(222 47% 7%)';

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer 
      className="relative overflow-hidden"
      style={{ backgroundColor: pageBg }}
    >
      {/* Subtle top border */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: borderColor }}
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                SoulRide
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-muted-foreground">
              Where every curve whispers adventure and every horizon beckons the wandering soul.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: tealColor }}
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
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
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
              style={{ color: tealColor }}
            >
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 text-muted-foreground hover:text-foreground"
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div className="flex items-start gap-2 text-sm mt-4 text-muted-foreground">
              <MapPin size={16} style={{ color: tealColor }} className="mt-0.5 shrink-0" />
              <span>Ohrid, North Macedonia</span>
            </div>
          </div>

          {/* Share */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: tealColor }}
            >
              Share the Journey
            </h4>
            <ShareButtons variant="compact" />
            <p className="text-xs text-muted-foreground mt-2">
              Invite fellow explorers to join
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm italic text-muted-foreground">
              "Discover the soul of the ride"
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SoulRide. Crafted with soul in North Macedonia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
