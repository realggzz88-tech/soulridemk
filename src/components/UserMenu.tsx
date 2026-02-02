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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, MessageCircle, Bike } from "lucide-react";

const UserMenu = () => {
  const { user, profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div 
        className="h-8 w-8 rounded-full animate-pulse"
        style={{ background: 'hsl(200 12% 20%)' }}
      />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button 
            variant="ghost" 
            size="sm" 
            className="font-medium"
            style={{ color: 'hsl(45 15% 70%)' }}
          >
            Најави се
          </Button>
        </Link>
        <Link to="/signup">
          <Button 
            size="sm" 
            className="rounded-full font-medium"
            style={{
              background: 'linear-gradient(135deg, hsl(160 25% 40%), hsl(160 20% 35%))',
              color: 'hsl(45 20% 95%)',
            }}
          >
            Регистрирај се
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center gap-2 p-1 rounded-full transition-colors"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(200 12% 20%)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Avatar className="h-8 w-8">
            {profile?.profile_photo_url ? (
              <AvatarImage src={profile.profile_photo_url} alt={profile.username} />
            ) : null}
            <AvatarFallback 
              className="text-xs font-medium"
              style={{
                background: 'linear-gradient(135deg, hsl(160 25% 35%), hsl(160 20% 30%))',
                color: 'hsl(45 20% 95%)',
              }}
            >
              {profile?.username?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 rounded-xl"
        style={{
          background: 'hsl(200 12% 14%)',
          border: '1px solid hsl(160 15% 25% / 0.3)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="px-3 py-3">
          <p className="text-sm font-medium" style={{ color: 'hsl(45 20% 90%)' }}>
            {profile?.username}
          </p>
          <p className="text-xs truncate" style={{ color: 'hsl(45 15% 55%)' }}>
            {user.email}
          </p>
          {profile?.what_you_ride && (
            <p 
              className="text-xs flex items-center gap-1 mt-1"
              style={{ color: 'hsl(25 40% 58%)' }}
            >
              <Bike className="h-3 w-3" />
              {profile.what_you_ride}
            </p>
          )}
        </div>
        <DropdownMenuSeparator style={{ background: 'hsl(160 15% 25% / 0.2)' }} />
        <DropdownMenuItem asChild>
          <Link 
            to="/profile" 
            className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-colors"
            style={{ color: 'hsl(45 15% 75%)' }}
          >
            <User className="h-4 w-4" />
            Мој профил
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link 
            to="/chat" 
            className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition-colors"
            style={{ color: 'hsl(45 15% 75%)' }}
          >
            <MessageCircle className="h-4 w-4" />
            Заедница
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator style={{ background: 'hsl(160 15% 25% / 0.2)' }} />
        <DropdownMenuItem 
          onClick={signOut}
          className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg"
          style={{ color: 'hsl(0 50% 60%)' }}
        >
          <LogOut className="h-4 w-4" />
          Одјави се
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
