import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Download, Upload, Sparkles, FileText, Edit, Trash2, Filter } from "lucide-react";
import { NetworkBackground } from "@/components/NetworkBackground";
import { CircuitDecorations } from "@/components/CircuitDecorations";
import { Header } from "@/components/Header";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/contexts/BrandContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AuditLogEntry {
  id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
  brand_account_id: string | null;
}

const actionTypes = [
  "all",
  "upload",
  "generation",
  "export",
  "template_create",
  "template_update",
  "template_delete",
];

const PAGE_SIZE = 20;

const AuditLog = () => {
  const { toast } = useToast();
  const { selectedBrandId, selectedBrand, brands, agencyId } = useBrand();

  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!agencyId) return;

    const load = async () => {
      setLoading(true);

      let query = supabase
        .from("audit_logs")
        .select("*", { count: "exact" })
        .eq("agency_id", agencyId)
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (actionFilter !== "all") {
        query = query.eq("action", actionFilter);
      }

      if (brandFilter !== "all") {
        query = query.eq("brand_account_id", brandFilter);
      }

      const { data, error, count } = await query;

      if (error) {
        toast({
          title: "Failed to load audit logs",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setLogs((data as AuditLogEntry[]) ?? []);
        setTotalCount(count ?? 0);
      }
      setLoading(false);
    };

    load();
  }, [agencyId, actionFilter, brandFilter, page, toast]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "upload":
        return <Upload className="w-4 h-4 text-blue-500" />;
      case "generation":
        return <Sparkles className="w-4 h-4 text-primary" />;
      case "export":
        return <Download className="w-4 h-4 text-green-500" />;
      case "template_create":
        return <FileText className="w-4 h-4 text-purple-500" />;
      case "template_update":
        return <Edit className="w-4 h-4 text-orange-500" />;
      case "template_delete":
        return <Trash2 className="w-4 h-4 text-destructive" />;
      default:
        return <ClipboardList className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      upload: "File Upload",
      generation: "Ad Generation",
      export: "Export",
      template_create: "Template Created",
      template_update: "Template Updated",
      template_delete: "Template Deleted",
    };
    return labels[action] ?? action;
  };

  const getBrandName = (brandId: string | null) => {
    if (!brandId) return "—";
    const brand = brands.find((b) => b.id === brandId);
    return brand?.name ?? "Unknown";
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const exportCSV = () => {
    const headers = ["Timestamp", "Action", "Brand", "Details"];
    const rows = logs.map((log) => [
      format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss"),
      getActionLabel(log.action),
      getBrandName(log.brand_account_id),
      JSON.stringify(log.details),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <NetworkBackground />
      <CircuitDecorations />
      <Header />

      <div className="flex-1 flex overflow-hidden relative z-10">
        <NavigationSidebar />

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-foreground"
                >
                  Audit Log
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-muted-foreground"
                >
                  Compliance reporting • {totalCount} total events
                </motion.p>
              </div>

              <Button variant="outline" onClick={exportCSV} disabled={logs.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <div className="flex gap-3">
              <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1); }}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a === "all" ? "All Actions" : getActionLabel(a)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={brandFilter} onValueChange={(v) => { setBrandFilter(v); setPage(1); }}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted/50 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ClipboardList className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No audit logs found
                </h3>
                <p className="text-muted-foreground">
                  Activity will appear here as users perform actions
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-48">Timestamp</TableHead>
                        <TableHead className="w-48">Action</TableHead>
                        <TableHead className="w-40">Brand</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getActionIcon(log.action)}
                              <span>{getActionLabel(log.action)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {getBrandName(log.brand_account_id)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                            {Object.keys(log.details).length > 0
                              ? JSON.stringify(log.details)
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setPage(pageNum)}
                                isActive={page === pageNum}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditLog;
