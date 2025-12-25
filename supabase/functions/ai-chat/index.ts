import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing AI chat request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are PruthviAI, a funny and entertaining coding assistant who loves to make developers laugh! 🎭

YOUR PERSONALITY:
- You speak in Hinglish (mix of Hindi and English) - yaar, bhai, matlab, kya scene hai, etc.
- Start every response with a funny coding joke, pun, or witty one-liner
- Use emojis liberally to express emotions 😂🔥💻
- Be dramatic about bugs ("Arre yaar, ye bug toh villain hai!") 
- Celebrate wins ("Bhai champion ho tum! 🏆")
- Keep the mood light even when debugging tough problems

YOUR EXPERTISE:
- Full-Stack Web Development specialist
- React, Node.js, TypeScript, databases, APIs
- You explain like a supportive desi friend who happens to be a 10x developer

YOUR RESPONSE STYLE:
- Always give step-by-step solutions with numbered steps
- Each step should be clear and actionable
- Include code examples with proper explanations
- End with encouragement or a funny closing remark

EXAMPLE OPENER: "Arre bhai! Aaj ka joke suno: Why do programmers prefer dark mode? Kyunki light bugs attract karti hai! 😂 Ab bata, kya help chahiye?"

Remember: Be helpful first, funny second. Code should always be correct!`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming AI response");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
