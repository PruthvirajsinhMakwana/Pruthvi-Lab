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
import { useAIUsageStats } from "@/hooks/useAIUsageStats";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
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
  Maximize2,
  Settings,
  Zap,
  Flame,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-image`;

type LanguageMode = "hinglish" | "gujlish" | "coding" | "coding-advanced" | "debug-expert";
type RoastLevel = "mild" | "medium" | "spicy";

const languageOptions = [
  { value: "hinglish", label: "🇮🇳 Hinglish", desc: "Desi style with roasts" },
  { value: "gujlish", label: "🦁 Gujlish", desc: "Topa, Dofa, Hopara!" },
  { value: "coding", label: "💻 Coding Pro", desc: "Precise code answers" },
  { value: "coding-advanced", label: "🚀 Advanced Dev", desc: "System design + architecture" },
  { value: "debug-expert", label: "🔧 Debug Expert", desc: "Find & fix bugs fast" },
];

const roastLevelOptions = [
  { value: "mild", label: "😊 Mild", desc: "Friendly & supportive" },
  { value: "medium", label: "😏 Medium", desc: "Light teasing" },
  { value: "spicy", label: "🔥 Spicy", desc: "Full desi roasts!" },
];

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
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);
  const [typingText, setTypingText] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [languageMode, setLanguageMode] = useState<LanguageMode>("hinglish");
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("medium");
  const [useCombinedAI, setUseCombinedAI] = useState(true);
  const [lastApiUsed, setLastApiUsed] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { stats, recordCall, recordImageGeneration } = useAIUsageStats();
  
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
    onDone: (apiUsed?: string) => void,
    language: LanguageMode = "hinglish",
    roast: RoastLevel = "medium",
    useCombined: boolean = true
  ) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: messagesToSend.map(m => ({ role: m.role, content: m.content })),
        language,
        roastLevel: roast,
        useCombined
      }),
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
    let detectedApiUsed: string | undefined;

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
          if (parsed.apiUsed) {
            detectedApiUsed = parsed.apiUsed;
          }
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    onDone(detectedApiUsed);
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
        recordImageGeneration();
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
        async (apiUsed?: string) => {
          setIsLoading(false);
          if (apiUsed) {
            setLastApiUsed(apiUsed);
            recordCall(apiUsed as "gemini" | "lovable" | "combined");
          }
          if (user && convId && assistantSoFar) {
            await saveMessage(convId, { role: "assistant", content: assistantSoFar });
          }
        },
        languageMode,
        roastLevel,
        useCombinedAI
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
    toast({ title: "Copied! 📋", description: "Message copied to clipboard" });
  };

  const copyCodeToClipboard = (code: string, blockId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeBlock(blockId);
    setTimeout(() => setCopiedCodeBlock(null), 2000);
    toast({ title: "Code Copied! 📋", description: "Code block copied to clipboard" });
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
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            AI-Powered Assistant
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-foreground mb-2 sm:mb-4">
            PruthviAI Assistant 🤖
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-2">
            Arre yaar! Main hoon tumhara coding buddy! 💪 Koi bhi sawaal poocho - debugging se lekar jokes tak! 😂
          </p>
          
          {/* Controls Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            {/* Settings Button */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs sm:text-sm">
                  <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    AI Settings
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Language/Mode Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      AI Mode / Language
                    </Label>
                    <Select value={languageMode} onValueChange={(v) => setLanguageMode(v as LanguageMode)}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {languageOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{opt.label}</span>
                              <span className="text-xs text-muted-foreground">{opt.desc}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Roast Level Slider - Only show for Hinglish/Gujlish */}
                  {(languageMode === "hinglish" || languageMode === "gujlish") && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        Roast Level
                      </Label>
                      <div className="px-2">
                        <Slider
                          value={[roastLevel === "mild" ? 0 : roastLevel === "medium" ? 50 : 100]}
                          onValueChange={(v) => {
                            if (v[0] <= 33) setRoastLevel("mild");
                            else if (v[0] <= 66) setRoastLevel("medium");
                            else setRoastLevel("spicy");
                          }}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>😊 Mild</span>
                          <span>😏 Medium</span>
                          <span>🔥 Spicy</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border">
                        <p className="text-sm text-center">
                          {roastLevel === "mild" && "Friendly & supportive vibes only! 🤗"}
                          {roastLevel === "medium" && "Light teasing with lots of love! 😏"}
                          {roastLevel === "spicy" && "Full desi roasts incoming! 🔥🌶️"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Combined AI Toggle */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Use Combined AI
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Use both Gemini + Lovable AI for better results
                        </p>
                      </div>
                      <Switch
                        checked={useCombinedAI}
                        onCheckedChange={setUseCombinedAI}
                      />
                    </div>
                  </div>

                  {/* Model Info */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Current Configuration
                    </Label>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border text-sm space-y-1">
                      <p><strong>Mode:</strong> {languageOptions.find(l => l.value === languageMode)?.label}</p>
                      {(languageMode === "hinglish" || languageMode === "gujlish") && (
                        <p><strong>Roast:</strong> {roastLevelOptions.find(r => r.value === roastLevel)?.label}</p>
                      )}
                      <p><strong>AI Mode:</strong> {useCombinedAI ? "🚀 Combined (Gemini + Lovable)" : "⚡ Single API"}</p>
                      {lastApiUsed && (
                        <p><strong>Last API Used:</strong> <Badge variant="outline" className="ml-1 text-xs">
                          {lastApiUsed === "combined" ? "🔥 Both APIs" : lastApiUsed === "gemini" ? "💎 Gemini" : "💜 Lovable"}
                        </Badge></p>
                      )}
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      Today's Usage Stats
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                        <div className="text-2xl font-bold text-green-500">{stats.today.totalCalls}</div>
                        <div className="text-xs text-muted-foreground">Total Calls</div>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-center">
                        <div className="text-2xl font-bold text-blue-500">{stats.today.imageGenerations}</div>
                        <div className="text-xs text-muted-foreground">Images</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          Gemini (Free)
                        </span>
                        <span className="font-medium">{stats.today.geminiCalls}</span>
                      </div>
                      <Progress value={stats.today.totalCalls ? (stats.today.geminiCalls / stats.today.totalCalls) * 100 : 0} className="h-1.5" />
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                          Lovable AI
                        </span>
                        <span className="font-medium">{stats.today.lovableCalls}</span>
                      </div>
                      <Progress value={stats.today.totalCalls ? (stats.today.lovableCalls / stats.today.totalCalls) * 100 : 0} className="h-1.5" />
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                          Combined (Both)
                        </span>
                        <span className="font-medium">{stats.today.combinedCalls}</span>
                      </div>
                      <Progress value={stats.today.totalCalls ? (stats.today.combinedCalls / stats.today.totalCalls) * 100 : 0} className="h-1.5" />
                    </div>
                    
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      💡 Combined mode uses both APIs for smarter responses!
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Quick Mode Pills */}
            <div className="flex items-center gap-1.5">
              {languageOptions.slice(0, 3).map((opt) => (
                <Button
                  key={opt.value}
                  variant={languageMode === opt.value ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2.5 text-xs"
                  onClick={() => setLanguageMode(opt.value as LanguageMode)}
                >
                  {opt.label.split(" ")[0]}
                </Button>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <Link to="/chat">
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </Button>
              </Link>
              {user && (
                <Sheet open={showHistory} onOpenChange={setShowHistory}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                      <History className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">History</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72 sm:w-80">
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
          
          {/* Mode & Roast Badge */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              languageMode.includes("coding") || languageMode === "debug-expert"
                ? "bg-blue-500/10 text-blue-500" 
                : languageMode === "gujlish"
                ? "bg-orange-500/10 text-orange-500"
                : "bg-green-500/10 text-green-500"
            }`}>
              <Zap className="h-3 w-3" />
              {languageOptions.find(l => l.value === languageMode)?.label || "Hinglish Mode"}
            </span>
            {(languageMode === "hinglish" || languageMode === "gujlish") && (
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                roastLevel === "mild" 
                  ? "bg-emerald-500/10 text-emerald-500" 
                  : roastLevel === "medium"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
              }`}>
                <Flame className="h-3 w-3" />
                {roastLevelOptions.find(r => r.value === roastLevel)?.label}
              </span>
            )}
          </div>
        </div>

        {/* Fun Fact Banner */}
        {messages.length === 0 && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {funFacts[Math.floor(Math.random() * funFacts.length)]}
            </p>
          </div>
        )}

        {/* Chat Container */}
        <Card className="border-border/50">
          <CardContent className="p-0">
            {/* Chat Messages */}
            <ScrollArea className="h-[350px] sm:h-[450px] md:h-[500px] p-3 sm:p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
                  <div className="p-3 sm:p-4 rounded-full bg-primary/10 mb-3 sm:mb-4 animate-bounce">
                    <Bot className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    {languageMode === "gujlish" ? "Kem cho! 🙏 Su madad karu?" : languageMode === "coding" ? "Ready to code! 💻" : "Namaste! 🙏 Kya help chahiye aaj?"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 sm:mb-6 max-w-sm px-2">
                    {languageMode === "gujlish" 
                      ? "Coding, debugging, jokes - badhu j aave che! Topa nai thavu! 🦁" 
                      : languageMode === "coding"
                      ? "Ask any technical question. I'll give you clean, production-ready code."
                      : "Coding, debugging, jokes, ya image generation - sab milega yahan! 🚀"}
                  </p>
                  <div className="grid grid-cols-2 gap-2 w-full max-w-lg px-2">
                    {suggestedPrompts.map((prompt) => (
                      <Button
                        key={prompt.text}
                        variant="outline"
                        className="text-left h-auto py-2 sm:py-3 px-2 sm:px-4 justify-start hover:bg-primary/5 hover:border-primary/50"
                        onClick={() => handleSend(prompt.text)}
                      >
                        <span className="mr-1 sm:mr-2 text-sm sm:text-base">{prompt.icon}</span>
                        <span className="text-[10px] sm:text-xs truncate">{prompt.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 shrink-0">
                        <AvatarFallback className={msg.role === "user" ? "bg-primary text-primary-foreground text-xs" : "bg-gradient-to-br from-primary to-accent text-white text-xs"}>
                          {msg.role === "user" ? <User className="h-3 w-3 sm:h-4 sm:w-4" /> : <Bot className="h-3 w-3 sm:h-4 sm:w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 max-w-[90%] sm:max-w-[85%] ${msg.role === "user" ? "text-right" : ""}`}>
                        <div
                          className={`inline-block rounded-2xl px-3 py-2 sm:px-4 sm:py-2 ${
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
                          <div className="text-xs sm:text-sm prose prose-sm dark:prose-invert max-w-none break-words prose-p:my-1 prose-headings:my-2 prose-strong:text-foreground prose-strong:font-bold">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                strong: ({ children }) => (
                                  <strong className="font-bold text-foreground">{children}</strong>
                                ),
                                em: ({ children }) => (
                                  <em className="italic">{children}</em>
                                ),
                                p: ({ children }) => (
                                  <p className="my-1 leading-relaxed">{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
                                ),
                                li: ({ children }) => (
                                  <li className="leading-relaxed">{children}</li>
                                ),
                                code({ className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || "");
                                  const codeString = String(children).replace(/\n$/, "");
                                  const isInline = !match;
                                  const blockId = `code-${index}-${codeString.slice(0, 20)}`;
                                  
                                  if (isInline) {
                                    return (
                                      <code className="bg-background/50 px-1.5 py-0.5 rounded text-xs font-mono text-primary" {...props}>
                                        {children}
                                      </code>
                                    );
                                  }
                                  
                                  return (
                                    <div className="relative group my-3 -mx-2 sm:mx-0 max-w-[calc(100vw-4rem)] sm:max-w-none overflow-hidden rounded-lg border border-border">
                                      <div className="flex items-center justify-between bg-muted/80 px-3 py-2 border-b border-border">
                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{match[1]}</span>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs gap-1.5 hover:bg-background"
                                            onClick={() => copyCodeToClipboard(codeString, blockId)}
                                          >
                                            {copiedCodeBlock === blockId ? (
                                              <>
                                                <Check className="h-3 w-3 text-green-500" />
                                                <span className="hidden sm:inline text-green-500">Copied!</span>
                                              </>
                                            ) : (
                                              <>
                                                <Copy className="h-3 w-3" />
                                                <span className="hidden sm:inline">Copy</span>
                                              </>
                                            )}
                                          </Button>
                                          {(match[1] === "javascript" || match[1] === "js") && (
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 px-2 text-xs gap-1 hover:bg-background"
                                              onClick={() => executeCode(codeString, match[1])}
                                            >
                                              ▶️ <span className="hidden sm:inline">Run</span>
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                      <div className="overflow-x-auto">
                                        <SyntaxHighlighter
                                          style={oneDark}
                                          language={match[1]}
                                          PreTag="div"
                                          className="!mt-0 !rounded-t-none !text-xs sm:!text-sm !m-0"
                                          customStyle={{
                                            margin: 0,
                                            padding: '1rem',
                                            background: 'hsl(var(--background))',
                                            fontSize: 'inherit',
                                          }}
                                          codeTagProps={{
                                            style: {
                                              fontFamily: 'JetBrains Mono, monospace',
                                            }
                                          }}
                                        >
                                          {codeString}
                                        </SyntaxHighlighter>
                                      </div>
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
                          <div className="flex items-center gap-0.5 sm:gap-1 mt-1 flex-wrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 sm:h-7 px-1.5 sm:px-2 ${msg.reaction === "like" ? "text-green-500" : "text-muted-foreground"}`}
                              onClick={() => handleReaction(index, "like")}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-6 sm:h-7 px-1.5 sm:px-2 ${msg.reaction === "dislike" ? "text-red-500" : "text-muted-foreground"}`}
                              onClick={() => handleReaction(index, "dislike")}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 sm:h-7 px-1.5 sm:px-2 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRegenerate(index)}
                              disabled={isLoading}
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 sm:h-7 px-1.5 sm:px-2 text-muted-foreground hover:text-foreground"
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
                    <div className="flex gap-2 sm:gap-3">
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs">
                          <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2">
                        {isGeneratingImage ? (
                          <>
                            <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse text-primary" />
                            <span className="text-xs sm:text-sm text-muted-foreground">Image bana raha hoon... 🎨</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{typingText || "Typing..."}</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border p-2 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="shrink-0 text-muted-foreground hover:text-destructive h-8 w-8 sm:h-9 sm:w-9"
                    title="Clear chat"
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                )}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={languageMode === "gujlish" ? "Bol bhai, su madad karu? 🦁" : languageMode === "coding" ? "Ask any coding question..." : "Poocho kuch bhi... 🚀"}
                  disabled={isLoading}
                  className="flex-1 text-sm h-9 sm:h-10"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 bg-gradient-primary h-8 w-8 sm:h-10 sm:w-10 p-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center px-2">
                {languageMode === "gujlish" 
                  ? "PruthviAI kabhi bhool kari shake! Important info verify karje 🙏 | Fafda power! 🫓"
                  : languageMode === "coding"
                  ? "PruthviAI may make mistakes. Always verify important code. 💻"
                  : "PruthviAI kabhi kabhi galti kar sakta hai yaar! Important info verify karna 🙏"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AIAssistant;
