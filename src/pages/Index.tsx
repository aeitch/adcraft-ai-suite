import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkBackground } from "@/components/NetworkBackground";
import { CircuitDecorations } from "@/components/CircuitDecorations";
import { Header } from "@/components/Header";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { RAGSidebar } from "@/components/RAGSidebar";
import { PlatformTabs } from "@/components/PlatformTabs";
import { PromptInput } from "@/components/PromptInput";
import { AdCopyEditor } from "@/components/AdCopyEditor";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { SecurityBadges } from "@/components/SecurityBadges";
import { AgenticModeToggle } from "@/components/AgenticModeToggle";
import { NaturalLanguageRefinement } from "@/components/NaturalLanguageRefinement";
import { InstantRetrievalLoader } from "@/components/InstantRetrievalLoader";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { AgencyPortal } from "@/components/AgencyPortal";

const Index = () => {
  const [activeTab, setActiveTab] = useState("linkedin");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [agenticMode, setAgenticMode] = useState(false);
  const [showAgencyPortal, setShowAgencyPortal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    headline: string;
    bodyText: string;
    callToAction: string;
  } | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setGenerationStep(1);

    // Step 1: Retrieving Brand Context
    await new Promise((resolve) => setTimeout(resolve, 800));
    setGenerationStep(2);

    // Step 2: Analyzing Historical Success
    await new Promise((resolve) => setTimeout(resolve, 800));
    setGenerationStep(3);

    // Step 3: Generating Optimized Copy
    await new Promise((resolve) => setTimeout(resolve, 800));

    // RAG-grounded response
    setGeneratedContent({
      headline: agenticMode 
        ? "🚀 Transform Your Marketing with AI-Powered Intelligence"
        : "Accelerate Your Ad Performance with AdCraft AI",
      bodyText: agenticMode
        ? "Our enterprise clients are seeing a 25% lift in ad performance using our Central Brain technology. Powered by 1,000+ indexed successful campaigns and real-time brand context, AdCraft AI delivers copy that converts. Join leading agencies managing 50+ brands on our platform."
        : "Generate high-conversion ad copy in seconds, not hours. Our RAG-powered AI analyzes your brand context and successful templates to create optimized content for LinkedIn, Meta, and Google Ads.",
      callToAction: agenticMode
        ? "Schedule Enterprise Demo →"
        : "Start Free Trial",
    });

    setIsGenerating(false);
    setGenerationStep(0);
  };

  const handleRefine = (refinementPrompt: string) => {
    if (generatedContent) {
      handleGenerate(refinementPrompt);
    }
  };

  if (showAgencyPortal) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <NetworkBackground />
        <CircuitDecorations />
        <Header />
        <div className="flex-1 flex overflow-hidden relative z-10">
          <NavigationSidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b border-border flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setShowAgencyPortal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Generator
              </Button>
            </div>
            <AgencyPortal />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Network Animation Background */}
      <NetworkBackground />
      <CircuitDecorations />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Navigation Sidebar */}
        <NavigationSidebar />

        {/* RAG Knowledge Base Sidebar */}
        <RAGSidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Content Header */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-foreground"
                >
                  Multi-Platform Generator
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  AdCraft AI Content Intelligence dashboard · Central Brain for Marketing
                </motion.p>
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setShowAgencyPortal(true)}
                    className="border-border text-foreground hover:bg-muted gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Agency Portal
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Download className="w-4 h-4" />
                    Generate ad copy
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Platform Tabs */}
            <PlatformTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Agentic Mode Toggle */}
            <AgenticModeToggle
              isEnabled={agenticMode}
              onToggle={setAgenticMode}
            />

            {/* Prompt Input */}
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />

            {/* Natural Language Refinement */}
            <NaturalLanguageRefinement
              onRefine={handleRefine}
              disabled={isGenerating || !generatedContent}
            />

            {/* Instant Retrieval Loader - Chain of Thought */}
            <InstantRetrievalLoader
              isVisible={isGenerating}
              currentStep={generationStep}
            />

            {/* Ad Copy Editor */}
            <AnimatePresence>
              {!isGenerating && (
                <AdCopyEditor
                  isGenerating={isGenerating}
                  generatedContent={generatedContent}
                />
              )}
            </AnimatePresence>

            {/* Performance Metrics - Beta Results */}
            {generatedContent && !isGenerating && (
              <PerformanceMetrics showHighMatch={true} templatesUsed={847} />
            )}

            {/* Analytics Dashboard */}
            <AnalyticsDashboard />

            {/* Security Badges */}
            <SecurityBadges />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
