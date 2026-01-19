import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isIndexing, setIsIndexing] = useState(false);
  const [indexingProgress, setIndexingProgress] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isIndexing) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isIndexing, startTime]);

  const simulateFileUpload = () => {
    const templates = [
      "Q1_Campaign_LinkedIn.pdf",
      "Brand_Guidelines_2024.pdf",
      "Top_Performing_Ads.csv",
      "Meta_Campaign_Results.xlsx",
      "Google_Ads_Export.csv",
      "Email_Templates.docx",
      "Landing_Page_Copy.txt",
      "Product_Descriptions.json",
      "Competitor_Analysis.pdf",
      "Customer_Personas.pdf",
      "Social_Media_Calendar.xlsx",
      "Video_Script_Templates.docx",
    ];
    setUploadedFiles(templates.slice(0, 10 + Math.floor(Math.random() * 3)));
  };

  const startIndexing = () => {
    setIsIndexing(true);
    setCurrentStep(3);
    
    // Simulate rapid indexing
    const interval = setInterval(() => {
      setIndexingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentStep(4);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const steps = [
    { id: 1, label: "Brand Info", icon: Building2 },
    { id: 2, label: "Upload Templates", icon: Upload },
    { id: 3, label: "Indexing", icon: Loader2 },
    { id: 4, label: "Complete", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    backgroundColor: isComplete
                      ? "hsl(142 76% 46%)"
                      : isActive
                      ? "hsl(271 91% 65%)"
                      : "hsl(0 0% 12%)",
                    scale: isActive ? 1.1 : 1,
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isComplete || isActive ? "text-white" : "text-muted-foreground"
                    } ${step.id === 3 && isIndexing ? "animate-spin" : ""}`}
                  />
                </motion.div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 ${
                    isComplete ? "bg-success" : "bg-muted"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Brand Name
              </label>
              <Input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name..."
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Industry
              </label>
              <Input
                placeholder="e.g., Technology, Fashion, Finance..."
                className="bg-muted border-border"
              />
            </div>
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!brandName}
              className="w-full btn-glow bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={simulateFileUpload}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium">
                Drop legacy ad templates here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Support for PDF, CSV, XLSX, DOCX (10+ files for optimal results)
              </p>
            </motion.div>

            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 max-h-32 overflow-y-auto"
              >
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={file}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{file}</span>
                    <CheckCircle2 className="w-4 h-4 text-success ml-auto" />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1 border-border"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={startIndexing}
                disabled={uploadedFiles.length < 10}
                className="flex-1 btn-glow bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Index Templates
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 py-4"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <div className="w-full h-full rounded-full border-4 border-muted border-t-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Indexing {uploadedFiles.length} templates...
              </h3>
              <p className="text-sm text-muted-foreground">
                Building private RAG pipeline for {brandName}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">
                  {Math.min(100, Math.floor(indexingProgress))}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-primary"
                  style={{ width: `${Math.min(100, indexingProgress)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Elapsed: {elapsedTime}s (Target: under 2 minutes)</span>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-success" />
            </motion.div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {brandName} is ready!
            </h3>
            <p className="text-muted-foreground mb-6">
              {uploadedFiles.length} templates indexed in {elapsedTime} seconds
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-primary">
                  {uploadedFiles.length}
                </p>
                <p className="text-xs text-muted-foreground">Templates</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-secondary">1</p>
                <p className="text-xs text-muted-foreground">RAG Pipeline</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-success">{elapsedTime}s</p>
                <p className="text-xs text-muted-foreground">Setup Time</p>
              </div>
            </div>

            <Button
              onClick={onComplete}
              className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Generating Ads
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
