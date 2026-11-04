import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { usePhotoUpload } from "@/hooks/use-photo-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Bike, MapPin, Plus, Calendar, Route, Pencil, Trash2, Camera, ImagePlus, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface UserRoute {
  id: string;
  route_title: string;
  start_location: string;
  end_location: string;
  description: string;
  created_at: string;
  likes_count: number;
  route_photo_url: string | null;
  is_public: boolean;
}

interface ExtendedProfile {
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
  const [newRoutePhotoUrl, setNewRoutePhotoUrl] = useState<string | null>(null);
  const [newRoutePublic, setNewRoutePublic] = useState(false);
  const [savingRoute, setSavingRoute] = useState(false);

  // File input refs
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const ridePhotoRef = useRef<HTMLInputElement>(null);
  const routePhotoRef = useRef<HTMLInputElement>(null);

  // Photo upload hooks
  const { uploadPhoto: uploadProfilePhoto, uploading: uploadingProfile } = usePhotoUpload({
    bucket: "avatars",
    onSuccess: async (url) => {
      if (!user) return;
      await supabase.from("profiles").update({ profile_photo_url: url }).eq("user_id", user.id);
      setExtendedProfile(prev => prev ? { ...prev, profile_photo_url: url } : null);
    },
  });

  const { uploadPhoto: uploadRidePhoto, uploading: uploadingRide } = usePhotoUpload({
    bucket: "rides",
    onSuccess: async (url) => {
      if (!user) return;
      await supabase.from("profiles").update({ ride_photo_url: url }).eq("user_id", user.id);
      setExtendedProfile(prev => prev ? { ...prev, ride_photo_url: url } : null);
    },
  });

