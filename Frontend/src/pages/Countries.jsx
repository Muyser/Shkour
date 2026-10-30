import { useEffect, useState } from "react";
import PageHero from "@/components/site/PageHero";
import CountryCard from "@/components/site/CountryCard";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`${API_URL}/api/countries?limit=30`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const fetched = data?.items || data || [];
        setCountries(fetched);
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
    <div dir="rtl" className="bg-white min-h-screen">
      <PageHero
        breadcrumb={<span>الدول</span>}
        eyebrow="وجهات الدراسة"
        title="وجهتك القادمة تبدأ باختيارك 🌍"
        description="كل دولة تجربة تعليمية مختلفة: تكلفة، لغة، ونظام قبول. تعرّف على الخيارات واختر ما يناسبك."
      />
      <section className="bg-white py-12 sm:py-24">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-64 sm:h-72 rounded-2xl" />
              ))
            ) : countries.length > 0 ? (
              countries.map((country) => (
                <CountryCard key={country._id} country={country} />
              ))
            ) : (
              <p className="col-span-full py-10 text-center text-xs sm:text-sm text-slate-500">
                لا توجد دول مضافة حالياً.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}