import { Link } from "react-router-dom";
import { ArrowLeft, Stamp } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

const ITEMS = [
  { title: "توثيق من السفارة السودانية", text: "تصديق المستندات الرسمية من السفارة السودانية في بلد الدراسة." },
  { title: "توثيق من الخارجية المصرية", text: "استكمال إجراءات التوثيق من وزارة الخارجية المصرية." },
  { title: "تجهيز المستندات", text: "ترتيب الملف، مراجعة الصيغة، وتجهيز النسخ المطلوبة." },
  { title: "مراجعة المستندات", text: "تدقيق كامل قبل التسليم لتفادي أي رفض أو إعادة إجراء." },
];

export default function AttestationSection() {
  return (
    <section className="bg-white py-8 sm:py-16" dir="rtl">
      <div className="container-page px-3 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <SectionHeading
              align="start"
              eyebrow="التوثيق"
              title="توثيق الشهادات والمستندات"
              description="ملف موثق بالكامل یعنی قبولًا أسرع. نتولى إجراءات التوثيق نيابة عنك من البداية حتى النهاية."
            />
            <Link
              to="/services/توثيق-الشهادات-والمستندات"
              className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0d8274] hover:underline"
            >
              تفاصيل خدمة التوثيق
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-180" />
            </Link>
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 text-right">
            {ITEMS.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className="h-full rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 shadow-md sm:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#0d8274]/30 hover:shadow-xl">
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#0d8274]/10 text-[#0d8274]">
                    <Stamp className="h-4 w-4 sm:h-5 sm:w-5" />
                  </span>
                  <h3 className="mt-3 sm:mt-4 font-heading text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}