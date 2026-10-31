import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ServiceIcon from "@/components/site/ServiceIcon";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/site/EmptyState";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`${API_URL}/api/programs?limit=40`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const fetched = data?.items || data || [];
        setPrograms(fetched);
      })
      .catch(() => {
        if (active) setPrograms([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <PageHero
        breadcrumb={<span>التخصصات</span>}
        eyebrow="دليل التخصصات"
        title="التخصصات"
        description="تعرّف على التخصصات المتاحة في المؤسسات التعليمية، واختر المسار الذي يناسب مهاراتك وطموحك."
      />

      <div className="container-page py-8 sm:py-16 px-3 sm:px-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40 sm:h-48 rounded-3xl shadow-sm" />
            ))}
          </div>
        ) : programs.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 text-right">
            {programs.map((program) => (
              <article 
                key={program._id} 
                className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-md sm:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#0d8274]/30 hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0d8274]/10 text-[#0d8274]">
                    <ServiceIcon name={program.icon || "BookOpen"} />
                  </span>
                  <h2 className="font-heading text-base sm:text-lg font-bold text-slate-900">{program.name}</h2>
                </div>
                <p className="mt-3 sm:mt-4 flex-1 text-xs sm:text-sm leading-relaxed sm:leading-7 text-slate-600">
                  {program.description || "لا توجد نبذة تعريفية متاحة لهذا التخصص حالياً."}
                </p>
                {program.degree ? (
                  <p className="mt-2.5 text-[11px] sm:text-xs font-medium text-slate-500">الدرجة: {program.degree}</p>
                ) : null}
                <Link
                  to={`/universities?program=${encodeURIComponent(program.name)}`}
                  className="mt-4 sm:mt-5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0d8274] transition hover:text-[#0d8274]/80"
                >
                  المؤسسات التي تقدمه
                  <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-180" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="لا توجد تخصصات مضافة بعد" />
        )}
      </div>
    </div>
  );
}