import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { hasStoredSupabaseSession, scheduleIdle } from "@/lib/supabase-session";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  bio: string | null;
  what_you_ride: string | null;
  profile_photo_url: string | null;
  ride_photo_url: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

type Client = SupabaseClient;

let clientPromise: Promise<Client> | null = null;

function loadSupabase(): Promise<Client> {
  if (!clientPromise) {
    clientPromise = import("@/integrations/supabase/client").then((mod) => mod.supabase);
  }
  return clientPromise;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  const bindAuth = useCallback((supabase: Client) => {
    if (subscriptionRef.current) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      if (next?.user) {
        const userId = next.user.id;
        window.setTimeout(() => {
          void supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .single()
            .then(({ data, error }) => {
              if (data && !error) setProfile(data);
            });
        }, 0);
      } else {
        setProfile(null);
      }
    });
    subscriptionRef.current = subscription;
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!hasStoredSupabaseSession()) {
      setLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const start = () => {
      void loadSupabase()
        .then(async (supabase) => {
          bindAuth(supabase);
          const { data } = await supabase.auth.getSession();
          if (cancelled) return;
          setSession(data.session);
          setUser(data.session?.user ?? null);
          if (data.session?.user) {
            const { data: profileRow, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", data.session.user.id)
              .single();
            if (!cancelled && profileRow && !error) setProfile(profileRow);
          }
        })
        .catch(() => undefined)
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    const cancelIdle = scheduleIdle(start);
    return () => {
      cancelled = true;
      cancelIdle();
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [bindAuth]);

  const signUp = async (email: string, password: string, username: string) => {
    const redirectUrl = new URL(import.meta.env.BASE_URL, window.location.origin).toString();
    const supabase = await loadSupabase();
    bindAuth(supabase);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { username },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const supabase = await loadSupabase();
    bindAuth(supabase);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    const supabase = await loadSupabase();
    bindAuth(supabase);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
