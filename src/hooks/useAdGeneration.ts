import { useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GeneratedContent {
  headline: string;
  bodyText: string;
  callToAction: string;
  reasoning?: string;
  templateMatchScore?: number;
}

export const useAdGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const { toast } = useToast();

  const generateAd = async (
    prompt: string,
    platform: string,
    agenticMode: boolean,
    brandContext?: string
  ) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setGenerationStep(1);

    try {
      // Step 1: Retrieving Brand Context
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGenerationStep(2);

      // Step 2: Analyzing Historical Success
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGenerationStep(3);

      // Step 3: Call the AI edge function
      const { data, error } = await supabase.functions.invoke("generate-ad", {
        body: {
          prompt,
          platform,
          agenticMode,
          brandContext,
        },
      });

      if (error) {
        // Handle specific error codes
        if (error.message?.includes("429") || error.message?.includes("Rate limit")) {
          toast({
            title: "Rate limited",
            description: "Too many requests. Please wait a moment and try again.",
            variant: "destructive",
          });
        } else if (error.message?.includes("402") || error.message?.includes("credits")) {
          toast({
            title: "Credits exhausted",
            description: "AI credits have been used up. Please add more credits.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Generation failed",
            description: error.message || "Failed to generate ad copy. Please try again.",
            variant: "destructive",
          });
        }
        throw error;
      }

      if (data.error) {
        toast({
          title: "Generation failed",
          description: data.error,
          variant: "destructive",
        });
        throw new Error(data.error);
      }

      setGeneratedContent({
        headline: data.headline,
        bodyText: data.bodyText,
        callToAction: data.callToAction,
        reasoning: data.reasoning,
        templateMatchScore: data.templateMatchScore,
      });

      toast({
        title: "Ad copy generated!",
        description: `Template match score: ${data.templateMatchScore || 85}%`,
      });
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  return {
    isGenerating,
    generationStep,
    generatedContent,
    generateAd,
    setGeneratedContent,
  };
};
