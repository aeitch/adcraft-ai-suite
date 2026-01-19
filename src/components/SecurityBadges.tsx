import { motion } from "framer-motion";
import { Shield, FileCheck } from "lucide-react";

export const SecurityBadges = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex items-center gap-3 flex-wrap"
    >
      <div className="security-badge">
        <Shield className="w-3 h-3" />
        <span>Secure AWS VPC Hosting</span>
      </div>
      <div className="security-badge">
        <FileCheck className="w-3 h-3" />
        <span>Audit Logging Enabled</span>
      </div>
    </motion.div>
  );
};
