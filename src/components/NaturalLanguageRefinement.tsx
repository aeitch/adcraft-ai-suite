import { motion } from "framer-motion";
import { Wand2, Briefcase, Smartphone, Heart, Zap, Sparkles } from "lucide-react";

interface RefinementOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

const refinementOptions: RefinementOption[] = [
  {
    id: "professional",
    label: "Make it more professional",
    icon: <Briefcase className="w-4 h-4" />,
    prompt: "Refine to professional tone",
  },
  {
    id: "mobile",
    label: "Shorten for mobile",
    icon: <Smartphone className="w-4 h-4" />,
    prompt: "Optimize for mobile viewing",
  },
  {
    id: "emotional",
    label: "Add emotional appeal",
    icon: <Heart className="w-4 h-4" />,
    prompt: "Increase emotional connection",
  },
  {
    id: "urgent",
    label: "Create urgency",
    icon: <Zap className="w-4 h-4" />,
    prompt: "Add urgency and FOMO",
  },
  {
    id: "creative",
    label: "More creative",
    icon: <Sparkles className="w-4 h-4" />,
    prompt: "Make it more creative and bold",
  },
];

interface NaturalLanguageRefinementProps {
  onRefine: (prompt: string) => void;
  disabled?: boolean;
}

export const NaturalLanguageRefinement = ({
  onRefine,
  disabled = false,
}: NaturalLanguageRefinementProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Wand2 className="w-4 h-4" />
        <span>Quick Refinements</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {refinementOptions.map((option, index) => (
          <motion.button
            key={option.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            disabled={disabled}
            onClick={() => onRefine(option.prompt)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-muted/50 border border-border text-foreground hover:bg-muted hover:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-primary">{option.icon}</span>
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
