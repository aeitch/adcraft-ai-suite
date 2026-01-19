import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Building2, LogOut } from "lucide-react";
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
import { ExportDialog } from "@/components/ExportDialog";
import { useAuth } from "@/hooks/useAuth";
import { useAdGeneration } from "@/hooks/useAdGeneration";

const Index = () => {
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const { isGenerating, generationStep, generatedContent, generateAd } = useAdGeneration();
  
  const [activeTab, setActiveTab] = useState("linkedin");
  const [agenticMode, setAgenticMode] = useState(false);
  const [showAgencyPortal, setShowAgencyPortal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleGenerate = async (prompt: string) => {
    await generateAd(prompt, activeTab, agenticMode);
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
              {isAuthenticated && (
                <Button variant="ghost" onClick={signOut} className="text-muted-foreground">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
            <AgencyPortal />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <NetworkBackground />
      <CircuitDecorations />
      <Header />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <NavigationSidebar />
        <RAGSidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
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
                  {isAuthenticated ? `Welcome back! ` : ""}Central Brain for Marketing
                </motion.p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAgencyPortal(true)}
                  className="border-border text-foreground hover:bg-muted gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Agency Portal
                </Button>
                {generatedContent && (
                  <Button
                    variant="outline"
                    onClick={() => setShowExportDialog(true)}
                    className="border-border text-foreground hover:bg-muted gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                )}
                <Button className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  <Download className="w-4 h-4" />
                  Generate ad copy
                </Button>
              </div>
            </div>
            <PlatformTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AgenticModeToggle isEnabled={agenticMode} onToggle={setAgenticMode} />
            <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
            <NaturalLanguageRefinement onRefine={handleRefine} disabled={isGenerating || !generatedContent} />
            <InstantRetrievalLoader isVisible={isGenerating} currentStep={generationStep} />
            
            <AnimatePresence>
              {!isGenerating && (
                <AdCopyEditor isGenerating={isGenerating} generatedContent={generatedContent} />
              )}
            </AnimatePresence>

            {generatedContent && !isGenerating && (
              <PerformanceMetrics showHighMatch={true} templatesUsed={847} />
            )}

            <AnalyticsDashboard />
            <SecurityBadges />
          </div>
        </main>
      </div>

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        content={generatedContent}
        platform={activeTab}
      />
    </div>
  );
};

export default Index;
