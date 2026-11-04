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
import Seo from "@/components/Seo";
import { chatSeo } from "@/lib/seo";

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

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        // Database error - rooms failed to load
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
        // Database error - user receives toast notification
        toast({
          title: "Error loading messages",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } else {
        const msgs = (data || []) as Message[];
        setMessages(msgs);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      await uploadPhoto(file, user.id);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && !pendingImageUrl) || !user || !profile) return;

    // Client-side validation for message length (server-side constraint is 5000 chars)
    if (newMessage.length > 5000) {
      toast({
        title: "Пораката е премногу долга",
        description: "Максимум 5000 знаци.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      username: profile.username,
      content: newMessage.trim(),
      room_name: selectedRoom,
      image_url: pendingImageUrl,
    });

    if (error) {
      // Send failed - user receives toast notification
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

  const getRoomIcon = (roomName: string) => {
    const name = roomName.toLowerCase();
    if (name.includes('motorbike') || name.includes('rider')) return '🏍️';
    if (name.includes('offroad') || name.includes('adventure')) return '🧭';
    if (name.includes('camping') || name.includes('camp')) return '🏕️';
    if (name.includes('food') || name.includes('restaurant')) return '🍺';
    if (name.includes('route') || name.includes('road')) return '🛤️';
    return '🔥';
  };

  const pageSeo = (
    <Seo title={chatSeo.title} description={chatSeo.description} path={chatSeo.path} noindex />
  );

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center pt-16"
        style={{ backgroundColor: 'hsl(20 15% 8%)' }}
      >
        {pageSeo}
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'hsl(15 70% 55%)' }} />
      </div>
    );
  }

  if (!user) {
    return pageSeo;
  }

  const RoomList = ({ onSelect }: { onSelect?: (name: string) => void }) => (
    <div className="space-y-3">
      {loadingRooms ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'hsl(15 70% 55%)' }} />
        </div>
      ) : (
        rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect ? onSelect(room.name) : handleRoomSelect(room.name)}
            className="w-full text-left p-4 rounded-xl transition-all duration-300 group"
            style={{
              background: selectedRoom === room.name 
                ? 'hsl(15 70% 50% / 0.12)' 
                : 'hsl(20 15% 12%)',
              border: selectedRoom === room.name 
                ? '1px solid hsl(15 70% 50% / 0.3)' 
                : '1px solid hsl(25 15% 18%)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getRoomIcon(room.name)}</span>
                <span 
                  className="text-sm font-semibold"
                  style={{ 
                    color: selectedRoom === room.name ? 'hsl(15 70% 60%)' : 'hsl(0 0% 100%)',
                  }}
                >
                  {room.name}
                </span>
              </div>
              {selectedRoom === room.name && (
                <Radio className="h-3 w-3 animate-pulse" style={{ color: 'hsl(15 70% 55%)' }} />
              )}
            </div>
            <p 
              className="text-xs mt-2 line-clamp-2"
              style={{ color: 'hsl(30 10% 55%)' }}
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
      className="min-h-screen pt-16"
      style={{ backgroundColor: 'hsl(20 15% 8%)' }}
    >
      {pageSeo}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside 
          className="hidden md:flex w-80 flex-col"
          style={{
            backgroundColor: 'hsl(20 15% 9%)',
            borderRight: '1px solid hsl(25 15% 16%)',
          }}
        >
          <div 
            className="p-5"
            style={{ borderBottom: '1px solid hsl(25 15% 16%)' }}
          >
            <h2 
              className="text-lg font-bold flex items-center gap-2"
              style={{ color: 'hsl(0 0% 100%)' }}
            >
              <MessageCircle className="h-5 w-5" style={{ color: 'hsl(170 60% 55%)' }} />
              Soul Chat
            </h2>
            <p 
              className="text-sm mt-1 font-script"
              style={{ color: 'hsl(30 15% 55%)' }}
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
              backgroundColor: 'hsl(20 15% 10%)',
              borderBottom: '1px solid hsl(25 15% 16%)',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" style={{ color: 'hsl(0 0% 100%)' }} />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-80 p-0"
                  style={{ backgroundColor: 'hsl(20 15% 9%)' }}
                >
                  <div 
                    className="p-5"
                    style={{ borderBottom: '1px solid hsl(25 15% 16%)' }}
                  >
                    <h2 
                      className="text-lg font-bold flex items-center gap-2"
                      style={{ color: 'hsl(0 0% 100%)' }}
                    >
                      <MessageCircle className="h-5 w-5" style={{ color: 'hsl(170 60% 55%)' }} />
                      Soul Chat
                    </h2>
                  </div>
                  <ScrollArea className="h-[calc(100vh-80px)] p-4">
                    <RoomList onSelect={handleRoomSelect} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <div>
                <div className="flex items-center gap-2">
                  <h1 
                    className="text-xl font-semibold"
                    style={{ color: 'hsl(0 0% 100%)' }}
                  >
                    {selectedRoom}
                  </h1>
                  <span 
                    className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'hsl(15 70% 50% / 0.15)',
                      color: 'hsl(15 70% 60%)',
                      border: '1px solid hsl(15 70% 50% / 0.25)',
                    }}
                  >
                    <Radio className="h-2.5 w-2.5 animate-pulse" />
                    Live
                  </span>
                </div>
                {currentRoom && (
                  <p 
                    className="text-xs mt-0.5 max-w-md truncate"
                    style={{ color: 'hsl(30 10% 55%)' }}
                  >
                    {currentRoom.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs" style={{ color: 'hsl(30 10% 50%)' }}>
                Riding as
              </p>
              <p className="text-sm font-medium" style={{ color: 'hsl(170 60% 55%)' }}>
                {profile?.username}
              </p>
            </div>
          </div>

          {/* Moderation note */}
          <div 
            className="py-2 px-4 text-center"
            style={{ backgroundColor: 'hsl(15 70% 50% / 0.06)' }}
          >
            <p 
              className="text-sm font-script"
              style={{ color: 'hsl(15 60% 60%)' }}
            >
              ✨ Be kind, share soulfully. Every rider has a story worth hearing.
            </p>
          </div>

          {/* Messages area */}
          <ScrollArea className="flex-1 px-4">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full py-12">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'hsl(15 70% 55%)' }} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <MessageCircle className="h-12 w-12 mb-4" style={{ color: 'hsl(25 15% 25%)' }} />
                <p style={{ color: 'hsl(30 10% 50%)' }}>
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {messages.map((message) => {
                  const isOwn = message.user_id === user?.id;
                  const userProfile = userProfiles.get(message.user_id);
                  
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        isOwn ? "flex-row-reverse" : ""
                      )}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={userProfile?.profile_photo_url || undefined} />
                        <AvatarFallback 
                          style={{ 
                            background: 'hsl(15 70% 50% / 0.2)',
                            color: 'hsl(15 70% 60%)',
                          }}
                        >
                          {message.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={cn("max-w-[75%]", isOwn ? "text-right" : "")}>
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className={cn(
                              "text-xs font-medium",
                              isOwn ? "order-2" : ""
                            )}
                            style={{ color: isOwn ? 'hsl(15 70% 60%)' : 'hsl(170 60% 55%)' }}
                          >
                            {message.username}
                          </span>
                          <span 
                            className="text-[10px]"
                            style={{ color: 'hsl(30 10% 45%)' }}
                          >
                            {format(new Date(message.created_at), "h:mm a")}
                          </span>
                        </div>
                        
                        <div
                          className="p-3 rounded-2xl"
                          style={{
                            background: isOwn 
                              ? 'hsl(15 70% 50% / 0.15)' 
                              : 'hsl(20 15% 14%)',
                            border: isOwn 
                              ? '1px solid hsl(15 70% 50% / 0.25)' 
                              : '1px solid hsl(25 15% 20%)',
                            borderRadius: isOwn 
                              ? '16px 4px 16px 16px' 
                              : '4px 16px 16px 16px',
                          }}
                        >
                          {message.content && (
                            <p 
                              className="text-sm"
                              style={{ color: 'hsl(30 15% 85%)' }}
                            >
                              {message.content}
                            </p>
                          )}
                          {message.image_url && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <img
                                  src={message.image_url}
                                  alt="Shared image"
                                  className="mt-2 rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                                  style={{ maxHeight: '200px' }}
                                  onClick={() => setSelectedImageUrl(message.image_url)}
                                />
                              </DialogTrigger>
                              <DialogContent 
                                className="max-w-3xl p-2"
                                style={{ backgroundColor: 'hsl(20 15% 10%)' }}
                              >
                                <img
                                  src={message.image_url}
                                  alt="Shared image full"
                                  className="w-full rounded-lg"
                                />
                              </DialogContent>
                            </Dialog>
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

          {/* Message input */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4"
            style={{ 
              borderTop: '1px solid hsl(25 15% 16%)',
              backgroundColor: 'hsl(20 15% 10%)',
            }}
          >
            {pendingImageUrl && (
              <div className="mb-3 relative inline-block">
                <img
                  src={pendingImageUrl}
                  alt="Pending upload"
                  className="h-20 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setPendingImageUrl(null)}
                  className="absolute -top-2 -right-2 p-1 rounded-full"
                  style={{ 
                    backgroundColor: 'hsl(0 60% 50%)',
                    color: 'white',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            <div className="flex gap-3 items-end">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex-shrink-0"
              >
                {uploadingImage ? (
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'hsl(15 70% 55%)' }} />
                ) : (
                  <ImagePlus className="h-5 w-5" style={{ color: 'hsl(30 10% 60%)' }} />
                )}
              </Button>
              
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your story..."
                className="flex-1 min-h-[44px] max-h-32 resize-none rounded-xl"
                style={{
                  background: 'hsl(20 12% 14%)',
                  border: '1px solid hsl(25 15% 20%)',
                  color: 'hsl(0 0% 100%)',
                }}
              />
              
              <Button
                type="submit"
                disabled={sending || (!newMessage.trim() && !pendingImageUrl)}
                className="flex-shrink-0 rounded-full h-11 w-11"
                style={{
                  background: 'linear-gradient(135deg, hsl(15 70% 50%) 0%, hsl(25 75% 55%) 100%)',
                }}
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
