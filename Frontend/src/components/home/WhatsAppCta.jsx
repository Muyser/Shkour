import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/site/Reveal";
import useSiteSettings from "@/lib/useSiteSettings";
import { waLink } from "@/lib/site";

export default function WhatsAppCta() {
  const settings = useSiteSettings();

  return (
    <section className="bg-white py-8 sm:py-16" dir="rtl">
      <div className="container-page px-3 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#0d8274] px-5 py-10 text-center text-white shadow-2xl sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl" />
            
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md">
              جاهزون للإجابة على أسئلتك
            </span>
            
            <h2 className="mx-auto mt-3 max-w-xl font-heading text-xl font-extrabold text-white sm:text-3xl lg:text-4xl leading-tight">
              تحدّث مع مستشار تعليمي الآن على واتساب
            </h2>
            
            <p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm leading-relaxed sm:leading-8 text-white/85">
              أخبرنا بمؤهلك وتخصصك المفضل، وسنرسل لك خيارات مناسبة خلال دقائق.
            </p>
            
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl bg-[#f59e0b] px-6 py-4 text-xs sm:text-base font-bold text-slate-900 hover:bg-[#d9822b] shadow-md transition-all">
                <a href={waLink(settings?.whatsapp_number)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="ms-2 h-4 w-4 sm:h-5 sm:w-5 fill-current text-slate-900" />
                  محادثة واتساب
                </a>
              </Button>
              {settings?.phone ? (
                <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto rounded-2xl px-6 py-4 text-xs sm:text-base font-semibold text-white hover:bg-white/10 hover:text-white transition-all">
                  <a href={`tel:${settings.phone}`}>
                    <Phone className="ms-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {settings.phone}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}