import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBackground from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="Пат на зајдисонце низ планини"
          className="w-full h-full object-cover"
          ref={(node) => node?.setAttribute("fetchpriority", "high")}
          loading="eager"
          decoding="sync"
          width={1920}
          height={1080}
          style={{
            filter: "brightness(0.85) saturate(1.1)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, 
                hsl(20 15% 8% / 0.3) 0%, 
                hsl(20 15% 8% / 0.1) 30%,
                hsl(20 15% 8% / 0.2) 60%,
                hsl(20 15% 8% / 0.85) 90%,
                hsl(20 15% 8%) 100%
              )
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, hsl(25 60% 50% / 0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <span
            className="text-sm uppercase tracking-[0.4em] font-medium"
            style={{ color: "hsl(170 60% 55%)" }}
          >
            SoulRide Македонија
          </span>
        </div>

        <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6">
          Заборавените
          <br />
          <span className="relative">
            Патишта
            <span
              className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, hsl(15 70% 55%), transparent)" }}
            />
          </span>
        </h1>

        <p className="hero-subtitle text-2xl sm:text-3xl mb-12" style={{ color: "hsl(35 20% 75%)" }}>
          "Патот ги памети оние што возат со срце"
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/spots" className="btn-primary arrow-animate group">
            Започни го твоето патување
            <ArrowRight size={16} className="arrow-icon transition-transform" />
          </Link>
          <Link to="/chat" className="btn-secondary">
            Приклучи се на братството
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
          style={{ borderColor: "hsl(0 0% 100% / 0.3)" }}
        >
          <div
            className="w-1.5 h-2.5 rounded-full animate-bounce"
            style={{ backgroundColor: "hsl(15 70% 55%)" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
