import { Link } from "react-router-dom";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import useSiteSettings from "@/lib/useSiteSettings";
import { NAV_LINKS, OFFICE_NAME, waLink } from "@/lib/site";

const SERVICE_LINKS = [
  { label: "استخراج الشهادات السودانية", to: "/services/استخراج-الشهادات-السودانية" },
  { label: "توثيق الشهادات والمستندات", to: "/services/توثيق-الشهادات-والمستندات" },
  { label: "الموافقات الأمنية", to: "/services/الموافقات-الأمنية" },
  { label: "تذاكر السفر", to: "/services/تذاكر-السفر" },
];

export default function Footer() {
  const settings = useSiteSettings();
  const whatsapp = settings?.whatsapp_number;

  return (
    <footer className="mt-12 bg-[#092c27] text-white" dir="rtl">
      <div className="container-page grid gap-8 py-12 sm:py-16 md:grid-cols-4 text-right">
        
        {/* معلومات المكتب */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-[#f59e0b] font-heading text-lg sm:text-xl font-bold text-slate-900 shadow-sm">
              ش
            </span>
            <span className="font-heading text-base sm:text-lg font-extrabold tracking-wide">مكتب شكور</span>
          </div>
          <p className="mt-3.5 text-xs sm:text-sm leading-7 sm:leading-8 text-white/75">
            {settings?.about_text ||
              "مكتب متخصص في التقديمات الجامعية والخدمات التعليمية، نساعد الطلاب في الوصول إلى جامعاتهم ومعاهدهم المفضلة وتجهيز مستنداتهم بثقة ووضوح."}
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h3 className="mb-3.5 font-heading text-sm sm:text-base font-bold text-amber-400">روابط سريعة</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-white/80">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link className="transition hover:text-amber-400" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="transition hover:text-amber-400" to="/gallery">
                معرض الطلاب
              </Link>
            </li>
          </ul>
        </div>

        {/* خدماتنا */}
        <div>
          <h3 className="mb-3.5 font-heading text-sm sm:text-base font-bold text-amber-400">خدماتنا</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-white/80">
            {SERVICE_LINKS.map((link) => (
              <li key={link.to}>
                <Link className="transition hover:text-amber-400" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* تواصل معنا */}
        <div>
          <h3 className="mb-3.5 font-heading text-sm sm:text-base font-bold text-amber-400">تواصل معنا</h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
            <li>
              <a className="flex items-center gap-2.5 transition hover:text-amber-400" href={waLink(whatsapp)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                واتساب: {whatsapp || "‎+250 794 420 606"}
              </a>
            </li>
            {settings?.phone ? (
              <li>
                <a className="flex items-center gap-2.5 transition hover:text-amber-400" href={`tel:${settings.phone}`}>
                  <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings?.email ? (
              <li>
                <a className="flex items-center gap-2.5 transition hover:text-amber-400" href={`mailto:${settings.email}`}>
                  <Mail className="h-4 w-4 shrink-0 text-amber-400" />
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings?.address ? (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>{settings.address}</span>
              </li>
            ) : null}
          </ul>
        </div>

      </div>

      {/* شريط حقوق النشر السفلي */}
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {OFFICE_NAME} — جميع الحقوق محفوظة.</p>
          
          {/* إضافة جملة التوقيع وتطوير الموقع */}
          <p className="text-white/75 font-medium">
            تم التطوير بواسطة <span className="text-amber-400 font-bold">  ميسر  </span>
          </p>
        </div>
      </div>
    </footer>
  );
}