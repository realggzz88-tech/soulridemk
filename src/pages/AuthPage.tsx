import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { z } from "zod";
import { motion } from "framer-motion";

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be 20 characters or less"),
});

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

interface AuthPageProps {
  mode: "login" | "signup";
}

const AuthPage = ({ mode }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  const validateForm = () => {
    try {
      if (isLogin) {
        signInSchema.parse({ email, password });
      } else {
        signUpSchema.parse({ email, password, username });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Login failed",
              description: "Invalid email or password. Please try again.",
              variant: "destructive",
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email not verified",
              description: "Please check your email and verify your account.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Login failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome back, rider!",
            description: "The road awaits you.",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "An account with this email already exists. Try logging in.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Signup failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a verification link. Please check your inbox.",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden grain-overlay"
      style={{ backgroundColor: 'hsl(222 47% 7%)' }}
    >
      {/* Vintage background with aged paper feel */}
      <div 
        className="absolute inset-0 aged-paper"
        style={{
          background: `
            radial-gradient(ellipse at center top, hsl(174 72% 40% / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 70%, hsl(21 90% 42% / 0.05) 0%, transparent 40%)
          `
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, hsl(0 0% 0% / 0.3) 100%)'
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo - vintage style */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-4xl tracking-wider mb-3 text-distressed"
            style={{ 
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              color: 'hsl(40 20% 95%)',
              textShadow: '2px 2px 0 hsl(0 0% 0% / 0.4), -1px -1px 0 hsl(40 20% 95% / 0.1)'
            }}
          >
            SOULRIDE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-medium hero-subtitle-vintage"
          >
            {isLogin ? "Welcome Back, Rider" : "Join the Brotherhood"}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm mt-3 handwriting"
            style={{ color: 'hsl(40 8% 55%)' }}
          >
            "The road remembers those who ride with heart"
          </motion.p>
        </div>

        {/* Form Card - leather patch feel */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-8 rounded-xl"
          style={{
            backgroundColor: 'hsl(222 30% 12%)',
            border: '1px solid hsl(220 18% 22%)',
            boxShadow: 'inset 0 1px 0 hsl(40 20% 95% / 0.03), inset 0 -1px 0 hsl(0 0% 0% / 0.2), 0 8px 32px hsl(0 0% 0% / 0.5)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label 
                  htmlFor="username" 
                  className="text-sm uppercase tracking-wider"
                  style={{ color: 'hsl(174 72% 50%)' }}
                >
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(174 72% 50%)' }} />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="roadwarrior"
                    className="pl-10 input-vintage"
                  />
                </div>
                {errors.username && (
                  <p className="text-xs" style={{ color: 'hsl(21 90% 50%)' }}>{errors.username}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm uppercase tracking-wider"
                style={{ color: 'hsl(174 72% 50%)' }}
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(174 72% 50%)' }} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rider@soulride.mk"
                  className="pl-10 input-vintage"
                />
              </div>
              {errors.email && (
                <p className="text-xs" style={{ color: 'hsl(21 90% 50%)' }}>{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-sm uppercase tracking-wider"
                style={{ color: 'hsl(174 72% 50%)' }}
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(174 72% 50%)' }} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 input-vintage"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:scale-110"
                  style={{ color: 'hsl(174 72% 50%)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: 'hsl(21 90% 50%)' }}>{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full font-semibold py-6 transition-all duration-300 hover:scale-[0.98] group uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, hsl(21 90% 42%) 0%, hsl(25 85% 48%) 100%)',
                boxShadow: 'inset 0 2px 4px hsl(0 0% 0% / 0.3), 0 4px 12px hsl(21 90% 42% / 0.3), 0 1px 0 hsl(40 20% 95% / 0.1)',
                color: 'hsl(40 20% 95%)',
                fontSize: '0.875rem'
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'hsl(40 8% 55%)' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => navigate(isLogin ? "/signup" : "/login")}
                className="ml-1 font-medium hover:underline transition-colors"
                style={{ color: 'hsl(174 72% 50%)' }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Vintage footer quote */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs mt-6 handwriting"
          style={{ color: 'hsl(40 8% 45%)' }}
        >
          Keep the rubber side down.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
