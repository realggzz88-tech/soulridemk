import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageCircle, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Message {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

const ChatPage = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
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

    if (user) {
      fetchMessages();
    }
  }, [user, toast]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
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
  }, [user]);

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

  return (
    <div className="min-h-screen pt-16 pb-4 px-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-earth-green/20 to-soul-amber/20">
              <MessageCircle className="h-5 w-5 text-earth-green-glow" />
            </div>
            <div>
              <h1 className="font-display text-xl tracking-wide">Soul Chat</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />
                Community of soul riders
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Riding as</p>
            <p className="font-medium text-earth-green-glow">{profile?.username}</p>
          </div>
        </div>

        {/* Moderation note */}
        <div className="py-2 px-4 bg-earth-green/10 rounded-lg my-3 text-center">
          <p className="text-xs text-muted-foreground">
            ✨ Be kind, share soulfully. Every rider has a story worth hearing.
          </p>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-earth-green" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No messages yet.</p>
              <p className="text-sm text-muted-foreground">Be the first to share your soul ride story!</p>
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
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-border/50">
          <div className="flex gap-3">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your soul ride story or ask a question..."
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
      </div>
    </div>
  );
};

export default ChatPage;
