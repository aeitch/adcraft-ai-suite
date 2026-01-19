import { motion } from "framer-motion";
import { Bell, Settings, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import adcraftLogo from "@/assets/adcraft-logo.png";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-16 px-6 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm"
    >
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-3 focus:outline-none"
        aria-label="Go to generator"
      >
        <img src={adcraftLogo} alt="AdCraft AI" className="h-10 w-auto" />
      </button>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            toast({
              title: "Export",
              description: "Use the Export button after generating an ad.",
            })
          }
          className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Export"
        >
          <Download className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            toast({
              title: "Notifications",
              description: "Notifications are coming next.",
            })
          }
          className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/settings")}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/settings")}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/50 cursor-pointer"
          aria-label="Account"
        >
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
            <span className="text-sm font-bold text-white">U</span>
          </div>
        </motion.button>
      </div>
    </motion.header>
  );
};
