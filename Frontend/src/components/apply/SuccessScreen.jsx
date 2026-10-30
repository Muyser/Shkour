import { Link } from "react-router-dom";
import { CheckCircle2, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink } from "@/lib/site";

export default function SuccessScreen({ trackingCode, institutionName }) {
  return (
    <div className="container-page py-12 sm:py-16 bg-white min-h-screen" dir="rtl">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8" />
        </div>
        
        <h1 className="mt-4 sm:mt-5 font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">تم إرسال طلبك بنجاح ✅</h1>
        
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
          سيقوم فريق مكتب شكور بمراجعة طلبك والتواصل معك عبر WhatsApp في أقرب وقت.
        </p>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500">رقم الطلب</p>
          <p className="mt-1 font-mono text-lg sm:text-xl font-bold tracking-wider text-slate-900" dir="ltr">
            {trackingCode}
          </p>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(trackingCode)}
            className="mt-2 inline-flex items-center gap-1 text-[11px] sm:text-xs text-[#0d8274] font-semibold hover:underline"
          >
            <Copy className="h-3 w-3" />
            نسخ رقم الطلب
          </button>
        </div>

        {institutionName ? (
          <p className="mt-4 text-xs text-slate-500">المؤسسة المختارة: <span className="font-semibold text-slate-800">{institutionName}</span></p>
        ) : null}
        
        <p className="mt-1 text-[11px] text-slate-400">احتفظ برقم الطلب لمتابعة حالة طلبك مع المكتب.</p>

        <div className="mt-6 sm:mt-7 flex flex-col gap-2.5 sm:flex-row">
          <Button asChild className="flex-1 rounded-2xl bg-[#0d8274] font-bold text-white hover:bg-[#0b6e62] text-xs sm:text-sm py-3">
            <Link to="/">العودة إلى الرئيسية</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm py-3">
            <a
              href={waLink(undefined, `مرحبًا، أرسلت طلب تقديم برقم: ${trackingCode}`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="me-2 h-4 w-4 text-emerald-600" />
              متابعة عبر واتساب
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}