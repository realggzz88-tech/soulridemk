import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title?: string;
  url?: string;
  className?: string;
  variant?: "inline" | "compact";
  spotName?: string;
}

// Custom artistic line icons
const FacebookIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ size = 16, className }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const ShareButtons = ({
  title = "Soulride",
  url,
  className,
  variant = "inline",
  spotName,
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const shareText = spotName 
    ? `Discover ${spotName} on Soulride – a soul spot for wandering riders`
    : "Discover soul-stirring riding spots on Soulride";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleWhatsAppShare = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      "_blank"
    );
  };

  const handleInstagramShare = () => {
    // Instagram doesn't have direct URL sharing, so we copy the link
    handleCopyLink();
  };

  const iconButtonClass = cn(
    "group/share p-2.5 rounded-full transition-all duration-300",
    "bg-muted/30 border border-border/40",
    "hover:bg-earth-green/20 hover:border-earth-green/40",
    "hover:shadow-[0_0_20px_hsl(var(--earth-green)/0.3)]"
  );

  const iconClass = "transition-all duration-300 group-hover/share:scale-110";

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <button
          onClick={handleCopyLink}
          className={iconButtonClass}
          aria-label="Copy link"
        >
          {copied ? (
            <Check size={16} className="text-earth-green-glow" />
          ) : (
            <Link2 size={16} className={cn(iconClass, "text-muted-foreground group-hover/share:text-earth-green-glow")} />
          )}
        </button>
        <button
          onClick={handleWhatsAppShare}
          className={iconButtonClass}
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon size={16} className={cn(iconClass, "text-muted-foreground group-hover/share:text-earth-green-glow")} />
        </button>
        <button
          onClick={handleFacebookShare}
          className={iconButtonClass}
          aria-label="Share on Facebook"
        >
          <FacebookIcon size={16} className={cn(iconClass, "text-muted-foreground group-hover/share:text-soul-amber")} />
        </button>
        <button
          onClick={handleInstagramShare}
          className={iconButtonClass}
          aria-label="Share on Instagram"
        >
          <InstagramIcon size={16} className={cn(iconClass, "text-muted-foreground group-hover/share:text-soul-amber")} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Share2 size={14} className="text-earth-green-glow" />
        <span className="font-medium tracking-wide">Share this Soul Spot</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleCopyLink}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg",
            "bg-muted/30 border border-border/40",
            "text-sm text-muted-foreground hover:text-foreground",
            "hover:bg-earth-green/20 hover:border-earth-green/40",
            "hover:shadow-[0_0_20px_hsl(var(--earth-green)/0.2)]",
            "transition-all duration-300 tracking-wide",
            copied && "bg-earth-green/20 border-earth-green/40 text-earth-green-glow"
          )}
        >
          {copied ? (
            <>
              <Check size={16} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Link2 size={16} />
              <span>Copy Link</span>
            </>
          )}
        </button>
        <button
          onClick={handleWhatsAppShare}
          className={cn(iconButtonClass, "w-11 h-11 flex items-center justify-center")}
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon size={18} className={cn(iconClass, "text-muted-foreground group-hover/share:text-earth-green-glow")} />
        </button>
        <button
          onClick={handleFacebookShare}
          className={cn(iconButtonClass, "w-11 h-11 flex items-center justify-center")}
          aria-label="Share on Facebook"
        >
          <FacebookIcon size={18} className={cn(iconClass, "text-muted-foreground group-hover/share:text-soul-amber")} />
        </button>
        <button
          onClick={handleInstagramShare}
          className={cn(iconButtonClass, "w-11 h-11 flex items-center justify-center")}
          aria-label="Share on Instagram"
        >
          <InstagramIcon size={18} className={cn(iconClass, "text-muted-foreground group-hover/share:text-soul-amber")} />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
