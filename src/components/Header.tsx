import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Settings, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import adcraftLogo from "@/assets/adcraft-logo.png";
import { NotificationsPanel } from "@/components/NotificationsPanel";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("read", false);

      setUnreadCount(count ?? 0);
    };

    loadUnreadCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("notifications-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications" },
        () => {
          loadUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
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
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
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

      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};
