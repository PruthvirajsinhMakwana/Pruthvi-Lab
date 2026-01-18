import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, RotateCcw, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const contentTypes = [
  { id: "blog", name: "Blog Post", prompt: "Write a professional blog post about" },
  { id: "social", name: "Social Media", prompt: "Write engaging social media content about" },
  { id: "email", name: "Email", prompt: "Write a professional email about" },
  { id: "product", name: "Product Description", prompt: "Write a compelling product description for" },
  { id: "story", name: "Story", prompt: "Write a creative short story about" },
  { id: "essay", name: "Essay", prompt: "Write an informative essay about" },
];

const tones = [
  { id: "professional", name: "Professional" },
  { id: "casual", name: "Casual" },
  { id: "friendly", name: "Friendly" },
  { id: "persuasive", name: "Persuasive" },
  { id: "humorous", name: "Humorous" },
];

export function WritingAssistantTool() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const selectedType = contentTypes.find(t => t.id === contentType);
      const fullPrompt = `${selectedType?.prompt} "${topic}". Use a ${tone} tone. Make it engaging and well-structured.`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { 
          messages: [{ role: "user", content: fullPrompt }],
          language: "writing",
        },
      });

      if (error) throw error;

      if (data?.content) {
        setGeneratedContent(data.content);
        toast.success("Content generated!");
      }
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Copied to clipboard!");
  };

  const handleReset = () => {
    setTopic("");
    setGeneratedContent("");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="topic" className="text-sm font-medium">Topic or Description</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The benefits of remote work for productivity..."
              rows={8}
              className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !topic.trim()}
              className="flex-1 gap-2 h-11 font-medium"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline"
              size="lg"
              disabled={isGenerating}
              className="h-11"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Generated Content</Label>
            {generatedContent && (
              <Button 
                onClick={handleCopy} 
                variant="ghost" 
                size="sm"
                className="gap-2 h-8"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            )}
          </div>
          
          {generatedContent ? (
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={16}
              className="resize-none bg-background/50 border-border/50 font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="h-[400px] rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
                <div className="p-4 rounded-2xl bg-muted/50">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium">No content yet</p>
                  <p className="text-xs mt-1">Your AI-generated content will appear here</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
