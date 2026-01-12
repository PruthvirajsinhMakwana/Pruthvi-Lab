import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenTool, Loader2, Copy, RotateCcw, Sparkles } from "lucide-react";
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

      // Handle streaming response
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <PenTool className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Writing Assistant
              <Badge variant="default" className="text-xs">FREE</Badge>
            </CardTitle>
            <CardDescription>
              Generate blog posts, emails, social content, and more with AI
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
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
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="topic">Topic or Description</Label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The benefits of remote work for productivity..."
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !topic.trim()}
                className="flex-1 gap-2"
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
                disabled={isGenerating}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Generated Content</Label>
              {generatedContent && (
                <Button 
                  onClick={handleCopy} 
                  variant="ghost" 
                  size="sm"
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              placeholder="Your AI-generated content will appear here..."
              rows={12}
              className="resize-none font-mono text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
