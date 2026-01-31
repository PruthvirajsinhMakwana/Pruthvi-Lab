import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PageSEO } from "@/components/PageSEO";
import { 
  Image, 
  PenTool, 
  FileText, 
  Music, 
  Volume2, 
  Code2,
  Sparkles,
  Wand2,
  Eraser,
  ChevronRight,
  Zap,
  Stars
} from "lucide-react";

// Tool Components
import { TextToImageTool } from "@/components/ai-studio/TextToImageTool";
import { ImageEditorTool } from "@/components/ai-studio/ImageEditorTool";
import { BackgroundRemoverTool } from "@/components/ai-studio/BackgroundRemoverTool";
import { WritingAssistantTool } from "@/components/ai-studio/WritingAssistantTool";
import { ResumeBuilderTool } from "@/components/ai-studio/ResumeBuilderTool";
import { CodeGeneratorTool } from "@/components/ai-studio/CodeGeneratorTool";
import { TextToSpeechTool } from "@/components/ai-studio/TextToSpeechTool";
import { MusicGeneratorTool } from "@/components/ai-studio/MusicGeneratorTool";

const tools = [
  { 
    id: "text-to-image", 
    name: "Text to Image", 
    icon: Image, 
    description: "Generate stunning images from text",
    badge: "FREE",
    badgeVariant: "default" as const,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-500/10",
    textColor: "text-pink-500"
  },
  { 
    id: "image-editor", 
    name: "Image Editor", 
    icon: Wand2, 
    description: "Transform images with AI prompts",
    badge: "FREE",
    badgeVariant: "default" as const,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-500/10",
    textColor: "text-violet-500"
  },
  { 
    id: "bg-remover", 
    name: "Background Remover", 
    icon: Eraser, 
    description: "Remove backgrounds instantly",
    badge: "FREE",
    badgeVariant: "default" as const,
    color: "from-cyan-500 to-blue-500",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-500"
  },
  { 
    id: "writing-assistant", 
    name: "Writing Assistant", 
    icon: PenTool, 
    description: "AI-powered content creation",
    badge: "FREE",
    badgeVariant: "default" as const,
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-500"
  },
  { 
    id: "resume-builder", 
    name: "Resume Builder", 
    icon: FileText, 
    description: "Create professional resumes",
    badge: "FREE",
    badgeVariant: "default" as const,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-500"
  },
  { 
    id: "code-generator", 
    name: "Code Generator", 
    icon: Code2, 
    description: "Generate code snippets",
    badge: "FREE",
    badgeVariant: "default" as const,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500"
  },
  { 
    id: "text-to-speech", 
    name: "Text to Speech", 
    icon: Volume2, 
    description: "Natural voice synthesis",
    badge: "API",
    badgeVariant: "secondary" as const,
    color: "from-fuchsia-500 to-pink-500",
    bgColor: "bg-fuchsia-500/10",
    textColor: "text-fuchsia-500"
  },
  { 
    id: "music-generator", 
    name: "Music & SFX", 
    icon: Music, 
    description: "Create music and sound effects",
    badge: "API",
    badgeVariant: "secondary" as const,
    color: "from-red-500 to-rose-500",
    bgColor: "bg-red-500/10",
    textColor: "text-red-500"
  },
];

const toolComponents: Record<string, React.ComponentType> = {
  "text-to-image": TextToImageTool,
  "image-editor": ImageEditorTool,
  "bg-remover": BackgroundRemoverTool,
  "writing-assistant": WritingAssistantTool,
  "resume-builder": ResumeBuilderTool,
  "code-generator": CodeGeneratorTool,
  "text-to-speech": TextToSpeechTool,
  "music-generator": MusicGeneratorTool,
};

