import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { usePhotoUpload } from "@/hooks/use-photo-upload";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Send, MessageCircle, Loader2, Menu, Radio, ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
  room_name: string;
  image_url: string | null;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface UserProfile {
  user_id: string;
  username: string;
  profile_photo_url: string | null;
}

const ChatPage = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("Motorbike Riders");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userProfiles, setUserProfiles] = useState<Map<string, UserProfile>>(new Map());
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { uploadPhoto, uploading: uploadingImage } = usePhotoUpload({
    bucket: "chat-photos",
    onSuccess: (url) => {
      setPendingImageUrl(url);
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Fetch chat rooms
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        setRooms(data || []);
        if (data && data.length > 0 && !data.find(r => r.name === selectedRoom)) {
          setSelectedRoom(data[0].name);
        }
      }
      setLoadingRooms(false);
    };

    if (user) {
      fetchRooms();
    }
  }, [user]);

  // Fetch user profiles for avatars
  const fetchUserProfiles = async (userIds: string[]) => {
    const uniqueIds = [...new Set(userIds)].filter(id => !userProfiles.has(id));
    if (uniqueIds.length === 0) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, username, profile_photo_url")
      .in("user_id", uniqueIds);

    if (data && !error) {
      const newProfiles = new Map(userProfiles);
      data.forEach(p => newProfiles.set(p.user_id, p as UserProfile));
      setUserProfiles(newProfiles);
    }
  };

  // Fetch messages for selected room
  useEffect(() => {
    const fetchMessages = async () => {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_name", selectedRoom)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          title: "Error loading messages",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } else {
        const msgs = (data || []) as Message[];
        setMessages(msgs);
        // Fetch profiles for message authors
        if (msgs.length > 0) {
          fetchUserProfiles(msgs.map(m => m.user_id));
        }
      }
      setLoadingMessages(false);
    };

    if (user && selectedRoom) {
      fetchMessages();
    }
  }, [user, selectedRoom]);

  // Subscribe to new messages for selected room
  useEffect(() => {
    if (!user || !selectedRoom) return;

    const channel = supabase
      .channel(`messages-${selectedRoom}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_name=eq.${selectedRoom}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          fetchUserProfiles([newMsg.user_id]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      await uploadPhoto(file, user.id);
    }
    // Reset input so same file can be selected again
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !pendingImageUrl) || !user || !profile) return;

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      username: profile.username,
      content: newMessage.trim(),
      room_name: selectedRoom,
      image_url: pendingImageUrl,
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
      setPendingImageUrl(null);
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleRoomSelect = (roomName: string) => {
    setSelectedRoom(roomName);
    setMobileMenuOpen(false);
  };

  const currentRoom = rooms.find(r => r.name === selectedRoom);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-earth-green" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get room icon based on name
  const getRoomIcon = (roomName: string) => {
    const name = roomName.toLowerCase();
    if (name.includes('motorbike') || name.includes('rider')) return '🏍️';
    if (name.includes('offroad') || name.includes('adventure')) return '🧭';
    if (name.includes('camping') || name.includes('camp')) return '🏕️';
    if (name.includes('food') || name.includes('restaurant')) return '🍺';
    if (name.includes('route') || name.includes('road')) return '🛤️';
    return '🔥'; // Default campfire icon
  };

  const RoomList = ({ onSelect }: { onSelect?: (name: string) => void }) => (
    <div className="space-y-3">
      {loadingRooms ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'hsl(140 22% 50%)' }} />
        </div>
      ) : (
        rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect ? onSelect(room.name) : handleRoomSelect(room.name)}
            className="w-full text-left p-4 rounded-lg transition-all duration-300 group relative"
            style={{
              backgroundColor: selectedRoom === room.name 
                ? 'hsl(140 22% 42% / 0.15)' 
                : 'hsl(180 12% 12%)',
              border: selectedRoom === room.name 
                ? '1px solid hsl(140 22% 42% / 0.4)' 
                : '1px solid hsl(140 15% 25% / 0.3)',
              boxShadow: selectedRoom === room.name 
                ? '0 4px 12px hsl(140 22% 30% / 0.2)' 
                : '0 2px 8px hsl(0 0% 0% / 0.2)',
            }}
          >
            {/* Rusty pin icon */}
            <div 
              className="absolute -top-1.5 left-4 w-3 h-3 rounded-full"
              style={{ 
                background: 'linear-gradient(135deg, hsl(25 50% 50%) 0%, hsl(20 40% 35%) 100%)',
                boxShadow: '0 2px 4px hsl(0 0% 0% / 0.3)',
              }}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getRoomIcon(room.name)}</span>
                <span 
                  className="text-sm"
                  style={{ 
                    fontFamily: "'Bitter', serif",
                    fontWeight: 600,
                    color: selectedRoom === room.name ? 'hsl(140 22% 60%)' : 'hsl(40 30% 90%)',
                  }}
                >
                  {room.name}
                </span>
              </div>
              {selectedRoom === room.name && (
                <Radio className="h-3 w-3 animate-pulse" style={{ color: 'hsl(25 40% 55%)' }} />
              )}
            </div>
            <p 
              className="text-xs mt-2 line-clamp-2"
              style={{ 
                fontFamily: "'Libre Baskerville', serif",
                color: 'hsl(35 15% 50%)',
                lineHeight: 1.6,
              }}
            >
              {room.description}
            </p>
          </button>
        ))
      )}
    </div>
  );

  return (
    <div 
      className="min-h-screen pt-16 grain-overlay"
      style={{ background: 'linear-gradient(180deg, hsl(200 20% 8%) 0%, hsl(180 15% 10%) 100%)' }}
    >
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar - Bulletin Board Style */}
        <aside 
          className="hidden md:flex w-80 flex-col"
          style={{
            backgroundColor: 'hsl(180 12% 9%)',
            borderRight: '1px solid hsl(140 15% 20% / 0.4)',
          }}
        >
          <div 
            className="p-5"
            style={{ borderBottom: '1px solid hsl(140 15% 20% / 0.3)' }}
          >
            <h2 
              className="text-lg tracking-wide flex items-center gap-2"
              style={{ 
                fontFamily: "'Bitter', serif",
                fontWeight: 700,
                color: 'hsl(40 30% 94%)',
              }}
            >
              <MessageCircle className="h-5 w-5" style={{ color: 'hsl(140 22% 55%)' }} />
              Soul Chat
            </h2>
            <p 
              className="text-sm mt-1"
              style={{ 
                fontFamily: "'Caveat', cursive",
                color: 'hsl(35 50% 55%)',
              }}
            >
              Choose your tribe, share your story
            </p>
          </div>
          <ScrollArea className="flex-1 p-4">
            <RoomList />
          </ScrollArea>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4"
            style={{
              backgroundColor: 'hsl(180 12% 10% / 0.95)',
              borderBottom: '1px solid hsl(140 15% 20% / 0.3)',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-80 p-0"
                  style={{ backgroundColor: 'hsl(180 12% 9% / 0.98)' }}
                >
                  <div 
                    className="p-5"
                    style={{ borderBottom: '1px solid hsl(140 15% 20% / 0.3)' }}
                  >
                    <h2 
                      className="text-lg tracking-wide flex items-center gap-2"
                      style={{ 
                        fontFamily: "'Bitter', serif",
                        fontWeight: 700,
                        color: 'hsl(40 30% 94%)',
                      }}
                    >
                      <MessageCircle className="h-5 w-5" style={{ color: 'hsl(140 22% 55%)' }} />
                      Soul Chat
                    </h2>
                    <p 
                      className="text-sm mt-1"
                      style={{ 
                        fontFamily: "'Caveat', cursive",
                        color: 'hsl(35 50% 55%)',
                      }}
                    >
                      Choose your tribe
                    </p>
                  </div>
                  <ScrollArea className="h-[calc(100vh-80px)] p-4">
                    <RoomList onSelect={handleRoomSelect} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <div>
                <div className="flex items-center gap-2">
                  <h1 
                    className="text-xl tracking-wide"
                    style={{ 
                      fontFamily: "'Bitter', serif",
                      fontWeight: 600,
                      color: 'hsl(40 30% 94%)',
                    }}
                  >
                    {selectedRoom}
                  </h1>
                  <span 
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "'Special Elite', monospace",
                      backgroundColor: 'hsl(25 40% 35% / 0.2)',
                      color: 'hsl(25 40% 60%)',
                      border: '1px solid hsl(25 40% 40% / 0.3)',
                    }}
                  >
                    <Radio className="h-2.5 w-2.5 animate-pulse" />
                    Live
                  </span>
                </div>
                {currentRoom && (
                  <p 
                    className="text-xs mt-0.5 max-w-md truncate"
                    style={{ 
                      fontFamily: "'Libre Baskerville', serif",
                      color: 'hsl(35 15% 50%)',
                    }}
                  >
                    {currentRoom.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p 
                className="text-xs"
                style={{ 
                  fontFamily: "'Special Elite', monospace",
                  color: 'hsl(35 15% 50%)',
                }}
              >
                Riding as
              </p>
              <p 
                className="text-sm font-medium"
                style={{ 
                  fontFamily: "'Bitter', serif",
                  color: 'hsl(140 22% 60%)',
                }}
              >
                {profile?.username}
              </p>
            </div>
          </div>

          {/* Moderation note - handwritten */}
          <div 
            className="py-2 px-4 text-center"
            style={{ backgroundColor: 'hsl(140 22% 42% / 0.08)' }}
          >
            <p 
              className="text-sm"
              style={{ 
                fontFamily: "'Caveat', cursive",
                color: 'hsl(140 22% 55%)',
              }}
            >
              ✨ Be kind, share soulfully. Every rider has a story worth hearing.
            </p>
          </div>

          {/* Messages area */}
          <ScrollArea className="flex-1 px-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full py-12">
                <Loader2 className="h-6 w-6 animate-spin text-earth-green" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No messages in {selectedRoom} yet.</p>
                <p className="text-sm text-muted-foreground">Be the first to share your story!</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {messages.map((message) => {
                  const isOwn = message.user_id === user.id;
                  const authorProfile = userProfiles.get(message.user_id);
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {authorProfile?.profile_photo_url ? (
                          <AvatarImage src={authorProfile.profile_photo_url} alt={message.username} />
                        ) : null}
                        <AvatarFallback 
                          className={`text-xs font-medium ${
                            isOwn 
                              ? "bg-gradient-to-br from-earth-green to-earth-green/70 text-background" 
                              : "bg-gradient-to-br from-soul-amber/30 to-soul-amber/10 text-soul-amber"
                          }`}
                        >
                          {message.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-[75%] ${isOwn ? "text-right" : ""}`}>
                        <div className="flex items-baseline gap-2 mb-1" style={{ flexDirection: isOwn ? "row-reverse" : "row" }}>
                          <span className={`text-sm font-medium ${isOwn ? "text-earth-green-glow" : "text-soul-amber"}`}>
                            {message.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.created_at), "HH:mm")}
                          </span>
                        </div>
                        {/* Message bubble - torn notebook page style */}
                        <div
                          className="inline-block rounded-xl overflow-hidden"
                          style={{
                            backgroundColor: isOwn 
                              ? 'hsl(140 22% 42% / 0.15)' 
                              : 'hsl(180 12% 14%)',
                            border: isOwn 
                              ? '1px solid hsl(140 22% 42% / 0.3)' 
                              : '1px solid hsl(140 15% 20% / 0.3)',
                            borderRadius: isOwn ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                            boxShadow: '0 2px 8px hsl(0 0% 0% / 0.2)',
                          }}
                        >
                          {message.image_url && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <button className="block w-full max-w-sm">
                                  <img 
                                    src={message.image_url} 
                                    alt="Shared image" 
                                    className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    style={{ filter: 'sepia(10%) saturate(90%)' }}
                                  />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                                <img 
                                  src={message.image_url} 
                                  alt="Shared image" 
                                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                                />
                              </DialogContent>
                            </Dialog>
                          )}
                          {message.content && (
                            <p 
                              className="text-sm whitespace-pre-wrap break-words px-4 py-3"
                              style={{
                                fontFamily: "'Libre Baskerville', Georgia, serif",
                                color: 'hsl(40 30% 88%)',
                                lineHeight: 1.7,
                              }}
                            >
                              {message.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Pending image preview */}
          {pendingImageUrl && (
            <div className="px-4 py-2 border-t border-border/50">
              <div className="relative inline-block">
                <img 
                  src={pendingImageUrl} 
                  alt="Pending" 
                  className="h-20 w-auto rounded-lg object-cover"
                />
                <button
                  onClick={() => setPendingImageUrl(null)}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="shrink-0"
              >
                {uploadingImage ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ImagePlus className="h-5 w-5 text-soul-amber" />
                )}
              </Button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Chat in ${selectedRoom}...`}
                className="min-h-[60px] max-h-[120px] resize-none bg-background/50 border-border/50 focus:border-earth-green"
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={(!newMessage.trim() && !pendingImageUrl) || sending}
                className="h-auto px-4 bg-gradient-to-r from-earth-green to-soul-amber hover:from-earth-green/90 hover:to-soul-amber/90 text-background"
              >
                {sending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
