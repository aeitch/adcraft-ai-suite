import { motion } from "framer-motion";
import { NetworkBackground } from "@/components/NetworkBackground";
import { CircuitDecorations } from "@/components/CircuitDecorations";
import { Header } from "@/components/Header";
import { NavigationSidebar } from "@/components/NavigationSidebar";

const Templates = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <NetworkBackground />
      <CircuitDecorations />
      <Header />
      <div className="flex-1 flex overflow-hidden relative z-10">
        <NavigationSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            Templates
          </motion.h1>
          <p className="mt-2 text-muted-foreground">
            Template library management is coming next.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Templates;
