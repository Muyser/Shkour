import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2, Lock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/site/EmptyState";
import StepIndicator from "@/components/apply/StepIndicator";
import StudentForm from "@/components/apply/StudentForm";
import DocumentsStep from "@/components/apply/DocumentsStep";
import ReviewStep from "@/components/apply/ReviewStep";
import SuccessScreen from "@/components/apply/SuccessScreen";
import { waLink } from "@/lib/site";
import usePageTitle from "@/lib/usePageTitle";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ALLOWED_TYPES = [
  "application/pdf", 
  "image/jpeg", 
  "image/jpg", 
  "image/png",
  "video/mp4",
  "video/quicktime",
  "video/webm"
];
const MAX_SIZE = 1024 * 1024 * 1024; // 1GB limit (متوافق مع إعدادات Multer)

const EMPTY_DATA = {
  student_name: "",
  nationality: "",
  gender: "male",
  whatsapp: "",
  current_country: "",
  last_qualification: "",
  grade: "",
  program: "",
};

export default function Apply() {
  // دعم كلا التسميتين للـ params لضمان عدم ظهور undefined أبداً
  const params = useParams();
  const institutionId = params.institutionId || params.id;

  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [data, setData] = useState(EMPTY_DATA);
  const [uploads, setUploads] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState(null);
  usePageTitle("طلب تقديم جديد");

  useEffect(() => {
    let active = true;
    if (!institutionId) {
      setLoading(false);
      setInstitution(null);
      return;
    }

    fetch(`${API_URL}/api/institutions/${institutionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          if (data && (data._id || data.id)) {
            setInstitution(data);
          } else {
            setInstitution(null);
          }
        }
      })
      .catch(() => {
        if (active) setInstitution(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [institutionId]);

  const documents = [...(institution?.required_documents || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const handleFile = async (doc, file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("الصيغة غير مدعومة. المسموح: PDF أو الصور (JPG/PNG) أو الفيديوهات.");
    }
    if (file.size > MAX_SIZE) {
      throw new Error("حجم الملف يتجاوز الحد الأقصى المسموح به (1 جيجابايت).");
    }

    const formData = new FormData();
    formData.append("file", file); // متطابق مع upload.single("file") في الباك إند

    // 🚀 رفع الملف إلى مسار الـ Upload المربوط مع Cloudinary
    const res = await fetch(`${API_URL}/api/applications/upload`, {
      method: "POST",
      body: formData,
    });

    const uploadRes = await res.json();
    
    if (!res.ok) throw new Error(uploadRes.error || uploadRes.message || "فشل رفع الملف");

    // تخزين الـ file_uri المباشر القادم من استجابة Cloudinary
    setUploads((prev) => ({
      ...prev,
      [doc.name]: { 
        file_uri: uploadRes.file_uri || uploadRes.url || uploadRes.secure_url, 
        file_name: uploadRes.file_name || file.name 
      },
    }));
  };

  const handleRemove = (doc) => {
    setUploads((prev) => {
      const next = { ...prev };
      delete next[doc.name];
      return next;
    });
  };

  const validateStepOne = () => {
    const next = {};
    ["student_name", "nationality", "whatsapp", "current_country", "last_qualification", "grade", "program"].forEach(
      (field) => {
        const val = data[field];
        const strVal = typeof val === "object" && val !== null ? val.name : String(val || "");
        if (!strVal.trim()) next[field] = true;
      }
    );
    if (data.whatsapp && data.whatsapp.replace(/\D/g, "").length < 8) next.whatsapp = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const missingRequired = documents.filter((doc) => doc.required && !uploads[doc.name]);

  const goNext = () => {
    setSubmitError("");
    if (step === 1 && !validateStepOne()) return;
    setStep((prev) => Math.min(3, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setSubmitError("");
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (missingRequired.length) {
      setSubmitError(`يجب رفع المستندات المطلوبة: ${missingRequired.map((doc) => doc.name).join("، ")}`);
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    try {
      const programValue = typeof data.program === "object" && data.program !== null ? data.program.name : data.program;

      const payload = {
        ...data,
        program: programValue,
        institution_id: institution._id || institution.id,
        documents: documents
          .filter((doc) => uploads[doc.name])
          .map((doc) => ({
            name: doc.name,
            required: Boolean(doc.required),
            file_uri: uploads[doc.name].file_uri,
            file_name: uploads[doc.name].file_name,
          })),
      };

      const res = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || "تعذر إرسال الطلب");

      setResult(responseData);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error?.message || "تعذر إرسال الطلب، حاول مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page py-12 bg-white min-h-screen" dir="rtl">
        <Skeleton className="h-8 w-48 sm:w-56 rounded-2xl" />
        <Skeleton className="mt-4 sm:mt-6 h-64 sm:h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="container-page py-12 sm:py-16 bg-white min-h-screen" dir="rtl">
        <EmptyState
          title="لم نجد المؤسسة المطلوبة"
          description="اختر مؤسستك من دليل الجامعات أو المعاهد لبدء التقديم."
          action={
            <Button asChild className="rounded-2xl bg-[#0d8274] font-bold text-white hover:bg-[#0d8274]/90">
              <Link to="/universities">دليل المؤسسات</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (result) {
    return <SuccessScreen trackingCode={result.tracking_code} institutionName={institution.name} />;
  }

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <div className="container-page py-8 sm:py-12">
        <Link
          to={`/${institution.type === "institute" ? "institutes" : "universities"}/${encodeURIComponent(
            institution._id || institution.id
          )}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-[#0d8274]"
        >
          <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
          العودة إلى صفحة المؤسسة
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold text-[#0d8274]">طلب تقديم</p>
            <h1 className="mt-1 font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{institution.name}</h1>
            <p className="mt-1 text-xs text-slate-500">
              {[institution.city, institution.country].filter(Boolean).join("، ")}
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-2xl border-slate-200 bg-white text-xs sm:text-sm text-slate-700 hover:bg-slate-50">
            <a
              href={waLink(undefined, `مرحبًا، أحتاج مساعدة في التقديم إلى ${institution.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="me-2 h-4 w-4 text-emerald-600" />
              مساعدة عبر واتساب
            </a>
          </Button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <StepIndicator current={step} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
            {step === 1 ? (
              <StudentForm data={data} onChange={setData} institution={institution} errors={errors} />
            ) : null}

            {step === 2 ? (
              <div>
                <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">المستندات المطلوبة</h2>
                <p className="mt-1 text-xs text-slate-500">
                  المستندات التالية خاصة بـ {institution.name} فقط. الملفات تُحفظ بشكل خاص.
                </p>
                <div className="mt-4">
                  <DocumentsStep
                    documents={documents}
                    uploads={uploads}
                    onFile={handleFile}
                    onRemove={handleRemove}
                  />
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">مراجعة طلب التقديم</h2>
                <p className="mt-1 text-xs text-slate-500">
                  تأكد من صحة البيانات قبل الإرسال. يمكنك الرجوع لتعديل أي خطوة.
                </p>
                <div className="mt-4">
                  <ReviewStep
                    data={data}
                    institution={institution}
                    documents={documents}
                    uploads={uploads}
                  />
                </div>
              </div>
            ) : null}

            {submitError ? (
              <p className="mt-4 rounded-2xl bg-red-50 px-3.5 py-2.5 text-xs text-red-600 border border-red-200">{submitError}</p>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <Button type="button" variant="ghost" onClick={goBack} disabled={step === 1 || submitting} className="rounded-2xl text-xs sm:text-sm">
                <ArrowRight className="me-1 h-4 w-4" />
                السابق
              </Button>

              {step < 3 ? (
                <Button type="button" onClick={goNext} className="rounded-2xl bg-[#0d8274] font-bold text-white hover:bg-[#0b6e62] text-xs sm:text-sm px-5">
                  التالي
                  <ArrowLeft className="ms-1 h-4 w-4 rotate-180" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={submit}
                  disabled={submitting || missingRequired.length > 0}
                  className="rounded-2xl bg-amber-500 font-bold text-slate-900 hover:bg-amber-400 text-xs sm:text-sm px-6 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="me-2 h-4 w-4 animate-spin" />
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="me-2 h-4 w-4" />
                      إرسال طلب التقديم
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="flex items-center gap-2 font-heading text-xs sm:text-sm font-bold text-slate-900">
                <Lock className="h-4 w-4 text-amber-500" />
                خصوصيتك أولًا
              </p>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                بياناتك ومستنداتك محفوظة بشكل خاص ولا يمكن الوصول إليها إلا فريق مكتب شكور لمراجعة طلبك.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-heading text-xs sm:text-sm font-bold text-slate-900">حالة المستندات</p>
              <ul className="mt-3 space-y-2 text-xs">
                {documents.length ? (
                  documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2">
                      <span className="truncate text-slate-600">{doc.name}</span>
                      <span className={uploads[doc.name] ? "text-emerald-600 font-medium" : doc.required ? "text-amber-600 font-medium" : "text-slate-400"}>
                        {uploads[doc.name] ? "تم الرفع" : doc.required ? "مطلوب" : "مطلوب"}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">لا توجد مستندات مطلوبة.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl bg-[#092c27] p-5 text-white shadow-md">
              <p className="font-heading text-xs sm:text-sm font-bold">لديك سؤال أثناء التقديم؟</p>
              <p className="mt-2 text-xs leading-6 text-white/75">
                فريق المكتب جاهز للإجابة على واتساب خلال ساعات العمل.
              </p>
              <Button asChild className="mt-4 w-full rounded-2xl bg-amber-500 font-bold text-slate-900 hover:bg-amber-400 shadow-sm text-xs sm:text-sm">
                <a
                  href={waLink(undefined, `مرحبًا، أقدّم الآن إلى ${institution.name} وأحتاج مساعدة.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="me-2 h-4 w-4" />
                  تواصل معنا
                </a>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}