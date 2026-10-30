import Reveal from "@/components/site/Reveal";

export default function SectionHeading({ eyebrow, title, description, align = "center", action }) {
  const alignment = align === "start" ? "text-right items-start" : "text-center items-center mx-auto";
  return (
    <Reveal className={`flex flex-col gap-3 ${alignment} ${align === "start" ? "" : "max-w-2xl"}`} dir="rtl">
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium tracking-wide text-primary/80">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-2xl font-bold text-balance text-primary sm:text-3xl md:text-[2rem]">{title}</h2>
      {description ? (
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
      ) : null}
      {action}
    </Reveal>
  );
}