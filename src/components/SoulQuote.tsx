import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const soulQuotes = [
  "The best views are earned on two wheels",
  "Ride where the soul breathes free",
  "Every curve tells a story to those who listen",
  "The road doesn't care about your plans—it has its own poetry",
  "Mountains don't ask questions. They simply invite you higher",
];

const SoulQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % soulQuotes.length);
        setIsVisible(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative py-8 px-6 text-center">
      <div className="inline-flex items-center justify-center gap-4 max-w-xl mx-auto">
        <Quote size={20} className="text-earth-green-glow opacity-50 flex-shrink-0" />
        <p
          className={`text-muted-foreground italic text-base md:text-lg font-light tracking-wide transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          "{soulQuotes[currentQuote]}"
        </p>
        <Quote size={20} className="text-earth-green-glow opacity-50 flex-shrink-0 rotate-180" />
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {soulQuotes.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentQuote(index);
                setIsVisible(true);
              }, 300);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentQuote
                ? "bg-earth-green-glow w-4"
                : "bg-foreground/20 hover:bg-foreground/40"
            }`}
            aria-label={`Quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SoulQuote;
