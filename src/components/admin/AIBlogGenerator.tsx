import { useState } from "react";
import { Sparkles, Loader2, Wand2, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  keywords: string[];
}

const BLOG_CATEGORIES = [
  { value: "ai-video", label: "AI Video Creation" },
  { value: "youtube-automation", label: "YouTube Automation" },
  { value: "content-repurposing", label: "Content Repurposing" },
  { value: "ai-tools", label: "AI Tools & Software" },
  { value: "trading", label: "Trading & Finance" },
  { value: "prompt-engineering", label: "Prompt Engineering" },
  { value: "social-media", label: "Social Media Marketing" },
  { value: "automation", label: "Workflow Automation" },
];

const BLOG_TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual & Friendly" },
  { value: "tutorial", label: "Step-by-Step Tutorial" },
  { value: "listicle", label: "Listicle Format" },
  { value: "story", label: "Story-Based" },
];

export function AIBlogGenerator({ onGenerated }: { onGenerated: (blog: GeneratedBlog) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("tutorial");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState<GeneratedBlog | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateBlog = async () => {
    if (!topic.trim()) {
      toast({ title: "Please enter a topic", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-content-generator", {
        body: {
          type: "blog",
          data: {
            topic,
            category,
            tone,
            additionalNotes,
          },
        },
      });

      if (error) throw error;

      const blog = data as GeneratedBlog;
      setGeneratedBlog(blog);
      toast({ title: "Blog generated successfully!" });
    } catch (error) {
      console.error("Error generating blog:", error);
      toast({
        title: "Failed to generate blog",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseContent = () => {
    if (generatedBlog) {
      onGenerated(generatedBlog);
      setOpen(false);
      setGeneratedBlog(null);
      setTopic("");
      setCategory("");
      setAdditionalNotes("");
    }
  };

  const handleCopy = async () => {
    if (generatedBlog) {
      await navigator.clipboard.writeText(generatedBlog.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    setGeneratedBlog(null);
    generateBlog();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Blog Generator
          </DialogTitle>
          <DialogDescription>
            Generate SEO-optimized blog posts with AI. Just enter your topic and let AI do the work.
          </DialogDescription>
        </DialogHeader>

        {!generatedBlog ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Blog Topic *</Label>
              <Input
                id="topic"
                placeholder="e.g., How to create AI-generated videos for YouTube"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Writing Style</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_TONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Instructions (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific points to include, target audience, keywords to focus on..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={generateBlog} disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Blog
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{generatedBlog.title}</CardTitle>
                <CardDescription>{generatedBlog.excerpt}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedBlog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 max-h-[300px] overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {generatedBlog.content.slice(0, 1500)}
                    {generatedBlog.content.length > 1500 && "..."}
                  </pre>
                </div>
                
                {generatedBlog.keywords && generatedBlog.keywords.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground">SEO Keywords:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generatedBlog.keywords.map((kw) => (
                        <Badge key={kw} variant="outline" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1" />
                  )}
                  {copied ? "Copied!" : "Copy Content"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                  Regenerate
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUseContent} className="gap-2">
                  <Check className="h-4 w-4" />
                  Use This Content
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
