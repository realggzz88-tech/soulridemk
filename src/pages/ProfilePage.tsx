import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Bike, MapPin, Plus, Calendar, Route, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface UserRoute {
  id: string;
  route_title: string;
  start_location: string;
  end_location: string;
  description: string;
  created_at: string;
  likes_count: number;
}

interface ExtendedProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  bio: string | null;
  what_you_ride: string | null;
  created_at: string;
}

const ProfilePage = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [extendedProfile, setExtendedProfile] = useState<ExtendedProfile | null>(null);
  const [userRoutes, setUserRoutes] = useState<UserRoute[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  
  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editWhatYouRide, setEditWhatYouRide] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Add route state
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [newRouteTitle, setNewRouteTitle] = useState("");
  const [newRouteStart, setNewRouteStart] = useState("");
  const [newRouteEnd, setNewRouteEnd] = useState("");
  const [newRouteDescription, setNewRouteDescription] = useState("");
  const [savingRoute, setSavingRoute] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchExtendedProfile();
      fetchUserRoutes();
    }
  }, [user]);

  const fetchExtendedProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (data && !error) {
      setExtendedProfile(data as ExtendedProfile);
      setEditBio(data.bio || "");
      setEditWhatYouRide(data.what_you_ride || "");
    }
  };

  const fetchUserRoutes = async () => {
    if (!user) return;
    setLoadingRoutes(true);
    
    const { data, error } = await supabase
      .from("user_routes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data && !error) {
      setUserRoutes(data);
    }
    setLoadingRoutes(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        bio: editBio,
        what_you_ride: editWhatYouRide,
      })
      .eq("user_id", user.id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved",
      });
      setExtendedProfile(prev => prev ? { ...prev, bio: editBio, what_you_ride: editWhatYouRide } : null);
      setIsEditingProfile(false);
    }
    setSavingProfile(false);
  };

  const handleAddRoute = async () => {
    if (!user || !profile) return;
    
    if (!newRouteTitle.trim() || !newRouteStart.trim() || !newRouteEnd.trim() || !newRouteDescription.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setSavingRoute(true);
    
    const { error } = await supabase
      .from("user_routes")
      .insert({
        user_id: user.id,
        username: profile.username,
        route_title: newRouteTitle.trim(),
        start_location: newRouteStart.trim(),
        end_location: newRouteEnd.trim(),
        description: newRouteDescription.trim(),
      });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add route",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Route Added",
        description: "Your recommended route has been shared",
      });
      setNewRouteTitle("");
      setNewRouteStart("");
      setNewRouteEnd("");
      setNewRouteDescription("");
      setIsAddingRoute(false);
      fetchUserRoutes();
    }
    setSavingRoute(false);
  };

  const handleDeleteRoute = async (routeId: string) => {
    const { error } = await supabase
      .from("user_routes")
      .delete()
      .eq("id", routeId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Route Deleted",
        description: "Your route has been removed",
      });
      setUserRoutes(prev => prev.filter(r => r.id !== routeId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="bg-gradient-to-br from-card via-card to-earth-green/5 border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-earth-green to-soul-amber flex items-center justify-center">
                  <span className="text-2xl font-bold text-background">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-3xl font-display tracking-wide">
                    {profile.username}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    Member since {format(new Date(profile.created_at), "MMMM yyyy")}
                  </CardDescription>
                </div>
              </div>
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-lg border-border/50">
                  <DialogHeader>
                    <DialogTitle>Edit Your Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatYouRide">What I Ride</Label>
                      <Input
                        id="whatYouRide"
                        placeholder="e.g., Adventure bike, Classic car, Electric scooter..."
                        value={editWhatYouRide}
                        onChange={(e) => setEditWhatYouRide(e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / About Me</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself and your soul rides..."
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={4}
                        className="bg-muted/50 resize-none"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={savingProfile}
                      className="w-full bg-gradient-to-r from-earth-green to-soul-amber hover:from-earth-green/90 hover:to-soul-amber/90"
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* What I Ride */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
              <Bike className="h-5 w-5 text-soul-amber mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">What I Ride</p>
                <p className="text-foreground">
                  {extendedProfile?.what_you_ride || "Not specified yet"}
                </p>
              </div>
            </div>
            
            {/* Bio */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
              <User className="h-5 w-5 text-earth-green mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">About Me</p>
                <p className="text-foreground whitespace-pre-wrap">
                  {extendedProfile?.bio || "No bio yet. Click Edit Profile to add one!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Recommended Routes Section */}
        <Card className="bg-card/80 border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Route className="h-5 w-5 text-soul-amber" />
                  My Recommended SoulRides
                </CardTitle>
                <CardDescription>
                  {userRoutes.length > 0 
                    ? `You recommended ${userRoutes.length} route${userRoutes.length === 1 ? "" : "s"}`
                    : "Share your favorite routes with the community"}
                </CardDescription>
              </div>
              <Dialog open={isAddingRoute} onOpenChange={setIsAddingRoute}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-earth-green to-soul-amber hover:from-earth-green/90 hover:to-soul-amber/90">
                    <Plus className="h-4 w-4" />
                    Add Route
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-lg border-border/50 max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Recommended Route</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="routeTitle">Route Title</Label>
                      <Input
                        id="routeTitle"
                        placeholder="e.g., The Galicica Mountain Loop"
                        value={newRouteTitle}
                        onChange={(e) => setNewRouteTitle(e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startLocation">Start Location</Label>
                        <Input
                          id="startLocation"
                          placeholder="e.g., Ohrid"
                          value={newRouteStart}
                          onChange={(e) => setNewRouteStart(e.target.value)}
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endLocation">End Location</Label>
                        <Input
                          id="endLocation"
                          placeholder="e.g., Struga"
                          value={newRouteEnd}
                          onChange={(e) => setNewRouteEnd(e.target.value)}
                          className="bg-muted/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routeDescription">
                        Description
                        <span className="text-muted-foreground text-xs ml-2">
                          (Why is it soulful? Key views, food stops, tips...)
                        </span>
                      </Label>
                      <Textarea
                        id="routeDescription"
                        placeholder="Describe what makes this route special..."
                        value={newRouteDescription}
                        onChange={(e) => setNewRouteDescription(e.target.value)}
                        rows={5}
                        className="bg-muted/50 resize-none"
                      />
                    </div>
                    <Button 
                      onClick={handleAddRoute} 
                      disabled={savingRoute}
                      className="w-full bg-gradient-to-r from-earth-green to-soul-amber hover:from-earth-green/90 hover:to-soul-amber/90"
                    >
                      {savingRoute ? "Adding..." : "Share This Route"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loadingRoutes ? (
              <div className="text-center py-8 text-muted-foreground">Loading routes...</div>
            ) : userRoutes.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  No routes yet. Share your first SoulRide!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:border-earth-green/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{route.route_title}</h4>
                        <p className="text-sm text-soul-amber flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {route.start_location} → {route.end_location}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {route.description}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-2">
                          Added {format(new Date(route.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleDeleteRoute(route.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
