import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2, Download, Upload, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const editExamples = [
  "Make it look like sunset",
  "Add snow falling",
  "Make it vintage",
  "Add a rainbow",
  "More colorful",
];

export function ImageEditorTool() {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
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
      setEditedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = async () => {
    if (!originalImage) {
      toast.error("Please upload an image first");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please describe the edit you want");
      return;
    }

    setIsProcessing(true);
    setEditedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke("ai-image", {
        body: { 
          prompt, 
          action: "edit",
          imageUrl: originalImage 
        },
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setEditedImage(data.imageUrl);
        toast.success("Image edited successfully!");
      } else {
        throw new Error("No image returned");
      }
    } catch (error: any) {
      console.error("Error editing image:", error);
      toast.error(error.message || "Failed to edit image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;
    
    const link = document.createElement("a");
    link.href = editedImage;
    link.download = `ai-edited-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const clearImage = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setPrompt("");
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
                    className="max-h-48 mx-auto rounded-lg object-contain"
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
                <div className="flex flex-col items-center gap-3 py-6 text-muted-foreground">
                  <div className="p-3 rounded-xl bg-muted/50">
                    <Upload className="h-6 w-6" />
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

          {/* Edit Prompt */}
          <div className="space-y-3">
            <Label htmlFor="edit-prompt" className="text-sm font-medium">Describe the edit</Label>
            <Textarea
              id="edit-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Make it look like a watercolor painting..."
              rows={3}
              className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Example Edits */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick edits:</Label>
            <div className="flex flex-wrap gap-2">
              {editExamples.map((example, i) => (
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

          <Button 
            onClick={handleEdit} 
            disabled={isProcessing || !originalImage || !prompt.trim()}
            className="w-full gap-2 h-11 font-medium"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Editing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Apply Edit
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <Label className="text-sm font-medium">Edited Result</Label>
          <div className="aspect-square rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center overflow-hidden">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                  <div className="relative p-4 rounded-2xl bg-violet-500/10">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                  </div>
                </div>
                <p className="text-sm font-medium">Applying your edits...</p>
              </div>
            ) : editedImage ? (
              <img 
                src={editedImage} 
                alt="Edited" 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
                <div className="p-4 rounded-2xl bg-muted/50">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium">No result yet</p>
                  <p className="text-xs mt-1">Edited image will appear here</p>
                </div>
              </div>
            )}
          </div>

          {editedImage && (
            <Button 
              onClick={handleDownload} 
              variant="outline" 
              className="w-full gap-2 h-10"
            >
              <Download className="h-4 w-4" />
              Download Edited Image
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