export default function AIStudio() {
  const [activeTab, setActiveTab] = useState("text-to-image");
  const activeTool = tools.find(t => t.id === activeTab);
  const ActiveComponent = toolComponents[activeTab];

  return (
    <Layout>
      <PageSEO
        title="AI Studio - Free AI Tools for Creators"
        description="Create with AI at Pruthvi's Lab AI Studio. Free text-to-image, image editor, writing assistant, code generator, background remover, and more. Powered by Pruthvi Engine."
        keywords={["AI tools", "text to image", "AI image generator", "writing assistant", "code generator", "background remover", "AI studio", "free AI tools"]}
        url="https://dev-api-learn.lovable.app/ai-studio"
      />
      <div className="min-h-[calc(100vh-4rem)]">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-background via-background to-primary/5">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="container mx-auto px-4 py-8 lg:py-12 relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
                      <Sparkles className="h-7 w-7 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                        AI Studio
                      </h1>
                      <Badge variant="secondary" className="text-xs font-medium">
                        <Zap className="h-3 w-3 mr-1" />
                        Pro Tools
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base mt-1">
                      Powerful AI tools to supercharge your creativity
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-6 lg:gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{tools.length}</div>
                  <div className="text-xs text-muted-foreground">AI Tools</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{tools.filter(t => t.badge === "FREE").length}</div>
                  <div className="text-xs text-muted-foreground">Free Tools</div>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-foreground">
                    <Stars className="h-5 w-5 text-amber-500" />
                    Pro
                  </div>
                  <div className="text-xs text-muted-foreground">Quality</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-4">
                <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-4 border-b border-border/50">
                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-primary" />
                      Select Tool
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose an AI tool to get started
                    </p>
                  </div>
                  
                  {/* Mobile: Horizontal Scroll */}
                  <div className="lg:hidden overflow-x-auto">
                    <div className="flex gap-2 p-4">
                      {tools.map((tool) => (
                        <Button
                          key={tool.id}
                          variant={activeTab === tool.id ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "shrink-0 gap-2",
                            activeTab === tool.id && "shadow-md"
                          )}
                          onClick={() => setActiveTab(tool.id)}
                        >
                          <tool.icon className="h-4 w-4" />
                          <span>{tool.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Desktop: Vertical List */}
                  <ScrollArea className="hidden lg:block h-[calc(100vh-20rem)]">
                    <div className="p-2 space-y-1">
                      {tools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => setActiveTab(tool.id)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 group",
                            activeTab === tool.id 
                              ? "bg-primary/10 border border-primary/20" 
                              : "hover:bg-muted/50 border border-transparent"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            activeTab === tool.id ? tool.bgColor : "bg-muted group-hover:bg-muted/80"
                          )}>
                            <tool.icon className={cn(
                              "h-4 w-4 transition-colors",
                              activeTab === tool.id ? tool.textColor : "text-muted-foreground group-hover:text-foreground"
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-medium text-sm truncate transition-colors",
                                activeTab === tool.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                              )}>
                                {tool.name}
                              </span>
                              <Badge 
                                variant={tool.badge === "FREE" ? "default" : "secondary"} 
                                className="text-[10px] px-1.5 py-0 shrink-0"
                              >
                                {tool.badge}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {tool.description}
                            </p>
                          </div>
                          <ChevronRight className={cn(
                            "h-4 w-4 shrink-0 transition-all",
                            activeTab === tool.id 
                              ? "text-primary opacity-100" 
                              : "text-muted-foreground opacity-0 group-hover:opacity-100"
                          )} />
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                {/* Quick Tip */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/10">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-primary/20">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground">Pro Tip</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tools marked with "FREE" don't require any API keys. "API" tools need ElevenLabs configuration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Tool Content Area */}
            <main className="flex-1 min-w-0">
              {/* Tool Header */}
              {activeTool && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("p-2.5 rounded-xl", activeTool.bgColor)}>
                      <activeTool.icon className={cn("h-5 w-5", activeTool.textColor)} />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                        {activeTool.name}
                        <Badge 
                          variant={activeTool.badge === "FREE" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {activeTool.badge}
                        </Badge>
                      </h2>
                      <p className="text-sm text-muted-foreground">{activeTool.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tool Component */}
              <div className="animate-in fade-in-50 duration-300">
                {ActiveComponent && <ActiveComponent />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
}
