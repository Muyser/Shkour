import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import ServiceCard from "@/components/site/ServiceCard";
import Reveal from "@/components/site/Reveal";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const DEFAULT_SERVICES = [
  {
    _id: "1",
    title: "التسجيل الجامعي",
    description: "نساعدك في اختيار التخصص المناسب والتقديم المباشر لأفضل الجامعات والمعاهد المعتمدة.",
    icon: "GraduationCap",
  },
  {
    _id: "2",
    title: "تجهيز وتوثيق المستندات",
    description: "مراجعة، ترجمة، وتوثيق كافة الأوراق الرسمية والشهادات المطلوبة للقبول.",
    icon: "FileText",
  },
  {
    _id: "3",
    title: "تأمين القبولات الدراسية",
    description: "ضمان استخراج القبولات الجامعية الرسمية في أسرع وقت وبأعلى نسب قبول.",
    icon: "ShieldCheck",
  },
  {
    _id: "4",
    title: "استشارات تعليمية متخصصة",
    description: "جلسات توجيه فردية لمساعدتك في اتخاذ القرار الأنسب لمستقبلك الدراسي.",
    icon: "BookOpen",
  },
  {
    _id: "5",
    title: "خدمات التأشيرة الطلابية",
    description: "إرشادات ودعم كامل في ملف استخراج التأشيرة وتجهيز المقابلة السفارية.",
    icon: "Passport",
  },
  {
    _id: "6",
    title: "استقبال وترتيب السكن",
    description: "ترتيب السكن الطلابي المناسب والاستقبال عند الوصول للدولة الدراسية.",
    icon: "Globe",
  },
];

export default function ServicesHome() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`${API_URL}/api/services?limit=9`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const items = data?.items || data || [];
        setServices(items.length > 0 ? items : DEFAULT_SERVICES);
      })
      .catch(() => {
        if (active) setServices(DEFAULT_SERVICES);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-white py-6 sm:py-16" dir="rtl">
      <div className="container-page px-2 sm:px-6">
        <SectionHeading
          eyebrow="خدماتنا"
          title="كيف نساعدك؟"
          description="خدمات متكاملة تأخذ بيدك من الفكرة حتى السفر."
        />

        {/* 2 in a row on small phones (grid-cols-2), transitioning to 3 columns on larger screens */}
        <div className="mt-4 sm:mt-8 grid grid-cols-2 gap-2 sm:gap-5 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-32 sm:h-52 rounded-2xl" />
              ))
            : services.map((service, index) => (
                <Reveal key={service._id} delay={index * 0.04}>
                  <div className="h-full [&_div]:p-3 sm:[&_div]:p-5 [&_h3]:text-xs sm:[&_h3]:text-lg [&_p]:text-[10px] sm:[&_p]:text-sm [&_p]:leading-relaxed">
                    <ServiceCard service={service} />
                  </div>
                </Reveal>
              ))}
        </div>

        <div className="mt-5 sm:mt-8 text-center">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0d8274] hover:underline sm:text-sm">
            جميع الخدمات
            <ArrowLeft className="h-3.5 w-3.5 rotate-180 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}