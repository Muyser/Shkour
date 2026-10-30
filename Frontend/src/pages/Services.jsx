import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PageHero from "@/components/site/PageHero";
import ServiceCard from "@/components/site/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import WhatsAppCta from "@/components/home/WhatsAppCta";

// Default fallback data for educational services
const DEFAULT_SERVICES = [
  {
    id: "1",
    title: "استخراج الشهادات السودانية",
    short_description: "استخراج وتوثيق الشهادات الدراسية (الأساس والثانوي) باللغتين العربية والإنجليزية.",
    icon: "ScrollText",
  },
  {
    id: "2",
    title: "توثيق الشهادات والمستندات",
    short_description: "تصديق المستندات الرسمية من السفارات والوزارات المعنية بخطوات دقيقة وسريعة.",
    icon: "Stamp",
  },
  {
    id: "3",
    title: "الموافقات الأمنية",
    short_description: "متابعة وإنهاء إجراءات الموافقات الأمنية اللازمة للدراسة في الخارج.",
    icon: "ShieldCheck",
  },
  {
    id: "4",
    title: "تذاكر السفر",
    short_description: "حجز تذاكر الطيران للطلاب وأولياء الأمور بأفضل الأسعار وأنسب المواعيد.",
    icon: "Plane",
  },
  {
    id: "5",
    title: "القبول الجامعي",
    short_description: "تأمين القبولات الدراسية في أرقى الجامعات والمعاهد المعتمدة عالمياً.",
    icon: "GraduationCap",
  },
  {
    id: "6",
    title: "الاستشارات التعليمية",
    short_description: "استشارات مجانية لاختيار التخصص والدولة المناسبة لميزانيتك ومعدلك.",
    icon: "MessageSquare",
  },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Service.filter({ is_visible: true }, { sort: "order", limit: 30 })
      .then((page) => {
        const fetched = page?.items || [];
        setServices(fetched.length > 0 ? fetched : DEFAULT_SERVICES);
      })
      .catch(() => setServices(DEFAULT_SERVICES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir="rtl">
      <PageHero
        breadcrumb={<span>الخدمات</span>}
        eyebrow="خدماتنا"
        title="خدمات تعليمية كاملة في مكان واحد"
        description="من التقديم الجامعي إلى استخراج وتوثيق الشهادات وتذاكر السفر، نتولى التفاصيل لتتفرغ لهدفك."
      />
      <div className="container-page py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-52 rounded-[var(--radius)]" />
              ))
            : services.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      </div>
      <WhatsAppCta />
    </div>
  );
}