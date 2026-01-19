import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Upload, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkBackground } from "@/components/NetworkBackground";
import { CircuitDecorations } from "@/components/CircuitDecorations";
import { Header } from "@/components/Header";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BrandFileUpload } from "@/components/BrandFileUpload";

const Settings = () => {
  const { user, signOut } = useAuth();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <NetworkBackground />
      <CircuitDecorations />
      <Header />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <NavigationSidebar />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            Settings
          </motion.h1>

          <div className="rounded-xl bg-card border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-foreground">Account</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setShowUpload(true)}
                className="border-border"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Brand History
              </Button>
              <Button
                variant="outline"
                className="border-border"
                onClick={() => window.open("https://docs.lovable.dev/features/ai", "_blank")}
              >
                <Shield className="w-4 h-4 mr-2" />
                AI & Security
              </Button>
              <Button
                onClick={signOut}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>

          <Dialog open={showUpload} onOpenChange={setShowUpload}>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Upload Brand History</DialogTitle>
              </DialogHeader>
              <BrandFileUpload />
              <p className="text-xs text-muted-foreground">
                Tip: Upload from the generator after selecting a brand to keep files isolated per brand.
              </p>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Settings;
