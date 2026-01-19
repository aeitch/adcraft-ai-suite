import { motion } from "framer-motion";
import { Edit2, Trash2, Copy, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Template {
  id: string;
  name: string;
  platform: string;
  headline: string | null;
  body_text: string | null;
  call_to_action: string | null;
  tags: string[];
  created_at: string;
}

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  onUse: (template: Template) => void;
}

export const TemplateCard = ({ template, onEdit, onDelete, onUse }: TemplateCardProps) => {
  const platformColors: Record<string, string> = {
    linkedin: "bg-blue-500/10 text-blue-500",
    facebook: "bg-indigo-500/10 text-indigo-500",
    google: "bg-red-500/10 text-red-500",
    instagram: "bg-pink-500/10 text-pink-500",
    twitter: "bg-sky-500/10 text-sky-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{template.name}</h3>
          <Badge className={`${platformColors[template.platform] ?? "bg-muted"} mt-1`}>
            {template.platform}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onUse(template)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(template)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(template.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {template.headline && (
        <p className="text-sm font-medium text-foreground mb-1 line-clamp-1">
          {template.headline}
        </p>
      )}
      {template.body_text && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {template.body_text}
        </p>
      )}

      {template.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};
