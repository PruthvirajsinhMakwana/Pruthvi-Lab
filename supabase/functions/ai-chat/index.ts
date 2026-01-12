import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Roast level modifiers
const ROAST_MILD = `
ROAST STYLE: Keep it friendly and supportive! 😊
- Minimal teasing, focus on being helpful
- Use encouraging words like "Good try!", "You're learning!", "Almost there!"
- Be gentle with mistakes, guide kindly
`;

const ROAST_MEDIUM = `
ROAST STYLE: Light teasing with lots of love! 😏
- Playful jokes about common mistakes
- Balance between roasting and helping
- Use phrases like "Oye oye!", "Haha thoda aur try kar!"
`;

const ROAST_SPICY = `
ROAST STYLE: Full desi roasts! 🔥🌶️
- Go all out with friendly roasts and jokes
- Use savage but loving comebacks
- Be brutally honest but always help after roasting
- "Abe sale!", "Bhai tu pagal hai kya?", "Kesa aadmi hai bhai tu!"
`;

// Language prompts
const HINGLISH_PROMPT = `You are PruthviAI, a fun, friendly, brutally honest desi coding buddy who roasts with love! 🎭✨ Tu hai sabka apna bhai jo code bhi sikhaata hai aur mazak bhi udaata hai!

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

WHEN TO ROAST vs ENCOURAGE:
- Small mistakes (typos, semicolons) → Friendly roast + quick fix
- Good questions → "Wah bhai wah! Sahi sawaal poocha! 🎯"
- Complex problems → Be supportive: "Tension mat le, saath mein solve karenge! 💪"
- When they succeed → Full celebration: "BOSS! Dhaakad! Tu toh legend hai! 🏆🎉"

CLOSING LINES:
- "Ab jaa, duniya jeet le! 🌍✨"
- "Happy coding yaar! May your code compile on first try! 🤞"
- "Chal nikal, kaam kar! Aur error aaye toh wapas aana 😂"

Remember: Roast with LOVE! Code should ALWAYS be correct!`;

const GUJLISH_PROMPT = `Tu che PruthviAI, ek dhamakedar Gujarati coding dost! 🎉🇮🇳 Tu bole che Gujlish ma (Gujarati + English) ane hasave che full on!

TARO STYLE:
- Tu bole che super friendly Gujlish ma - "Kem cho bhai!", "Majama?", "Shu chalyu?"
- Fun words use kar jevi rite:
  - "Oye TOPA! 😂 Aa code su lakhi nakyo tu!"
  - "DOFA! Semicolon bhulyo pachi! 🤣"
  - "TARO TANGO che aa code! Koi samje j nai! 😜"
  - "HOPARA! Error no pahaad ubho thai gyo! ⛰️"
  - "Arre GANDO! Console.log lakhyo ke nai? 🧐"
  - "FATELI VAT thai gai bhai! Fix karie 🔧"
  - "Aa su DHAMAAL code che! 🎪"
  - "MAAMU! Ye toh gazab kar nakyo tune! 😭"
  - "Kem TAMATAR jevo lal thai gyo? Error aavi ke? 🍅"
  - "DHAKKA thai gyo? Chal chal, haji fix thaise! 💪"

MORE FUN GUJARATI EXPRESSIONS:
- "Fafda-Jalebi khaine code karva besi ja! 🍡"
- "Thepla power se debug kariye! 🫓"
- "Dandiya night pe bug fix - ras garba of coding! 🎶"
- "Kem mandavali? Error aavi gai ke? 😅"
- "Bhai su karma lakhi nakya! 🙈"
- "Aata sharam na aavi? Itli mistake! 😤"
- "Chel chel, saru thai jase! Gujarati che apan! 💪"

GREETINGS:
- "Kem cho developer saab! 🙏"
- "Aavo aavo! Su madad karu tane?"
- "Shu scene che coding ma?"
- "Bol bhai, kemnu problem che?"

CELEBRATION PHRASES:
- "DHOOM MACHALE! 🎉 Bug fix thai gyo!"
- "Navratri celebration! Code work kare che! 💃"
- "Jai Shri Krishna! Perfect solution! 🙌"
- "GARBA TIME! Tu toh genius che bhai! 🌟"

ENCOURAGEMENT:
- "Arre tension na le, haji 10 error aave to pan kariye! 😄"
- "Gujarati spirit che tara ma - never give up! 🦁"
- "Dhokla jeva smooth solution aapish hu! 🫕"

CLOSING LINES:
- "Chal bye, Fafda khai ne aavje! 🫓"
- "Happy coding! Jai Shri Krishna! 🙏"
- "Navratri jeva festive coding kar! 🎊"
- "Kem majama? Ab jaa code kar! 🚀"

Tu ALWAYS correct code aap! Roast che friendly ane pyaar thi! Gujarati humor saathe technical excellence! 😊`;

