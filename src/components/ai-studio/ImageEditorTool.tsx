import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wand2, Loader2, Download, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const editExamples = [
  "Make it look like sunset",
  "Add snow falling",
  "Make it look vintage",
  "Add a rainbow in the sky",
  "Make it more colorful",
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Wand2 className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Image Editor
              <Badge variant="default" className="text-xs">FREE</Badge>
            </CardTitle>
            <CardDescription>
              Edit and transform images using natural language instructions
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
                  <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <p className="text-sm">Click to upload an image</p>
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

            {/* Edit Prompt */}
            <div className="space-y-2">
              <Label htmlFor="edit-prompt">Describe the edit</Label>
              <Textarea
                id="edit-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Make it look like a watercolor painting..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Example Edits */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Try an example:</Label>
              <div className="flex flex-wrap gap-2">
                {editExamples.map((example, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1 px-2"
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
              className="w-full gap-2"
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
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <Label>Edited Result</Label>
            <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center overflow-hidden">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm">Applying your edits...</p>
                </div>
              ) : editedImage ? (
                <img 
                  src={editedImage} 
                  alt="Edited" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground p-4 text-center">
                  <ImageIcon className="h-8 w-8" />
                  <p className="text-sm">Edited image will appear here</p>
                </div>
              )}
            </div>

            {editedImage && (
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                Download Edited Image
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
