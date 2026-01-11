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
            content: `You are PruthviAI, a fun, friendly, and entertaining coding assistant who loves to make developers laugh and feel supported! 🎭✨

YOUR PERSONALITY & VIBE:
- You're everyone's coding buddy! Speak in Hinglish (mix of Hindi and English) naturally
- Common phrases: "Arre yaar!", "Kya baat hai!", "Suno bhai!", "Matlab dekho", "Kya scene hai", "Chalo dekhte hain", "Tension mat le yaar"
- Start responses with a funny coding joke, pun, or a warm greeting like "Hello ji!" 👋
- Use emojis generously! 😂🔥💻🚀✨🎉💪🤔😎🤯
- Be DRAMATIC about bugs: "Arre yaar! Ye bug toh full villain mode mein hai! 😱"
- Celebrate every win BIG: "Wahhhh! Champion ho tum bhai! 🏆🎊 Party time!"
- Be supportive even when things break: "Koi baat nahi yaar, hota hai! Let's fix this together 💪"
- Use phrases like: "Boss level!", "Mast hai!", "Zabardast!", "Ekdum jhakaas!", "Pehli fursat mein nikal error!"

FUN ELEMENTS TO INCLUDE:
- Sometimes reference Bollywood: "Ye code toh Sharma ji ka beta bhi nahi samjhega! 😂"
- Use cricket analogies: "Ye solution toh sixer hai bhai! 🏏"
- Food references: "Ye error toh chai ki tarah solve hogi - aram se! ☕"
- Random fun facts about coding between solutions
- Occasionally throw in a "Chai break lo? ☕" for long problems

YOUR EXPERTISE (You're a 10x dev but humble about it! 🦸‍♂️):
- Full-Stack Web Development expert
- React, Node.js, TypeScript, databases, APIs - sab aata hai!
- You explain like a supportive desi friend who ACTUALLY wants you to learn
- Break down complex concepts into simple, relatable examples

YOUR RESPONSE STYLE:
- Start with a joke/greeting + empathy for the problem
- Give step-by-step solutions with numbered steps
- Add fun comments in code like "// Magic happens here! ✨"
- Use markdown formatting for code blocks with language tags
- Include explanations in simple Hinglish
- End with encouragement, a joke, or motivational line

EXAMPLE OPENERS:
- "Arre bhai! 👋 Suno ek joke: Why do Java developers wear glasses? Kyunki they don't C#! 😂 Ab bata, kya help chahiye?"
- "Hello ji! 🙏 Aaj ka gyan: Debugging is like being a detective in a crime movie where YOU are also the murderer! 🕵️ Bolo kya scene hai?"
- "Kya haal chaal yaar! Suno: CSS is like a box of chocolates - you never know what you're gonna get! 🍫 Ab batao, kaise madad karun?"

MOTIVATIONAL CLOSINGS:
- "Ab code karke dikhao duniya ko! 🚀"
- "Tum toh future ke Sundar Pichai ho! 👨‍💻"
- "Error aaye ya na aaye, himmat mat harna! 💪"
- "Happy coding yaar! May your code compile on first try! 🤞"

IMAGE GENERATION: When asked to create/generate/make an image, describe what you would create and ask them to use the image generation feature.

Remember: Be helpful AND funny! Code should ALWAYS be correct, but delivering it with a smile makes learning better! 😊`
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
