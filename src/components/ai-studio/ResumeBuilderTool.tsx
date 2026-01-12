import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Loader2, Copy, Download, Sparkles } from "lucide-react";
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <FileText className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Resume Builder
              <Badge variant="default" className="text-xs">FREE</Badge>
            </CardTitle>
            <CardDescription>
              Create a professional resume with AI assistance
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Resume Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
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
                <Label htmlFor="title">Current Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetRole">Target Role</Label>
                <Input
                  id="targetRole"
                  value={formData.targetRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                  placeholder="Senior Developer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience *</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Describe your work experience, key achievements, and responsibilities..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="List your skills (e.g., JavaScript, React, Project Management...)"
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Textarea
                id="education"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                placeholder="Your educational background..."
                rows={2}
                className="resize-none"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !formData.name.trim() || !formData.experience.trim()}
              className="w-full gap-2"
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
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Generated Resume</Label>
              {generatedResume && (
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCopy} 
                    variant="ghost" 
                    size="sm"
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button 
                    onClick={handleDownload} 
                    variant="ghost" 
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
            <Textarea
              value={generatedResume}
              onChange={(e) => setGeneratedResume(e.target.value)}
              placeholder="Your AI-generated resume will appear here..."
              rows={18}
              className="resize-none font-mono text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
