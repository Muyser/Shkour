import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import InstitutionCard from "@/components/site/InstitutionCard";
import Reveal from "@/components/site/Reveal";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InstitutionsHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`${API_URL}/api/institutions?limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const fetchedItems = data?.items || data || [];
        setItems(fetchedItems);
      })
      .catch(() => {
        if (active) setItems([]);
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
      <div className="container-page px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end">
          <SectionHeading
            align="start"
            eyebrow="دليل المؤسسات"
            title="الجامعات والمعاهد"
            description="اختر مؤسستك من بين جامعات ومعاهد معتمدة، وتعرّف على التخصصات والمتطلبات قبل أن تبدأ طلبك."
          />
          <div className="flex gap-2">
            <Link to="/universities" className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#0d8274] hover:text-[#0d8274] shadow-sm">
              الجامعات
            </Link>
            <Link to="/institutes" className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#0d8274] hover:text-[#0d8274] shadow-sm">
              المعاهد
            </Link>
          </div>
        </div>

        {/* بطاقة واحدة لكل صف على الموبايل بنفس أسلوب بقية الأقسام */}
        <div className="mt-6 sm:mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 sm:h-[360px] rounded-3xl max-w-[280px] sm:max-w-none mx-auto w-full shadow-sm" />
            ))
          ) : items.length > 0 ? (
            items.map((institution, index) => (
              <Reveal key={institution._id} delay={index * 0.04}>
                <div className="max-w-[280px] sm:max-w-none mx-auto w-full h-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                  <InstitutionCard institution={institution} />
                </div>
              </Reveal>
            ))
          ) : (
            <p className="col-span-full py-10 text-center text-xs sm:text-sm text-slate-500">لا توجد مؤسسات مضافة حالياً.</p>
          )}
        </div>

        <div className="mt-8 text-center sm:mt-10">
          <Link to="/universities" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d8274] hover:underline sm:text-sm">
            استعرض كل المؤسسات
            <ArrowLeft className="h-3.5 w-3.5 rotate-180 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}