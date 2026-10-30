
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ServiceIcon from "@/components/site/ServiceIcon";

export default function ServiceCard({ service }) {
  return (
    <article className="group flex h-full flex-col gap-4 rounded-[var(--radius)] border border-border/70 bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_18px_40px_-30px_rgba(26,43,76,0.6)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary transition group-hover:bg-gold/15 group-hover:text-gold-foreground">
        <ServiceIcon name={service.icon} />
      </div>
      <h3 className="font-heading text-lg font-bold text-primary">{service.title}</h3>
      <p className="flex-1 text-sm leading-7 text-muted-foreground">{service.short_description}</p>
      <Link
        to={`/services/${encodeURIComponent(service.slug || service.title)}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-gold-foreground"
      >
        التفاصيل
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </article>
  );
}