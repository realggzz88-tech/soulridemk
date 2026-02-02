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
            <Link to="/" className="inline-block">
              <span 
                className="text-2xl font-bold tracking-tight"
                style={{ color: 'hsl(0 0% 100%)' }}
              >
                Soul<span style={{ color: 'hsl(15 70% 55%)' }}>Ride</span>
              </span>
            </Link>
            <p 
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: 'hsl(30 10% 55%)' }}
            >
              Where every curve whispers adventure and every horizon beckons the wandering soul.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'hsl(170 60% 55%)' }}
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
                  style={{ color: 'hsl(30 10% 55%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(0 0% 100%)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(30 10% 55%)'}
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
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'hsl(20 15% 12%)',
                    border: '1px solid hsl(25 15% 18%)',
                    color: 'hsl(30 10% 55%)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(15 70% 50% / 0.15)';
                    e.currentTarget.style.color = 'hsl(15 70% 60%)';
                    e.currentTarget.style.borderColor = 'hsl(15 70% 50% / 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(20 15% 12%)';
                    e.currentTarget.style.color = 'hsl(30 10% 55%)';
                    e.currentTarget.style.borderColor = 'hsl(25 15% 18%)';
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div 
              className="flex items-start gap-2 text-sm mt-4"
              style={{ color: 'hsl(30 10% 55%)' }}
            >
              <MapPin size={16} style={{ color: 'hsl(15 70% 55%)' }} className="mt-0.5 shrink-0" />
              <span>Ohrid, North Macedonia</span>
            </div>
          </div>

          {/* Share */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: 'hsl(170 60% 55%)' }}
            >
              Share the Journey
            </h4>
            <ShareButtons variant="compact" />
            <p 
              className="text-xs mt-2"
              style={{ color: 'hsl(30 10% 50%)' }}
            >
              Invite fellow explorers to join
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
              "Keep the rubber side down, ride with soul"
            </p>
            <p 
              className="text-sm"
              style={{ color: 'hsl(30 10% 45%)' }}
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
