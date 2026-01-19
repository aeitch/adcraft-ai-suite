import { motion } from "framer-motion";
import {
  Home,
  LayoutGrid,
  Sparkles,
  FileText,
  Building2,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", active: false },
  { icon: LayoutGrid, label: "Dashboard", active: true },
  { icon: Sparkles, label: "Generator", active: false },
  { icon: Building2, label: "Agency", active: false },
  { icon: FileText, label: "Templates", active: false },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

export const NavigationSidebar = () => {
  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-16 h-full bg-card border-r border-border flex flex-col items-center py-4"
    >
      {/* Main Nav */}
      <div className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-3 rounded-xl transition-colors ${
                item.active
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                  initial={false}
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <Icon className="w-5 h-5" />
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className="flex flex-col items-center gap-2 pt-4 border-t border-border">
        {bottomItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon className="w-5 h-5" />
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};
