import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  prompt: string;
  platform: "linkedin" | "meta" | "google";
  agenticMode: boolean;
  brandContext?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, platform, agenticMode, brandContext } = await req.json() as GenerateRequest;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build system prompt based on mode and platform
    const platformInstructions = {
      linkedin: "Create professional B2B content optimized for LinkedIn. Use emojis sparingly, focus on thought leadership and industry insights. Keep headlines under 150 characters.",
      meta: "Create engaging, visually-oriented ad copy for Meta (Facebook/Instagram). Use conversational tone, strong hooks, and clear CTAs. Optimize for mobile viewing.",
      google: "Create concise, high-converting Google Ads copy. Headlines must be under 30 characters, descriptions under 90 characters. Focus on keywords and urgency."
    };

    const systemPrompt = `You are AdCraft AI, an expert marketing copywriter specializing in high-conversion advertising content.

PLATFORM: ${platform.toUpperCase()}
${platformInstructions[platform]}

${agenticMode ? `CENTRAL BRAIN MODE ACTIVE: Adapt tone and style based on brand history context provided.` : ''}

${brandContext ? `BRAND CONTEXT:\n${brandContext}` : ''}

CRITICAL INSTRUCTIONS:
1. First outline your approach (1-2 sentences about strategy)
2. Then generate the ad copy

OUTPUT FORMAT (JSON):
{
  "reasoning": "Brief explanation of your approach",
  "headline": "The ad headline",
  "bodyText": "The main ad body copy",
  "callToAction": "The CTA button text",
  "templateMatchScore": 85
}

If you lack sufficient context for a quality response, set templateMatchScore to 0 and include "Insufficient knowledge base data" in the reasoning.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service unavailable. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response from the AI
    let parsedContent;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content);
      // Fallback to raw content parsing
      parsedContent = {
        reasoning: "Generated based on your prompt",
        headline: content.substring(0, 100),
        bodyText: content,
        callToAction: "Learn More",
        templateMatchScore: 70
      };
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Generate ad error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
