import { lazy, Suspense } from "react";
import Seo from "@/components/Seo";
import HeroSection from "@/components/HeroSection";
import { DeferMount } from "@/components/DeferMount";
import { homeSeo } from "@/lib/seo";

const HomeBelowFold = lazy(() => import("@/components/HomeBelowFold"));

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title={homeSeo.title} description={homeSeo.description} path={homeSeo.path} />
      <HeroSection />
      <DeferMount
        eager={import.meta.env.MODE === "test"}
        fallback={() => <div className="min-h-[40vh]" aria-hidden="true" />}
      >
        <Suspense
          fallback={
            <div
              className="min-h-[40vh] flex items-center justify-center text-sm"
              style={{ color: "hsl(30 10% 60%)" }}
            >
              Се вчитува…
            </div>
          }
        >
          <HomeBelowFold />
        </Suspense>
      </DeferMount>
    </div>
  );
};

export default HomePage;
