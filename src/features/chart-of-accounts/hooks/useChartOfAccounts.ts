import { useState, useCallback, useMemo } from "react";
import type { GLAccount, GLAccountTreeNode, AccountCategory } from "../types";
import { getCategoryFromAccountNumber } from "../types";
import { DEFAULT_CHART_OF_ACCOUNTS } from "../constants";

export function useChartOfAccounts() {
  const [accounts, setAccounts] = useState<GLAccount[]>(
    () => [...DEFAULT_CHART_OF_ACCOUNTS],
  );

  // ── Build nested tree from flat list ───────────────────────────────────────
  const buildTree = useCallback(
    (
      flatAccounts: GLAccount[],
      parentNumber: string | null = null,
      level = 0,
    ): GLAccountTreeNode[] => {
      return flatAccounts
        .filter((a) => a.parentAccountNumber === parentNumber)
        .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber))
        .map((account) => ({
          ...account,
          level,
          children: buildTree(flatAccounts, account.accountNumber, level + 1),
        }));
    },
    [],
  );

  const accountTree = useMemo(
    () => buildTree(accounts),
    [accounts, buildTree],
  );

  // ── Flat sorted list for display ───────────────────────────────────────────
  const flattenTree = useCallback(
    (nodes: GLAccountTreeNode[]): GLAccountTreeNode[] => {
      const result: GLAccountTreeNode[] = [];
      for (const node of nodes) {
        result.push(node);
        if (node.children.length > 0) {
          result.push(...flattenTree(node.children));
        }
      }
      return result;
    },
    [],
  );

  const flatTree = useMemo(
    () => flattenTree(accountTree),
    [accountTree, flattenTree],
  );

  // ── Filter by category ────────────────────────────────────────────────────
  const getAccountsByCategory = useCallback(
    (category: AccountCategory) => {
      return accounts.filter((a) => a.accountCategory === category);
    },
    [accounts],
  );

  // ── Get header accounts (for parent selection) ─────────────────────────────
  const headerAccounts = useMemo(
    () =>
      accounts
        .filter((a) => a.postingType === "header")
        .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)),
    [accounts],
  );

  // ── Get posting accounts ───────────────────────────────────────────────────
  const postingAccounts = useMemo(
    () =>
      accounts
        .filter((a) => a.postingType === "posting")
        .sort((a, b) => a.accountNumber.localeCompare(b.accountNumber)),
    [accounts],
  );

  // ── Check if account number exists ─────────────────────────────────────────
  const accountExists = useCallback(
    (accountNumber: string) => {
      return accounts.some((a) => a.accountNumber === accountNumber);
    },
    [accounts],
  );

  // ── Check if account has children ──────────────────────────────────────────
  const hasChildren = useCallback(
    (accountNumber: string) => {
      return accounts.some((a) => a.parentAccountNumber === accountNumber);
    },
    [accounts],
  );

  // ── Add account ────────────────────────────────────────────────────────────
  const addAccount = useCallback(
    (account: GLAccount): { success: boolean; error?: string } => {
      if (accountExists(account.accountNumber)) {
        return {
          success: false,
          error: `Account ${account.accountNumber} already exists`,
        };
      }

      const category = getCategoryFromAccountNumber(account.accountNumber);
      if (!category) {
        return {
          success: false,
          error: "Account number is not in a valid range (100000–599999)",
        };
      }

      const newAccount: GLAccount = {
        ...account,
        accountCategory: category,
        // Header accounts cannot allow manual entry
        allowManualEntry:
          account.postingType === "header" ? false : account.allowManualEntry,
      };

      setAccounts((prev) => [...prev, newAccount]);
      return { success: true };
    },
    [accountExists],
  );

  // ── Update account ────────────────────────────────────────────────────────
  const updateAccount = useCallback(
    (
      accountNumber: string,
      updates: Partial<GLAccount>,
    ): { success: boolean; error?: string } => {
      // If changing account number, check uniqueness
      if (updates.accountNumber && updates.accountNumber !== accountNumber) {
        if (accountExists(updates.accountNumber)) {
          return {
            success: false,
            error: `Account ${updates.accountNumber} already exists`,
          };
        }
      }

      setAccounts((prev) =>
        prev.map((a) => {
          if (a.accountNumber !== accountNumber) return a;

          const updated = { ...a, ...updates };

          // Recalculate category if account number changed
          if (updates.accountNumber) {
            const category = getCategoryFromAccountNumber(
              updates.accountNumber,
            );
            if (category) updated.accountCategory = category;
          }

          // Enforce header account rules
          if (updated.postingType === "header") {
            updated.allowManualEntry = false;
          }

          return updated;
        }),
      );
      return { success: true };
    },
    [accountExists],
  );

  // ── Delete account ────────────────────────────────────────────────────────
  const deleteAccount = useCallback(
    (accountNumber: string): { success: boolean; error?: string } => {
      if (hasChildren(accountNumber)) {
        return {
          success: false,
          error:
            "Cannot delete account with child accounts. Remove children first.",
        };
      }

      setAccounts((prev) =>
        prev.filter((a) => a.accountNumber !== accountNumber),
      );
      return { success: true };
    },
    [hasChildren],
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  const isHeaderAccount = useCallback(
    (accountNumber: string) => {
      const account = accounts.find((a) => a.accountNumber === accountNumber);
      return account?.postingType === "header";
    },
    [accounts],
  );

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: accounts.length,
      header: accounts.filter((a) => a.postingType === "header").length,
      posting: accounts.filter((a) => a.postingType === "posting").length,
      active: accounts.filter((a) => a.isActive).length,
    }),
    [accounts],
  );

  return {
    accounts,
    accountTree,
    flatTree,
    headerAccounts,
    postingAccounts,
    stats,
    getAccountsByCategory,
    accountExists,
    hasChildren,
    addAccount,
    updateAccount,
    deleteAccount,
    isHeaderAccount,
  };
}
