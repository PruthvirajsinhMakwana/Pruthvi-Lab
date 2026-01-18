import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Sparkles, Wand2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const examplePrompts = [
  "A futuristic city at sunset with flying cars",
  "A cute robot playing guitar in a garden",
  "An astronaut riding a horse on Mars",
  "A magical forest with glowing mushrooms",
  "A steampunk owl wearing a top hat",
];

export function TextToImageTool() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-image", {
        body: { prompt, action: "generate" },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Image generated successfully!");
      } else {
        throw new Error("No image returned");
      }
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-3">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Describe your image
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains with a lake in the foreground..."
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
                  {example.slice(0, 28)}...
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !prompt.trim()}
            className="w-full gap-2 h-11 font-medium"
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
                Generate Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <Label className="text-sm font-medium">Generated Image</Label>
          <div className="aspect-square rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                  <div className="relative p-4 rounded-2xl bg-primary/10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </div>
                <p className="text-sm font-medium">Creating your masterpiece...</p>
              </div>
            ) : generatedImage ? (
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
                <div className="p-4 rounded-2xl bg-muted/50">
                  <ImagePlus className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium">No image yet</p>
                  <p className="text-xs mt-1">Your creation will appear here</p>
                </div>
              </div>
            )}
          </div>

          {generatedImage && (
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              className="w-full gap-2 h-10"
            >
              <Download className="h-4 w-4" />
              Download Image
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
