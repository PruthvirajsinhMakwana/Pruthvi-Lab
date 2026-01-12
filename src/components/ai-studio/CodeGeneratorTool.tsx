import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, Loader2, Copy, Sparkles, RotateCcw } from "lucide-react";
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
  "Create a function to validate email addresses",
  "Write a binary search algorithm",
  "Create a REST API endpoint for user authentication",
  "Build a React hook for fetching data",
  "Write a SQL query to find duplicate records",
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
        // Parse code blocks from response
        const codeMatch = data.content.match(/```[\w]*\n([\s\S]*?)```/);
        if (codeMatch) {
          setGeneratedCode(codeMatch[1].trim());
          // Get explanation (text after code block)
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Code2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Code Generator
              <Badge variant="default" className="text-xs">FREE</Badge>
            </CardTitle>
            <CardDescription>
              Generate code snippets in any programming language
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Programming Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="code-prompt">Describe what you need</Label>
              <Textarea
                id="code-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a function that sorts an array of objects by a specific property..."
                rows={5}
                className="resize-none"
              />
            </div>

            {/* Example Prompts */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Try an example:</Label>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.slice(0, 3).map((example, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => setPrompt(example)}
                  >
                    {example.slice(0, 35)}...
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !prompt.trim()}
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
                    Generate Code
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
              <Label>Generated Code</Label>
              {generatedCode && (
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
            
            <div className="rounded-lg overflow-hidden border bg-muted/50 max-h-80 overflow-y-auto">
              {generatedCode ? (
                <SyntaxHighlighter
                  language={language}
                  style={oneDark}
                  customStyle={{ 
                    margin: 0, 
                    borderRadius: 0,
                    fontSize: '0.8rem'
                  }}
                  wrapLines
                  wrapLongLines
                >
                  {generatedCode}
                </SyntaxHighlighter>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Code2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Generated code will appear here</p>
                </div>
              )}
            </div>

            {explanation && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Explanation</Label>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
