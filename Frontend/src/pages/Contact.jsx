import { Mail, MessageCircle, Phone } from "lucide-react";
import useSiteSettings from "@/lib/useSiteSettings";
import { waLink } from "@/lib/site";
import ContactForm from "@/components/contact/ContactForm";

const DEFAULTS = {
  whatsapp_number: "250794420606",
  phone: "+250 794 420 606",
  email: "info@shakoor-office.com",
};

function InfoRow({ icon, label, value, href }) {
  const content = (
    <>
      <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-[#0d8274]">
        {icon}
      </span>
      <span className="min-w-0 text-right">
        <span className="block text-[11px] sm:text-xs font-medium text-slate-500">{label}</span>
        <span className="block truncate text-xs sm:text-sm font-semibold text-slate-900" dir={href && href.startsWith("tel") ? "ltr" : undefined}>
          {value}
        </span>
      </span>
    </>
  );
  const baseClass =
    "flex items-center gap-3.5 rounded-3xl border border-slate-100 bg-white p-4 sm:p-5 shadow-md sm:shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0d8274]/30 hover:shadow-xl";
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={baseClass}>
      {content}
    </a>
  ) : (
    <div className={baseClass}>{content}</div>
  );
}

export default function Contact() {
  const settings = useSiteSettings();
  const whatsapp = settings?.whatsapp_number || DEFAULTS.whatsapp_number;
  const phone = settings?.phone || DEFAULTS.phone;
  const email = settings?.email || DEFAULTS.email;

  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <section className="relative overflow-hidden border-b border-slate-100 bg-white text-right">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="container-page relative py-12 sm:py-20 px-3 sm:px-6">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#0d8274]/10 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[11px] sm:text-xs font-bold text-[#0d8274]">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            تواصل معنا
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-[2.6rem] font-extrabold leading-tight text-slate-900 text-balance">
            نحن هنا للإجابة على كل أسئلتك
          </h1>
          <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed sm:leading-8 text-slate-600">
            سواء كان لديك استفسار عن التقديم للجامعات، أو ترغب في خدمات التوثيق والتأشيرات، فريقنا جاهز لمساعدتك عبر الهاتف أو واتساب.
          </p>
        </div>
      </section>

      <div className="container-page py-8 sm:py-16 px-3 sm:px-6">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-5 text-right">
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-8 shadow-md sm:shadow-lg">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-3.5 sm:space-y-4 lg:col-span-2">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-900 px-1">معلومات التواصل</h2>
            <InfoRow
              icon={<MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="واتساب"
              value={`+${whatsapp}`}
              href={waLink(whatsapp, "مرحبًا، أرغب في الاستفسار عن خدماتكم.")}
            />
            <InfoRow icon={<Phone className="h-4 w-4 sm:h-5 sm:w-5" />} label="الهاتف" value={phone} href={`tel:${phone}`} />
            <InfoRow icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />} label="البريد الإلكتروني" value={email} href={`mailto:${email}`} />
          </div>
        </div>
      </div>
    </div>
  );
}