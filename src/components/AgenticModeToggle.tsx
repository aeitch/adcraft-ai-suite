import { motion } from "framer-motion";
import { Brain, Upload } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AgenticModeToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onUploadClick?: () => void;
}

export const AgenticModeToggle = ({
  isEnabled,
  onToggle,
  onUploadClick,
}: AgenticModeToggleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
    >
      <motion.div
        className="relative"
        animate={{
          boxShadow: isEnabled
            ? [
                "0 0 0 0 rgba(168, 85, 247, 0)",
                "0 0 20px 5px rgba(168, 85, 247, 0.4)",
                "0 0 0 0 rgba(168, 85, 247, 0)",
              ]
            : "none",
        }}
        transition={{ duration: 2, repeat: isEnabled ? Infinity : 0 }}
      >
        <div
          className={`p-3 rounded-xl transition-colors duration-300 ${
            isEnabled ? "bg-primary/20" : "bg-muted"
          }`}
        >
          <Brain
            className={`w-6 h-6 transition-colors duration-300 ${
              isEnabled ? "text-primary" : "text-muted-foreground"
            }`}
          />
        </div>
      </motion.div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Central Brain Mode</h3>
          {isEnabled && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary"
            >
              Active
            </motion.span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Auto-adapt tone from Brand History
        </p>
      </div>

      <div className="flex items-center gap-3">
        {isEnabled && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUploadClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Brand Files
          </motion.button>
        )}
        <Switch checked={isEnabled} onCheckedChange={onToggle} />
      </div>
    </motion.div>
  );
};
