import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  PenTool, 
  FileText, 
  Music, 
  Volume2, 
  Code2,
  Sparkles,
  Wand2
} from "lucide-react";

// Tool Components
import { TextToImageTool } from "@/components/ai-studio/TextToImageTool";
import { ImageEditorTool } from "@/components/ai-studio/ImageEditorTool";
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
    description: "Generate images from text prompts",
    badge: "FREE",
    badgeVariant: "default" as const
  },
  { 
    id: "image-editor", 
    name: "Image Editor", 
    icon: Wand2, 
    description: "Edit images with AI prompts",
    badge: "FREE",
    badgeVariant: "default" as const
  },
  { 
    id: "writing-assistant", 
    name: "Writing Assistant", 
    icon: PenTool, 
    description: "AI-powered content writing",
    badge: "FREE",
    badgeVariant: "default" as const
  },
  { 
    id: "resume-builder", 
    name: "Resume Builder", 
    icon: FileText, 
    description: "Create professional resumes",
    badge: "FREE",
    badgeVariant: "default" as const
  },
  { 
    id: "code-generator", 
    name: "Code Generator", 
    icon: Code2, 
    description: "Generate code snippets",
    badge: "FREE",
    badgeVariant: "default" as const
  },
  { 
    id: "text-to-speech", 
    name: "Text to Speech", 
    icon: Volume2, 
    description: "Convert text to audio",
    badge: "API",
    badgeVariant: "secondary" as const
  },
  { 
    id: "music-generator", 
    name: "Music & SFX", 
    icon: Music, 
    description: "Generate music and sound effects",
    badge: "API",
    badgeVariant: "secondary" as const
  },
];

export default function AIStudio() {
  const [activeTab, setActiveTab] = useState("text-to-image");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              AI Studio
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Powerful AI tools at your fingertips. Generate images, write content, create music, and more - all powered by cutting-edge AI.
          </p>
        </div>

        {/* Tool Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile: Horizontal Scroll */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
            <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-xl gap-1 min-w-max">
              {tools.map((tool) => (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
                >
                  <tool.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tool.name}</span>
                  <Badge variant={tool.badgeVariant} className="text-[10px] px-1.5 py-0">
                    {tool.badge}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tool Content */}
          <TabsContent value="text-to-image" className="mt-0">
            <TextToImageTool />
          </TabsContent>

          <TabsContent value="image-editor" className="mt-0">
            <ImageEditorTool />
          </TabsContent>

          <TabsContent value="writing-assistant" className="mt-0">
            <WritingAssistantTool />
          </TabsContent>

          <TabsContent value="resume-builder" className="mt-0">
            <ResumeBuilderTool />
          </TabsContent>

          <TabsContent value="code-generator" className="mt-0">
            <CodeGeneratorTool />
          </TabsContent>

          <TabsContent value="text-to-speech" className="mt-0">
            <TextToSpeechTool />
          </TabsContent>

          <TabsContent value="music-generator" className="mt-0">
            <MusicGeneratorTool />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
