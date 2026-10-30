import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import usePageTitle from "@/lib/usePageTitle";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  usePageTitle("معرض الطلاب");

  useEffect(() => {
    let activeEffect = true;
    setLoading(true);

    fetch(`${API_URL}/api/gallery?limit=60`)
      .then((res) => res.json())
      .then((data) => {
        if (!activeEffect) return;
        const fetched = data?.items || data || [];
        setItems(fetched);
      })
      .catch(() => {
        if (activeEffect) setItems([]);
      })
      .finally(() => {
        if (activeEffect) setLoading(false);
      });

    return () => {
      activeEffect = false;
    };
  }, []);

  const visible = filter === "all" ? items : items.filter((item) => item.media_type === filter);

  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <PageHero
        breadcrumb={<span>معرض الطلاب</span>}
        eyebrow="لحظاتنا"
        title="معرض الطلاب"
        description="صور وفيديوهات من رحلات طلابنا: وصول، تسجيل في الجامعات، وتخرّج."
      />

      <div className="container-page py-10 sm:py-16">
        <Tabs value={filter} onValueChange={setFilter} className="mb-6 sm:mb-8">
          <TabsList className="bg-slate-100 rounded-2xl p-1 border border-slate-200">
            <TabsTrigger value="all" className="rounded-xl text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">الكل</TabsTrigger>
            <TabsTrigger value="image" className="rounded-xl text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">صور</TabsTrigger>
            <TabsTrigger value="video" className="rounded-xl text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">فيديوهات</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-56 sm:h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : visible.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {visible.map((item) => (
              <button
                key={item._id}
                onClick={() => setActive(item)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-right transition duration-300 hover:shadow-md"
              >
                {item.media_type === "video" ? (
                  <div className="relative flex h-56 sm:h-64 w-full items-center justify-center bg-[#092c27]/90 overflow-hidden">
                    <video
                      src={item.media_url}
                      className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 transition duration-300 group-hover:bg-slate-900/10" />
                    <div className="relative z-10 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-amber-500 text-slate-900 shadow-lg transition duration-300 group-hover:scale-110">
                      <Play className="h-5 w-5 sm:h-6 sm:w-6 translate-x-0.5 fill-current" />
                    </div>
                  </div>
                ) : (
                  <div className="h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.media_url}
                      alt={item.student_name || "معرض الطلاب"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent p-3.5 sm:p-4">
                  <p className="text-xs sm:text-sm font-bold text-white">
                    {[item.student_name, item.university].filter(Boolean).join(" · ") || "طالب من طلابنا"}
                  </p>
                  {item.media_type === "video" && (
                    <span className="mt-1 inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] text-amber-300 font-semibold backdrop-blur-md">
                      فيديو توثيقي
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-xs sm:text-sm text-slate-500">لا توجد عناصر في هذا القسم بعد.</p>
        )}
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl bg-white border border-slate-200 p-0 shadow-lg" dir="rtl">
          <DialogTitle className="sr-only">{active?.student_name || "معرض الطلاب"}</DialogTitle>
          {active?.media_type === "video" ? (
            <div className="relative bg-slate-950 flex items-center justify-center max-h-[60vh] sm:max-h-[70vh] w-full">
              <video
                src={active.media_url}
                controls
                autoPlay
                className="max-h-[60vh] sm:max-h-[70vh] w-full object-contain"
              />
            </div>
          ) : active ? (
            <Image src={active.media_url} alt={active.student_name || "معرض الطلاب"} className="max-h-[60vh] sm:max-h-[70vh] w-full object-contain bg-slate-50" />
          ) : null}
          <div className="p-4 sm:p-6 text-right text-xs sm:text-sm text-slate-600 bg-white">
            <p className="font-heading text-base sm:text-lg font-bold text-slate-900">{active?.student_name}</p>
            <p className="mt-1 text-[11px] sm:text-xs text-amber-600 font-semibold">
              {[active?.program, active?.university, active?.country].filter(Boolean).join(" · ")}
            </p>
            {active?.description ? <p className="mt-2.5 text-xs sm:text-sm text-slate-700 leading-6 sm:leading-7">{active.description}</p> : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}