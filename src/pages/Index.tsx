import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("linkedin");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    headline: string;
    bodyText: string;
    callToAction: string;
  } | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setGeneratedContent(null);

    // Simulate AI generation with reasoning pattern
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulated RAG-grounded response
    setGeneratedContent({
      headline:
        "Generate a high-conversion LinkedIn post for our new SaaS platform.",
      bodyText:
        "We are 📲 Ineet to enhantorice toom.0|0v.ttrnu engagement. 🎯 to pronot tines on-inal-simay platforms, and eepiriceami relcetions to our autontmnt solution and reatmeal strutiees, and clending SaaS platforms emphasizing AI and automation, one sesil operative to even creation, nvito, emphasizing AI and automation.",
      callToAction:
        "We team encouvatе.az apperame to enlumov. Al kil cliser with Call to Action. Thank you for iriner and I'm blowing the mady.",
    });

    setIsGenerating(false);
  };

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
                  AdCraft AI Content Intelligence dashboard · our new SaaS
                  platform
                </motion.p>
              </div>
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

            {/* Platform Tabs */}
            <PlatformTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Prompt Input */}
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />

            {/* Ad Copy Editor */}
            <AdCopyEditor
              isGenerating={isGenerating}
              generatedContent={generatedContent}
            />

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
