import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Image, Loader2, Download, Sparkles, Wand2 } from "lucide-react";
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-500/10">
            <Image className="h-5 w-5 text-pink-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Text to Image
              <Badge variant="default" className="text-xs">FREE</Badge>
            </CardTitle>
            <CardDescription>
              Generate stunning images from text descriptions using AI
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Describe your image</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A beautiful sunset over mountains with a lake in the foreground..."
                rows={5}
                className="resize-none"
              />
            </div>

            {/* Example Prompts */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Try an example:</Label>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
                    onClick={() => setPrompt(example)}
                  >
                    {example.slice(0, 30)}...
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full gap-2"
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
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <Label>Generated Image</Label>
            <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm">Creating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground p-4 text-center">
                  <Wand2 className="h-8 w-8" />
                  <p className="text-sm">Your generated image will appear here</p>
                </div>
              )}
            </div>

            {generatedImage && (
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                Download Image
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
