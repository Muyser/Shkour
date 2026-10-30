import { Eye, ShieldCheck, UserRoundCheck, Zap } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "مصداقية وشفافية",
    text: "معلومات واضحة عن كل مؤسسة، ولا رسوم مخفية. أنت تعرف كل خطوة قبل أن تبدأها.",
  },
  {
    icon: UserRoundCheck,
    title: "متابعة شخصية",
    text: "مسؤول واحد يرافق ملفك من أول استشارة حتى استلام القبول، ويجيبك على واتساب.",
  },
  {
    icon: Eye,
    title: "ملف بلا أخطاء",
    text: "نراجع كل مستند قبل الإرسال لتقليل فرص الرفض أو طلب مستندات ناقصة.",
  },
  {
    icon: Zap,
    title: "سرعة في الإجراءات",
    text: "نبدأ العمل على طلبك فور استلامه، ونحدّث حالتك في كل مرحلة.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-white py-12 sm:py-24" dir="rtl">
      <div className="container-page">
        <SectionHeading
          eyebrow="لماذا نحن"
          title="لماذا مكتب شكور؟"
          description="لأن اختيار جامعتك قرار مستقبلي، نمنحه من الدقة والوضوح ما يستحق."
        />
        {/* شبكة بطاقتين في الشاشات الصغيرة (grid-cols-2) وتصبح 4 أعمدة في الشاشات الكبيرة */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-6 lg:grid-cols-4 text-right">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#0d8274]/10 text-[#0d8274]">
                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <h3 className="mt-3 sm:mt-4 font-heading text-sm sm:text-base font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">{feature.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}