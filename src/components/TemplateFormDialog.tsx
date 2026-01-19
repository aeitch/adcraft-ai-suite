import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TemplateData {
  id?: string;
  name: string;
  platform: string;
  headline: string;
  body_text: string;
  call_to_action: string;
  tags: string[];
}

interface TemplateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TemplateData) => void;
  initialData?: TemplateData | null;
  isLoading?: boolean;
}

const platforms = ["linkedin", "facebook", "google", "instagram", "twitter"];

export const TemplateFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: TemplateFormDialogProps) => {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("linkedin");
  const [headline, setHeadline] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [callToAction, setCallToAction] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPlatform(initialData.platform);
      setHeadline(initialData.headline || "");
      setBodyText(initialData.body_text || "");
      setCallToAction(initialData.call_to_action || "");
      setTags(initialData.tags || []);
    } else {
      setName("");
      setPlatform("linkedin");
      setHeadline("");
      setBodyText("");
      setCallToAction("");
      setTags([]);
    }
  }, [initialData, isOpen]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialData?.id,
      name,
      platform,
      headline,
      body_text: bodyText,
      call_to_action: callToAction,
      tags,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {initialData ? "Edit Template" : "Create Template"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Product Launch Announcement"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Attention-grabbing headline"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bodyText">Body Text</Label>
            <Textarea
              id="bodyText"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Main ad copy content..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta">Call to Action</Label>
            <Input
              id="cta"
              value={callToAction}
              onChange={(e) => setCallToAction(e.target.value)}
              placeholder="e.g., Learn More"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()}>
              {isLoading ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
