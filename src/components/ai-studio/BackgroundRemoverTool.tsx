import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Eraser, Loader2, Download, Upload, ImageIcon } from "lucide-react";
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Eraser className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Background Remover
              <Badge variant="default" className="text-xs">FREE</Badge>
            </CardTitle>
            <CardDescription>
              Remove backgrounds from images using AI - perfect for product photos and portraits
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                {originalImage ? (
                  <img 
                    src={originalImage} 
                    alt="Original" 
                    className="max-h-48 mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                    <Upload className="h-10 w-10" />
                    <p className="text-sm font-medium">Click to upload an image</p>
                    <p className="text-xs">PNG, JPG up to 5MB</p>
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

            {originalImage && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setOriginalImage(null);
                  setProcessedImage(null);
                }}
              >
                Clear Image
              </Button>
            )}

            <Button 
              onClick={handleRemoveBackground} 
              disabled={isProcessing || !originalImage}
              className="w-full gap-2"
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

            <p className="text-xs text-muted-foreground text-center">
              Works best with clear subjects and distinct backgrounds
            </p>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <Label>Result</Label>
            <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXJib2FyZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCBmaWxsPSIjZjBmMGYwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZTBlMGUwIiB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgZmlsbD0iI2UwZTBlMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IGZpbGw9IiNmMGYwZjAiIHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2NoZWNrZXJib2FyZCkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] flex items-center justify-center overflow-hidden">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm">Removing background...</p>
                </div>
              ) : processedImage ? (
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground p-4 text-center bg-background/80 rounded-lg">
                  <ImageIcon className="h-8 w-8" />
                  <p className="text-sm">Processed image will appear here</p>
                  <p className="text-xs">Transparent background shown as checkerboard</p>
                </div>
              )}
            </div>

            {processedImage && (
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
