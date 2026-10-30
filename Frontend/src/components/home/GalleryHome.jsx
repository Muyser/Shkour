import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function GalleryHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    // جلب 6 عناصر فقط للمعرض
    fetch(`${API_URL}/api/gallery?limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const fetched = data?.items || data || [];
        setItems(fetched.slice(0, 6));
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
      <div className="container-page">
        <SectionHeading
          eyebrow="المعرض"
          title="معرض الطلاب"
          description="لحظات من رحلة طلابنا: وصول، تسجيل، وتخرّج."
        />

        <div className="mt-5 sm:mt-8 columns-2 gap-3 sm:gap-4 md:columns-3 [&>*]:mb-3 sm:[&>*]:mb-4 text-right">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40 sm:h-48 w-full break-inside-avoid rounded-2xl" />
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <Link
                to="/gallery"
                key={item._id}
                className="group relative block break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {item.media_type === "video" ? (
                  <div className="relative flex h-40 sm:h-48 items-center justify-center bg-slate-900">
                    <Play className="h-7 w-7 sm:h-8 sm:w-8 text-amber-400" />
                  </div>
                ) : item.media_url ? (
                  <Image
                    src={item.media_url}
                    alt={item.title || item.student_name || "معرض الطلاب"}
                    className="h-40 sm:h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-40 sm:h-48 items-center justify-center bg-slate-100 text-[11px] sm:text-xs text-slate-500 p-3 text-center">
                    {item.title || item.student_name || "صورة من المعرض"}
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent p-3 sm:p-3.5">
                  <p className="text-[11px] sm:text-xs font-semibold text-white line-clamp-1">
                    {item.title || item.student_name || item.country || "طالب من طلابنا"}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full py-10 text-center text-xs sm:text-sm text-slate-500">
              لا توجد عناصر مضافة في المعرض حالياً.
            </p>
          )}
        </div>

        <div className="mt-5 sm:mt-8 text-center">
          <Link to="/gallery" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d8274] hover:underline sm:text-sm">
            كل الصور والفيديوهات
            <ArrowLeft className="h-3.5 w-3.5 rotate-180 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}