import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, GraduationCap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Image } from "@/components/ui/image";
import InstitutionCard from "@/components/site/InstitutionCard";
import EmptyState from "@/components/site/EmptyState";
import { waLink } from "@/lib/site";
import usePageTitle from "@/lib/usePageTitle";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CountryDetail() {
  const { id } = useParams(); // المعرّف _id القادم من الرابط مباشرة
  const [country, setCountry] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageTitle(country?.name ? `الدراسة في ${country.name}` : "تفاصيل الدولة");

  useEffect(() => {
    let active = true;

    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // جلب تفاصيل الدولة مباشرة باستخدام _id عبر GET /api/countries/:id
    fetch(`${API_URL}/api/countries/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Country not found");
        return res.json();
      })
      .then((countryData) => {
        if (!active) return;
        setCountry(countryData);

        // جلب المؤسسات التابعة لهذه الدولة باستعمال country_id
        return fetch(`${API_URL}/api/institutions?country_id=${id}&limit=30`);
      })
      .then((res) => (res ? res.json() : null))
      .then((instData) => {
        if (!active || !instData) return;
        setInstitutions(instData?.items || instData || []);
      })
      .catch(() => {
        if (active) {
          setCountry(null);
          setInstitutions([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container-page py-12 sm:py-16 bg-white min-h-screen" dir="rtl">
        <Skeleton className="h-56 sm:h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container-page py-12 sm:py-16 bg-white min-h-screen" dir="rtl">
        <EmptyState
          title="الدولة غير موجودة"
          description="تعذر العثور على بيانات هذه الدولة أو ربما تم حذفها."
          action={
            <Button asChild className="rounded-2xl bg-amber-500 text-slate-900 hover:bg-amber-400">
              <Link to="/countries">كل الدول</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const programs = Array.from(
    new Set(institutions.flatMap((item) => (Array.isArray(item.programs) ? item.programs : [])))
  );

  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <section className="relative overflow-hidden border-b border-slate-100 text-right">
        <div className="absolute inset-0">
          {country.image_url ? (
            <Image src={country.image_url} alt={country.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-[#092c27]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-[#092c27]/95 via-[#092c27]/85 to-[#092c27]/60" />
        </div>
        <div className="container-page relative py-12 sm:py-20 text-white">
          <Link to="/countries" className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75 hover:text-amber-400 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            كل الدول
          </Link>
          <h1 className="mt-3 sm:mt-4 font-heading text-2xl sm:text-3xl lg:text-[2.7rem] font-extrabold leading-tight">
            الدراسة في {country.name} {country.flag || ""}
          </h1>
          <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm leading-6 sm:leading-8 text-white/80">
            {country.description || "معلومات تفصيلية حول الدراسة والجامعات المتاحة في هذه الدولة."}
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Button asChild className="w-full sm:w-auto rounded-2xl bg-amber-500 font-bold text-slate-900 hover:bg-amber-400 shadow-sm text-xs sm:text-sm py-3">
              <Link to={`/universities?country_id=${country._id}`}>
                جامعات {country.name}
                <ArrowLeft className="ms-2 h-4 w-4 rotate-180" />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full sm:w-auto rounded-2xl text-white hover:bg-white/10 hover:text-white text-xs sm:text-sm py-3">
              <a href={waLink(undefined, `مرحبًا، أريد معلومات عن الدراسة في ${country.name}.`)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="ms-2 h-4 w-4 text-emerald-400" />
                استفسر عبر واتساب
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="container-page py-12 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <aside className="space-y-6 text-right">
            {country.highlights && country.highlights.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="font-heading text-sm sm:text-base font-bold text-slate-900">مزايا الدراسة هنا</h2>
                <ul className="mt-3.5 space-y-2.5">
                  {country.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
                      <CheckCircle2 className="mt-0.5 sm:mt-1 h-4 w-4 shrink-0 text-amber-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {programs.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h2 className="font-heading text-sm sm:text-base font-bold text-slate-900">التخصصات المتاحة</h2>
                <div className="mt-3.5 flex flex-wrap gap-1.5 sm:gap-2">
                  {programs.map((program, idx) => (
                    <Link
                      key={idx}
                      to={`/universities?country_id=${country._id}&program=${encodeURIComponent(program)}`}
                      className="rounded-2xl bg-slate-100 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 hover:bg-amber-400/20 hover:text-slate-900 transition-colors"
                    >
                      {program}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div className="text-right">
            <div className="flex items-center justify-between pb-4">
              <h2 className="flex items-center gap-2 font-heading text-lg sm:text-xl font-bold text-slate-900">
                <GraduationCap className="h-5 w-5 text-amber-500" />
                الجامعات والمعاهد
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] sm:text-xs font-semibold text-slate-600">{institutions.length} مؤسسة</span>
            </div>
            {institutions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {institutions.map((institution) => (
                  <InstitutionCard key={institution._id} institution={institution} />
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyState title="لا توجد مؤسسات مضافة لهذه الدولة بعد" description="تواصل معنا لمعرفة الخيارات المتاحة." />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}