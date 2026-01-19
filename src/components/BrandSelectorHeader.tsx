import { ChevronDown, Shield } from "lucide-react";
import { useBrand } from "@/contexts/BrandContext";

export const BrandSelectorHeader = () => {
  const { brands, selectedBrandId, selectedBrand, selectBrand, loading } = useBrand();

  const ragLabel = (status: string) => {
    if (status === "connected") return "RAG Connected";
    if (status === "syncing") return "RAG Syncing";
    return "RAG Offline";
  };

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-muted-foreground">Brand</div>
      <div className="relative">
        <select
          value={selectedBrandId ?? ""}
          disabled={loading || brands.length === 0}
          onChange={(e) => selectBrand(e.target.value)}
          className="appearance-none pl-3 pr-9 py-2 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {brands.length === 0 ? (
            <option value="">No brands</option>
          ) : (
            brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>

      {selectedBrand && (
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{ragLabel(selectedBrand.rag_status)}</span>
        </div>
      )}
    </div>
  );
};
