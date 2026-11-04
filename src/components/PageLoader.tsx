import { Compass } from "lucide-react";

const PageLoader = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <div className="text-center">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 animate-spin"
          style={{
            background: "hsl(var(--primary) / 0.15)",
            border: "2px solid hsl(var(--primary) / 0.3)",
          }}
        >
          <Compass className="w-8 h-8" style={{ color: "hsl(var(--primary))" }} />
        </div>
        <p
          className="text-sm tracking-wider"
          style={{
            fontFamily: "'Special Elite', monospace",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          Loading the road ahead...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
