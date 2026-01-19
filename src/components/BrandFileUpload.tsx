import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BrandFileUploadProps {
  brandAccountId?: string;
  onFilesUploaded?: (files: string[]) => void;
}

interface UploadedFile {
  name: string;
  size: number;
  status: "uploading" | "complete" | "error";
  path?: string;
}

export const BrandFileUpload = ({ brandAccountId, onFilesUploaded }: BrandFileUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = brandAccountId ? `${brandAccountId}/${fileName}` : `temp/${fileName}`;

    const { data, error } = await supabase.storage
      .from("brand-files")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    return data.path;
  };

  const processFiles = async (fileList: FileList) => {
    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/json",
    ];

    const validFiles = Array.from(fileList).filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive",
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      name: file.name,
      size: file.size,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    const uploadedPaths: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const path = await uploadFile(file);

      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, status: path ? "complete" : "error", path: path || undefined }
            : f
        )
      );

      if (path) {
        uploadedPaths.push(path);
      }
    }

    if (uploadedPaths.length > 0) {
      onFilesUploaded?.(uploadedPaths);
      toast({
        title: "Files uploaded",
        description: `${uploadedPaths.length} file(s) uploaded successfully.`,
      });
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [brandAccountId]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          borderColor: isDragging ? "hsl(271 91% 65%)" : "hsl(0 0% 15%)",
          backgroundColor: isDragging ? "hsl(271 91% 65% / 0.1)" : "transparent",
        }}
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
      >
        <input
          type="file"
          multiple
          accept=".pdf,.csv,.xlsx,.xls,.doc,.docx,.txt,.json"
          onChange={handleFileSelect}
          className="hidden"
          id="brand-file-upload"
        />
        <label htmlFor="brand-file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium">
            Drop brand history files here
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            PDF, CSV, XLSX, DOCX, TXT, JSON (max 10MB each)
          </p>
        </label>
      </motion.div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 max-h-48 overflow-y-auto"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                {file.status === "uploading" && (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                )}
                {file.status === "complete" && (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                )}
                {file.status === "error" && (
                  <X className="w-4 h-4 text-destructive" />
                )}
                <button
                  onClick={() => removeFile(file.name)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {files.filter((f) => f.status === "complete").length} of {files.length} files
          uploaded
        </p>
      )}
    </div>
  );
};
