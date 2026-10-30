import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PageHero from "@/components/site/PageHero";
import FaqList from "@/components/site/FaqList";
import WhatsAppCta from "@/components/home/WhatsAppCta";
import { Skeleton } from "@/components/ui/skeleton";
import usePageTitle from "@/lib/usePageTitle";

export default function FaqPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  usePageTitle("الأسئلة الشائعة");

  useEffect(() => {
    base44.entities.Faq.filter({ is_visible: true }, { sort: "order", limit: 40 })
      .then((page) => setItems(page?.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHero
        breadcrumb={<span>الأسئلة الشائعة</span>}
        eyebrow="مساعدة"
        title="الأسئلة الشائعة"
        description="أجوبة سريعة عن التقديم والمستندات والتوثيق. وإن لم تجد سؤالك، راسلنا على واتساب."
      />
      <div className="container-page py-10">
        {loading ? (
          <div className="mx-auto max-w-3xl space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 rounded-[var(--radius)]" />
            ))}
          </div>
        ) : (
          <FaqList items={items} />
        )}
      </div>
      <WhatsAppCta />
    </>
  );
}