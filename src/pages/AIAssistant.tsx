import { useState, useRef, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAIChatHistory, ChatMessage } from "@/hooks/useAIChatHistory";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  Code2,
  Trash2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Image as ImageIcon,
  History,
  Plus,
  MessageSquare,
  X,
  Maximize2
} from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatDistanceToNow } from "date-fns";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-image`;

const suggestedPrompts = [
  { text: "Explain React hooks simply", icon: "💡" },
  { text: "How to center a div with CSS?", icon: "🎨" },
  { text: "Best practices for TypeScript", icon: "📘" },
  { text: "Debug my code", icon: "🔧" },
  { text: "Generate an image of a robot coding", icon: "🖼️" },
  { text: "Tell me a coding joke", icon: "😂" },
];

const funFacts = [
  "🤓 Fun fact: The first computer bug was an actual bug - a moth found in a Harvard computer in 1947!",
  "💡 Did you know? JavaScript was created in just 10 days by Brendan Eich!",
  "🎮 Fun fact: The game Pac-Man was designed to appeal to women!",
  "☕ Coffee fact: Programmers convert caffeine into code since 1952!",
  "🚀 Space fact: NASA still uses code from the 1970s for space missions!",
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [typingText, setTypingText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const {
    conversations,
    currentConversationId,
    fetchMessages,
    createConversation,
    saveMessage,
    updateReaction,
    deleteConversation,
    startNewChat,
  } = useAIChatHistory();

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, typingText]);

  // Typing indicator animation
  useEffect(() => {
    if (isLoading && messages[messages.length - 1]?.role === "user") {
      const phrases = ["Soch raha hoon... 🤔", "Code samajh raha hoon... 💭", "Magic ho rahi hai... ✨"];
      let i = 0;
      const interval = setInterval(() => {
        setTypingText(phrases[i % phrases.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setTypingText("");
    }
  }, [isLoading, messages]);

  const streamChat = useCallback(async (
    messagesToSend: ChatMessage[],
    onDelta: (chunk: string) => void,
    onDone: () => void
  ) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: messagesToSend.map(m => ({ role: m.role, content: m.content })) }),
    });

    if (!resp.ok) {
      const error = await resp.json();
      throw new Error(error.error || "Failed to get response");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    onDone();
  }, []);

  const generateImage = async (prompt: string): Promise<string | null> => {
    try {
      const resp = await fetch(IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.error || "Image generation failed");
      }

      const data = await resp.json();
      return data.imageUrl || null;
    } catch (error) {
      console.error("Image generation error:", error);
      throw error;
    }
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const isImageRequest = /generate|create|make|draw|show me|banao|bana do/i.test(text) && 
                           /image|picture|photo|illustration|art|tasveer|drawing/i.test(text);

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Save to database if logged in
    let convId = currentConversationId;
    if (user && !convId) {
      convId = await createConversation(text.slice(0, 50));
    }
    if (user && convId) {
      await saveMessage(convId, userMsg);
    }

    if (isImageRequest) {
      setIsGeneratingImage(true);
      try {
        const imageUrl = await generateImage(text);
        const assistantMsg: ChatMessage = { 
          role: "assistant", 
          content: imageUrl 
            ? `Arre wah! 🎨 Tumhara image ban gaya hai bhai! Dekho kitna mast hai:\n\n*Prompt: ${text}*\n\nAgar aur kuch banana hai toh bolo! 🖼️✨`
            : "Oops yaar! 😅 Image generate nahi ho payi. Thoda baad mein try karo!",
          image_url: imageUrl
        };
        setMessages(prev => [...prev, assistantMsg]);
        if (user && convId) {
          await saveMessage(convId, assistantMsg);
        }
      } catch (error) {
        const errorMsg: ChatMessage = { 
          role: "assistant", 
          content: `Arre yaar! 😅 Image generation mein problem aa gayi: ${error instanceof Error ? error.message : "Unknown error"}. Thoda baad mein try karo!`
        };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsGeneratingImage(false);
        setIsLoading(false);
      }
      return;
    }

    let assistantSoFar = "";
    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat(
        [...messages, userMsg],
        (chunk) => upsertAssistant(chunk),
        async () => {
          setIsLoading(false);
          if (user && convId && assistantSoFar) {
            await saveMessage(convId, { role: "assistant", content: assistantSoFar });
          }
        }
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Oops! 😅",
        description: error instanceof Error ? error.message : "Kuch gadbad ho gayi yaar!",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (index: number) => {
    if (isLoading) return;
    
    // Find the user message before this assistant message
    let userMsgIndex = index - 1;
    while (userMsgIndex >= 0 && messages[userMsgIndex].role !== "user") {
      userMsgIndex--;
    }
    
    if (userMsgIndex < 0) return;
    
    const userMessage = messages[userMsgIndex];
    // Remove messages from this point
    setMessages(prev => prev.slice(0, userMsgIndex));
    // Resend
    setTimeout(() => handleSend(userMessage.content), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    startNewChat();
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({ title: "Copied! 📋" });
  };

  const handleReaction = (index: number, reaction: "like" | "dislike") => {
    const message = messages[index];
    if (message.id) {
      const newReaction = message.reaction === reaction ? null : reaction;
      updateReaction(message.id, newReaction);
    }
    setMessages(prev => prev.map((m, i) => {
      if (i === index) {
        return { ...m, reaction: m.reaction === reaction ? null : reaction };
      }
      return m;
    }));
  };

  const loadConversation = async (convId: string) => {
    await fetchMessages(convId);
    setShowHistory(false);
  };

  // Code execution (simple eval for demo - in production use sandbox)
  const executeCode = (code: string, language: string) => {
    if (language !== "javascript" && language !== "js") {
      toast({ 
        title: "Oye! 🤔", 
        description: "Abhi sirf JavaScript code run hota hai yaar!" 
      });
      return;
    }

    try {
      // Create a safe console.log capture
      const logs: string[] = [];
      const mockConsole = {
        log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
      };
      
      // eslint-disable-next-line no-new-func
      const fn = new Function("console", code);
      fn(mockConsole);
      
      toast({
        title: "Code Output 🎉",
        description: logs.join("\n") || "Code ran successfully! (No output)",
      });
    } catch (error) {
      toast({
        title: "Error! 💥",
        description: error instanceof Error ? error.message : "Code execution failed",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Assistant
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            PruthviAI Assistant 🤖
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Arre yaar! Main hoon tumhara coding buddy! 💪 Koi bhi sawaal poocho - debugging se lekar jokes tak! 😂
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Link to="/chat">
              <Button variant="outline" size="sm" className="gap-2">
                <Maximize2 className="h-4 w-4" />
                Fullscreen Mode
              </Button>
            </Link>
            {user && (
              <Sheet open={showHistory} onOpenChange={setShowHistory}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <History className="h-4 w-4" />
                    Chat History
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Chat History
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-2">
                    <Button 
                      onClick={() => { startNewChat(); setShowHistory(false); }}
                      variant="outline" 
                      className="w-full justify-start gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      New Chat
                    </Button>
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                            currentConversationId === conv.id ? "bg-muted" : ""
                          }`}
                          onClick={() => loadConversation(conv.id)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{conv.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conv.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {/* Fun Fact Banner */}
        {messages.length === 0 && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 text-center">
            <p className="text-sm text-muted-foreground">
              {funFacts[Math.floor(Math.random() * funFacts.length)]}
            </p>
          </div>
        )}

        {/* Chat Container */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            {/* Chat Messages */}
            <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="p-4 rounded-full bg-primary/10 mb-4 animate-bounce">
                    <Bot className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Namaste! 🙏 Kya help chahiye aaj?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Coding, debugging, jokes, ya image generation - sab milega yahan! 🚀
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-lg">
                    {suggestedPrompts.map((prompt) => (
                      <Button
                        key={prompt.text}
                        variant="outline"
                        className="text-left h-auto py-3 px-4 justify-start hover:bg-primary/5 hover:border-primary/50"
                        onClick={() => handleSend(prompt.text)}
                      >
                        <span className="mr-2">{prompt.icon}</span>
                        <span className="text-xs truncate">{prompt.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className={msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-primary to-accent text-white"}>
                          {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block rounded-2xl px-4 py-2 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted text-foreground rounded-tl-sm"
                          }`}
                        >
                          {msg.image_url && (
                            <img 
                              src={msg.image_url} 
                              alt="Generated" 
                              className="max-w-full rounded-lg mb-2 border border-border"
                            />
                          )}
                          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({ className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || "");
                                  const codeString = String(children).replace(/\n$/, "");
                                  const isInline = !match;
                                  
                                  if (isInline) {
                                    return (
                                      <code className="bg-background/50 px-1 py-0.5 rounded text-xs" {...props}>
                                        {children}
                                      </code>
                                    );
                                  }
                                  
                                  return (
                                    <div className="relative group my-2">
                                      <div className="flex items-center justify-between bg-background/80 px-3 py-1 rounded-t-lg border-b border-border text-xs">
                                        <span className="text-muted-foreground">{match[1]}</span>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                            onClick={() => copyToClipboard(codeString, index)}
                                          >
                                            {copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                          </Button>
                                          {(match[1] === "javascript" || match[1] === "js") && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-2 text-xs"
                                              onClick={() => executeCode(codeString, match[1])}
                                            >
                                              ▶️ Run
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        className="!mt-0 !rounded-t-none"
                                      >
                                        {codeString}
                                      </SyntaxHighlighter>
                                    </div>
                                  );
                                },
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                        {msg.role === "assistant" && (
                          <div className="flex items-center gap-1 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 px-2 ${msg.reaction === "like" ? "text-green-500" : "text-muted-foreground"}`}
                              onClick={() => handleReaction(index, "like")}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 px-2 ${msg.reaction === "dislike" ? "text-red-500" : "text-muted-foreground"}`}
                              onClick={() => handleReaction(index, "dislike")}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRegenerate(index)}
                              disabled={isLoading}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Regenerate
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(msg.content, index)}
                            >
                              {copiedIndex === index ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                        {isGeneratingImage ? (
                          <>
                            <ImageIcon className="h-4 w-4 animate-pulse text-primary" />
                            <span className="text-sm text-muted-foreground">Image bana raha hoon... 🎨</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">{typingText || "Typing..."}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    title="Clear chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Poocho kuch bhi... (type 'generate image of...' for images!) 🚀"
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 bg-gradient-primary"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                PruthviAI kabhi kabhi galti kar sakta hai yaar! Important info verify karna 🙏 | Made with ❤️ for developers
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIAssistant;
