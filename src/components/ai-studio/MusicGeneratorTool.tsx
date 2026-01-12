import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Loader2, Play, Pause, Download, AlertCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const musicExamples = [
  "Upbeat electronic dance music with synth leads",
  "Calm lo-fi hip hop for studying",
  "Epic orchestral cinematic trailer music",
  "Acoustic guitar folk song with warm tones",
  "Ambient space music with ethereal pads",
];

const sfxExamples = [
  "Magical sparkle sound effect",
  "Heavy footsteps on gravel",
  "Sci-fi laser gun shot",
  "Door creaking open slowly",
  "Thunder rumbling in the distance",
];

export function MusicGeneratorTool() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState([10]);
  const [mode, setMode] = useState<"music" | "sfx">("music");
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Music className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              Music & SFX Generator
              <Badge variant="secondary" className="text-xs">API</Badge>
            </CardTitle>
            <CardDescription>
              Generate music tracks and sound effects using ElevenLabs AI
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

        {/* Mode Toggle */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "music" | "sfx")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="music" className="gap-2">
              <Music className="h-4 w-4" />
              Music
            </TabsTrigger>
            <TabsTrigger value="sfx" className="gap-2">
              <Zap className="h-4 w-4" />
              Sound Effects
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-prompt">
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
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Duration Slider */}
            <div className="space-y-2">
              <Label>Duration: {duration[0]} seconds</Label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={mode === "sfx" ? 1 : 5}
                max={mode === "sfx" ? 22 : 60}
                step={1}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">
                {mode === "sfx" ? "Max 22 seconds for sound effects" : "5-60 seconds for music"}
              </p>
            </div>

            {/* Example Prompts */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Try an example:</Label>
              <div className="flex flex-wrap gap-2">
                {examples.slice(0, 3).map((example, i) => (
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
                  Generating {mode === "music" ? "Music" : "SFX"}...
                </>
              ) : (
                <>
                  <Music className="h-4 w-4" />
                  Generate {mode === "music" ? "Music" : "Sound Effect"}
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
                    <Music className="h-12 w-12 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mode === "music" ? "Music" : "Sound effect"} ready to play
                  </p>
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
                  <Music className="h-8 w-8" />
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
