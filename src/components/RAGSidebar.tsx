import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Database,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface KnowledgeSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: { label: string; value: string }[];
}

const knowledgeSections: KnowledgeSection[] = [
  {
    id: "company",
    title: "Company Data",
    icon: <Database className="w-4 h-4" />,
    items: [
      { label: "Company Name", value: "AdCraft" },
      { label: "Industry Trends", value: "20%" },
      { label: "Product Specs", value: "39.13%" },
      { label: "Product Name", value: "R8:0233" },
    ],
  },
  {
    id: "trends",
    title: "Industry Trends",
    icon: <TrendingUp className="w-4 h-4" />,
    items: [
      { label: "Industry Trends", value: "Enptemia" },
      { label: "Industry Trends", value: "Blaaglintation" },
      { label: "Company", value: "Irvwone: Limbstics and trending" },
    ],
  },
  {
    id: "specs",
    title: "Product Specs",
    icon: <Package className="w-4 h-4" />,
    items: [
      { label: "Product Specs", value: "686" },
      { label: "Company Name", value: "820" },
      { label: "Product Specs", value: "1400" },
    ],
  },
];

export const RAGSidebar = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "company",
    "trends",
    "specs",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRetrieving, setIsRetrieving] = useState(true);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-80 h-full bg-card border-r border-border flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            RAG Knowledge Base
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Retrieval Status */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-success"
            style={{ boxShadow: "0 0 8px hsl(142 76% 46% / 0.6)" }}
          />
          <span className="text-sm text-muted-foreground">
            Real-time document retrieved...
          </span>
        </div>
        <motion.div
          className="mt-2 h-1 rounded-full overflow-hidden bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-primary"
            initial={{ width: "0%" }}
            animate={{ width: "75%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Knowledge Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {knowledgeSections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-muted/50 border border-border overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-2 text-foreground font-medium">
                {section.icon}
                <span>{section.title}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.includes(section.id) ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.includes(section.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-2">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="text-primary">•</span>
                        <span className="text-muted-foreground">
                          {item.label}:
                        </span>
                        <span className="text-foreground font-medium">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Real-time document retrieval</span>
        </div>
      </div>
    </motion.aside>
  );
};
