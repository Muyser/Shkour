
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, XCircle } from "lucide-react";

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-primary">{value || "—"}</span>
    </div>
  );
}

export default function ReviewStep({ data, institution, documents, uploads }) {
  const genderLabel = data.gender === "female" ? "أنثى" : "ذكر";

  return (
    <div className="space-y-5">
      <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
        <h2 className="font-heading text-base font-bold text-primary">بيانات الطالب</h2>
        <div className="mt-2 divide-y divide-border/60">
          <Row label="الاسم الكامل" value={data.student_name} />
          <Row label="الجنسية" value={data.nationality} />
          <Row label="الجنس" value={genderLabel} />
          <Row label="واتساب" value={data.whatsapp} />
          <Row label="البريد الإلكتروني" value={data.email} />
          <Row label="الدولة الحالية" value={data.current_country} />
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
        <h2 className="font-heading text-base font-bold text-primary">البيانات الأكاديمية</h2>
        <div className="mt-2 divide-y divide-border/60">
          <Row label="آخر مؤهل دراسي" value={data.last_qualification} />
          <Row label="النسبة / الدرجة" value={data.grade} />
          <Row label="التخصص المطلوب" value={data.program} />
          <Row label="الجامعة / المعهد" value={institution?.name} />
          <Row label="الدولة" value={institution?.country} />
        </div>
      </section>

      <section className="rounded-[var(--radius)] border border-border/70 bg-card p-5">
        <h2 className="font-heading text-base font-bold text-primary">المستندات</h2>
        {documents.length ? (
          <ul className="mt-3 space-y-2">
            {documents.map((doc) => {
              const uploaded = uploads[doc.name];
              return (
                <li key={doc.id || doc.name} className="flex items-center justify-between gap-3 rounded-xl bg-secondary/50 px-3 py-2">
                  <span className="flex min-w-0 items-center gap-2 text-xs text-primary">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </span>
                  {uploaded ? (
                    <span className="flex shrink-0 items-center gap-1 text-[11px] text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {uploaded.file_name}
                    </span>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`shrink-0 rounded-full text-[10px] ${
                        doc.required
                          ? "border-destructive/30 bg-destructive/5 text-destructive"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      <XCircle className="me-1 h-3 w-3" />
                      {doc.required ? "ناقص" : "لم يُرفع (اختياري)"}
                    </Badge>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">لا توجد مستندات محددة لهذه المؤسسة.</p>
        )}
      </section>
    </div>
  );
}