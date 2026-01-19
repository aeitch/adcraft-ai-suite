import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ThumbsUp, RefreshCw, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdCopyEditorProps {
  isGenerating: boolean;
  generatedContent: {
    headline: string;
    bodyText: string;
    callToAction: string;
  } | null;
}

export const AdCopyEditor = ({ isGenerating, generatedContent }: AdCopyEditorProps) => {
  const [expandedEditor, setExpandedEditor] = useState(true);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const sections = [
    { id: "headline", label: "Headline", content: generatedContent?.headline || "" },
    { id: "body", label: "Body Text", content: generatedContent?.bodyText || "" },
    { id: "cta", label: "Call to Action", content: generatedContent?.callToAction || "" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl bg-card border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: isGenerating ? 360 : 0 }}
            transition={{ duration: 2, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="font-medium text-foreground">Generated ad copy</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpandedEditor(!expandedEditor)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Real-time editor
            <motion.div
              animate={{ rotate: expandedEditor ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {expandedEditor && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <label className="text-sm font-medium text-muted-foreground">
                    {section.label}
                  </label>
                  <div className="relative">
                    <div className="min-h-[60px] p-3 rounded-lg bg-muted/50 border border-border text-foreground">
                      {isGenerating ? (
                        <motion.div
                          className="flex items-center gap-2"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-muted-foreground">Generating...</span>
                        </motion.div>
                      ) : section.content ? (
                        <p className="whitespace-pre-wrap">{section.content}</p>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Click "Generate" to create content
                        </span>
                      )}
                    </div>

                    {/* Polishing Tooltip */}
                    <AnimatePresence>
                      {hoveredSection === section.id && section.content && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-2 top-2 px-3 py-1.5 rounded-md polish-tooltip text-xs font-medium text-primary"
                        >
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Polishing микрополиshеd by AI
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-muted-foreground hover:text-foreground"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Generation
                </Button>
                <Button
                  size="sm"
                  className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate in AI
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
