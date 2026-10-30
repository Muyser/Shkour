import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import StatusBadge from "@/components/site/StatusBadge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/site";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUSES = [
  { key: "all", label: "الكل" },
  { key: "قيد الانتظار", label: "قيد الانتظار" },
  { key: "قيد المراجعة", label: "قيد المراجعة" },
  { key: "مقبول", label: "مقبول" },
  { key: "مرفوض", label: "مرفوض" },
];

export default function AdminApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        let url = `${API_URL}/api/applications?`;
        if (status !== "all") url += `status=${encodeURIComponent(status)}&`;
        if (search.trim()) url += `search=${encodeURIComponent(search.trim())}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (active) {
          if (res.ok) {
            setItems(data.items || []);
          } else {
            setItems([]);
          }
        }
      } catch (err) {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [status, search, token]);

  return (
    <div className="text-right" dir="rtl">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">طلبات التقديم</h1>
        <p className="mt-1 text-xs text-muted-foreground">راجع الطلبات، حمّل المستندات، وحدّث حالة كل طلب.</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {STATUSES.map((item) => (
          <Button
            key={item.key}
            size="sm"
            variant={status === item.key ? "default" : "outline"}
            className={status === item.key ? "bg-primary" : ""}
            onClick={() => setStatus(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="relative mt-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ابحث باسم الطالب..."
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
                  {["رقم الطلب", "اسم الطالب", "واتساب", "التخصص", "التاريخ", "الحالة", ""].map(
                    (head) => (
                      <TableHead key={head} className="whitespace-nowrap text-right text-xs text-muted-foreground">
                        {head}
                      </TableHead>
                    )
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="whitespace-nowrap font-mono text-[11px] text-muted-foreground" dir="ltr">
                      {item.tracking_code || "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm font-medium text-primary">{item.student_name}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs" dir="ltr">
                      {item.whatsapp}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate text-xs">{item.program || "—"}</TableCell>
                    <TableCell className="whitespace-nowrap text-[11px] text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-left">
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/admin/applications/${item._id}`}>فتح</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="p-10 text-center text-sm text-muted-foreground">لا توجد طلبات مطابقة.</p>
        )}
      </div>
    </div>
  );
}