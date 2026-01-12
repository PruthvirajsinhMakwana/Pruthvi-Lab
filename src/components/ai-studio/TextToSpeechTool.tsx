import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Loader2, Play, Pause, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const voices = [
  { id: "alloy", name: "Alloy", description: "Neutral and balanced" },
  { id: "echo", name: "Echo", description: "Warm and conversational" },
  { id: "fable", name: "Fable", description: "Narrative storyteller" },
  { id: "onyx", name: "Onyx", description: "Deep and authoritative" },
  { id: "nova", name: "Nova", description: "Youthful and bright" },
  { id: "shimmer", name: "Shimmer", description: "Soft and soothing" },
];

export function TextToSpeechTool() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voice }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setHasApiKey(true);
      toast.success("Audio generated!");
    } catch (error: any) {
      console.error("Error generating audio:", error);
      if (error.message?.includes("API key") || error.message?.includes("not configured")) {
        setHasApiKey(false);
      }
      toast.error(error.message || "Failed to generate audio. API key may not be configured.");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => setIsPlaying(false);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `speech-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audio downloaded!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Volume2 className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Text to Speech
              <Badge variant="secondary" className="text-xs">API</Badge>
            </CardTitle>
            <CardDescription>
              Convert text to natural-sounding speech using ElevenLabs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This tool requires an ElevenLabs API key. Connect your ElevenLabs account to use this feature.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Voice</Label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex flex-col">
                        <span>{v.name}</span>
                        <span className="text-xs text-muted-foreground">{v.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tts-text">Text to Convert</Label>
              <Textarea
                id="tts-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {text.length} characters
              </p>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !text.trim()}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Speech...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Generate Speech
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <Label>Generated Audio</Label>
            <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex items-center justify-center">
              {audioUrl ? (
                <div className="flex flex-col items-center gap-4 p-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Volume2 className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Audio ready to play</p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={togglePlayback} 
                      variant="default"
                      className="gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleDownload} 
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground p-4 text-center">
                  <Volume2 className="h-8 w-8" />
                  <p className="text-sm">Generated audio will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
