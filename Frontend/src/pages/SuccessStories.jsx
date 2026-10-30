import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PageHero from "@/components/site/PageHero";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/site";
import usePageTitle from "@/lib/usePageTitle";

// Default fallback data for student success stories page
const DEFAULT_SUCCESS_STORIES = [
  {
    id: "1",
    student_name: "محمد أحمد",
    story: "كنت مترددًا في اختيار التخصص المناسب، لكن بفضل مكتب شكور حصلت على استشارة دقيقة ومتابعة سريعة حتى وصلت إلى مقعدي في تخصص هندسة الحاسوب بتركيا.",
    program: "هندسة الحاسوب",
    university: "جامعة إسطنبول أيدن",
    country: "تركيا",
    image_url: "",
    published_date: "2026-01-15",
  },
  {
    id: "2",
    student_name: "سارة عبد الله",
    story: "تجهيز المستندات وتوثيقها كان الهاجس الأكبر بالنسبة لي، لكن الفريق قام بكل الإجراءات باحترافية عالية وبدون أي عناء.",
    program: "الطب البشري",
    university: "جامعة القاهرة",
    country: "مصر",
    image_url: "",
    published_date: "2026-02-10",
  },
  {
    id: "3",
    student_name: "عمر خالد",
    story: "تجربة رائعة جدًا وشفافة من أول يوم. استلمت قبولي الدراسي وتأشيرتي في وقت قياسي وبدون رسوم استشارة.",
    program: "إدارة الأعمال",
    university: "جامعة السيتي",
    country: "ماليزيا",
    image_url: "",
    published_date: "2026-03-01",
  },
  {
    id: "4",
    student_name: "فاطمة إبراهيم",
    story: "خدمة العملاء والمتابعة المستمرة على الواتساب جعلتني مطمئنة طوال فترة التقديم حتى وصولي إلى مقر الجامعة.",
    program: "الصيدلة",
    university: "جامعة قبرص الدولية",
    country: "قبرص",
    image_url: "",
    published_date: "2026-03-20",
  },
];

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  usePageTitle("قصص نجاح طلابنا");

  useEffect(() => {
    base44.entities.StudentStory.filter({ is_visible: true }, { sort: "order", limit: 40 })
      .then((page) => {
        const fetched = page?.items || [];
        setStories(fetched.length > 0 ? fetched : DEFAULT_SUCCESS_STORIES);
      })
      .catch(() => setStories(DEFAULT_SUCCESS_STORIES))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div dir="rtl">
      <PageHero
        breadcrumb={<span>قصص النجاح</span>}
        eyebrow="قصص ملهمة"
        title="قصص نجاح طلابنا"
        description="طلاب مثلك بدأوا بسؤال، وانتهوا بمقعد دراسي في جامعة أحلامهم."
      />

      <div className="container-page py-10">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-64 rounded-[var(--radius)]" />
            ))}
          </div>
        ) : stories.length ? (
          <div className="grid gap-5 md:grid-cols-2 text-right">
            {stories.map((story) => (
              <article key={story.id} className="overflow-hidden rounded-[var(--radius)] border border-border/70 bg-card">
                <div className="grid sm:grid-cols-[180px_1fr]">
                  <div className="relative h-48 sm:h-full bg-primary/5">
                    {story.image_url ? (
                      <Image src={story.image_url} alt={story.student_name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary/70 font-heading text-4xl text-accent">
                        {story.student_name?.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <Quote className="h-5 w-5 text-gold" />
                    <p className="mt-2 text-sm leading-8 text-muted-foreground">{story.story}</p>
                    <div className="mt-4 border-t border-border/70 pt-3">
                      <p className="font-heading text-sm font-bold text-primary">{story.student_name}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {[story.program, story.university, story.country].filter(Boolean).join(" · ")}
                      </p>
                      {story.published_date ? (
                        <p className="mt-1 text-[10px] text-muted-foreground/80">{formatDate(story.published_date)}</p>
                      ) : null}
                    </div>
                    {story.video_url ? (
                      <video src={story.video_url} controls className="mt-3 w-full rounded-xl bg-primary" />
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">سيتم نشر قصص الطلاب قريبًا.</p>
        )}
      </div>
    </div>
  );
}