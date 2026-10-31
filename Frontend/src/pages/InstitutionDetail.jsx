import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/site/EmptyState";
import { TYPE_LABEL, waLink } from "@/lib/site";
import usePageTitle from "@/lib/usePageTitle";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function InfoCard({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 text-right shadow-md sm:shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-slate-500">
        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0d8274]" />
        {label}
      </div>
      <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function Bullets({ items, emptyText }) {
  if (!items?.length) return <p className="text-xs sm:text-sm text-slate-500">{emptyText}</p>;
  return (
    <ul className="space-y-2.5 text-right">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed sm:leading-7 text-slate-600">
          <CheckCircle2 className="mt-0.5 sm:mt-1 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#0d8274]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function InstitutionDetail() {
  const { id } = useParams();
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  usePageTitle(institution?.name);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`${API_URL}/api/institutions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data && data._id) {
          setInstitution(data);
        } else {
          setInstitution(null);
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
  }, [id]);

  if (loading) {
    return (
      <div className="container-page py-8 sm:py-16 bg-white min-h-screen px-3 sm:px-6" dir="rtl">
        <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 rounded-3xl" />
        <Skeleton className="mt-4 h-48 sm:h-60 w-full rounded-3xl" />
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="container-page py-8 sm:py-16 bg-white min-h-screen px-3 sm:px-6" dir="rtl">
        <EmptyState
          title="المؤسسة غير موجودة"
          description="ربما تم حذفها أو أن الرابط غير صحيح."
          action={
            <Button asChild className="rounded-2xl bg-[#0d8274] font-bold text-white hover:bg-[#0d8274]/90 text-xs sm:text-sm shadow-md">
              <Link to="/universities">العودة إلى الجامعات</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isInstitute = institution.type === "institute";
  const documents = [...(institution.required_documents || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
  const requiredCount = documents.filter((doc) => doc.required).length;
  const targetId = institution._id;

  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <section className="border-b border-slate-100 bg-white text-right">
        <div className="container-page py-8 sm:py-16 px-3 sm:px-6">
          <Link
            to={isInstitute ? "/institutes" : "/universities"}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-[#0d8274]"
          >
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            العودة إلى {isInstitute ? "المعاهد" : "الجامعات"}
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-[#0d8274] px-3.5 py-1 text-[11px] font-bold text-white shadow-sm">
                  {TYPE_LABEL[institution.type] || "مؤسسة تعليمية"}
                </Badge>
                {institution.country ? (
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-[#0d8274]" />
                    {[institution.city, institution.country].filter(Boolean).join("، ")}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-2.5 font-heading text-2xl sm:text-3xl lg:text-[2.4rem] font-extrabold leading-tight text-slate-900">
                {institution.name}
              </h1>
              <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600">
                {institution.description || "لا توجد نبذة تعريفية متاحة حالياً."}
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Button asChild className="w-full sm:w-auto rounded-2xl bg-amber-500 font-bold text-slate-900 hover:bg-amber-400 shadow-md text-xs sm:text-sm py-4">
                  <Link to={`/apply/${targetId}`}>
                    ابدأ التقديم
                    <ArrowLeft className="ms-2 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm py-4 shadow-sm">
                  <a
                    href={waLink(undefined, `مرحبًا، أريد الاستفسار عن ${institution.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="me-2 h-4 w-4 text-emerald-600" />
                    استفسر عبر واتساب
                  </a>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-2xl">
              {institution.image_url ? (
                <img
                  src={institution.image_url}
                  alt={institution.name}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-[#0d8274] to-[#092c27]">
                  <GraduationCap className="h-12 w-12 text-amber-400" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoCard icon={Clock} label="مدة الدراسة" value={institution.duration} />
            <InfoCard icon={Wallet} label="الرسوم الدراسية" value={institution.tuition_fees} />
            <InfoCard icon={CalendarClock} label="مواعيد التقديم" value={institution.application_deadline} />
            <InfoCard icon={Globe2} label="لغة الدراسة" value={institution.language} />
          </div>
        </div>
      </section>

      <div className="container-page grid gap-6 py-8 sm:py-16 lg:grid-cols-[1.6fr_1fr] text-right px-3 sm:px-6">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-md sm:shadow-lg">
            <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">التخصصات المتاحة</h2>
            <div className="mt-3.5 flex flex-wrap gap-2">
              {institution.programs?.length ? (
                institution.programs.map((program, idx) => (
                  <span
                    key={idx}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm"
                  >
                    {program}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-500">لا توجد تخصصات مضافة حالياً.</p>
              )}
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-md sm:shadow-lg">
              <h2 className="font-heading text-sm sm:text-base font-bold text-slate-900">الدرجات العلمية</h2>
              <div className="mt-3.5">
                <Bullets items={institution.degrees} emptyText="غير متوفرة." />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-md sm:shadow-lg">
              <h2 className="font-heading text-sm sm:text-base font-bold text-slate-900">متطلبات القبول</h2>
              <div className="mt-3.5">
                <Bullets items={institution.admission_requirements} emptyText="غير متوفرة." />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-md sm:shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-heading text-base sm:text-lg font-bold text-slate-900">
                <FileText className="h-4 w-4 text-[#0d8274]" />
                المستندات المطلوبة للتقديم
              </h2>
              <span className="rounded-full bg-slate-100 px-3.5 py-1 text-[10px] sm:text-xs font-semibold text-slate-600 shadow-sm">
                {requiredCount} مستند مطلوب من أصل {documents.length}
              </span>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {documents.length ? (
                documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 py-3.5">
                    <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                      <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#0d8274] shrink-0" />
                      <span>{doc.name}</span>
                      {doc.note ? <span className="text-[10px] text-slate-400">({doc.note})</span> : null}
                    </span>
                    <Badge
                      variant="outline"
                      className={`rounded-full px-3 py-0.5 text-[10px] font-semibold shrink-0 ${
                        doc.required
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {doc.required ? "مطلوب" : "اختياري"}
                    </Badge>
                  </li>
                ))
              ) : (
                <li className="py-3 text-xs text-slate-500">
                  لا توجد مستندات مطلوبة محددة لهذه المؤسسة.
                </li>
              )}
            </ul>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-3xl bg-[#092c27] p-5 sm:p-6 text-white shadow-2xl">
            <p className="font-heading text-base sm:text-lg font-bold">هل هذه مؤسستك المناسبة؟</p>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/75">
              ابدأ طلبك الآن، وسيتواصل معك فريق المكتب لمراجعة ملفك والتأكد من مستنداتك.
            </p>
            <Button asChild className="mt-5 w-full rounded-2xl bg-amber-500 font-bold text-slate-900 hover:bg-amber-400 shadow-md text-xs sm:text-sm py-3.5">
              <Link to={`/apply/${targetId}`}>ابدأ التقديم</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2.5 w-full rounded-2xl text-white hover:bg-white/10 hover:text-white text-xs sm:text-sm py-3.5">
              <a href={waLink(undefined, `مرحبًا، أريد التقديم إلى ${institution.name}.`)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="ms-2 h-4 w-4 text-emerald-400" />
                واتساب
              </a>
            </Button>
          </div>

          {(institution.contact_phone || institution.contact_email || institution.website) && (
            <div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-md sm:shadow-lg">
              <p className="font-heading text-sm sm:text-base font-bold text-slate-900">معلومات التواصل</p>
              <ul className="mt-3.5 space-y-3 text-xs sm:text-sm text-slate-600">
                {institution.contact_phone ? (
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-3.5 w-3.5 text-[#0d8274]" />
                    <span dir="ltr">{institution.contact_phone}</span>
                  </li>
                ) : null}
                {institution.contact_email ? (
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-3.5 w-3.5 text-[#0d8274]" />
                    <span dir="ltr">{institution.contact_email}</span>
                  </li>
                ) : null}
                {institution.website ? (
                  <li className="truncate pt-1">
                    <a className="font-semibold text-[#0d8274] hover:underline" href={institution.website} target="_blank" rel="noopener noreferrer">
                      {institution.website}
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}