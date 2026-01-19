import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BrandAccountOption {
  id: string;
  name: string;
  logo_initial: string | null;
  rag_status: string;
}

interface BrandSelectorProps {
  value: string | null;
  onChange: (nextBrandId: string) => void;
  onLoaded?: (brands: BrandAccountOption[]) => void;
}

export const BrandSelector = ({ value, onChange, onLoaded }: BrandSelectorProps) => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<BrandAccountOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      // Agency owners can see their agencies
      const { data: agencies, error: agenciesError } = await supabase
        .from("agencies")
        .select("id")
        .eq("owner_id", userId);

      if (agenciesError) {
        if (!cancelled) {
          toast({
            title: "Failed to load agency",
            description: agenciesError.message,
            variant: "destructive",
          });
          setLoading(false);
        }
        return;
      }

      const agencyIds = (agencies ?? []).map((a) => a.id);
      if (agencyIds.length === 0) {
        if (!cancelled) {
          setBrands([]);
          setLoading(false);
        }
        return;
      }

      const { data: brandRows, error: brandsError } = await supabase
        .from("brand_accounts")
        .select("id,name,logo_initial,rag_status")
        .in("agency_id", agencyIds)
        .order("created_at", { ascending: true });

      if (brandsError) {
        if (!cancelled) {
          toast({
            title: "Failed to load brands",
            description: brandsError.message,
            variant: "destructive",
          });
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        const nextBrands = (brandRows ?? []) as BrandAccountOption[];
        setBrands(nextBrands);
        onLoaded?.(nextBrands);

        if (!value && nextBrands[0]?.id) {
          onChange(nextBrands[0].id);
        }

        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [onChange, onLoaded, toast, value]);

  const selected = useMemo(
    () => brands.find((b) => b.id === value) ?? null,
    [brands, value]
  );

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
          value={value ?? ""}
          disabled={loading || brands.length === 0}
          onChange={(e) => onChange(e.target.value)}
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

      {selected && (
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{ragLabel(selected.rag_status)}</span>
        </div>
      )}
    </div>
  );
};