  const { uploadPhoto: uploadRoutePhoto, uploading: uploadingRoutePhoto } = usePhotoUpload({
    bucket: "route-photos",
    onSuccess: (url) => {
      setNewRoutePhotoUrl(url);
    },
  });

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
      setUserRoutes(data as UserRoute[]);
    }
    setLoadingRoutes(false);
  };

  const handleProfilePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      await uploadProfilePhoto(file, user.id, "profile.jpg");
    }
  };

  const handleRidePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      await uploadRidePhoto(file, user.id, "ride.jpg");
    }
  };

  const handleRoutePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      await uploadRoutePhoto(file, user.id);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // Client-side validation for field lengths
    if (editBio.length > 500) {
      toast({
        title: "Bio too long",
        description: "Maximum 500 characters allowed.",
        variant: "destructive",
      });
      return;
    }
    if (editWhatYouRide.length > 200) {
      toast({
        title: "Field too long",
        description: "Maximum 200 characters for 'What I Ride'.",
        variant: "destructive",
      });
      return;
    }

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

    // Client-side validation for route field lengths
    if (newRouteTitle.length > 100) {
      toast({
        title: "Title too long",
        description: "Maximum 100 characters for route title.",
        variant: "destructive",
      });
      return;
    }
    if (newRouteStart.length > 200 || newRouteEnd.length > 200) {
      toast({
        title: "Location too long",
        description: "Maximum 200 characters for locations.",
        variant: "destructive",
      });
      return;
    }
    if (newRouteDescription.length > 2000) {
      toast({
        title: "Description too long",
        description: "Maximum 2000 characters for description.",
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
        route_photo_url: newRoutePhotoUrl,
        is_public: newRoutePublic,
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
        description: newRoutePublic
          ? "Your route is public."
          : "Saved as a private route. Only you can see it.",
      });
      setNewRouteTitle("");
      setNewRouteStart("");
      setNewRouteEnd("");
      setNewRouteDescription("");
      setNewRoutePhotoUrl(null);
      setNewRoutePublic(false);
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
    <div 
      className="min-h-screen pt-20 pb-16 px-4 grain-overlay"
      style={{ background: 'linear-gradient(180deg, hsl(200 20% 8%) 0%, hsl(180 15% 10%) 50%, hsl(25 12% 10%) 100%)' }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header with Photos - Vintage Journal Style */}
        <div 
          className="relative rounded-xl overflow-hidden p-8"
          style={{
            backgroundColor: 'hsl(180 12% 11%)',
            border: '2px solid hsl(140 15% 25% / 0.4)',
            boxShadow: '0 8px 40px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(40 30% 90% / 0.03)',
          }}
        >
          {/* Brass rivets */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(35 50% 55%) 0%, hsl(30 40% 35%) 100%)' }} />
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo Section - Polaroid Style */}
            <div className="flex flex-col items-center gap-4">
              <div 
                className="relative group p-3 rounded-lg"
                style={{
                  backgroundColor: 'hsl(40 30% 95%)',
                  boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3)',
                  transform: 'rotate(-2deg)',
                }}
              >
                <div className="h-32 w-32 rounded overflow-hidden">
                  {extendedProfile?.profile_photo_url ? (
                    <img 
                      src={extendedProfile.profile_photo_url} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                      style={{ filter: 'sepia(10%) saturate(90%)' }}
                    />
                  ) : (
                    <div 
                      className="h-full w-full flex items-center justify-center"
                      style={{ backgroundColor: 'hsl(140 22% 42%)' }}
                    >
                      <span 
                        className="text-4xl font-bold"
                        style={{ 
                          fontFamily: "'Bitter', serif",
                          color: 'hsl(40 30% 94%)',
                        }}
                      >
                        {profile.username.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => profilePhotoRef.current?.click()}
                  disabled={uploadingProfile}
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ backgroundColor: 'hsl(0 0% 0% / 0.5)' }}
                >
                  {uploadingProfile ? (
                    <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'hsl(40 30% 90%)' }} />
                  ) : (
                    <Camera className="h-6 w-6" style={{ color: 'hsl(40 30% 90%)' }} />
                  )}
                </button>
                <input
                  ref={profilePhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoChange}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => profilePhotoRef.current?.click()}
                disabled={uploadingProfile}
                className="gap-2 btn-soul-secondary"
              >
                {uploadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                Change Photo
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 
                className="text-3xl tracking-wide text-center md:text-left mb-2"
                style={{
                  fontFamily: "'Bitter', serif",
                  fontWeight: 700,
                  color: 'hsl(40 30% 94%)',
                }}
              >
                {profile.username}
              </h1>
              <p 
                className="flex items-center gap-2 mt-1 justify-center md:justify-start text-sm"
                style={{ 
                  fontFamily: "'Special Elite', monospace",
                  color: 'hsl(35 15% 50%)',
                }}
              >
                <Calendar className="h-4 w-4" style={{ color: 'hsl(25 40% 55%)' }} />
                Member since {format(new Date(profile.created_at), "MMMM yyyy")}
              </p>
                
                <div className="flex gap-2 mt-4 justify-center md:justify-start">
                  <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 btn-soul-secondary">
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent 
                      className="backdrop-blur-lg max-w-md"
                      style={{
                        backgroundColor: 'hsl(180 12% 11% / 0.98)',
                        border: '2px solid hsl(140 15% 25% / 0.4)',
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle 
                          style={{
                            fontFamily: "'Bitter', serif",
                            color: 'hsl(40 30% 94%)',
                          }}
                        >
                          Edit Your Profile
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label 
                            htmlFor="whatYouRide"
                            style={{ 
                              fontFamily: "'Special Elite', monospace",
                              color: 'hsl(35 50% 55%)',
                            }}
                          >
                            What I Ride
                          </Label>
                          <Input
                            id="whatYouRide"
                            placeholder="e.g., Adventure bike, Classic car..."
                            value={editWhatYouRide}
                            onChange={(e) => setEditWhatYouRide(e.target.value)}
                            style={{
                              backgroundColor: 'hsl(180 12% 15%)',
                              border: '1px solid hsl(140 15% 25% / 0.4)',
                              fontFamily: "'Special Elite', monospace",
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label 
                            htmlFor="bio"
                            style={{ 
                              fontFamily: "'Special Elite', monospace",
                              color: 'hsl(35 50% 55%)',
                            }}
                          >
                            Bio / About Me
                          </Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about yourself and your soul rides..."
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            rows={4}
                            className="resize-none"
                            style={{
                              backgroundColor: 'hsl(180 12% 15%)',
                              border: '1px solid hsl(140 15% 25% / 0.4)',
                              fontFamily: "'Libre Baskerville', serif",
                            }}
                          />
                        </div>
                        <Button 
                          onClick={handleSaveProfile} 
                          disabled={savingProfile}
                          className="w-full btn-soul-primary"
                        >
                          {savingProfile ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

            {/* My Ride Photo Section - Polaroid style */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: "'Bitter', serif",
                    fontWeight: 600,
                    color: 'hsl(40 30% 94%)',
                  }}
                >
                  <Bike className="h-5 w-5" style={{ color: 'hsl(25 40% 55%)' }} />
                  My Ride
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => ridePhotoRef.current?.click()}
                  disabled={uploadingRide}
                  className="gap-2 btn-soul-secondary"
                >
                  {uploadingRide ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  {extendedProfile?.ride_photo_url ? "Change" : "Add Photo"}
                </Button>
                <input
                  ref={ridePhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleRidePhotoChange}
                />
              </div>
              
              {/* Ride photo with polaroid frame */}
              <div 
                className="relative aspect-video rounded-lg overflow-hidden"
                style={{
                  backgroundColor: 'hsl(180 12% 13%)',
                  border: '1px solid hsl(140 15% 25% / 0.3)',
                }}
              >
                {extendedProfile?.ride_photo_url ? (
                  <>
                    <img 
                      src={extendedProfile.ride_photo_url} 
                      alt="My Ride" 
                      className="w-full h-full object-cover"
                      style={{ filter: 'sepia(10%) saturate(90%)' }}
                    />
                    {/* Caption overlay */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-3 text-center"
                      style={{
                        background: 'linear-gradient(to top, hsl(0 0% 0% / 0.7) 0%, transparent 100%)',
                      }}
                    >
                      <p 
                        className="text-sm"
                        style={{ 
                          fontFamily: "'Caveat', cursive",
                          color: 'hsl(40 30% 85%)',
                        }}
                      >
                        "My faithful companion on Macedonia's soul roads"
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Bike className="h-12 w-12 mb-2" style={{ color: 'hsl(35 15% 35%)' }} />
                    <p 
                      className="text-sm"
                      style={{ 
                        fontFamily: "'Libre Baskerville', serif",
                        color: 'hsl(35 15% 50%)',
                      }}
                    >
                      No ride photo yet
                    </p>
                    <p 
                      className="text-xs"
                      style={{ 
                        fontFamily: "'Caveat', cursive",
                        color: 'hsl(35 15% 45%)',
                      }}
                    >
                      Show off your wheels!
                    </p>
                  </div>
                )}
              </div>
              
              {extendedProfile?.what_you_ride && (
                <p 
                  className="text-sm"
                  style={{ 
                    fontFamily: "'Special Elite', monospace",
                    color: 'hsl(35 50% 55%)',
                  }}
                >
                  {extendedProfile.what_you_ride}
                </p>
              )}
            </div>
            
            {/* Bio */}
            <div 
              className="flex items-start gap-3 p-4 rounded-lg mt-6"
              style={{
                backgroundColor: 'hsl(140 22% 42% / 0.1)',
                border: '1px solid hsl(140 22% 42% / 0.25)',
              }}
            >
              <User className="h-5 w-5 mt-0.5" style={{ color: 'hsl(140 22% 55%)' }} />
              <div>
                <p 
                  className="text-sm font-medium mb-1"
                  style={{ 
                    fontFamily: "'Special Elite', monospace",
                    color: 'hsl(35 50% 55%)',
                  }}
                >
                  About Me
                </p>
                <p 
                  className="whitespace-pre-wrap"
                  style={{
                    fontFamily: "'Libre Baskerville', Georgia, serif",
                    color: 'hsl(40 30% 85%)',
                    lineHeight: 1.7,
                  }}
                >
                  {extendedProfile?.bio || "No bio yet. Click Edit Profile to add one!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* My Recommended Routes Section - Logbook Entries */}
        <div 
          className="rounded-xl p-6"
          style={{
            backgroundColor: 'hsl(180 12% 11%)',
            border: '2px solid hsl(140 15% 25% / 0.4)',
            boxShadow: '0 8px 40px hsl(0 0% 0% / 0.4)',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 
                className="flex items-center gap-2 text-xl tracking-wide"
                style={{
                  fontFamily: "'Bitter', serif",
                  fontWeight: 700,
                  color: 'hsl(40 30% 94%)',
                }}
              >
                <Route className="h-5 w-5" style={{ color: 'hsl(25 40% 55%)' }} />
                My Recommended SoulRides
              </h2>
              <p 
                className="text-sm mt-1"
                style={{ 
                  fontFamily: "'Caveat', cursive",
                  color: 'hsl(140 22% 55%)',
                }}
              >
                {userRoutes.length > 0 
                  ? `You recommended ${userRoutes.length} route${userRoutes.length === 1 ? "" : "s"}`
                  : "Share your favorite routes with the community"}
              </p>
            </div>
            <Dialog open={isAddingRoute} onOpenChange={(open) => {
                setIsAddingRoute(open);
                if (!open) setNewRoutePhotoUrl(null);
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-earth-green to-soul-amber hover:from-earth-green/90 hover:to-soul-amber/90">
                    <Plus className="h-4 w-4" />
                    Add Route
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-lg border-border/50 max-w-lg max-h-[90vh] overflow-y-auto">
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
                    
                    {/* Route Photo Upload */}
                    <div className="space-y-2">
                      <Label>Route Photo (Optional)</Label>
                      {newRoutePhotoUrl ? (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <img src={newRoutePhotoUrl} alt="Route" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setNewRoutePhotoUrl(null)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => routePhotoRef.current?.click()}
                          disabled={uploadingRoutePhoto}
                          className="w-full aspect-video rounded-lg border-2 border-dashed border-border/50 hover:border-earth-green/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
                        >
                          {uploadingRoutePhoto ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                          ) : (
                            <>
                              <ImagePlus className="h-8 w-8" />
                              <span className="text-sm">Add a photo of this route</span>
                            </>
                          )}
                        </button>
                      )}
                      <input
                        ref={routePhotoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleRoutePhotoChange}
                      />
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
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={newRoutePublic}
                        onChange={(e) => setNewRoutePublic(e.target.checked)}
                      />
                      List this route publicly. Leave it off and only you can see it.
                    </label>
                    <Button 
                      onClick={handleAddRoute} 
                      disabled={savingRoute}
                      className="w-full bg-gradient-to-r from-earth-green to-soul-amber hover:from-earth-green/90 hover:to-soul-amber/90"
                    >
                      {savingRoute ? "Adding..." : newRoutePublic ? "Publish this route" : "Save private route"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
          </div>
          <div className="mt-6">
            {loadingRoutes ? (
              <div 
                className="text-center py-8"
                style={{ 
                  fontFamily: "'Libre Baskerville', serif",
                  color: 'hsl(35 15% 50%)',
                }}
              >
                Loading routes...
              </div>
            ) : userRoutes.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 mx-auto mb-3" style={{ color: 'hsl(35 15% 35%)' }} />
                <p 
                  style={{ 
                    fontFamily: "'Libre Baskerville', serif",
                    color: 'hsl(35 15% 50%)',
                  }}
                >
                  No routes yet. Share your first SoulRide!
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {userRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    style={{
                      backgroundColor: 'hsl(180 12% 13%)',
                      border: '1px solid hsl(140 15% 25% / 0.3)',
                      boxShadow: '0 4px 20px hsl(0 0% 0% / 0.3)',
                    }}
                  >
                    {route.route_photo_url && (
                      <div 
                        className="aspect-video overflow-hidden relative"
                        style={{ 
                          borderBottom: '3px solid hsl(40 30% 90%)',
                        }}
                      >
                        <img 
                          src={route.route_photo_url} 
                          alt={route.route_title}
                          className="w-full h-full object-cover"
                          style={{ filter: 'sepia(15%) saturate(85%)' }}
                        />
                        {/* Date stamp */}
                        <div 
                          className="absolute bottom-2 right-2 px-2 py-1 rounded"
                          style={{
                            backgroundColor: 'hsl(180 12% 10% / 0.85)',
                            border: '1px solid hsl(25 40% 40% / 0.4)',
                          }}
                        >
                          <span 
                            className="text-xs"
                            style={{ 
                              fontFamily: "'Special Elite', monospace",
                              color: 'hsl(25 40% 60%)',
                            }}
                          >
                            {format(new Date(route.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 
                            className="text-lg"
                            style={{
                              fontFamily: "'Caveat', cursive",
                              fontWeight: 600,
                              color: 'hsl(40 30% 94%)',
                              fontSize: '1.25rem',
                            }}
                          >
                            {route.route_title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {route.is_public ? "Public" : "Private"}
                          </p>
                          <p 
                            className="flex items-center gap-1 mt-1 text-sm"
                            style={{ 
                              fontFamily: "'Special Elite', monospace",
                              color: 'hsl(25 40% 55%)',
                            }}
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            {route.start_location} → {route.end_location}
                          </p>
                          <p 
                            className="mt-3 line-clamp-2 text-sm"
                            style={{
                              fontFamily: "'Libre Baskerville', Georgia, serif",
                              color: 'hsl(40 15% 55%)',
                              lineHeight: 1.7,
                            }}
                          >
                            {route.description}
                          </p>
                          {!route.route_photo_url && (
                            <p 
                              className="text-xs mt-3"
                              style={{ 
                                fontFamily: "'Special Elite', monospace",
                                color: 'hsl(35 15% 45%)',
                              }}
                            >
                              Added {format(new Date(route.created_at), "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 hover:bg-destructive/20"
                          onClick={() => handleDeleteRoute(route.id)}
                        >
                          <Trash2 className="h-4 w-4" style={{ color: 'hsl(0 60% 50%)' }} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
