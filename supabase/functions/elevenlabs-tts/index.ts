import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ElevenLabs voice IDs - using popular preset voices
const voiceMap: Record<string, string> = {
  "alloy": "21m00Tcm4TlvDq8ikWAM", // Rachel
  "echo": "AZnzlk1XvdvUeBnXmlld",   // Domi
  "fable": "EXAVITQu4vr4xnSDxMaL",  // Bella
  "onyx": "VR6AewLTigWG4xSOukaG",   // Arnold
  "nova": "ThT5KcBeYPX3keUQqHPh",   // Dorothy
  "shimmer": "pNInz6obpgDQGcFmaJgB", // Adam
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = "alloy" } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "ElevenLabs API key not configured. Please connect your ElevenLabs account." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (text.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Text is too long. Maximum 5000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const voiceId = voiceMap[voice] || voiceMap["alloy"];
    console.log("Generating TTS with voice:", voice, "voiceId:", voiceId);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs TTS API error:", response.status, errorText);
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "Invalid ElevenLabs API key. Please check your API key." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    console.log("TTS generated successfully, size:", audioBuffer.byteLength, "bytes");

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: any) {
    console.error("TTS generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate speech" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
