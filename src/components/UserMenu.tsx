import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, MessageCircle, Bike } from "lucide-react";

interface ExtendedProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  bio?: string | null;
  what_you_ride?: string | null;
  created_at: string;
}

const UserMenu = () => {
  const { user, profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-earth-green to-soul-amber hover:from-earth-green/90 hover:to-soul-amber/90 text-background"
          >
            Join
          </Button>
        </Link>
      </div>
    );
  }

  const extendedProfile = profile as ExtendedProfile | null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-muted/50 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-earth-green to-earth-green/70 text-background text-xs font-medium">
              {profile?.username?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-lg border-border/50">
        <div className="px-2 py-2">
          <p className="text-sm font-medium">{profile?.username}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          {extendedProfile?.what_you_ride && (
            <p className="text-xs text-soul-amber flex items-center gap-1 mt-1">
              <Bike className="h-3 w-3" />
              {extendedProfile.what_you_ride}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/chat" className="flex items-center gap-2 cursor-pointer">
            <MessageCircle className="h-4 w-4" />
            Soul Chat
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={signOut}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
