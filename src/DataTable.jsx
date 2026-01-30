import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { Button } from "./components/ui/button";
import { Edit, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent } from "./components/ui/card";

import { useExpenseStore } from "@/store/useExpenseStore";

// =================
// ألوان الفئات
// =================
const categoryStyles = {
  طعام: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  مواصلات: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  فواتير: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  تسوق: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  ترفيه: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  أخرى: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

export function DataTable() {
  // =================
  // Zustand (state فقط)
  // =================
  const expenses = useExpenseStore((s) => s.expenses);
  const filters = useExpenseStore((s) => s.filters);

  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const setEditingExpense = useExpenseStore((s) => s.setEditingExpense);
  const setFilters = useExpenseStore((s) => s.setFilters);
  const resetFilters = useExpenseStore((s) => s.resetFilters);

  // =================
  // الحسابات (React side)
  // =================

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        const matchSearch = expense.title
          .toLowerCase()
          .includes(filters.search.toLowerCase());

        const matchCategory =
          filters.category === "all" || expense.category === filters.category;

        const matchFrom =
          !filters.fromDate ||
          new Date(expense.date) >= new Date(filters.fromDate);

        const matchTo =
          !filters.toDate || new Date(expense.date) <= new Date(filters.toDate);

        return matchSearch && matchCategory && matchFrom && matchTo;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, filters]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [filteredExpenses]);

  // =================
  // UI
  // =================
  return (
    <div>
      <br />
      <div className="flex gap-3 mb-4 ">
        <Input
          placeholder="ابحث بالاسم"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="كل الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفئات</SelectItem>
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
            <Button variant="outline">
              {filters.fromDate
                ? format(filters.fromDate, "yyyy-MM-dd")
                : "من تاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={filters.fromDate}
              onSelect={(date) => setFilters({ ...filters, fromDate: date })}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {filters.toDate
                ? format(filters.toDate, "yyyy-MM-dd")
                : "إلى تاريخ"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={filters.toDate}
              onSelect={(date) => setFilters({ ...filters, toDate: date })}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={resetFilters}>
          <RefreshCwIcon />
        </Button>
      </div>
      <Table className="w-full text-right">
        <TableCaption>
          <Card className="w-full my-2">
            <CardContent className="text-xl font-bold text-right">
              💰 المجموع: {totalAmount.toLocaleString("ar-SA")} ر.س
            </CardContent>
          </Card>
        </TableCaption>

        {/* ================= HEADER ================= */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-right">#</TableHead>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-right">المبلغ</TableHead>
            <TableHead className="text-right">الفئة</TableHead>
            <TableHead className="text-right">التاريخ</TableHead>
            <TableHead className="w-28 text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>

        {/* ================= BODY ================= */}
        <TableBody>
          {filteredExpenses.map((expense, index) => (
            <TableRow key={expense.id}>
              <TableCell className="text-right">{index + 1}</TableCell>

              <TableCell className="text-right font-medium">
                {expense.title}
              </TableCell>

              <TableCell className="text-right">{expense.amount}</TableCell>

              <TableCell className="text-right">
                <Badge
                  className={categoryStyles[expense.category] || "bg-gray-100"}
                >
                  {expense.category}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                {format(new Date(expense.date), "yyyy-MM-dd")}
              </TableCell>

              {/* ✅ لا نستخدم flex على TableCell */}
              <TableCell>
                <div className="flex gap-2 justify-end">
                  {/* حذف */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="destructive">
                        <Trash2Icon size={16} />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          هل أنت متأكد من الحذف؟
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          لا يمكن التراجع عن هذه العملية
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => deleteExpense(expense.id)}
                          variant="destructive"
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  {/* تعديل */}
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setEditingExpense(expense)}
                  >
                    <Edit size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
