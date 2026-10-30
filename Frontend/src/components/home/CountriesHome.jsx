import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import CountryCard from "@/components/site/CountryCard";
import Reveal from "@/components/site/Reveal";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CountriesHome() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    // جلب الدول من الـ Backend الحقيقي
    fetch(`${API_URL}/api/countries?limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const items = data?.items || data || [];
        setCountries(items);
      })
      .catch(() => {
        if (active) setCountries([]);
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
      <div className="container-page">
        <SectionHeading
          eyebrow="الدول"
          title="وجهتك القادمة تبدأ باختيارك 🌍"
          description="اختر دولتك الدراسية بتكاليف وأنظمة تعليمية متنوعة تناسب طموحك وميزانيتك."
        />

        {/* عرض بطاقة واحدة لكل صف (grid-cols-1) في الموبايل وتعود لثلاث أعمدة في الشاشات الكبيرة */}
        <div className="mt-5 sm:mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-56 sm:h-72 rounded-2xl" />
            ))
          ) : countries.length > 0 ? (
            countries.map((country, index) => (
              <Reveal key={country._id} delay={index * 0.04}>
                <CountryCard country={country} />
              </Reveal>
            ))
          ) : (
            <p className="col-span-full py-10 text-center text-xs sm:text-sm text-slate-500">
              لا توجد دول مضافة حالياً.
            </p>
          )}
        </div>

        <div className="mt-5 sm:mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm">
          <Link to="/countries" className="inline-flex items-center gap-1.5 font-bold text-[#0d8274] hover:underline">
            كل الدول
            <ArrowLeft className="h-3.5 w-3.5 rotate-180 sm:h-4 sm:w-4" />
          </Link>
          <Link to="/institutes" className="font-medium text-slate-600 hover:text-[#0d8274]">
            معاهد اللغة
          </Link>
        </div>
      </div>
    </section>
  );
}