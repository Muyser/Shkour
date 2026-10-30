import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  MessageCircle,
  Save,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/site/StatusBadge";
import EmptyState from "@/components/site/EmptyState";
import { formatDate, waLink } from "@/lib/site";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const STATUS_OPTIONS = ["قيد الانتظار", "قيد المراجعة", "مقبول", "مرفوض"];

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2.5 last:border-0 text-right">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-primary">{value || "—"}</span>
    </div>
  );
}

export default function AdminApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("قيد الانتظار");
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/api/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data && data._id) {
          setApplication(data);
          setNotes(data.admin_notes || "");
          setStatus(data.status || "قيد الانتظار");
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, token]);

  const save = async () => {
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, admin_notes: notes }),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || "فشل التحديث");

      setApplication((prev) => ({ ...prev, status, admin_notes: notes }));
      alert("تم تحديث الطلب بنجاح");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteApp = async () => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/applications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل الحذف");
      navigate("/admin/applications");
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 text-right" dir="rtl">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64 w-full rounded-[var(--radius)]" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-right" dir="rtl">
        <EmptyState
          title="الطلب غير موجود"
          action={
            <Button asChild>
              <Link to="/admin/applications">كل الطلبات</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const documents = application.documents || [];

  return (
    <div className="space-y-5 text-right" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/admin/applications" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            كل الطلبات
          </Link>
          <h1 className="mt-2 font-heading text-2xl font-bold text-primary">{application.student_name}</h1>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground" dir="ltr">
            {application.tracking_code}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={application.status} />
          <Button asChild variant="outline" size="sm">
            <a
              href={waLink(
                String(application.whatsapp || "").replace(/\D/g, ""),
                `مرحبًا ${application.student_name}، بخصوص طلبك رقم ${application.tracking_code} في مكتب شكور.`
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="ms-1.5 h-4 w-4" />
              واتساب
            </a>
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteApp} disabled={deleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
            <h2 className="font-heading text-base font-bold text-primary">معلومات الطالب</h2>
            <div className="mt-2">
              <Row label="الاسم الكامل" value={application.student_name} />
              <Row label="الجنسية" value={application.nationality} />
              <Row label="الجنس" value={application.gender === "female" ? "أنثى" : "ذكر"} />
              <Row label="واتساب" value={application.whatsapp} />
              <Row label="الدولة الحالية" value={application.current_country} />
            </div>
          </section>

          <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
            <h2 className="font-heading text-base font-bold text-primary">المعلومات الأكاديمية</h2>
            <div className="mt-2">
              <Row label="آخر مؤهل دراسي" value={application.last_qualification} />
              <Row label="النسبة / الدرجة" value={application.grade} />
              <Row label="التخصص المطلوب" value={application.program} />
              <Row label="تاريخ الإرسال" value={formatDate(application.createdAt)} />
            </div>
          </section>

          <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-bold text-primary">المستندات المرفوعة</h2>
              <span className="text-[11px] text-muted-foreground">{documents.length} مستند</span>
            </div>
            <div className="mt-3 space-y-2">
              {documents.length ? (
                documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-secondary/50 px-3 py-2.5"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-xs text-primary">
                      <FileText className="h-4 w-4 shrink-0 text-gold" />
                      <span className="truncate">{doc.name}</span>
                      <span className="text-[10px] text-muted-foreground">({doc.file_name})</span>
                    </span>
                    <Button asChild size="sm" variant="ghost">
                      <a href={doc.file_uri} target="_blank" rel="noreferrer">
                        <ExternalLink className="ms-1 h-3.5 w-3.5" />
                        فتح الملف
                      </a>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">لم يرفع الطالب أي مستندات.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
            <h2 className="font-heading text-base font-bold text-primary">تحديث الطلب</h2>
            <div className="mt-3 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">حالة الطلب</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1 text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl">
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">ملاحظات داخلية</label>
                <Textarea
                  rows={5}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="ملاحظات لا تظهر للطالب..."
                  className="mt-1 text-right"
                />
              </div>
              {errorMsg ? <p className="text-xs text-destructive">{errorMsg}</p> : null}
              <Button onClick={save} disabled={saving} className="w-full gap-2 bg-primary">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                حفظ التحديثات
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}