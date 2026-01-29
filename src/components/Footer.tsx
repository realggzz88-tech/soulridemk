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
    <footer className="relative overflow-hidden">
      {/* Artistic gradient background - intensified */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-mountain-blue/10 via-transparent to-earth-green/10" />
      
      {/* Mountain silhouette divider at top */}
      <div className="mountain-divider" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 road-pattern opacity-8" />
      <div className="absolute bottom-0 left-0 right-0 h-48 mountain-overlay opacity-40" />
      
      {/* Top gradient line */}
      <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-earth-green/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl tracking-widest logo-glow">
                SOULRIDE
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Where every curve whispers adventure and every horizon beckons the wandering soul.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-display text-lg tracking-wider text-foreground">EXPLORE</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/spots" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Discover Spots
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Our Story
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-display text-lg tracking-wider text-foreground">CONNECT</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-muted/30 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-earth-green/20 hover:border-earth-green/40 hover:shadow-[0_0_15px_hsl(var(--earth-green)/0.3)] transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mt-4">
              <MapPin size={16} className="text-earth-green-glow mt-0.5 shrink-0" />
              <span>Ohrid, North Macedonia</span>
            </div>
          </div>

          {/* Share This Gem */}
          <div className="space-y-4">
            <h4 className="font-display text-lg tracking-wider text-foreground">SPREAD THE SOUL</h4>
            <ShareButtons variant="compact" />
            <p className="text-xs text-muted-foreground/70 italic mt-2">
              Share the journey with fellow riders
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground italic text-high-contrast">
              "Discover the soul of the ride"
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Soulride. Crafted with soul in North Macedonia.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
