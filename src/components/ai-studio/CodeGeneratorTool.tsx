import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Loader2, Copy, Sparkles, RotateCcw, Terminal } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const languages = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "cpp", name: "C++" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "php", name: "PHP" },
  { id: "ruby", name: "Ruby" },
  { id: "swift", name: "Swift" },
  { id: "kotlin", name: "Kotlin" },
  { id: "sql", name: "SQL" },
  { id: "html", name: "HTML/CSS" },
];

const examplePrompts = [
  "Validate email addresses",
  "Binary search algorithm",
  "REST API for auth",
];

export function CodeGeneratorTool() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [explanation, setExplanation] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what code you need");
      return;
    }

    setIsGenerating(true);
    setGeneratedCode("");
    setExplanation("");

    try {
      const fullPrompt = `Generate ${language} code for: ${prompt}

Please provide:
1. The complete, working code
2. A brief explanation of how it works

Format your response with the code first (in a code block), then the explanation.`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { 
          messages: [{ role: "user", content: fullPrompt }],
          language: "coding",
        },
      });

      if (error) throw error;

      if (data?.content) {
        const codeMatch = data.content.match(/```[\w]*\n([\s\S]*?)```/);
        if (codeMatch) {
          setGeneratedCode(codeMatch[1].trim());
          const explanationText = data.content.replace(/```[\w]*\n[\s\S]*?```/, "").trim();
          setExplanation(explanationText);
        } else {
          setGeneratedCode(data.content);
        }
        toast.success("Code generated!");
      }
    } catch (error: any) {
      console.error("Error generating code:", error);
      toast.error(error.message || "Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Code copied to clipboard!");
  };

  const handleReset = () => {
    setPrompt("");
    setGeneratedCode("");
    setExplanation("");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Programming Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="code-prompt" className="text-sm font-medium">Describe what you need</Label>
            <Textarea
              id="code-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a function that sorts an array of objects by a specific property..."
              rows={6}
              className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Example Prompts */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick examples:</Label>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5 px-3 bg-background/50 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
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
                  Generate Code
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
            <Label className="text-sm font-medium">Generated Code</Label>
            {generatedCode && (
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
          
          <div className="rounded-xl overflow-hidden border border-border/50 bg-[#282c34]">
            {generatedCode ? (
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                <SyntaxHighlighter
                  language={language}
                  style={oneDark}
                  customStyle={{ 
                    margin: 0, 
                    borderRadius: 0,
                    fontSize: '0.8rem',
                    background: 'transparent'
                  }}
                  wrapLines
                  wrapLongLines
                >
                  {generatedCode}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="p-10 text-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <div className="p-4 rounded-2xl bg-muted/20">
                    <Terminal className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No code yet</p>
                    <p className="text-xs mt-1">Generated code will appear here</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {explanation && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Explanation</Label>
              <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/50 leading-relaxed">
                {explanation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
