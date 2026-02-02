import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Send, MessageCircle, Users, Loader2, Menu, Radio, ChevronRight } from "lucide-react";
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
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

const ChatPage = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("Motorbike Riders");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        setMessages(data || []);
      }
      setLoadingMessages(false);
    };

    if (user && selectedRoom) {
      fetchMessages();
    }
  }, [user, selectedRoom, toast]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user || !profile) return;

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      username: profile.username,
      content: newMessage.trim(),
      room_name: selectedRoom,
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

  const RoomList = ({ onSelect }: { onSelect?: (name: string) => void }) => (
    <div className="space-y-2">
      {loadingRooms ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-earth-green" />
        </div>
      ) : (
        rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect ? onSelect(room.name) : handleRoomSelect(room.name)}
            className={cn(
              "w-full text-left p-3 rounded-lg transition-all duration-200 group",
              selectedRoom === room.name
                ? "bg-gradient-to-r from-earth-green/20 to-soul-amber/10 border border-earth-green/30"
                : "hover:bg-muted/50 border border-transparent"
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn(
                "font-medium text-sm",
                selectedRoom === room.name ? "text-earth-green-glow" : "text-foreground"
              )}>
                {room.name}
              </span>
              {selectedRoom === room.name && (
                <Radio className="h-3 w-3 text-soul-amber animate-pulse" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {room.description}
            </p>
          </button>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-72 border-r border-border/50 flex-col bg-background/50">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-display text-lg tracking-wide flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-earth-green" />
              Chat Rooms
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Choose your tribe</p>
          </div>
          <ScrollArea className="flex-1 p-3">
            <RoomList />
          </ScrollArea>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-background/95 backdrop-blur-lg">
                  <div className="p-4 border-b border-border/50">
                    <h2 className="font-display text-lg tracking-wide flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-earth-green" />
                      Chat Rooms
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">Choose your tribe</p>
                  </div>
                  <ScrollArea className="h-[calc(100vh-80px)] p-3">
                    <RoomList onSelect={handleRoomSelect} />
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl tracking-wide">{selectedRoom}</h1>
                  <span className="flex items-center gap-1 text-xs text-soul-amber bg-soul-amber/10 px-2 py-0.5 rounded-full">
                    <Radio className="h-2.5 w-2.5 animate-pulse" />
                    Live
                  </span>
                </div>
                {currentRoom && (
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-md truncate">
                    {currentRoom.description}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Riding as</p>
              <p className="text-sm font-medium text-earth-green-glow">{profile?.username}</p>
            </div>
          </div>

          {/* Moderation note */}
          <div className="py-2 px-4 bg-earth-green/10 text-center">
            <p className="text-xs text-muted-foreground">
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
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
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
                        <div
                          className={`inline-block px-4 py-2 rounded-2xl ${
                            isOwn
                              ? "bg-gradient-to-r from-earth-green/20 to-earth-green/10 rounded-tr-sm"
                              : "bg-muted/50 rounded-tl-sm"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
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
          <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="flex gap-3">
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
                disabled={!newMessage.trim() || sending}
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
