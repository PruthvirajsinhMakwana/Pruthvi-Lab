import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Copy, Download, Sparkles, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const resumeStyles = [
  { id: "professional", name: "Professional" },
  { id: "creative", name: "Creative" },
  { id: "minimal", name: "Minimal" },
  { id: "modern", name: "Modern" },
];

export function ResumeBuilderTool() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    experience: "",
    skills: "",
    education: "",
    targetRole: "",
  });
  const [style, setStyle] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");

  const handleGenerate = async () => {
    if (!formData.name.trim() || !formData.experience.trim()) {
      toast.error("Please fill in at least your name and experience");
      return;
    }

    setIsGenerating(true);
    setGeneratedResume("");

    try {
      const prompt = `Create a ${style} resume for:
Name: ${formData.name}
Target Role: ${formData.targetRole || "Not specified"}
Current/Previous Title: ${formData.title}

Experience:
${formData.experience}

Skills:
${formData.skills}

Education:
${formData.education}

Format it professionally with clear sections. Include a compelling professional summary at the top. Make it ATS-friendly.`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { 
          messages: [{ role: "user", content: prompt }],
          language: "writing",
        },
      });

      if (error) throw error;

      if (data?.content) {
        setGeneratedResume(data.content);
        toast.success("Resume generated!");
      }
    } catch (error: any) {
      console.error("Error generating resume:", error);
      toast.error(error.message || "Failed to generate resume");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResume);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([generatedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formData.name.replace(/\s+/g, "_")}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Resume downloaded!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Resume Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resumeStyles.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Current Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Software Engineer"
                className="bg-background/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRole" className="text-sm font-medium">Target Role</Label>
              <Input
                id="targetRole"
                value={formData.targetRole}
                onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                placeholder="Senior Developer"
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm font-medium">Experience *</Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Describe your work experience, key achievements..."
              rows={4}
              className="resize-none bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills" className="text-sm font-medium">Skills</Label>
            <Textarea
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="JavaScript, React, Project Management..."
              rows={2}
              className="resize-none bg-background/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education" className="text-sm font-medium">Education</Label>
            <Textarea
              id="education"
              value={formData.education}
              onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
              placeholder="Your educational background..."
              rows={2}
              className="resize-none bg-background/50 border-border/50"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !formData.name.trim() || !formData.experience.trim()}
            className="w-full gap-2 h-11 font-medium"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Resume...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Resume
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Generated Resume</Label>
            {generatedResume && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleCopy} 
                  variant="ghost" 
                  size="sm"
                  className="gap-2 h-8"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </Button>
                <Button 
                  onClick={handleDownload} 
                  variant="ghost" 
                  size="sm"
                  className="gap-2 h-8"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            )}
          </div>
          
          {generatedResume ? (
            <Textarea
              value={generatedResume}
              onChange={(e) => setGeneratedResume(e.target.value)}
              rows={20}
              className="resize-none bg-background/50 border-border/50 font-mono text-sm leading-relaxed"
            />
          ) : (
            <div className="h-[500px] rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
                <div className="p-4 rounded-2xl bg-muted/50">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium">No resume yet</p>
                  <p className="text-xs mt-1">Your AI-generated resume will appear here</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
