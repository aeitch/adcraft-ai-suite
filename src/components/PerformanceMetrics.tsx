import { motion } from "framer-motion";
import { TrendingUp, Award, Target, Zap, CheckCircle2, Star } from "lucide-react";

interface PerformanceMetricsProps {
  showHighMatch?: boolean;
  templatesUsed?: number;
}

export const PerformanceMetrics = ({
  showHighMatch = true,
  templatesUsed = 847,
}: PerformanceMetricsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-2 gap-4"
    >
      {/* Performance Lift Card */}
      <div className="rounded-xl bg-card border border-border p-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-success/20">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Performance Lift</h3>
          </div>

          <div className="flex items-end gap-2 mb-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-4xl font-bold text-success"
            >
              +25%
            </motion.span>
            <span className="text-muted-foreground text-sm mb-1">avg. increase</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Observed during corporate beta phase
          </p>

          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "75%" }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-4 h-2 rounded-full bg-success/30"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-full rounded-full bg-success"
            />
          </motion.div>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>CTR +18%</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>Conv. +32%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Template Success Rate Card */}
      <div className="rounded-xl bg-card border border-border p-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Template Match</h3>
            </div>

            {showHighMatch && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20"
              >
                <Star className="w-3 h-3 text-primary fill-primary" />
                <span className="text-xs font-medium text-primary">High-Match</span>
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Templates Indexed</span>
              <span className="font-bold text-foreground">1,000+</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Used in Generation</span>
              <span className="font-bold text-secondary">{templatesUsed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Match Accuracy</span>
              <span className="font-bold text-success">94.2%</span>
            </div>
          </div>

          {showHighMatch && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">
                  This copy leverages top-performing templates
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
