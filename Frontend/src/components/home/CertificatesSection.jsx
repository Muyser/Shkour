import { Link } from "react-router-dom";
import { ArrowLeft, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/site/Reveal";
import { waLink } from "@/lib/site";

export default function CertificatesSection() {
  return (
    <section className="bg-white py-8 sm:py-16" dir="rtl">
      <div className="container-page px-3 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-[#0d8274] text-white shadow-2xl">
          <div className="grid gap-6 p-5 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12 text-right">
            <Reveal>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                <ScrollText className="h-3.5 w-3.5" />
                خدمة خاصة
              </span>
              <h2 className="mt-4 font-heading text-2xl font-extrabold sm:text-3xl lg:text-4xl leading-tight">
                استخراج الشهادات السودانية
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed sm:leading-8 text-white/85">
                نستخرج شهادتك باللغتين العربية والإنجليزية ونجهّز ملفك كاملًا، بمتابعة دقيقة من فريق المكتب حتى
                استلام المستند.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild className="rounded-2xl bg-[#f59e0b] px-6 py-4 text-xs sm:text-sm font-bold text-slate-900 hover:bg-[#d9822b] shadow-md transition-all">
                  <a
                    href={waLink(undefined, "مرحبًا، أرغب في بدء طلب استخراج الشهادة السودانية.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ابدأ طلب استخراج الشهادة
                  </a>
                </Button>
                <Button asChild variant="ghost" className="rounded-2xl text-white hover:bg-white/10 hover:text-white px-5 py-4 text-xs sm:text-sm transition-all">
                  <Link to="/services/استخراج-الشهادات-السودانية">
                    تفاصيل الخدمة
                    <ArrowLeft className="ms-1.5 h-4 w-4 rotate-180" />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm shadow-inner">
                  <p className="text-xs font-bold text-amber-300">شهادة بالإنجليزية</p>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/90">صورة من جواز السفر</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm shadow-inner">
                  <p className="text-xs font-bold text-amber-300">شهادة بالعربية</p>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-white/90">صورة من الرقم الوطني</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm sm:col-span-2 shadow-inner">
                  <p className="text-xs font-bold text-amber-300">المستندات والبيانات الأكاديمية</p>
                  <ul className="mt-2 grid gap-1.5 text-xs sm:text-sm text-white/90 sm:grid-cols-2 list-disc list-inside">
                    <li>شهادة الأساس / الصف الثامن</li>
                    <li>رقم الجلوس</li>
                    <li>اسم المدرسة</li>
                    <li>عام الامتحان</li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}