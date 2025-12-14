import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import {
  useCommunityMessages,
  useSendMessage,
  useDeleteMessage,
  useToggleReaction,
  useBlockedUsers,
  useBlockUser,
  useUnblockUser,
} from "@/hooks/useCommunityMessages";
import {
  Send,
  Trash2,
  MessageCircle,
  Users,
  Loader2,
  SmilePlus,
  Ban,
  Shield,
  Link as LinkIcon,
  Maximize2,
  Minimize2,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "💯"];

// Function to detect and render links
const renderMessageWithLinks = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:opacity-80 inline-flex items-center gap-1"
        >
          <LinkIcon className="h-3 w-3" />
          {part.length > 40 ? part.substring(0, 40) + "..." : part}
        </a>
      );
    }
    return part;
  });
};

const Community = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { messages, isLoading } = useCommunityMessages();
  const { data: blockedUsers } = useBlockedUsers();
  const sendMessage = useSendMessage();
  const deleteMessage = useDeleteMessage();
  const toggleReaction = useToggleReaction();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const isMobile = useIsMobile();

  const [newMessage, setNewMessage] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<{ id: string; name: string } | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check if current user is blocked
  const isCurrentUserBlocked = blockedUsers?.some((b) => b.user_id === user?.id);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    if (isCurrentUserBlocked) {
      toast({
        title: "You are blocked",
        description: "You cannot send messages in this chat.",
        variant: "destructive",
      });
      return;
    }

    try {
      await sendMessage.mutateAsync({
        userId: user.id,
        message: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage.mutateAsync(messageId);
      toast({
        title: "Message deleted",
        description: "Your message has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to react to messages.",
        variant: "destructive",
      });
      return;
    }

    try {
      await toggleReaction.mutateAsync({
        messageId,
        userId: user.id,
        emoji,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reaction.",
        variant: "destructive",
      });
    }
  };

  const handleBlockUser = async () => {
    if (!userToBlock || !user) return;

    try {
      await blockUser.mutateAsync({
        userId: userToBlock.id,
        blockedBy: user.id,
        reason: blockReason,
      });
      toast({
        title: "User blocked",
        description: `${userToBlock.name} has been blocked from the chat.`,
      });
      setBlockDialogOpen(false);
      setUserToBlock(null);
      setBlockReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block user.",
        variant: "destructive",
      });
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await unblockUser.mutateAsync(userId);
      toast({
        title: "User unblocked",
        description: "User can now send messages again.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unblock user.",
        variant: "destructive",
      });
    }
  };

  const openBlockDialog = (userId: string, userName: string) => {
    setUserToBlock({ id: userId, name: userName });
    setBlockDialogOpen(true);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isUserBlocked = (userId: string) => {
    return blockedUsers?.some((b) => b.user_id === userId);
  };

  // Fullscreen chat component for mobile
  if (isFullscreen && isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* Fullscreen Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(false)}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold text-foreground">Community Chat</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              <Shield className="h-3 w-3" />
              Admin
            </div>
          )}
        </div>

        {/* Blocked notice */}
        {isCurrentUserBlocked && (
          <div className="mx-4 mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive flex items-center gap-2 text-sm">
            <Ban className="h-4 w-4" />
            <span>You are blocked from sending messages.</span>
          </div>
        )}

        {/* Messages Area - Fullscreen */}
        <ScrollArea className="flex-1 px-4 py-2" ref={scrollRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isOwn = user?.id === msg.user_id;
                const profile = msg.profile;
                const userBlocked = isUserBlocked(msg.user_id);

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    <Link to={`/user/${msg.user_id}`}>
                      <Avatar className={`h-8 w-8 border-2 ${userBlocked ? "border-destructive opacity-50" : "border-border"}`}>
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                          {getInitials(profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className={`flex-1 max-w-[80%] ${isOwn ? "text-right" : ""}`}>
                      <div className={`flex items-center gap-2 mb-0.5 ${isOwn ? "justify-end" : ""}`}>
                        <span className={`text-xs font-medium ${userBlocked ? "text-destructive" : "text-foreground"} ${isOwn ? "order-2" : ""}`}>
                          {profile?.full_name || "Anonymous"}
                        </span>
                        <span className={`text-[10px] text-muted-foreground ${isOwn ? "order-1" : ""}`}>
                          {format(new Date(msg.created_at), "HH:mm")}
                        </span>
                      </div>
                      <div
                        className={`inline-block rounded-2xl px-3 py-2 ${
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted text-foreground rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {renderMessageWithLinks(msg.message)}
                        </p>
                      </div>

                      {/* Reactions Display */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className={`flex gap-1 mt-1 flex-wrap ${isOwn ? "justify-end" : ""}`}>
                          {msg.reactions.map((reaction) => (
                            <button
                              key={reaction.emoji}
                              onClick={() => handleReaction(msg.id, reaction.emoji)}
                              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs ${
                                reaction.users.includes(user?.id || "")
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {reaction.emoji} {reaction.count}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "justify-end" : ""}`}>
                        {user && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 px-1.5">
                                <SmilePlus className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-2" align={isOwn ? "end" : "start"}>
                              <div className="flex gap-1">
                                {EMOJI_OPTIONS.map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleReaction(msg.id, emoji)}
                                    className="text-lg hover:scale-125 transition-transform p-1"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                        {(isOwn || isAdmin) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(msg.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                        {isAdmin && !isOwn && !userBlocked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-1.5 text-muted-foreground hover:text-destructive"
                            onClick={() => openBlockDialog(msg.user_id, profile?.full_name || "Anonymous")}
                          >
                            <Ban className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-base font-medium text-foreground mb-1">No messages yet</h3>
              <p className="text-sm text-muted-foreground">Start the conversation!</p>
            </div>
          )}
        </ScrollArea>

        {/* Message Input - Fixed at bottom */}
        <div className="border-t border-border p-3 bg-background">
          {user ? (
            isCurrentUserBlocked ? (
              <div className="text-center py-2 text-sm text-muted-foreground">
                You cannot send messages while blocked.
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  disabled={sendMessage.isPending}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newMessage.trim() || sendMessage.isPending}
                  className="bg-gradient-primary shrink-0"
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            )
          ) : (
            <div className="text-center py-2">
              <Link to="/auth" className="text-primary hover:underline text-sm font-medium">
                Sign in to chat
              </Link>
            </div>
          )}
        </div>

        {/* Block Dialog */}
        <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Block User</DialogTitle>
              <DialogDescription>
                Block {userToBlock?.name} from sending messages.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Reason for blocking (optional)"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleBlockUser}>
                Block User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Header - Hide on mobile when not fullscreen */}
        <div className="text-center mb-4 md:mb-8 hidden md:block">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Users className="h-4 w-4" />
            Community Chat
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Developer Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with fellow developers, share ideas, ask questions, and learn together.
          </p>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-heading font-bold text-foreground">Community Chat</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(true)}
              className="gap-1"
            >
              <Maximize2 className="h-4 w-4" />
              Fullscreen
            </Button>
          </div>
        </div>

        {/* Blocked notice */}
        {isCurrentUserBlocked && (
          <div className="mb-4 p-3 md:p-4 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive flex items-center gap-2 text-sm md:text-base">
            <Ban className="h-4 w-4 md:h-5 md:w-5" />
            <span>You have been blocked from sending messages in this chat.</span>
          </div>
        )}

        {/* Chat Card */}
        <Card className="border-border/50 shadow-elegant">
          <CardHeader className="border-b border-border/50 p-3 md:p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Live Chat
              </CardTitle>
              <div className="flex items-center gap-2 md:gap-4">
                {isAdmin && (
                  <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                    <Shield className="h-3 w-3 md:h-4 md:w-4" />
                    Admin
                  </div>
                )}
                <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-muted-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(true)}
                  className="hidden md:inline-flex h-8 w-8"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages Area */}
            <ScrollArea className="h-[350px] md:h-[500px] p-3 md:p-4" ref={scrollRef}>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages && messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isOwn = user?.id === msg.user_id;
                    const profile = msg.profile;
                    const userBlocked = isUserBlocked(msg.user_id);

                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                      >
                        <Link to={`/user/${msg.user_id}`}>
                          <Avatar className={`h-10 w-10 border-2 transition-colors ${userBlocked ? "border-destructive opacity-50" : "border-border hover:border-primary"}`}>
                            <AvatarImage src={profile?.avatar_url || undefined} />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                              {getInitials(profile?.full_name)}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className={`flex-1 max-w-[70%] ${isOwn ? "text-right" : ""}`}>
                          <div className={`flex items-center gap-2 mb-1 ${isOwn ? "justify-end" : ""}`}>
                            <Link
                              to={`/user/${msg.user_id}`}
                              className={`text-sm font-medium hover:text-primary transition-colors ${userBlocked ? "text-destructive line-through" : "text-foreground"} ${isOwn ? "order-2" : ""}`}
                            >
                              {profile?.full_name || "Anonymous"}
                              {userBlocked && " (Blocked)"}
                            </Link>
                            <span className={`text-xs text-muted-foreground ${isOwn ? "order-1" : ""}`}>
                              {format(new Date(msg.created_at), "HH:mm")}
                            </span>
                          </div>
                          <div
                            className={`inline-block rounded-2xl px-4 py-2 ${
                              isOwn
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-muted text-foreground rounded-tl-sm"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {renderMessageWithLinks(msg.message)}
                            </p>
                          </div>

                          {/* Reactions Display */}
                          {msg.reactions && msg.reactions.length > 0 && (
                            <div className={`flex gap-1 mt-1 flex-wrap ${isOwn ? "justify-end" : ""}`}>
                              {msg.reactions.map((reaction) => (
                                <button
                                  key={reaction.emoji}
                                  onClick={() => handleReaction(msg.id, reaction.emoji)}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
                                    reaction.users.includes(user?.id || "")
                                      ? "bg-primary/20 text-primary border border-primary/30"
                                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                                  }`}
                                >
                                  {reaction.emoji} {reaction.count}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : ""}`}>
                            {/* Reaction Button */}
                            {user && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-muted-foreground hover:text-foreground"
                                  >
                                    <SmilePlus className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2" align={isOwn ? "end" : "start"}>
                                  <div className="flex gap-1">
                                    {EMOJI_OPTIONS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        onClick={() => handleReaction(msg.id, emoji)}
                                        className="text-xl hover:scale-125 transition-transform p-1"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}

                            {/* Delete Button (own messages or admin) */}
                            {(isOwn || isAdmin) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => handleDelete(msg.id)}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            )}

                            {/* Block Button (admin only, not for own messages) */}
                            {isAdmin && !isOwn && !userBlocked && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                                onClick={() => openBlockDialog(msg.user_id, profile?.full_name || "Anonymous")}
                              >
                                <Ban className="h-3 w-3 mr-1" />
                                Block
                              </Button>
                            )}

                            {/* Unblock Button (admin only) */}
                            {isAdmin && userBlocked && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-green-600 hover:text-green-700"
                                onClick={() => handleUnblockUser(msg.user_id)}
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Unblock
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No messages yet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Be the first to start the conversation!
                  </p>
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t border-border/50 p-4">
              {user ? (
                isCurrentUserBlocked ? (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    You cannot send messages while blocked.
                  </div>
                ) : (
                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message... (links are supported)"
                      className="flex-1"
                      disabled={sendMessage.isPending}
                    />
                    <Button
                      type="submit"
                      disabled={!newMessage.trim() || sendMessage.isPending}
                      className="bg-gradient-primary"
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                )
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sign in to join the conversation
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-border/50">
          <h3 className="font-semibold text-foreground mb-3">Community Guidelines</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be respectful and supportive to fellow developers</li>
            <li>• Keep discussions relevant to development and learning</li>
            <li>• No spam, self-promotion, or inappropriate content</li>
            <li>• Help others when you can — we all learn together!</li>
            <li>• Sharing useful links and resources is encouraged 🔗</li>
          </ul>
        </div>
      </div>

      {/* Block User Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-destructive" />
              Block User
            </DialogTitle>
            <DialogDescription>
              Block <strong>{userToBlock?.name}</strong> from sending messages in the community chat.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-foreground">
              Reason (optional)
            </label>
            <Textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Enter reason for blocking..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockUser}
              disabled={blockUser.isPending}
            >
              {blockUser.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Ban className="h-4 w-4 mr-2" />
              )}
              Block User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Community;
