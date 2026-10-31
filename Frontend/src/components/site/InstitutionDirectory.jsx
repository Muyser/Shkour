import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InstitutionCard from "@/components/site/InstitutionCard";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/site/EmptyState";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function InstitutionDirectory({ type }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [institutions, setInstitutions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [programsList, setProgramsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب قيم الفلاتر من الـ URL
  const searchQuery = searchParams.get("name") || "";
  const selectedCountry = searchParams.get("country_id") || "";
  const selectedProgram = searchParams.get("program") || "";

  // جلب قائمة الدول لفلتر الدول
  useEffect(() => {
    fetch(`${API_URL}/api/countries?limit=50`)
      .then((res) => res.json())
      .then((data) => {
        setCountries(data?.items || data || []);
      })
      .catch(() => setCountries([]));
  }, []);

  // جلب قائمة التخصصات لفلتر التخصصات
  useEffect(() => {
    fetch(`${API_URL}/api/programs?limit=50`)
      .then((res) => res.json())
      .then((data) => {
        setProgramsList(data?.items || data || []);
      })
      .catch(() => setProgramsList([]));
  }, []);

  // جلب المؤسسات بناءً على الفلاتر الحالية
  useEffect(() => {
    let active = true;
    setLoading(true);

    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (searchQuery) params.append("name", searchQuery);
    if (selectedCountry) params.append("country_id", selectedCountry);
    params.append("limit", "50");

    fetch(`${API_URL}/api/institutions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        let items = data?.items || data || [];

        // تصفية إضافية بالتخصص إذا تم اختياره من القائمة أو الـ URL
        if (selectedProgram) {
          items = items.filter((inst) =>
            inst.programs?.some((p) =>
              typeof p === "string"
                ? p.toLowerCase().includes(selectedProgram.toLowerCase())
                : p.name?.toLowerCase().includes(selectedProgram.toLowerCase())
            )
          );
        }

        setInstitutions(items);
      })
      .catch(() => {
        if (active) setInstitutions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [type, searchQuery, selectedCountry, selectedProgram]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val) {
      searchParams.set("name", val);
    } else {
      searchParams.delete("name");
    }
    setSearchParams(searchParams);
  };

  const handleCountryChange = (e) => {
    const val = e.target.value;
    if (val) {
      searchParams.set("country_id", val);
    } else {
      searchParams.delete("country_id");
    }
    setSearchParams(searchParams);
  };

  const handleProgramChange = (e) => {
    const val = e.target.value;
    if (val) {
      searchParams.set("program", val);
    } else {
      searchParams.delete("program");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white py-8 sm:py-16" dir="rtl">
      <div className="container-page px-3 sm:px-6">
        {/* شريط البحث وفلاتر الدول والتخصصات */}
        <div className="mb-8 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="ابحث بالاسم..."
              className="w-full rounded-2xl sm:rounded-3xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-[#0d8274] focus:outline-none focus:ring-1 focus:ring-[#0d8274]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* فلتر الدولة */}
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white px-3 sm:px-4 py-3 text-xs sm:text-sm text-slate-900 shadow-sm focus:border-[#0d8274] focus:outline-none focus:ring-1 focus:ring-[#0d8274]"
            >
              <option value="">كل الدول</option>
              {countries.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.name}
                </option>
              ))}
            </select>

            {/* فلتر التخصصات */}
            <select
              value={selectedProgram}
              onChange={handleProgramChange}
              className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white px-3 sm:px-4 py-3 text-xs sm:text-sm text-slate-900 shadow-sm focus:border-[#0d8274] focus:outline-none focus:ring-1 focus:ring-[#0d8274]"
            >
              <option value="">كل التخصصات</option>
              {programsList.map((prog) => (
                <option key={prog._id} value={prog.name}>
                  {prog.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* عرض النتائج أو الهياكل الوهمية أثناء التحميل */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-64 sm:h-[360px] rounded-3xl max-w-[280px] sm:max-w-none mx-auto w-full shadow-sm" />
            ))}
          </div>
        ) : institutions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {institutions.map((institution) => (
              <div 
                key={institution._id} 
                className="max-w-[280px] sm:max-w-none mx-auto w-full h-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl transition-all duration-300 hover:scale-[1.01]"
              >
                <InstitutionCard institution={institution} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="لا توجد نتائج مطابقة"
            description="جرب تغيير كلمات البحث أو إزالة الفلاتر الحالية."
            action={
              <Button
                variant="outline"
                className="rounded-2xl border-slate-200 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 shadow-sm"
                onClick={() => {
                  setSearchParams({});
                }}
              >
                إعادة تعيين البحث والفلاتر
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}