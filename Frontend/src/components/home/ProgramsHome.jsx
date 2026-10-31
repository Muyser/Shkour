import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/site/SectionHeading";
import ServiceIcon from "@/components/site/ServiceIcon";
import Reveal from "@/components/site/Reveal";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProgramsHome() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    // جلب التخصصات من الـ Backend الحقيقي
    fetch(`${API_URL}/api/programs?limit=12`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const items = data?.items || data || [];
        setPrograms(items);
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
    <section className="bg-white py-8 sm:py-16" dir="rtl">
      <div className="container-page px-3 sm:px-6">
        <SectionHeading
          eyebrow="التخصصات"
          title="تخصصات تناسب طموحك"
          description="من الطب والهندسة إلى إدارة الأعمال والعلوم الإنسانية، تعرّف على التخصصات المتاحة واربطها بالمؤسسات التي تقدمها."
        />

        {/* شبكة بطاقتين في الشاشات الصغيرة مع إضافة ظلال بارزة وعصرية */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-10 sm:gap-4 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-16 sm:h-20 rounded-2xl shadow-sm" />
            ))
          ) : programs.length > 0 ? (
            programs.map((program, index) => (
              <Reveal key={program._id} delay={index * 0.03}>
                <Link
                  to={`/universities?program=${encodeURIComponent(program.name)}`}
                  className="flex items-center gap-2.5 sm:gap-3 rounded-2xl sm:rounded-3xl border border-slate-100 bg-white px-3.5 py-3 sm:px-4 sm:py-4 shadow-md sm:shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#0d8274]/40 hover:shadow-xl h-full"
                >
                  <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#0d8274]/10 text-[#0d8274]">
                    <ServiceIcon name={program.icon || "BookOpen"} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">{program.name}</span>
                </Link>
              </Reveal>
            ))
          ) : (
            <p className="col-span-full py-10 text-center text-xs sm:text-sm text-slate-500">
              لا توجد تخصصات مضافة حالياً.
            </p>
          )}
        </div>

        <div className="mt-6 text-center sm:mt-10">
          <Link to="/programs" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d8274] hover:underline sm:text-sm">
            جميع التخصصات
          </Link>
        </div>
      </div>
    </section>
  );
}