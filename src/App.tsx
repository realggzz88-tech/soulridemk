import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import SpotsPage from "@/pages/SpotsPage";
import SpotDetailPage from "@/pages/SpotDetailPage";
import RouteDetailPage from "@/pages/RouteDetailPage";
import AboutPage from "@/pages/AboutPage";
import AuthPage from "@/pages/AuthPage";
import ChatPage from "@/pages/ChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/spots" element={<SpotsPage />} />
                <Route path="/spots/:id" element={<SpotDetailPage />} />
                <Route path="/routes/:id" element={<RouteDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/signup" element={<AuthPage mode="signup" />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
