import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Use Lovable AI Gateway for image generation
async function generateWithLovableAI(prompt: string, imageUrl?: string): Promise<{ text: string; imageUrl: string | null }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    throw new Error("Image generation service not configured");
  }

  console.log("Using Pruthvi Engine for image generation");

  const messages: any[] = [];
  
  if (imageUrl) {
    // For image editing, include the image
    messages.push({
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: imageUrl }
        },
        {
          type: "text",
          text: prompt
        }
      ]
    });
  } else {
    // For text-to-image generation
    messages.push({
      role: "user",
      content: prompt
    });
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-pro-image-preview",
      messages,
      modalities: ["image", "text"],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI Image error:", response.status, errorText);
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error("Service credits exhausted. Please try again later.");
    }
    
    throw new Error("Image generation failed");
  }

  const data = await response.json();
  const textContent = data.choices?.[0]?.message?.content || "";
  const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

  console.log("Image generation successful");

  return { text: textContent, imageUrl: generatedImageUrl };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, action, imageUrl } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required");
    }

    console.log(`Processing ${action || 'generate'} request:`, prompt.substring(0, 50) + "...");

    let result: { text: string; imageUrl: string | null };

    switch (action) {
      case "edit":
        if (!imageUrl) {
          throw new Error("Image URL is required for editing");
        }
        result = await generateWithLovableAI(
          `Edit this image: ${prompt}. Apply the changes while maintaining image quality.`,
          imageUrl
        );
        break;
      
      case "remove-background":
        if (!imageUrl) {
          throw new Error("Image URL is required for background removal");
        }
        result = await generateWithLovableAI(
          "Remove the background from this image completely. Create a clean cutout of the main subject with transparent or white background. Preserve fine details like hair and edges.",
          imageUrl
        );
        break;
      
      default: // "generate" or undefined
        result = await generateWithLovableAI(`Generate an image: ${prompt}`);
        break;
    }

    if (!result.imageUrl) {
      throw new Error("Failed to generate image. Please try a different prompt.");
    }

    return new Response(JSON.stringify({ 
      text: result.text,
      imageUrl: result.imageUrl 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
