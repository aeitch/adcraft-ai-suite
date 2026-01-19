import { Button } from "@/components/ui/button";
import { NetworkBackground } from "@/components/NetworkBackground";
import { CircuitDecorations } from "@/components/CircuitDecorations";
import { Header } from "@/components/Header";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { AgencyPortal } from "@/components/AgencyPortal";
import { useAuth } from "@/hooks/useAuth";

const Agency = () => {
  const { signOut, isAuthenticated } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <NetworkBackground />
      <CircuitDecorations />
      <Header />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <NavigationSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-border flex items-center justify-between">
            <Button variant="ghost" onClick={() => window.history.back()} className="text-muted-foreground hover:text-foreground">
              ← Back
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                Sign Out
              </Button>
            )}
          </div>
          <AgencyPortal />
        </main>
      </div>
    </div>
  );
};

export default Agency;
