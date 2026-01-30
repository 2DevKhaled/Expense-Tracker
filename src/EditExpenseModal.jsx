import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { toast } from "sonner";
import { useExpenseStore } from "@/store/useExpenseStore"; // 🔥 المهم
export default function EditExpenseModal() {
  const editingExpense = useExpenseStore((s) => s.editingExpense);
  const isEditOpen = useExpenseStore((s) => s.isEditOpen);
  const updateExpense = useExpenseStore((s) => s.updateExpense);
  const closeEditModal = useExpenseStore((s) => s.closeEditModal);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: null,
  });
  useEffect(() => {
    if (editingExpense) {
      setForm(editingExpense);
    }
  }, [editingExpense]);
  const handleSubmit = () => {
    if (!form.title || !form.amount) return toast.error("الرجاء تعبئة الحقول");
    updateExpense(form);
    toast.success("تم التحديث بنجاح");
    closeEditModal();
  };
  if (!editingExpense) return null;
  return (
    <Dialog open={isEditOpen} onOpenChange={closeEditModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">تعديل المصروف</DialogTitle>
        </DialogHeader>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="اسم المصروف"
        />
        <Input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="المبلغ"
        />
        <DialogFooter>
          <Button variant="outline" onClick={closeEditModal}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>تحديث</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
