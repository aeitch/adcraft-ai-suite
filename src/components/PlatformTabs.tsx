import { motion } from "framer-motion";
import { Linkedin, Instagram, Chrome } from "lucide-react";

interface PlatformTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const platforms = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0A66C2" },
  { id: "meta", label: "Meta", icon: Instagram, color: "#E4405F" },
  { id: "google", label: "Google Ads", icon: Chrome, color: "#4285F4" },
];

export const PlatformTabs = ({ activeTab, onTabChange }: PlatformTabsProps) => {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {platforms.map((platform) => {
        const Icon = platform.icon;
        const isActive = activeTab === platform.id;

        return (
          <motion.button
            key={platform.id}
            onClick={() => onTabChange(platform.id)}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-card rounded-md border border-border"
                initial={false}
                transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" style={{ color: isActive ? platform.color : undefined }} />
              {platform.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
