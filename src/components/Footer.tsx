import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, MapPin, Leaf } from "lucide-react";
import ShareButtons from "./ShareButtons";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Organic gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsl(200 12% 12%) 0%, hsl(180 15% 14%) 50%, hsl(200 15% 11%) 100%)'
        }}
      />
      
      {/* Soft organic shapes */}
      <div 
        className="absolute top-20 left-0 w-[300px] h-[300px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(160 25% 30% / 0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-[250px] h-[250px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, hsl(25 35% 35% / 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      
      {/* Wavy top divider */}
      <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
        <svg 
          viewBox="0 0 1200 48" 
          preserveAspectRatio="none" 
          className="absolute top-0 w-full h-full"
          style={{ opacity: 0.15 }}
        >
          <path 
            d="M0,48 L0,24 C200,40 400,8 600,24 C800,40 1000,8 1200,24 L1200,48 Z" 
            fill="hsl(160 25% 35%)"
          />
        </svg>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <Leaf 
                size={18} 
                className="transition-transform duration-300 group-hover:rotate-12"
                style={{ color: 'hsl(160 30% 50%)' }}
              />
              <span 
                className="text-2xl font-serif tracking-wide"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'hsl(45 20% 90%)',
                }}
              >
                SoulRide
              </span>
            </Link>
            <p 
              className="text-sm leading-relaxed max-w-xs font-light"
              style={{ color: 'hsl(45 15% 60%)' }}
            >
              Where every curve whispers adventure and every horizon beckons the wandering soul.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: 'hsl(160 25% 55%)' }}
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
                  className="text-sm font-light transition-colors duration-300"
                  style={{ color: 'hsl(45 15% 65%)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(45 20% 85%)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(45 15% 65%)'}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: 'hsl(160 25% 55%)' }}
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
                    background: 'hsl(200 12% 18%)',
                    border: '1px solid hsl(160 20% 30% / 0.2)',
                    color: 'hsl(45 15% 65%)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'hsl(160 25% 25% / 0.4)';
                    e.currentTarget.style.borderColor = 'hsl(160 25% 40% / 0.3)';
                    e.currentTarget.style.color = 'hsl(45 20% 90%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'hsl(200 12% 18%)';
                    e.currentTarget.style.borderColor = 'hsl(160 20% 30% / 0.2)';
                    e.currentTarget.style.color = 'hsl(45 15% 65%)';
                  }}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div 
              className="flex items-start gap-2 text-sm mt-4"
              style={{ color: 'hsl(45 15% 60%)' }}
            >
              <MapPin size={16} style={{ color: 'hsl(160 30% 50%)' }} className="mt-0.5 shrink-0" />
              <span className="font-light">Ohrid, North Macedonia</span>
            </div>
          </div>

          {/* Share */}
          <div className="space-y-4">
            <h4 
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: 'hsl(160 25% 55%)' }}
            >
              Share the Journey
            </h4>
            <ShareButtons variant="compact" />
            <p 
              className="text-xs italic font-light mt-2"
              style={{ color: 'hsl(45 15% 50%)' }}
            >
              Invite fellow explorers to join
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="pt-8"
          style={{ borderTop: '1px solid hsl(160 15% 25% / 0.2)' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p 
              className="text-sm italic font-light"
              style={{ color: 'hsl(45 15% 55%)' }}
            >
              "Discover the soul of the ride"
            </p>
            <p 
              className="text-sm font-light"
              style={{ color: 'hsl(45 15% 50%)' }}
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
