import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eraser, Loader2, Download, Upload, ImageIcon, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function BackgroundRemoverTool() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    setProcessedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-image", {
        body: { 
          prompt: "Remove the background from this image completely. Make the background transparent or white. Keep only the main subject/object in the foreground with clean edges.", 
          action: "remove-background",
          imageUrl: originalImage 
        },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setProcessedImage(data.imageUrl);
        toast.success("Background removed successfully!");
      } else {
        throw new Error("No image returned");
      }
    } catch (error: any) {
      console.error("Error removing background:", error);
      toast.error(error.message || "Failed to remove background");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `bg-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const clearImage = () => {
    setOriginalImage(null);
    setProcessedImage(null);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-5">
          {/* Upload Area */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Upload Image</Label>
            <div 
              onClick={() => !originalImage && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                originalImage 
                  ? "border-border/50 cursor-default" 
                  : "border-muted-foreground/25 cursor-pointer hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              {originalImage ? (
                <div className="relative">
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="max-h-52 mx-auto rounded-lg object-contain"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <Upload className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Click to upload an image</p>
                    <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Best Results</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Works best with clear subjects, product photos, and portraits with distinct backgrounds.
                </p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleRemoveBackground} 
            disabled={isProcessing || !originalImage}
            className="w-full gap-2 h-11 font-medium"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Removing Background...
              </>
            ) : (
              <>
                <Eraser className="h-4 w-4" />
                Remove Background
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <Label className="text-sm font-medium">Result</Label>
          <div 
            className="aspect-square rounded-xl border border-border/50 flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: processedImage ? `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXJib2FyZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCBmaWxsPSIjZjBmMGYwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZTBlMGUwIiB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgZmlsbD0iI2UwZTBlMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IGZpbGw9IiNmMGYwZjAiIHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2NoZWNrZXJib2FyZCkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=")` : undefined,
              backgroundColor: processedImage ? undefined : 'hsl(var(--muted) / 0.3)'
            }}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground bg-background/80 p-8 rounded-xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="relative p-4 rounded-2xl bg-cyan-500/10">
                    <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                  </div>
                </div>
                <p className="text-sm font-medium">Removing background...</p>
              </div>
            ) : processedImage ? (
              <img 
                src={processedImage} 
                alt="Processed" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
                <div className="p-4 rounded-2xl bg-muted/50">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium">No result yet</p>
                  <p className="text-xs mt-1">Transparent background shown as checkerboard</p>
                </div>
              </div>
            )}
          </div>

          {processedImage && (
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
