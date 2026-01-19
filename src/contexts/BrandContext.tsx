import React, { createContext, useContext, ReactNode } from "react";
import { useBrandPreference, BrandAccountOption } from "@/hooks/useBrandPreference";

interface BrandContextValue {
  brands: BrandAccountOption[];
  selectedBrandId: string | null;
  selectedBrand: BrandAccountOption | null;
  agencyId: string | null;
  selectBrand: (brandId: string) => Promise<void>;
  loading: boolean;
  userId: string | null;
}

const BrandContext = createContext<BrandContextValue | null>(null);

export const BrandProvider = ({ children }: { children: ReactNode }) => {
  const value = useBrandPreference();
  return <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;
};

export const useBrand = () => {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return ctx;
};
