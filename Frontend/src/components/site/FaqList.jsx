
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeading from "@/components/site/SectionHeading";

export default function FaqList({ items }) {
  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <Accordion type="single" collapsible className="flex flex-col gap-3">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="rounded-[var(--radius)] border border-border/70 bg-card px-5"
          >
            <AccordionTrigger className="py-4 text-right font-body text-sm font-semibold text-primary hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-7 text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function FaqSection({ items }) {
  if (!items?.length) return null;
  return (
    <section className="container-page py-14 sm:py-20">
      <SectionHeading eyebrow="الأسئلة الشائعة" title="أسئلة يسألها الطلاب دائمًا" />
      <FaqList items={items} />
    </section>
  );
}