import { useState, useCallback, useMemo } from "react";
import type { TaxCode, TaxCodeType } from "../types";
import { DEFAULT_TAX_CODES } from "../constants";

export function useTaxEngine() {
  const [taxCodes, setTaxCodes] = useState<TaxCode[]>(
    () => [...DEFAULT_TAX_CODES],
  );

  // ── Add tax code ───────────────────────────────────────────────────────────
  const addTaxCode = useCallback(
    (
      taxCode: Omit<TaxCode, "id">,
    ): { success: boolean; error?: string } => {
      const exists = taxCodes.some(
        (tc) => tc.code.toLowerCase() === taxCode.code.toLowerCase(),
      );
      if (exists) {
        return {
          success: false,
          error: `Tax code "${taxCode.code}" already exists`,
        };
      }

      const newTaxCode: TaxCode = {
        ...taxCode,
        id: `tc-${Date.now()}`,
      };

      setTaxCodes((prev) => [...prev, newTaxCode]);
      return { success: true };
    },
    [taxCodes],
  );

  // ── Update tax code ────────────────────────────────────────────────────────
  const updateTaxCode = useCallback(
    (
      id: string,
      updates: Partial<TaxCode>,
    ): { success: boolean; error?: string } => {
      // Check code uniqueness if code is being changed
      if (updates.code) {
        const exists = taxCodes.some(
          (tc) =>
            tc.id !== id &&
            tc.code.toLowerCase() === updates.code!.toLowerCase(),
        );
        if (exists) {
          return {
            success: false,
            error: `Tax code "${updates.code}" already exists`,
          };
        }
      }

      setTaxCodes((prev) =>
        prev.map((tc) => (tc.id === id ? { ...tc, ...updates } : tc)),
      );
      return { success: true };
    },
    [taxCodes],
  );

  // ── Delete tax code ────────────────────────────────────────────────────────
  const deleteTaxCode = useCallback(
    (id: string): { success: boolean; error?: string } => {
      setTaxCodes((prev) => prev.filter((tc) => tc.id !== id));
      return { success: true };
    },
    [],
  );

  // ── Calculate VAT ──────────────────────────────────────────────────────────
  const calculateVat = useCallback(
    (
      amount: number,
      taxCodeId: string,
    ): { net: number; vat: number; gross: number } | null => {
      const taxCode = taxCodes.find((tc) => tc.id === taxCodeId);
      if (!taxCode) return null;

      const vat = (amount * taxCode.rate) / 100;
      return {
        net: amount,
        vat: Math.round(vat * 100) / 100,
        gross: Math.round((amount + vat) * 100) / 100,
      };
    },
    [taxCodes],
  );

  // ── Filter by type ────────────────────────────────────────────────────────
  const getTaxCodesByType = useCallback(
    (type: TaxCodeType) => {
      return taxCodes.filter((tc) => tc.type === type);
    },
    [taxCodes],
  );

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: taxCodes.length,
      active: taxCodes.filter((tc) => tc.isActive).length,
      input: taxCodes.filter((tc) => tc.type === "input").length,
      output: taxCodes.filter((tc) => tc.type === "output").length,
      exempt: taxCodes.filter((tc) => tc.type === "exempt").length,
    }),
    [taxCodes],
  );

  return {
    taxCodes,
    stats,
    addTaxCode,
    updateTaxCode,
    deleteTaxCode,
    calculateVat,
    getTaxCodesByType,
  };
}
