import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Search,
  Plus,
  MoreVertical,
  Shield,
  Activity,
  Users,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OnboardingWizard } from "./OnboardingWizard";

interface BrandAccount {
  id: string;
  name: string;
  logo: string;
  status: "active" | "pending" | "paused";
  ragStatus: "connected" | "syncing" | "offline";
  adsGenerated: number;
  performanceLift: number;
  templatesIndexed: number;
  lastActive: string;
}

const mockBrandAccounts: BrandAccount[] = [
  {
    id: "1",
    name: "TechFlow Solutions",
    logo: "T",
    status: "active",
    ragStatus: "connected",
    adsGenerated: 234,
    performanceLift: 28,
    templatesIndexed: 156,
    lastActive: "2 min ago",
  },
  {
    id: "2",
    name: "GreenLeaf Organic",
    logo: "G",
    status: "active",
    ragStatus: "syncing",
    adsGenerated: 189,
    performanceLift: 22,
    templatesIndexed: 98,
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "UrbanStyle Fashion",
    logo: "U",
    status: "active",
    ragStatus: "connected",
    adsGenerated: 312,
    performanceLift: 31,
    templatesIndexed: 203,
    lastActive: "5 min ago",
  },
  {
    id: "4",
    name: "FinanceFirst Bank",
    logo: "F",
    status: "pending",
    ragStatus: "offline",
    adsGenerated: 0,
    performanceLift: 0,
    templatesIndexed: 0,
    lastActive: "Pending setup",
  },
  {
    id: "5",
    name: "HealthPlus Clinic",
    logo: "H",
    status: "active",
    ragStatus: "connected",
    adsGenerated: 145,
    performanceLift: 19,
    templatesIndexed: 87,
    lastActive: "3 hours ago",
  },
];

export const AgencyPortal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const filteredAccounts = mockBrandAccounts.filter((account) =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: BrandAccount["status"]) => {
    switch (status) {
      case "active":
        return "bg-success/20 text-success";
      case "pending":
        return "bg-warning/20 text-warning";
      case "paused":
        return "bg-muted text-muted-foreground";
    }
  };

  const getRagStatusIndicator = (ragStatus: BrandAccount["ragStatus"]) => {
    switch (ragStatus) {
      case "connected":
        return { color: "bg-success", label: "Private RAG Connected" };
      case "syncing":
        return { color: "bg-secondary animate-pulse", label: "RAG Syncing" };
      case "offline":
        return { color: "bg-muted-foreground", label: "RAG Offline" };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Agency Portal</h1>
              <p className="text-sm text-muted-foreground">
                Managing {mockBrandAccounts.length} brand accounts
              </p>
            </div>
          </div>

          <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
            <DialogTrigger asChild>
              <Button className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" />
                New Brand Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Rapid Agency Onboarding
                </DialogTitle>
              </DialogHeader>
              <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search brand accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted border-border"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {mockBrandAccounts.filter((a) => a.status === "active").length}
                </span>{" "}
                Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {mockBrandAccounts.filter((a) => a.ragStatus === "connected").length}
                </span>{" "}
                RAG Connected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAccounts.map((account, index) => {
            const ragIndicator = getRagStatusIndicator(account.ragStatus);
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedAccount(account.id)}
                className={`group cursor-pointer rounded-xl bg-card border transition-all duration-300 ${
                  selectedAccount === account.id
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="p-4">
                  {/* Account Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {account.logo}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {account.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                            account.status
                          )}`}
                        >
                          {account.status}
                        </span>
                      </div>
                    </div>
                    <button className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* RAG Status */}
                  <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/50">
                    <div
                      className={`w-2 h-2 rounded-full ${ragIndicator.color}`}
                      style={{
                        boxShadow:
                          account.ragStatus === "connected"
                            ? "0 0 8px hsl(142 76% 46% / 0.6)"
                            : "none",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {ragIndicator.label}
                    </span>
                    <Shield className="w-3 h-3 text-muted-foreground ml-auto" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">
                        {account.adsGenerated}
                      </p>
                      <p className="text-xs text-muted-foreground">Ads</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-success">
                        +{account.performanceLift}%
                      </p>
                      <p className="text-xs text-muted-foreground">Lift</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">
                        {account.templatesIndexed}
                      </p>
                      <p className="text-xs text-muted-foreground">Templates</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {account.lastActive}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
