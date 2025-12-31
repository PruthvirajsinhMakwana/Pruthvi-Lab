import { useState } from "react";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeneratedSnippet {
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
}

interface AISnippetGeneratorProps {
  onGenerated: (snippet: GeneratedSnippet) => void;
}

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "rust",
  "go",
  "java",
  "csharp",
  "cpp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "bash",
  "react",
  "nodejs",
];

export function AISnippetGenerator({ onGenerated }: AISnippetGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "javascript",
    code: "",
  });

  const handleGenerate = async () => {
    if (!formData.title) {
      toast.error("Please enter a title or feature name");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-content-generator", {
        body: {
          type: "snippet",
          data: formData,
        },
      });

      if (error) throw error;

      if (data.success && data.data) {
        toast.success("Code snippet generated successfully!");
        onGenerated(data.data);
        setOpen(false);
        setFormData({ title: "", description: "", language: "javascript", code: "" });
      } else {
        throw new Error(data.error || "Failed to generate snippet");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate snippet");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wand2 className="h-4 w-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Code Snippet Generator
          </DialogTitle>
        </DialogHeader>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>
              Describe what you need and AI will generate production-ready code with proper documentation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-snippet-title">Feature / Function Name</Label>
              <Input
                id="ai-snippet-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Debounce function, API fetch wrapper"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-snippet-desc">Description (optional)</Label>
              <Textarea
                id="ai-snippet-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details about what the code should do..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Programming Language</Label>
              <Select
                value={formData.language}
                onValueChange={(v) => setFormData({ ...formData, language: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-snippet-code">Reference Code (optional)</Label>
              <Textarea
                id="ai-snippet-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Paste existing code to improve or refactor..."
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Code...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Snippet
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
