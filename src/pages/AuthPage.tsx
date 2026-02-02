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
  email: z.string().email("Внесете валидна е-пошта"),
  password: z.string().min(6, "Лозинката мора да има најмалку 6 карактери"),
  username: z.string().min(3, "Корисничкото име мора да има најмалку 3 карактери").max(20, "Корисничкото име мора да има најмногу 20 карактери"),
});

const signInSchema = z.object({
  email: z.string().email("Внесете валидна е-пошта"),
  password: z.string().min(1, "Лозинката е задолжителна"),
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
              title: "Неуспешна најава",
              description: "Невалидна е-пошта или лозинка. Обидете се повторно.",
              variant: "destructive",
            });
          } else if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Е-поштата не е потврдена",
              description: "Проверете ја вашата е-пошта и потврдете ја сметката.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Неуспешна најава",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Добредојде назад!",
            description: "Патот те очекува.",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, username);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Сметката постои",
              description: "Сметка со оваа е-пошта веќе постои. Обидете се да се најавите.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Неуспешна регистрација",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Проверете ја вашата е-пошта",
            description: "Ви испративме линк за потврда. Проверете го вашето сандаче.",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden"
      style={{ backgroundColor: 'hsl(20 15% 8%)' }}
    >
      {/* Background glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, hsl(15 70% 50% / 0.08) 0%, transparent 60%)',
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ color: 'hsl(0 0% 100%)' }}
          >
            {isLogin ? "Добредојде назад" : "Приклучи се на возењето"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-xl font-script"
            style={{ color: 'hsl(30 15% 60%)' }}
          >
            {isLogin ? "Патот го очекува твоето враќање" : "Започни го твоето патување со душа"}
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="p-8 rounded-2xl"
          style={{
            background: 'linear-gradient(180deg, hsl(20 18% 12%) 0%, hsl(25 15% 10%) 100%)',
            border: '1px solid hsl(25 15% 18%)',
            boxShadow: '0 8px 40px -8px hsl(0 0% 0% / 0.5)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label 
                  htmlFor="username" 
                  className="text-sm font-medium"
                  style={{ color: 'hsl(30 10% 70%)' }}
                >
                  Корисничко име
                </Label>
                <div className="relative">
                  <User 
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" 
                    style={{ color: 'hsl(30 10% 45%)' }} 
                  />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="возач_на_душа"
                    className="pl-11 py-5 rounded-xl"
                    style={{
                      background: 'hsl(20 12% 16%)',
                      border: '1px solid hsl(25 15% 22%)',
                      color: 'hsl(0 0% 100%)',
                    }}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs" style={{ color: 'hsl(0 60% 55%)' }}>{errors.username}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium"
                style={{ color: 'hsl(30 10% 70%)' }}
              >
                Е-пошта
              </Label>
              <div className="relative">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" 
                  style={{ color: 'hsl(30 10% 45%)' }} 
                />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="возач@soulride.mk"
                  className="pl-11 py-5 rounded-xl"
                  style={{
                    background: 'hsl(20 12% 16%)',
                    border: '1px solid hsl(25 15% 22%)',
                    color: 'hsl(0 0% 100%)',
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs" style={{ color: 'hsl(0 60% 55%)' }}>{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium"
                style={{ color: 'hsl(30 10% 70%)' }}
              >
                Лозинка
              </Label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" 
                  style={{ color: 'hsl(30 10% 45%)' }} 
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 pr-11 py-5 rounded-xl"
                  style={{
                    background: 'hsl(20 12% 16%)',
                    border: '1px solid hsl(25 15% 22%)',
                    color: 'hsl(0 0% 100%)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'hsl(30 10% 50%)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: 'hsl(0 60% 55%)' }}>{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full py-6 transition-all duration-300 hover:scale-[1.02] group"
              style={{
                background: 'linear-gradient(135deg, hsl(15 70% 50%) 0%, hsl(25 75% 55%) 100%)',
                color: 'hsl(0 0% 100%)',
                boxShadow: '0 4px 16px hsl(15 70% 45% / 0.35)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Се најавува..." : "Се креира сметка..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Најави се" : "Создај сметка"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center pt-6" style={{ borderTop: '1px solid hsl(25 15% 18%)' }}>
            <p className="text-sm" style={{ color: 'hsl(30 10% 55%)' }}>
              {isLogin ? "Немаш сметка?" : "Веќе имаш сметка?"}
              <button
                onClick={() => navigate(isLogin ? "/signup" : "/login")}
                className="ml-1 font-medium hover:underline transition-colors"
                style={{ color: 'hsl(170 60% 55%)' }}
              >
                {isLogin ? "Регистрирај се" : "Најави се"}
              </button>
            </p>
          </div>
        </motion.div>

        {/* Quote */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm mt-8 font-script"
          style={{ color: 'hsl(30 15% 50%)' }}
        >
          "Каде секое патување започнува со еден завој"
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
