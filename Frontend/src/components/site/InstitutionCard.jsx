import { Link } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function InstitutionCard({ institution }) {
  const isInstitute = institution.type === "institute";
  
  // استخدام _id الخاص بـ MongoDB بدلاً من id أو slug
  const targetId = institution._id || institution.id;
  
  const detailsPath = `${isInstitute ? "/institutes" : "/universities"}/${targetId}`;
  const programs = (institution.programs || []).slice(0, 3);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-[#0d8274]/30 hover:shadow-md text-right" dir="rtl">
      {/* قسم الصورة والشارة */}
      <div className="relative h-36 sm:h-48 overflow-hidden bg-slate-100 shrink-0">
        {institution.image_url ? (
          <Image
            src={institution.image_url}
            alt={institution.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0d8274] to-[#092c27]">
            <span className="font-heading text-4xl sm:text-5xl font-extrabold text-amber-400">
              {institution.name?.slice(0, 1)}
            </span>
          </div>
        )}
        <span className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full bg-white/90 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold text-[#0d8274] shadow-sm backdrop-blur-md">
          {isInstitute ? "معهد" : "جامعة"}
        </span>
      </div>

      {/* قسم تفاصيل المؤسسة */}
      <div className="flex flex-1 flex-col gap-2.5 sm:gap-3.5 p-4 sm:p-6">
        <h3 className="font-heading text-base sm:text-lg font-bold leading-snug text-slate-900 group-hover:text-[#0d8274] transition-colors">
          {institution.name}
        </h3>
        
        <p className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          {[institution.city, institution.country].filter(Boolean).join("، ")}
        </p>

        {institution.description ? (
          <p className="line-clamp-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
            {institution.description}
          </p>
        ) : null}

        {/* التخصصات */}
        {programs.length ? (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5">
            {programs.map((program, idx) => (
              <span key={idx} className="rounded-full bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-medium text-slate-700">
                {program}
              </span>
            ))}
            {(institution.programs || []).length > 3 ? (
              <span className="rounded-full bg-amber-400/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-amber-700">
                +{(institution.programs || []).length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* الأزرار السفليّة */}
        <div className="mt-auto flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-100">
          <Link
            to={detailsPath}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:text-[#0d8274] hover:border-[#0d8274]/30"
          >
            التفاصيل
            <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 rotate-180" />
          </Link>

          <Link
            to={`/apply/${targetId}`}
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-amber-500 px-3 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold text-slate-900 transition hover:bg-amber-400 shadow-sm"
          >
            ابدأ التقديم
          </Link>
        </div>
      </div>
    </article>
  );
}