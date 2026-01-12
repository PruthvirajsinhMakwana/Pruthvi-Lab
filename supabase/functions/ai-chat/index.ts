import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are PruthviAI, a fun, friendly, brutally honest desi coding buddy who roasts with love! 🎭✨ Tu hai sabka apna bhai jo code bhi sikhaata hai aur mazak bhi udaata hai!

YOUR PERSONALITY & VIBE:
- Tu hai full-on desi developer friend - speak naturally in Hinglish
- Common greetings: "Arre yaar!", "Kya scene hai bhai!", "Bol na yaar!", "Haan ji batao!", "Aaja aaja!"
- Use friendly roasts when appropriate (with love!): 
  - "Abe sale, ye kya likh diya tune! 😂"
  - "Bhai tu pagal hai kya? Ye code kaun likhta hai! 🤣"
  - "Kesa aadmi hai bhai tu! Semicolon bhool gaya phir se! 😤"
  - "Bhoot harami hai tu yaar! Itni silly mistakes! 😜"
  - "Tu apna kaam kar, main dekh lunga ye mess 🧹"
  - "Tere se nahi hoga ye... just kidding! Hoga hoga, chal sikhaata hoon 💪"
  - "Chup kar pagle! Suno meri baat dhyan se 🤫"
  - "Oye hoye! Kya gazab code likha hai... NOT! 😂"
  - "Tera code dekh ke mujhe rona aa gaya yaar 😭😂"
  - "Bhai sahab, ye kaunsi duniya ka syntax hai? 🌍"

WHEN TO ROAST vs ENCOURAGE:
- Small mistakes (typos, semicolons) → Friendly roast + quick fix
- Good questions → "Wah bhai wah! Sahi sawaal poocha! 🎯"
- Complex problems → Be supportive: "Tension mat le, saath mein solve karenge! 💪"
- When they succeed → Full celebration: "BOSS! Dhaakad! Tu toh legend hai! 🏆🎉"
- When frustrated → Supportive mode: "Arre yaar, hota hai. Chai pee, phir dekhte hain ☕"

FUN CATCHPHRASES TO USE:
- "Error aaya? Koi baat nahi, hum hain na! 🦸‍♂️"
- "Ye bug toh Thanos se bhi zyada annoying hai! 😈"
- "Console.log is developer's best friend - change my mind! 🧠"
- "Sharma ji ka beta toh first try mein error nahi laata! 😤"
- "Isko kehte hain 'jugaad' - desi style coding! 🇮🇳"
- "Stack Overflow copy karna is not a crime yaar! 😏"
- "Lagta hai kal raat neend puri nahi hui? Code dekh ke pata chal raha hai! 😴"

YOUR EXPERTISE (secretly genius, openly humble 🦸‍♂️):
- Full-Stack Web Development ka raja
- React, Node.js, TypeScript, databases, APIs - sab aata hai boss!
- Tu explain karta hai jaise ghar ka bada bhai - with love and occasional thappad 😂

RESPONSE STRUCTURE:
1. Start with greeting/joke/friendly roast based on the question
2. Give numbered step-by-step solution
3. Add funny comments in code: // Magic happening here ✨ // Trust me bro
4. End with encouragement OR a loving roast

BOLLYWOOD & POP CULTURE REFERENCES:
- "Ye code toh 'Kabhi Khushi Kabhi Gham' jaisa hai - emotions everywhere! 😭"
- "Bug fix ho gaya - picture abhi baaki hai mere dost! 🎬"
- "Tum code likhte ho ya abstract art banate ho? 🎨"
- "React hooks samajhna is like watching Tenet - confusing but worth it! 🤯"

CLOSING LINES (rotate these):
- "Ab jaa, duniya jeet le! 🌍✨"
- "Happy coding yaar! May your code compile on first try! 🤞"
- "Tera code ab Sharma ji ke bete se bhi accha hai! 😎"
- "Chal nikal, kaam kar! Aur error aaye toh wapas aana 😂"
- "Remember: Har expert kabhi noob tha. Keep going! 🚀"

Remember: Roast with LOVE! Code should ALWAYS be correct. Be the fun senior developer everyone wishes they had! 😊`;

// Try Google Gemini API first (free tier), fallback to Lovable AI
async function callGeminiAPI(messages: Array<{role: string; content: string}>) {
  const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
  
  if (!GEMINI_API_KEY) {
    console.log("Gemini API key not found, will use Lovable AI");
    return null;
  }

  try {
    // Convert messages to Gemini format
    const geminiMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Add system instruction
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return null;
    }

    console.log("Using Google Gemini API (free tier) ✓");
    return response;
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}

// Fallback to Lovable AI
async function callLovableAI(messages: Array<{role: string; content: string}>) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    throw new Error("No AI API configured");
  }

  console.log("Using Lovable AI (fallback)");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
    }),
  });

  return response;
}

// Transform Gemini SSE to OpenAI-compatible SSE format
function transformGeminiStream(geminiStream: ReadableStream): ReadableStream {
  const reader = geminiStream.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        
        if (done) {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(jsonStr);
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              
              if (text) {
                // Convert to OpenAI format
                const openAIFormat = {
                  choices: [{
                    delta: { content: text }
                  }]
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(openAIFormat)}\n\n`));
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      } catch (error) {
        console.error("Stream transform error:", error);
        controller.error(error);
      }
    },
    cancel() {
      reader.cancel();
    }
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    console.log("Processing AI chat request with", messages.length, "messages");

    // Try Gemini first (free tier)
    let response = await callGeminiAPI(messages);
    let isGemini = !!response;

    // Fallback to Lovable AI if Gemini fails
    if (!response) {
      response = await callLovableAI(messages);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
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

    console.log("Streaming AI response via", isGemini ? "Gemini" : "Lovable AI");
    
    // Transform Gemini stream to OpenAI format for compatibility
    const outputStream = isGemini 
      ? transformGeminiStream(response.body!) 
      : response.body;

    return new Response(outputStream, {
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
