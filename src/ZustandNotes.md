# 🎯 ما هو Zustand؟

مكتبة **إدارة حالة (State Management)** خفيفة جدًا لـ React.

بديل بسيط لـ:
❌ Redux (معقد + Boilerplate)  
❌ Context API (props drilling + re-render كثير)

---

# ✨ المميزات

✅ خفيف جدًا (~1kb)  
✅ بدون Providers  
✅ بدون reducers  
✅ بدون boilerplate  
✅ أسرع من Context  
✅ سهل التعلم  
✅ مناسب للمشاريع الصغيرة والكبيرة

---

---

# 🧠 الفكرة الأساسية

## بدون Zustand

App
├─ Form
├─ Table
├─ Modal

تمرير props بينهم:
props → props → props → props 😵

---

## مع Zustand

Store مركزي واحد
↑
أي مكون يقرأ/يعدل مباشرة

🔥 لا يوجد props drilling

---

---

# 📦 التثبيت

```bash
npm install zustand
✅ إنشاء Store
📁 src/store/useExpenseStore.js
import { create } from "zustand";

export const useExpenseStore = create((set) => ({
  // =================
  // state
  // =================
  expenses: [],
  filters: {
    search: "",
    category: "all",
    fromDate: null,
    toDate: null,
  },
  editingExpense: null,
  isEditOpen: false,

  // =================
  // actions
  // =================
  addExpense: (expense) =>
    set((state) => ({
      expenses: [...state.expenses, expense],
    })),

  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    })),

  updateExpense: (updated) =>
    set((state) => ({
      expenses: state.expenses.map((e) =>
        e.id === updated.id ? updated : e
      ),
    })),

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

  setEditingExpense: (expense) =>
    set({
      editingExpense: expense,
      isEditOpen: true,
    }),

  closeEditModal: () =>
    set({
      editingExpense: null,
      isEditOpen: false,
    }),
}));
✅ استخدام الـ Store
قراءة state
const expenses = useExpenseStore((s) => s.expenses);
استدعاء action
const addExpense = useExpenseStore((s) => s.addExpense);
🔥 CRUD أمثلة
➕ إضافة
addExpense({
  id: crypto.randomUUID(),
  title,
  amount,
});
❌ حذف
deleteExpense(id);
✏️ تحديث
updateExpense(updatedExpense);
⚠️ القاعدة الذهبية (مهم جدًا)
❌ لا تستدعي دوال داخل selector
useExpenseStore((s) => s.getFilteredExpenses())
لماذا؟
لأن:

ترجع array جديدة كل مرة

React يعتقد state تغير

re-render لا نهائي

infinite loop

✅ الصحيح
useExpenseStore((s) => s.expenses)
والحسابات تسويها بـ React:

useMemo(() => filter(...), [expenses])
✅ الفلترة والحسابات (الطريقة الصحيحة)
لا تضعها داخل store ❌
استخدم useMemo داخل الكمبوننت ✅
const filteredExpenses = useMemo(() => {
  return expenses.filter(...);
}, [expenses, filters]);
حساب المجموع
const totalAmount = useMemo(() => {
  return filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
}, [filteredExpenses]);
🎯 متى أستخدم Zustand؟
استخدمه لـ:
✅ بيانات مشتركة
✅ CRUD
✅ Auth
✅ Cart
✅ Filters
✅ Modals
✅ Settings

لا تستخدمه لـ:
❌ input fields
❌ form مؤقت
❌ hover state
❌ open/close بسيط محلي

هذه استخدم:

useState()
💾 Persist (يحفظ بعد refresh)
import { persist } from "zustand/middleware";

export const useExpenseStore = create(
  persist(
    (set) => ({
      expenses: [],
    }),
    {
      name: "expenses-storage",
    }
  )
);
🔥 يخزن في LocalStorage

⚡ تحسين الأداء
استخدم selectors صغيرة
const expenses = useStore(s => s.expenses)
بدل:

const state = useStore()
استخدم shallow عند قراءة عدة قيم
import { shallow } from "zustand/shallow";

const { expenses, filters } = useStore(
  s => ({ expenses: s.expenses, filters: s.filters }),
  shallow
);
❌ أخطاء شائعة
1️⃣ استدعاء دالة داخل selector
❌

useStore(s => s.someFunction())
2️⃣ وضع form داخل store
❌

formTitle
inputValue
3️⃣ استخدام flex على TableCell 😄
يكسر الجدول

✅ أفضل الممارسات
✔ state عالمي فقط
✔ الحسابات بـ useMemo
✔ الفورم بـ useState
✔ selectors صغيرة
✔ persist للتخزين
✔ لا props drilling
✔ لا functions داخل selector

📁 تنظيم احترافي للمشروع
src/
 ├─ store/
 │   └─ useExpenseStore.js
 │
 ├─ components/
 │   ├─ Form.jsx
 │   ├─ DataTable.jsx
 │   ├─ EditExpenseModal.jsx
🧠 Cheatsheet سريعة
قراءة
useStore(s => s.value)
تعديل
useStore(s => s.action)
حسابات
useMemo()
تخزين دائم
persist()
```
