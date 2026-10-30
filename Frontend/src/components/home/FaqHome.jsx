import { useEffect, useState } from "react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FaqHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`${API_URL}/api/faqs?limit=8`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const fetched = data?.items || data || [];
        setItems(fetched);
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

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-12 sm:py-24" dir="rtl">
      <div className="container-page max-w-4xl">
        <SectionHeading
          eyebrow="الأسئلة الشائعة"
          title="إجابات لكل ما تبحث عنه"
          description="كل ما تحتاج معرفته حول التقديم، المستندات، والقبولات الجامعية."
        />

        <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 sm:h-16 w-full rounded-2xl" />
            ))
          ) : items.length > 0 ? (
            items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <Reveal key={item._id || index} delay={index * 0.03}>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition">
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-right font-bold text-slate-900 transition hover:bg-slate-50"
                    >
                      <span className="text-xs sm:text-sm">{item.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 sm:h-5 sm:w-5 text-slate-500 shrink-0 ms-2 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#0d8274]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 p-4 sm:p-5 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600 bg-slate-50/50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })
          ) : (
            <p className="col-span-full py-10 text-center text-sm text-slate-500">
              لا توجد أسئلة شائعة مضافة حالياً.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}