
import { Link } from "react-router-dom";
import { Languages, ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/site/SectionHeading";
import { COUNTRY_IMAGES } from "@/lib/images";

const DESTINATIONS = [
  {
    country: "رواندا",
    text: "معاهد لغة إنجليزية معتمدة في كيغالي، بمدة مرنة وتكلفة مناسبة وبيئة أفريقية قريبة من السودان.",
    image: COUNTRY_IMAGES["رواندا"],
  },
  {
    country: "ماليزيا",
    text: "برامج لغة إنجليزية ولغة ملايوية في جامعات خاصة بمعايير عالمية وتكلفة معيشة متوسطة.",
    image: COUNTRY_IMAGES["ماليزيا"],
  },
];

export default function LanguageInstitutesSection() {
  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading
        eyebrow="معاهد اللغة"
        title="ابدأ بلغتك، ثم أكمل دراستك"
        description="دورات لغة تمهيدية تفتح لك باب القبول الجامعي والعمل في نفس الوقت."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {DESTINATIONS.map((item) => (
          <article key={item.country} className="group overflow-hidden rounded-[var(--radius)] border border-border/70 bg-card">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={item.image}
                alt={`معاهد اللغة في ${item.country}`}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/10" />
              <h3 className="absolute bottom-4 right-5 font-heading text-xl font-bold text-white">
                معاهد اللغة في {item.country}
              </h3>
            </div>
            <div className="p-5">
              <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
              <Link
                to={`/institutes?country=${encodeURIComponent(item.country)}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-gold-foreground"
              >
                <Languages className="h-4 w-4" />
                استعرض المعاهد
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}