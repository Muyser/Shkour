import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, IdCard, MessageCircle, ScrollText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/site/EmptyState";
import ServiceIcon from "@/components/site/ServiceIcon";
import { waLink } from "@/lib/site";
import usePageTitle from "@/lib/usePageTitle";

const CERTIFICATE_SLUG = "استخراج-الشهادات-السودانية";

// Fallback details for services if fetched data is missing
const DEFAULT_SERVICE_DETAIL = {
  title: "استخراج الشهادات السودانية",
  slug: CERTIFICATE_SLUG,
  short_description: "نستخرج شهادتك باللغتين العربية والإنجليزية ونجهّز ملفك كاملًا، بمتابعة دقيقة من فريق المكتب.",
  description: "نقدم خدمة متكاملة لاستخراج وتوثيق الشهادات الدراسية السودانية بسرعة وموثوقية عالية، مع مراجعة تامة للمستندات لضمان قبولها.",
  icon: "ScrollText",
  includes: ["مراجعة الأوراق المطلوبة", "المتابعة الميدانية اليومية", "تجهيز الترجمة والتصديق"],
  requirements: ["صورة جواز السفر أو الرقم الوطني", "شهادة الأساس أو الثانوي"]
};

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  usePageTitle(service?.title);

  useEffect(() => {
    let active = true;
    const decoded = decodeURIComponent(slug || "");
    const load = async () => {
      setLoading(true);
      try {
        const page = await base44.entities.Service.filter({ is_visible: true }, { limit: 40 });
        const items = page?.items || [];
        const found =
          items.find((item) => item.slug === decoded) ||
          items.find((item) => item.title === decoded) ||
          null;

        if (active) {
          setService(found || { ...DEFAULT_SERVICE_DETAIL, title: decoded || DEFAULT_SERVICE_DETAIL.title });
        }
      } catch (err) {
        if (active) {
          setService(DEFAULT_SERVICE_DETAIL);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-16 bg-white min-h-screen" dir="rtl">
        <Skeleton className="h-10 w-56 rounded-2xl" />
        <Skeleton className="mt-6 h-56 w-full rounded-2xl" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container-page py-16 bg-white min-h-screen" dir="rtl">
        <EmptyState
          title="الخدمة غير موجودة"
          action={
            <Button asChild className="rounded-2xl bg-[#0d8274] font-bold text-white hover:bg-[#0d8274]/90">
              <Link to="/services">كل الخدمات</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const isCertificate = service.slug === CERTIFICATE_SLUG || service.title === "استخراج الشهادات السودانية";

  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <section className="border-b border-slate-100 bg-white text-right">
        <div className="container-page py-12 sm:py-16">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0d8274] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            كل الخدمات
          </Link>
          <div className="mt-6 flex flex-col sm:flex-row items-start gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0d8274]/10 text-[#0d8274]">
              <ServiceIcon name={service.icon} className="h-7 w-7" />
            </span>
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-slate-900 sm:text-4xl">{service.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-8 text-slate-600">{service.short_description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.6fr_1fr] text-right">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-slate-900">عن الخدمة</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-slate-600">{service.description}</p>
          </section>

          {isCertificate ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="flex items-center gap-2 font-heading text-xl font-bold text-slate-900">
                <ScrollText className="h-5 w-5 text-amber-500" />
                المطلوبات
              </h2>

              <h3 className="mt-6 text-sm font-bold text-slate-900">إثبات الهوية</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <IdCard className="h-4 w-4 text-amber-500" />
                    شهادة باللغة الإنجليزية
                  </div>
                  <p className="mt-2 text-sm text-slate-600">صورة من جواز السفر</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <IdCard className="h-4 w-4 text-amber-500" />
                    شهادة باللغة العربية
                  </div>
                  <p className="mt-2 text-sm text-slate-600">صورة من الرقم الوطني</p>
                </div>
              </div>

              <h3 className="mt-6 text-sm font-bold text-slate-900">المستندات والبيانات الأكاديمية</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {["شهادة الأساس / الصف الثامن", "رقم الجلوس", "اسم المدرسة", "عام الامتحان"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {service.includes?.length ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-slate-900">ماذا تشمل الخدمة؟</h2>
              <ul className="mt-4 space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-7 text-slate-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {service.requirements?.length && !isCertificate ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-slate-900">المستندات والمتطلبات</h2>
              <ul className="mt-4 space-y-3">
                {service.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-7 text-slate-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-[#092c27] p-6 sm:p-8 text-white shadow-md">
            <p className="font-heading text-xl font-bold">ابدأ طلبك الآن</p>
            <p className="mt-3 text-xs leading-7 text-white/75">
              أرسل لنا تفاصيلك على واتساب وسيرد عليك فريق المكتب خلال ساعات العمل.
            </p>
            <Button asChild className="mt-6 w-full rounded-2xl bg-amber-500 font-bold text-slate-900 hover:bg-amber-400 shadow-sm">
              <a
                href={waLink(undefined, `مرحبًا، أريد الاستفسار عن خدمة: ${service.title}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="ms-2 h-4 w-4 text-emerald-600" />
                {service.cta_label || "تواصل معنا"}
              </a>
            </Button>
            <Button asChild variant="ghost" className="mt-3 w-full rounded-2xl text-white hover:bg-white/10 hover:text-white">
              <Link to="/services">خدمات أخرى</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}