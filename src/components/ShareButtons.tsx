import { useState } from "react";
import { Share2, Link2, Facebook, Instagram, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title?: string;
  url?: string;
  className?: string;
  variant?: "inline" | "compact";
}

const ShareButtons = ({
  title = "Soulride",
  url,
  className,
  variant = "inline",
}: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

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
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const handleInstagramShare = () => {
    // Instagram doesn't have direct URL sharing, so we just copy the link
    handleCopyLink();
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-earth-green/20 hover:border-earth-green/30 transition-all duration-300"
          aria-label="Copy link"
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />}
        </button>
        <button
          onClick={handleFacebookShare}
          className="p-2 rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-earth-green/20 hover:border-earth-green/30 transition-all duration-300"
          aria-label="Share on Facebook"
        >
          <Facebook size={16} />
        </button>
        <button
          onClick={handleInstagramShare}
          className="p-2 rounded-full bg-muted/50 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-earth-green/20 hover:border-earth-green/30 transition-all duration-300"
          aria-label="Share on Instagram"
        >
          <Instagram size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Share2 size={14} />
        <span className="font-medium">Share this gem</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyLink}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg",
            "bg-muted/50 border border-border/50",
            "text-sm text-muted-foreground hover:text-foreground",
            "hover:bg-earth-green/20 hover:border-earth-green/30",
            "transition-all duration-300",
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
          onClick={handleFacebookShare}
          className="w-10 h-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-earth-green/20 hover:border-earth-green/30 transition-all duration-300"
          aria-label="Share on Facebook"
        >
          <Facebook size={18} />
        </button>
        <button
          onClick={handleInstagramShare}
          className="w-10 h-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-earth-green/20 hover:border-earth-green/30 transition-all duration-300"
          aria-label="Share on Instagram"
        >
          <Instagram size={18} />
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
