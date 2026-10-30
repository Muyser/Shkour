import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { HERO_IMAGE } from "@/lib/images";
import { waLink } from "@/lib/site";

const STATS = [
  { value: "+7", label: "دول دراسية" },
  { value: "+10", label: "خدمات متكاملة" },
  { value: "100%", label: "متابعة شخصية" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-12 lg:py-16" dir="rtl">
      <div className="container-page relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        
        {/* قسم النصوص والأزرار على اليمين (يأتي أولاً) */}
        <motion.div
          className="order-1 text-right lg:order-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0d8274]/10 px-3.5 py-1.5 text-xs font-semibold text-[#0d8274]">
            <Sparkles className="h-3.5 w-3.5" />
            شريكك الموثوق في رحلة الدراسة
          </span>

          <h1 className="mt-5 font-heading text-3xl font-extrabold leading-[1.3] text-slate-900 sm:text-4xl lg:text-[3.2rem]">
            خطوتك نحو مستقبلك <br />
            تبدأ من هنا 🎓
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            نساعدك في إيجاد فرصتك الدراسية، والتقديم للجامعات والمعاهد، وتجهيز وتوثيق مستنداتك بكل سهولة.
          </p>

          {/* الأزرار */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#0d8274] px-7 py-6 text-base font-bold text-white hover:bg-[#0b6e62] shadow-sm transition"
            >
              <Link to="/universities">
                اكتشف فرصتك
                <ArrowLeft className="ms-2 h-4 w-4 rotate-180" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-200 bg-white px-6 py-6 text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="me-2 h-4 w-4 text-[#25d366] fill-current" />
                تواصل معنا عبر WhatsApp
              </a>
            </Button>
          </div>

          {/* الإحصائيات والأرقام */}
          <div className="mt-10 flex items-center gap-10 border-t border-slate-100 pt-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-right">
                <p className="font-heading text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* قسم الصورة على اليسار (تأتي ثانية) */}
        <motion.div
          className="relative order-2 lg:order-2"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-slate-50 shadow-xl">
            <Image
              src={HERO_IMAGE}
              alt="طالب في حرم جامعي حديث"
              className="aspect-[4/5] w-full object-cover"
              fittingType="fill"
            />
          </div>

          {/* البطاقة العائمة السفلية */}
          <motion.div
            className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 px-5 py-3.5 shadow-xl backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="text-right">
              <p className="font-heading text-sm font-bold text-slate-900">قبولات حقيقية</p>
              <p className="text-[11px] text-slate-500">متابعة حتى السفر</p>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}