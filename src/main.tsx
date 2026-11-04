import { createRoot } from "react-dom/client";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/caveat/500.css";
import "@fontsource/jetbrains-mono/500.css";
import App from "./App.tsx";
import "./index.css";

if (import.meta.env.VITE_FONTS === "google") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Manrope:wght@700;800&family=Inter:wght@400;500;600;700&family=Caveat:wght@500&family=JetBrains+Mono:wght@500&display=swap";
  document.head.appendChild(link);
}

createRoot(document.getElementById("root")!).render(<App />);
