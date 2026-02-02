import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Flame } from "lucide-react";
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
            title: "Welcome back, old friend!",
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
    <div className="page-container flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden grain-overlay">
      {/* Aged parchment background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center top, hsl(140 22% 42% / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 70%, hsl(25 40% 35% / 0.04) 0%, transparent 40%)
          `
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 45%, hsl(0 0% 0% / 0.35) 100%)'
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo - vintage soul */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <Flame className="w-8 h-8" style={{ color: 'hsl(25 45% 45%)' }} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-display text-3xl sm:text-4xl tracking-wider mb-3"
            style={{ 
              color: 'hsl(40 30% 92%)',
              textShadow: '2px 2px 0 hsl(0 0% 0% / 0.4)'
            }}
          >
            SOULRIDE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="handwriting text-xl"
            style={{ color: 'hsl(140 22% 50%)' }}
          >
            {isLogin ? "Welcome Back, Old Friend" : "Join the Brotherhood"}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm mt-3 typewriter"
            style={{ color: 'hsl(35 15% 45%)' }}
          >
            "The road remembers those who ride with heart"
          </motion.p>
        </div>

        {/* Form Card - campfire glow */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="p-8 rounded-xl campfire-glow"
          style={{
            backgroundColor: 'hsl(180 12% 11%)',
            border: '1px solid hsl(170 12% 20%)',
            boxShadow: 'inset 0 1px 0 hsl(40 30% 94% / 0.03), 0 8px 32px hsl(0 0% 0% / 0.5)'
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label 
                  htmlFor="username" 
                  className="text-sm typewriter tracking-wider"
                  style={{ color: 'hsl(140 22% 55%)' }}
                >
                  USERNAME
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(140 22% 50%)' }} />
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
                  <p className="text-xs" style={{ color: 'hsl(20 50% 50%)' }}>{errors.username}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm typewriter tracking-wider"
                style={{ color: 'hsl(140 22% 55%)' }}
              >
                EMAIL
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(140 22% 50%)' }} />
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
                <p className="text-xs" style={{ color: 'hsl(20 50% 50%)' }}>{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-sm typewriter tracking-wider"
                style={{ color: 'hsl(140 22% 55%)' }}
              >
                PASSWORD
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'hsl(140 22% 50%)' }} />
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
                  style={{ color: 'hsl(140 22% 50%)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: 'hsl(20 50% 50%)' }}>{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-6 transition-all duration-300 hover:scale-[0.98] group btn-rust"
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
            <p className="text-sm" style={{ color: 'hsl(35 15% 50%)' }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => navigate(isLogin ? "/signup" : "/login")}
                className="ml-1 font-medium hover:underline transition-colors"
                style={{ color: 'hsl(140 22% 55%)' }}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Soul footer quote */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs mt-6 typewriter"
          style={{ color: 'hsl(35 12% 38%)' }}
        >
          Keep the rubber side down.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
