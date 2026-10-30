import React, { useState } from "react";
import { Pencil, Plus, Search, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminField from "@/components/admin/AdminField";

function cellValue(item, column) {
  const value = item[column.key];
  if (column.render) return column.render(item);
  if (typeof value === "boolean") return value ? "مفعّل" : "معطّل";
  if (Array.isArray(value)) return value.join("، ") || "—";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export default function EntityManager({
  title,
  description,
  fields,
  columns,
  defaults = {},
  defaultItems = [],
  searchField,
  addLabel = "إضافة جديد",
}) {
  const [items, setItems] = useState(defaultItems);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  const hasVisibility = columns.some((column) => column.key === "is_visible");

  // Filter items locally based on search field and input query
  const filteredItems = items.filter((item) => {
    if (!search.trim() || !searchField) return true;
    const val = item[searchField] || "";
    return String(val).toLowerCase().includes(search.trim().toLowerCase());
  });

  const startCreate = () => {
    setEditing(null);
    setForm({ ...defaults });
    setError("");
    setOpen(true);
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({ ...defaults, ...item });
    setError("");
    setOpen(true);
  };

  const save = () => {
    const missing = fields.filter((field) => field.required && !String(form[field.name] ?? "").trim());
    if (missing.length) {
      setError(`الحقول المطلوبة: ${missing.map((field) => field.label).join("، ")}`);
      return;
    }
    
    setSaving(true);
    setError("");

    setTimeout(() => {
      const payload = {};
      fields.forEach((field) => {
        payload[field.name] = form[field.name] ?? (field.type === "boolean" ? false : "");
      });

      if (editing) {
        setItems((prev) =>
          prev.map((item) => (item.id === editing.id ? { ...item, ...payload } : item))
        );
      } else {
        const newItem = {
          ...payload,
          id: `local-${Date.now()}`,
          is_visible: payload.is_visible ?? true,
          order: items.length + 1,
        };
        setItems((prev) => [...prev, newItem]);
      }

      setSaving(false);
      setOpen(false);
    }, 200);
  };

  const remove = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const toggleVisibility = (item) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_visible: !i.is_visible } : i))
    );
  };

  return (
    <div className="text-right" dir="rtl">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{title}</h1>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        <Button onClick={startCreate} className="gap-2 bg-primary">
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>

      {searchField ? (
        <div className="relative mt-5 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث..."
            className="bg-card pl-9 text-right"
          />
        </div>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-[var(--radius)] border border-border/70 bg-card">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredItems.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  {columns.map((column) => (
                    <TableHead key={column.key} className="whitespace-nowrap text-right text-xs text-muted-foreground">
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead className="text-left text-xs text-muted-foreground">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className="max-w-[260px] text-sm text-foreground/85">
                        {column.key === "is_visible" && hasVisibility ? (
                          <Switch checked={Boolean(item.is_visible)} onCheckedChange={() => toggleVisibility(item)} />
                        ) : typeof column.render === "function" ? (
                          column.render(item)
                        ) : (
                          <span className="line-clamp-2">{cellValue(item, column)}</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {hasVisibility ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title={item.is_visible ? "إخفاء" : "إظهار"}
                            onClick={() => toggleVisibility(item)}
                          >
                            {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-muted-foreground">
            لا توجد عناصر بعد. اضغط «{addLabel}» للبدء.
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{filteredItems.length} عنصر</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-card text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-primary">
              {editing ? `تعديل: ${editing.title || editing.name || editing.question || editing.student_name || ""}` : addLabel}
            </DialogTitle>
            <DialogDescription className="text-xs">{title}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 sm:grid-cols-2">
            {fields.map((field) => (
              <AdminField
                key={field.name}
                field={field}
                value={form[field.name]}
                onChange={(value) => setForm((prev) => ({ ...prev, [field.name]: value }))}
              />
            ))}
          </div>

          {error ? <p className="text-xs text-destructive">{error}</p> : null}

          <DialogFooter className="gap-2 sm:justify-start">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={save} disabled={saving} className="bg-primary">
              {saving ? <Loader2 className="ms-2 h-4 w-4 animate-spin" /> : null}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(value) => !value && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card text-right" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-primary">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا العنصر نهائيًا. لا يمكن التراجع عن هذه العملية.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={remove}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}