import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Try Google Gemini for image generation (free tier)
async function generateWithGemini(prompt: string): Promise<{ text: string; imageUrl: string | null }> {
  const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
  
  if (!GEMINI_API_KEY) {
    console.log("Gemini API key not found, will use Lovable AI");
    return { text: "", imageUrl: null };
  }

  try {
    // Use Gemini 2.0 Flash for image generation (Imagen 3)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Generate an image: ${prompt}` }]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Image API error:", response.status, errorText);
      return { text: "", imageUrl: null };
    }

    const data = await response.json();
    console.log("Gemini Image response received");
    
    let textContent = "";
    let imageUrl = null;

    // Extract text and image from response
    const parts = data.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text) {
        textContent = part.text;
      }
      if (part.inlineData) {
        const mimeType = part.inlineData.mimeType || "image/png";
        const base64Data = part.inlineData.data;
        imageUrl = `data:${mimeType};base64,${base64Data}`;
      }
    }

    if (imageUrl) {
      console.log("Using Google Gemini for image generation (free tier) ✓");
    }

    return { text: textContent, imageUrl };
  } catch (error) {
    console.error("Gemini Image error:", error);
    return { text: "", imageUrl: null };
  }
}

// Fallback to Lovable AI for image generation
async function generateWithLovable(prompt: string): Promise<{ text: string; imageUrl: string | null }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    throw new Error("No image generation API configured");
  }

  console.log("Using Lovable AI for image generation (fallback)");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Lovable AI Image error:", response.status, errorText);
    throw new Error("Image generation failed");
  }

  const data = await response.json();
  const textContent = data.choices?.[0]?.message?.content || "";
  const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

  return { text: textContent, imageUrl };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required");
    }

    console.log("Generating image for prompt:", prompt);

    // Try Gemini first (free tier)
    let result = await generateWithGemini(prompt);

    // Fallback to Lovable AI if Gemini fails
    if (!result.imageUrl) {
      result = await generateWithLovable(prompt);
    }

    return new Response(JSON.stringify({ 
      text: result.text,
      imageUrl: result.imageUrl 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
