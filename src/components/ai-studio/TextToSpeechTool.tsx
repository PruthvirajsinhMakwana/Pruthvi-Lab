import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Loader2, Play, Pause, Download, Info } from "lucide-react";
import { toast } from "sonner";

const voices = [
  { id: "alloy", name: "Sarah", description: "Neutral and balanced" },
  { id: "echo", name: "Charlie", description: "Warm and conversational" },
  { id: "fable", name: "Matilda", description: "Narrative storyteller" },
  { id: "onyx", name: "Daniel", description: "Deep and authoritative" },
  { id: "nova", name: "Lily", description: "Youthful and bright" },
  { id: "shimmer", name: "Brian", description: "Soft and soothing" },
];

export function TextToSpeechTool() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

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
      toast.success("Audio generated!");
    } catch (error: any) {
      console.error("Error generating audio:", error);
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
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/20">
        <Info className="h-5 w-5 text-fuchsia-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">ElevenLabs Powered</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            This tool uses ElevenLabs for natural voice synthesis. Make sure your API key is connected.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Voice</Label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{v.name}</span>
                        <span className="text-xs text-muted-foreground">• {v.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="tts-text" className="text-sm font-medium">Text to Convert</Label>
                <span className="text-xs text-muted-foreground">{text.length} / 5000</span>
              </div>
              <Textarea
                id="tts-text"
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 5000))}
                placeholder="Enter the text you want to convert to natural speech..."
                rows={10}
                className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !text.trim()}
              className="w-full gap-2 h-11 font-medium"
              size="lg"
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
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <Label className="text-sm font-medium">Generated Audio</Label>
            <div className="aspect-[4/3] rounded-xl border border-border/50 bg-muted/30 flex items-center justify-center">
              {audioUrl ? (
                <div className="flex flex-col items-center gap-5 p-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-fuchsia-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 flex items-center justify-center">
                      <Volume2 className="h-10 w-10 text-fuchsia-500" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">Audio ready to play</p>
                  <div className="flex gap-3">
                    <Button 
                      onClick={togglePlayback} 
                      variant="default"
                      className="gap-2 px-6"
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
                <div className="flex flex-col items-center gap-4 text-muted-foreground p-6 text-center">
                  <div className="p-4 rounded-2xl bg-muted/50">
                    <Volume2 className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No audio yet</p>
                    <p className="text-xs mt-1">Generated speech will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
