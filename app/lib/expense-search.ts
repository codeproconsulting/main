type ExpenseRow = {
  description: string; category: string; payee?: string; reference?: string; paymentMethod?: string;
  voidedAt?: string; amountMinor: string;
};
export type ExpenseFilters = { search: string; category: string; paymentMethod: string; status: "all" | "active" | "voided" };
export function filterExpenses<T extends ExpenseRow>(expenses: T[], filters: ExpenseFilters) {
  const terms = filters.search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const rows = expenses.filter(expense => {
    if (filters.category && expense.category !== filters.category) return false;
    if (filters.paymentMethod && expense.paymentMethod !== filters.paymentMethod) return false;
    if (filters.status === "active" && expense.voidedAt) return false;
    if (filters.status === "voided" && !expense.voidedAt) return false;
    const text = [expense.description, expense.payee, expense.reference].join(" ").toLowerCase();
    return terms.every(term => text.includes(term));
  });
  return { rows, activeTotalMinor: rows.filter(row => !row.voidedAt).reduce((sum, row) => sum + Number(row.amountMinor), 0) };
}