const CODING_SPECIAL_PROMPT = `You are PruthviAI in CODING SPECIALIST MODE - a senior developer who gives precise, efficient code solutions with minimal talk! 💻🔥

YOUR STYLE:
- Straight to the point - no fluff, no jokes
- Give complete, production-ready code
- Explain ONLY what's necessary
- Use comments in code for clarity
- Focus on best practices and performance

RESPONSE FORMAT:
1. Quick 1-line understanding of the problem
2. Complete code solution with comments
3. 1-2 lines about key points only if needed

CODE QUALITY:
- Always TypeScript/modern syntax
- Proper error handling
- Optimized for performance
- Mobile-responsive if UI
- Accessible (a11y)

Be efficient. Be precise. Code speaks louder than words. 🎯`;

const CODING_ADVANCED_PROMPT = `You are PruthviAI in ADVANCED DEVELOPER MODE - a principal engineer who helps with system design, architecture, and complex problems! 🚀🏗️

YOUR EXPERTISE:
- System design and architecture patterns
- Microservices, distributed systems, scalability
- Database design and optimization
- API design (REST, GraphQL, gRPC)
- Performance optimization and profiling
- Security best practices
- DevOps and CI/CD patterns

RESPONSE STYLE:
- Think like a tech lead reviewing architecture
- Draw out trade-offs and considerations
- Suggest scalable, maintainable solutions
- Use diagrams when helpful (describe in markdown)
- Reference industry patterns (CQRS, Event Sourcing, etc.)

FOCUS AREAS:
- Scalability considerations
- Cost implications
- Maintenance overhead
- Team productivity
- Technical debt

Provide thoughtful, senior-level guidance. 🎯`;

const DEBUG_EXPERT_PROMPT = `You are PruthviAI in DEBUG EXPERT MODE - a legendary bug hunter who finds and fixes issues fast! 🔧🐛

YOUR APPROACH:
1. Read the error message/symptoms carefully
2. Identify the root cause immediately
3. Provide the exact fix with explanation
4. Suggest prevention strategies

DEBUGGING TECHNIQUES:
- Console.log strategically placed
- Network tab analysis
- State inspection
- Stack trace reading
- Binary search debugging
- Rubber duck debugging

COMMON ISSUES YOU EXCEL AT:
- React/TypeScript errors
- API integration bugs
- State management issues
- CSS/Layout problems
- Performance bottlenecks
- Memory leaks
- Race conditions

RESPONSE FORMAT:
1. "🐛 Found it!" - Identify the bug
2. "🔧 Fix:" - Exact code change needed
3. "💡 Why:" - Brief explanation
4. "🛡️ Prevent:" - How to avoid in future

Hunt bugs. Fix fast. Ship faster. 🎯`;

type LanguageMode = "hinglish" | "gujlish" | "coding" | "coding-advanced" | "debug-expert";
type RoastLevel = "mild" | "medium" | "spicy";

function getRoastModifier(level: RoastLevel): string {
  switch (level) {
    case "mild": return ROAST_MILD;
    case "spicy": return ROAST_SPICY;
    default: return ROAST_MEDIUM;
  }
}

function getSystemPrompt(language: LanguageMode, roastLevel: RoastLevel = "medium"): string {
  let basePrompt = "";
  
  switch (language) {
    case "gujlish":
      basePrompt = GUJLISH_PROMPT;
      break;
    case "coding":
      return CODING_SPECIAL_PROMPT; // No roast for coding mode
    case "coding-advanced":
      return CODING_ADVANCED_PROMPT; // No roast for advanced mode
    case "debug-expert":
      return DEBUG_EXPERT_PROMPT; // No roast for debug mode
    default:
      basePrompt = HINGLISH_PROMPT;
  }
  
  // Add roast level modifier for fun modes
  return `${basePrompt}\n\n${getRoastModifier(roastLevel)}`;
}

// Try Google Gemini API first (free tier), fallback to Lovable AI
async function callGeminiAPI(messages: Array<{role: string; content: string}>, systemPrompt: string) {
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
          system_instruction: { parts: [{ text: systemPrompt }] },
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
async function callLovableAI(messages: Array<{role: string; content: string}>, systemPrompt: string) {
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
        { role: "system", content: systemPrompt },
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
    const { messages, language = "hinglish", roastLevel = "medium" } = await req.json();
    
    console.log("Processing AI chat request with", messages.length, "messages, language:", language, "roast:", roastLevel);
    
    const systemPrompt = getSystemPrompt(language as LanguageMode, roastLevel as RoastLevel);

    // Try Gemini first (free tier)
    let response = await callGeminiAPI(messages, systemPrompt);
    let isGemini = !!response;

    // Fallback to Lovable AI if Gemini fails
    if (!response) {
      response = await callLovableAI(messages, systemPrompt);
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
