import { useMemo, useState } from "react";
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
import { ExportDialog } from "@/components/ExportDialog";
import { BrandFileUpload } from "@/components/BrandFileUpload";
import { BrandSelector, type BrandAccountOption } from "@/components/BrandSelector";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { isGenerating, generationStep, generatedContent, generateAd } =
    useAdGeneration();

  const [activeTab, setActiveTab] = useState("linkedin");
  const [agenticMode, setAgenticMode] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const [prompt, setPrompt] = useState(
    "Generate a high-conversion LinkedIn post for our new SaaS platform, emphasizing AI and automation."
  );

  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [brands, setBrands] = useState<BrandAccountOption[]>([]);

  const [showBrandUpload, setShowBrandUpload] = useState(false);

  const selectedBrand = useMemo(
    () => brands.find((b) => b.id === selectedBrandId) ?? null,
    [brands, selectedBrandId]
  );

  const brandContext = useMemo(() => {
    if (!selectedBrand) return undefined;
    return `Brand: ${selectedBrand.name}\nRAG Status: ${selectedBrand.rag_status}`;
  }, [selectedBrand]);

  const handleGenerate = async (p: string) => {
    await generateAd(p, activeTab, agenticMode, agenticMode ? brandContext : undefined);
  };

  const handleRefine = (refinementPrompt: string) => {
    if (generatedContent) {
      handleGenerate(refinementPrompt);
    }
  };

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
                  Central Brain for Marketing
                </motion.p>
              </div>

              <div className="flex items-center gap-3">
                <BrandSelector
                  value={selectedBrandId}
                  onChange={setSelectedBrandId}
                  onLoaded={setBrands}
                />

                <Button
                  variant="outline"
                  onClick={() => navigate("/agency")}
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

                <Button
                  onClick={() => handleGenerate(prompt)}
                  disabled={isGenerating}
                  className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generate ad copy
                </Button>
              </div>
            </div>

            <PlatformTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AgenticModeToggle
              isEnabled={agenticMode}
              onToggle={setAgenticMode}
              onUploadClick={() => {
                if (!selectedBrandId) {
                  toast({
                    title: "Select a brand first",
                    description: "Pick a brand in the top bar to upload Brand History files.",
                    variant: "destructive",
                  });
                  return;
                }
                setShowBrandUpload(true);
              }}
            />

            <PromptInput
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onOpenSettings={() => navigate("/settings")}
              onOpenTemplates={() => navigate("/templates")}
              onClearPrompt={() => setPrompt("")}
            />

            <NaturalLanguageRefinement
              onRefine={handleRefine}
              disabled={isGenerating || !generatedContent}
            />

            <InstantRetrievalLoader
              isVisible={isGenerating}
              currentStep={generationStep}
            />

            <AnimatePresence>
              {!isGenerating && (
                <AdCopyEditor
                  isGenerating={isGenerating}
                  generatedContent={generatedContent}
                />
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

      <Dialog open={showBrandUpload} onOpenChange={setShowBrandUpload}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Upload Brand History</DialogTitle>
          </DialogHeader>
          <BrandFileUpload brandAccountId={selectedBrandId ?? undefined} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
