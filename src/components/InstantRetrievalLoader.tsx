import { motion, AnimatePresence } from "framer-motion";
import { Zap, Database, Brain, FileCheck } from "lucide-react";

interface GenerationStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface InstantRetrievalLoaderProps {
  isVisible: boolean;
  currentStep: number;
}

export const InstantRetrievalLoader = ({
  isVisible,
  currentStep,
}: InstantRetrievalLoaderProps) => {
  const steps: GenerationStep[] = [
    {
      id: 1,
      label: "Retrieving Brand Context",
      icon: <Database className="w-5 h-5" />,
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      id: 2,
      label: "Analyzing Historical Success",
      icon: <Brain className="w-5 h-5" />,
      completed: currentStep > 2,
      active: currentStep === 2,
    },
    {
      id: 3,
      label: "Generating Optimized Copy",
      icon: <FileCheck className="w-5 h-5" />,
      completed: currentStep > 3,
      active: currentStep === 3,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-xl bg-card border border-border p-6 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(34, 211, 238, 0)",
                  "0 0 20px 5px rgba(34, 211, 238, 0.3)",
                  "0 0 0 0 rgba(34, 211, 238, 0)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="p-2 rounded-lg bg-secondary/20"
            >
              <Zap className="w-5 h-5 text-secondary" />
            </motion.div>
            <div>
              <h3 className="font-semibold text-foreground">Instant Retrieval</h3>
              <p className="text-sm text-muted-foreground">
                Generation time: seconds not hours
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex items-center gap-4"
              >
                {/* Step Icon */}
                <motion.div
                  animate={{
                    scale: step.active ? [1, 1.1, 1] : 1,
                    backgroundColor: step.completed
                      ? "hsl(142 76% 46%)"
                      : step.active
                      ? "hsl(271 91% 65%)"
                      : "hsl(0 0% 12%)",
                  }}
                  transition={{
                    duration: step.active ? 1 : 0.3,
                    repeat: step.active ? Infinity : 0,
                  }}
                  className="relative p-2 rounded-lg"
                >
                  <motion.div
                    animate={{ color: step.completed || step.active ? "#fff" : "hsl(0 0% 55%)" }}
                    className="relative z-10"
                  >
                    {step.icon}
                  </motion.div>
                  {step.active && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-primary"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        step.completed || step.active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      Step {step.id}: {step.label}
                    </span>
                    {step.completed && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success"
                      >
                        Complete
                      </motion.span>
                    )}
                  </div>
                  {step.active && (
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2 }}
                      className="h-1 mt-2 rounded-full bg-gradient-primary"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Speed Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-2 text-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-secondary"
            />
            <span className="text-secondary font-medium">
              Processing at lightning speed
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
