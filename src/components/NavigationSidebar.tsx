import { motion } from "framer-motion";
import { Home, LayoutGrid, Sparkles, FileText, Building2, Settings, HelpCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: LayoutGrid, label: "Dashboard", to: "/" },
  { icon: Sparkles, label: "Generator", to: "/" },
  { icon: Building2, label: "Agency", to: "/agency" },
  { icon: FileText, label: "Templates", to: "/templates" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", to: "/settings" },
  { icon: HelpCircle, label: "Help", to: "/help" },
];

export const NavigationSidebar = () => {
  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-16 h-full bg-card border-r border-border flex flex-col items-center py-4"
      aria-label="Primary navigation"
    >
      <div className="flex-1 flex flex-col items-center gap-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink
                to={item.to}
                className="relative p-3 rounded-xl transition-colors text-muted-foreground hover:text-foreground hover:bg-muted block"
                activeClassName="bg-primary/20 text-primary"
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 pt-4 border-t border-border">
        {bottomItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
            >
              <NavLink
                to={item.to}
                className="p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors block"
                activeClassName="bg-primary/20 text-primary"
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
};
