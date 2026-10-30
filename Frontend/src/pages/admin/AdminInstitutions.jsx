import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminInstitutions({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const basePath = type === "institute" ? "/admin/institutes" : "/admin/universities";
  const title = type === "institute" ? "المعاهد" : "الجامعات";
  const token = localStorage.getItem("admin_token");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/institutions?type=${type}&name=${encodeURIComponent(search.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      }
    } catch (err) {
      toast({ title: "خطأ", description: "فشل تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [type, search]);

  const toggle = async (item) => {
    try {
      const res = await fetch(`${API_URL}/api/institutions/${item._id || item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_visible: !item.is_visible }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) =>
        prev.map((i) => ((i._id === item._id || i.id === item.id) ? { ...i, is_visible: !i.is_visible } : i))
      );
    } catch (e) {
      toast({ title: "خطأ", description: "فشل تحديث حالة الظهور", variant: "destructive" });
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id || deleteTarget.id;
    try {
      const res = await fetch(`${API_URL}/api/institutions/${targetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((i) => (i._id !== targetId && i.id !== targetId)));
      toast({ title: "نجاح", description: "تم حذف المؤسسة بنجاح" });
    } catch (e) {
      toast({ title: "خطأ", description: "فشل حذف المؤسسة", variant: "destructive" });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="text-right" dir="rtl">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{title}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            أضف وعدّل {type === "institute" ? "المعاهد" : "الجامعات"}، وحدد المستندات المطلوبة لكل مؤسسة.
          </p>
        </div>
        <Button asChild className="gap-2 bg-primary">
          <Link to={`${basePath}/new`}>
            <Plus className="h-4 w-4" />
            إضافة {type === "institute" ? "معهد" : "جامعة"}
          </Link>
        </Button>
      </div>

      <div className="relative mt-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="بحث بالاسم..."
          className="bg-card pl-9 text-right"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-[var(--radius)] border border-border/70 bg-card">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : items.length ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                  {["الاسم", "الدولة", "التخصصات", "المستندات", "ظاهر", ""].map((head) => (
                    <TableHead key={head} className="whitespace-nowrap text-right text-xs text-muted-foreground">
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id || item.id}>
                    <TableCell className="max-w-[240px]">
                      <p className="truncate text-sm font-medium text-primary">{item.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{item.city}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">{item.country || "—"}</TableCell>
                    <TableCell className="text-xs">{(item.programs || []).length}</TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="outline" className="rounded-full text-[10px]">
                        {(item.required_documents || []).length}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={Boolean(item.is_visible)} onCheckedChange={() => toggle(item)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggle(item)}
                          title={item.is_visible ? "إخفاء" : "إظهار"}
                        >
                          {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link to={`${basePath}/${item._id || item.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
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
          <p className="p-10 text-center text-sm text-muted-foreground">
            لا توجد {type === "institute" ? "معاهد" : "جامعات"} بعد. ابدأ بالإضافة.
          </p>
        )}
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(value) => !value && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card text-right" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-primary">حذف {deleteTarget?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف المؤسسة مع مستنداتها المطلوبة. لن تتأثر الطلبات المرسلة سابقًا.
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