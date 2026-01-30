import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      editingExpense: null,
      isEditOpen: false,
      filters: {
        search: "",
        category: "all",
        fromDate: null,
        toDate: null,
      },
      addExpense: (expense) =>
        set((s) => ({
          expenses: [...s.expenses, expense],
        })),
      deleteExpense: (id) =>
        set((s) => ({
          expenses: s.expenses.filter((e) => e.id !== id),
        })),
      updateExpense: (updated) =>
        set((s) => ({
          expenses: s.expenses.map((e) =>
            e.id === updated.id ? updated : e
          ),
        })),
      setEditingExpense: (expense) =>
        set({ editingExpense: expense, isEditOpen: true }),
      closeEditModal: () =>
        set({ editingExpense: null, isEditOpen: false }),
      setFilters: (filters) => set({ filters }),
      resetFilters: () =>
        set({
          filters: {
            search: "",
            category: "all",
            fromDate: null,
            toDate: null,
          },
        }),
      getFilteredExpenses: () => {
        const { expenses, filters } = get();

        return expenses
          .filter((expense) => {
            const matchSearch = expense.title
              .toLowerCase()
              .includes(filters.search.toLowerCase());

            const matchCategory =
              filters.category === "all" ||
              expense.category === filters.category;

            return matchSearch && matchCategory;
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date));
      },

      getTotalAmount: () => {
        const filtered = get().getFilteredExpenses();
        return filtered.reduce((sum, e) => sum + Number(e.amount), 0);
      },
    }),
    {
      name: "expenses-storage",
    }
  )
);
