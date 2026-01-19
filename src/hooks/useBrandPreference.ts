import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BrandAccountOption {
  id: string;
  name: string;
  logo_initial: string | null;
  rag_status: string;
  agency_id: string;
}

export const useBrandPreference = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<BrandAccountOption[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) {
        setLoading(false);
        return;
      }
      setUserId(uid);

      // Fetch agencies owned by user
      const { data: agencies, error: agenciesError } = await supabase
        .from("agencies")
        .select("id")
        .eq("owner_id", uid);

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

      setAgencyId(agencyIds[0]);

      // Fetch brands
      const { data: brandRows, error: brandsError } = await supabase
        .from("brand_accounts")
        .select("id,name,logo_initial,rag_status,agency_id")
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

      const nextBrands = (brandRows ?? []) as BrandAccountOption[];

      // Fetch user preference
      const { data: pref } = await supabase
        .from("brand_preferences")
        .select("brand_account_id")
        .eq("user_id", uid)
        .maybeSingle();

      if (!cancelled) {
        setBrands(nextBrands);

        // Use persisted preference if valid, otherwise first brand
        const preferredId = pref?.brand_account_id;
        const validPref = nextBrands.find((b) => b.id === preferredId);
        setSelectedBrandId(validPref ? preferredId : nextBrands[0]?.id ?? null);
        setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const selectBrand = useCallback(
    async (brandId: string) => {
      setSelectedBrandId(brandId);

      if (!userId) return;

      // Upsert preference
      const { error } = await supabase
        .from("brand_preferences")
        .upsert(
          { user_id: userId, brand_account_id: brandId },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Failed to save brand preference:", error);
      }
    },
    [userId]
  );

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) ?? null;

  return {
    brands,
    selectedBrandId,
    selectedBrand,
    agencyId,
    selectBrand,
    loading,
    userId,
  };
};
