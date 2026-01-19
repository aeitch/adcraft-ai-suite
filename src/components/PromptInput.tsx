import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Mic, RefreshCw, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (next: string) => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  onOpenSettings?: () => void;
  onOpenTemplates?: () => void;
  onClearPrompt?: () => void;
}

export const PromptInput = ({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  onOpenSettings,
  onOpenTemplates,
  onClearPrompt,
}: PromptInputProps) => {
  const { toast } = useToast();

  const handleSubmit = () => {
    if (prompt.trim()) onGenerate(prompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl bg-card border border-border overflow-hidden"
    >
      <div className="p-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe the ad copy you want to generate..."
            className="w-full min-h-[80px] bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute right-2 top-2"
          >
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(168, 85, 247, 0)",
                  "0 0 0 8px rgba(168, 85, 247, 0.2)",
                  "0 0 0 0 rgba(168, 85, 247, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-white text-sm font-bold">G</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              toast({
                title: "Image",
                description: "Image-to-ad generation is coming next.",
              })
            }
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Image"
          >
            <Image className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              toast({
                title: "Voice",
                description: "Voice input is coming next.",
              })
            }
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Voice"
          >
            <Mic className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (onClearPrompt ? onClearPrompt() : onPromptChange(""))}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Clear prompt"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenTemplates}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Templates"
          >
            <FileText className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={onOpenSettings}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isGenerating ? (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </motion.div>
              ) : (
                "Generate"
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
