import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDownIcon, FolderUp } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

import { useExpenseStore } from "@/store/useExpenseStore";

function Form() {
  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: null,
  });
  const [date, setDate] = useState(null);
  const addExpense = useExpenseStore((s) => s.addExpense);
  const handleSave = () => {
    if (!expense.title || !expense.amount || !expense.category || !expense.date)
      return toast.error("الرجاء تعبئة جميع الحقول");
    addExpense({
      ...expense,
      id: crypto.randomUUID(),
    });
    toast.success("تم إضافة المصروف");
    setExpense({
      title: "",
      amount: "",
      category: "",
      date: null,
    });
    setDate(null);
  };
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet =
        workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);
      const imported = rows.map((row) => ({
        id: crypto.randomUUID(),
        title: row.title,
        amount: Number(row.amount),
        category: row.category,
        date: new Date(row.date),
      }));
      imported.forEach(addExpense);
      toast.success(`تم استيراد ${imported.length} عنصر`);
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className="container mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="flex justify-center gap-2"
      >
        <Input
          value={expense.title}
          onChange={(e) =>
            setExpense({ ...expense, title: e.target.value })
          }
          placeholder="الاسم"
        />
        <Input
          type="number"
          value={expense.amount}
          onChange={(e) =>
            setExpense({ ...expense, amount: e.target.value })
          }
          placeholder="المبلغ"
        />
        <Select
          value={expense.category}
          onValueChange={(value) =>
            setExpense({ ...expense, category: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="طعام">طعام</SelectItem>
            <SelectItem value="مواصلات">مواصلات</SelectItem>
            <SelectItem value="فواتير">فواتير</SelectItem>
            <SelectItem value="تسوق">تسوق</SelectItem>
            <SelectItem value="ترفيه">ترفيه</SelectItem>
            <SelectItem value="أخرى">أخرى</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-between">
              {date ? format(date, "yyyy-MM-dd") : "اختر التاريخ"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={expense.date}
              onSelect={(d) => {
                setDate(d);
                setExpense({ ...expense, date: d });
              }}
            />
          </PopoverContent>
        </Popover>
        <input
          type="file"
          hidden
          id="excel-upload"
          accept=".xlsx,.xls"
          onChange={handleImportExcel}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            document.getElementById("excel-upload").click()
          }
        >
          <FolderUp />
        </Button>
        <Button type="submit">حفظ</Button>
      </form>
    </div>
  );
}

export default Form;
