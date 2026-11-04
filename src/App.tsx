import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";

// Lazy load all pages for better performance
const HomePage = lazy(() => import("@/pages/HomePage"));
const SpotsPage = lazy(() => import("@/pages/SpotsPage"));
const SpotDetailPage = lazy(() => import("@/pages/SpotDetailPage"));
const RoutesPage = lazy(() => import("@/pages/RoutesPage"));
const RouteDetailPage = lazy(() => import("@/pages/RouteDetailPage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const CreditsPage = lazy(() => import("@/pages/CreditsPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter basename={routerBasename}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/spots" element={<SpotsPage />} />
                  <Route path="/spots/:id" element={<SpotDetailPage />} />
                  <Route path="/routes" element={<RoutesPage />} />
                  <Route path="/routes/:id" element={<RouteDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/credits" element={<CreditsPage />} />
                  <Route path="/login" element={<AuthPage mode="login" />} />
                  <Route path="/signup" element={<AuthPage mode="signup" />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
