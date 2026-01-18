import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Music, Loader2, Play, Pause, Download, Info, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const musicExamples = [
  "Upbeat electronic dance music with synth leads",
  "Calm lo-fi hip hop for studying",
  "Epic orchestral cinematic trailer music",
];

const sfxExamples = [
  "Magical sparkle sound effect",
  "Heavy footsteps on gravel",
  "Sci-fi laser gun shot",
];

export function MusicGeneratorTool() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState([10]);
  const [mode, setMode] = useState<"music" | "sfx">("sfx");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe the audio you want");
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const endpoint = mode === "music" ? "elevenlabs-music" : "elevenlabs-sfx";
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ 
            prompt, 
            duration: mode === "sfx" ? Math.min(duration[0], 22) : duration[0]
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate audio");
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      toast.success(`${mode === "music" ? "Music" : "Sound effect"} generated!`);
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
    link.download = `${mode}-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audio downloaded!");
  };

  const examples = mode === "music" ? musicExamples : sfxExamples;

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
        <Info className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">ElevenLabs Powered</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generate music tracks and sound effects using AI. Make sure your API key is connected.
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
        <Button
          variant={mode === "sfx" ? "default" : "ghost"}
          size="sm"
          className={cn("gap-2 px-4", mode === "sfx" && "shadow-sm")}
          onClick={() => setMode("sfx")}
        >
          <Zap className="h-4 w-4" />
          Sound Effects
        </Button>
        <Button
          variant={mode === "music" ? "default" : "ghost"}
          size="sm"
          className={cn("gap-2 px-4", mode === "music" && "shadow-sm")}
          onClick={() => setMode("music")}
        >
          <Music className="h-4 w-4" />
          Music
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 space-y-5">
            <div className="space-y-3">
              <Label htmlFor="audio-prompt" className="text-sm font-medium">
                Describe your {mode === "music" ? "music" : "sound effect"}
              </Label>
              <Textarea
                id="audio-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={mode === "music" 
                  ? "e.g., Upbeat electronic dance music with energetic synths..."
                  : "e.g., A magical sparkle sound with reverb..."
                }
                rows={5}
                className="resize-none bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

            {/* Duration Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Duration</Label>
                <span className="text-sm font-medium text-primary">{duration[0]}s</span>
              </div>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={mode === "sfx" ? 1 : 5}
                max={mode === "sfx" ? 22 : 60}
                step={1}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">
                {mode === "sfx" ? "1-22 seconds for sound effects" : "5-60 seconds for music"}
              </p>
            </div>

            {/* Example Prompts */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Quick examples:</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, i) => (
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
                  Generating {mode === "music" ? "Music" : "SFX"}...
                </>
              ) : (
                <>
                  {mode === "music" ? <Music className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                  Generate {mode === "music" ? "Music" : "Sound Effect"}
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
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                      <Music className="h-10 w-10 text-red-500" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {mode === "music" ? "Music" : "Sound effect"} ready
                  </p>
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
                    <Music className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No audio yet</p>
                    <p className="text-xs mt-1">Generated audio will appear here</p>
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
