import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function PageHero({ eyebrow, title, description, breadcrumb, children }) {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-100" dir="rtl">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="container-page relative py-8 sm:py-12 text-right">
        {breadcrumb ? (
          <nav className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Link to="/" className="transition hover:text-[#0d8274]">
              الرئيسية
            </Link>
            <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
            <span className="text-slate-800">{breadcrumb}</span>
          </nav>
        ) : null}
        <div className="max-w-3xl">
          {eyebrow ? (
            <span className="mb-2.5 inline-flex items-center gap-2 rounded-full bg-[#0d8274]/10 px-3 py-0.5 text-xs font-bold text-[#0d8274]">
              <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 text-balance">
            {title}
          </h1>
          {description ? (
            <p className="mt-2.5 max-w-2xl text-xs sm:text-sm md:text-base leading-6 sm:leading-7 text-slate-600">{description}</p>
          ) : null}
          {children ? <div className="mt-5">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}