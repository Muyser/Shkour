import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";

function DocumentRow({ doc, upload, onFile, onRemove }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      await onFile(doc, file);
    } catch (uploadError) {
      setError(uploadError?.message || "تعذر رفع الملف، تأكد من الصيغة والحجم.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm text-right">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#0d8274]/70 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-900">{doc.name}</span>
          <Badge
            variant="outline"
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              doc.required
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            {doc.required ? "مطلوب" : "اختياري"}
          </Badge>
        </div>

        <span
          className={`text-[11px] font-medium ${
            upload ? "text-emerald-600" : doc.required ? "text-amber-600" : "text-slate-400"
          }`}
        >
          {upload ? "تم الرفع" : doc.required ? "لم يتم الرفع — مطلوب" : "لم يتم الرفع — اختياري"}
        </span>
      </div>

      {doc.note ? <p className="mt-1.5 text-[11px] sm:text-xs text-slate-500">{doc.note}</p> : null}

      {upload ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5">
          <span className="flex min-w-0 items-center gap-2 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="truncate">{upload.file_name}</span>
          </span>
          <Button type="button" size="icon" variant="ghost" className="h-7 w-7 rounded-xl hover:bg-emerald-100 text-emerald-700" onClick={() => onRemove(doc)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div className="mt-3.5">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={pick}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-2xl border-slate-200 bg-white text-xs sm:text-sm text-slate-700 hover:bg-slate-50 gap-2 px-4 py-2.5"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin text-[#0d8274]" /> : <Upload className="h-4 w-4 text-[#0d8274]" />}
            {busy ? "جارٍ الرفع..." : "رفع الملف"}
          </Button>
          <p className="mt-1.5 text-[10px] sm:text-[11px] text-slate-400">PDF أو JPG أو PNG — حتى 10 ميجابايت</p>
        </div>
      )}

      {error ? <p className="mt-2 text-[11px] text-red-600">{error}</p> : null}
    </div>
  );
}

export default function DocumentsStep({ documents, uploads, onFile, onRemove }) {
  if (!documents.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-xs sm:text-sm text-slate-500">
        لا توجد مستندات محددة لهذه المؤسسة حاليًا. يمكنك المتابعة إلى المراجعة وإرسال الطلب، وسيتواصل معك
        فريق المكتب لتزويدك بالمستندات المطلوبة.
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm leading-6 text-slate-600">
        تُطلب هذه المستندات لهذه المؤسسة تحديدًا. الملفات تُحفظ بشكل خاص ولا يراها إلا فريق المكتب.
      </div>
      {documents.map((doc) => (
        <DocumentRow
          key={doc.id || doc.name}
          doc={doc}
          upload={uploads[doc.name]}
          onFile={onFile}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}