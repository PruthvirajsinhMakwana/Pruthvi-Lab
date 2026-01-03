import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating AI content for type:", type);

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "tutorial") {
      systemPrompt = `You are an expert technical tutorial writer. Generate comprehensive, well-structured tutorials with clear explanations and practical code examples. Always respond in valid JSON format.`;
      
      userPrompt = `Create a complete tutorial based on the following information:
Title: ${data.title}
Topic/Description: ${data.topic}
Difficulty: ${data.difficulty || "beginner"}
Programming Language: ${data.language || "javascript"}

Generate a JSON response with this exact structure:
{
  "title": "Tutorial title",
  "slug": "url-friendly-slug",
  "description": "A compelling 2-3 sentence description",
  "difficulty": "${data.difficulty || "beginner"}",
  "estimated_minutes": 30,
  "tags": ["tag1", "tag2", "tag3"],
  "steps": [
    {
      "title": "Step 1 Title",
      "content": "Detailed explanation with multiple paragraphs. Use markdown formatting.",
      "code_example": "// Complete working code example\\nconsole.log('Hello');"
    },
    {
      "title": "Step 2 Title",
      "content": "More detailed content...",
      "code_example": "// More code..."
    }
  ]
}

Create at least 5 comprehensive steps with detailed explanations and working code examples.`;
    } else if (type === "snippet") {
      systemPrompt = `You are an expert programmer. Generate clean, well-documented code snippets with proper explanations. Always respond in valid JSON format.`;
      
      userPrompt = `Create a complete code snippet based on the following:
Title/Feature: ${data.title}
Description: ${data.description || ""}
Programming Language: ${data.language || "javascript"}
${data.code ? `Reference Code: ${data.code}` : ""}

Generate a JSON response with this exact structure:
{
  "title": "Descriptive title for the snippet",
  "description": "Clear explanation of what the code does and when to use it (2-3 sentences)",
  "language": "${data.language || "javascript"}",
  "code": "// Complete, well-commented code\\n// with proper formatting\\n// and explanations",
  "tags": ["relevant", "tags", "for", "search"]
}

Make the code production-ready with:
- Proper error handling
- Clear comments
- Best practices for the language
- Reusable structure`;
    } else if (type === "ai-tool") {
      systemPrompt = `You are an AI tools expert. Generate accurate information about AI tools. Always respond in valid JSON format.`;
      
      userPrompt = `Generate information for an AI tool based on:
Name: ${data.name}
URL: ${data.url || ""}
Category hint: ${data.category || ""}

Generate a JSON response with this exact structure:
{
  "name": "Tool Name",
  "description": "Concise but informative description of what the tool does (1-2 sentences)",
  "category": "image|video|chat|code|audio|writing|design|productivity|education|presentation|data|avatar",
  "pricing": "free|freemium|paid|trial",
  "trialCredits": "Description of free tier if freemium/trial",
  "url": "${data.url || "https://example.com"}",
  "features": ["feature1", "feature2", "feature3"],
  "rating": 4.5,
  "isNew": true,
  "isTrending": false
}`;
    } else if (type === "blog") {
      systemPrompt = `You are an expert SEO content writer specializing in AI, automation, and content creation topics. Write engaging, human-like blog posts with proper markdown formatting, tables, code blocks, and embedded YouTube video suggestions. Always respond in valid JSON format.`;
      
      userPrompt = `Create a comprehensive SEO-optimized blog post about:
Topic: ${data.topic}
Category: ${data.category || "ai-tools"}
Writing Style: ${data.tone || "tutorial"}
Additional Notes: ${data.additionalNotes || "None"}

Generate a JSON response with this exact structure:
{
  "title": "Engaging SEO title (include main keyword)",
  "slug": "url-friendly-slug-with-keywords",
  "excerpt": "Compelling 2-sentence excerpt for previews",
  "content": "Full markdown content with:\n- H2 and H3 headings\n- Tables for comparisons\n- Bullet points and numbered lists\n- Code blocks where relevant\n- Embedded image suggestions like ![Description](https://images.unsplash.com/...)\n- YouTube video links section\n- Pro tips and common mistakes sections\n- At least 1500 words",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keywords": ["primary keyword", "secondary keyword", "long-tail keyword"]
}

Make the content feel human-written, engaging, and packed with actionable advice.`;
    }

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
          { role: "user", content: userPrompt },
        ],
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

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    console.log("AI response received:", content?.substring(0, 200));

    // Extract JSON from the response
    let jsonContent;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: jsonContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI content generator error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
