import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Quote } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";

// Default fallback data for student success stories
const DEFAULT_STORIES = [
  {
    id: "1",
    student_name: "محمد أحمد",
    story: "كنت مترددًا في اختيار التخصص المناسب، لكن بفضل مكتب شكور حصلت على استشارة دقيقة ومتابعة سريعة حتى وصلت إلى مقعدي في تخصص هندسة الحاسوب بتركيا.",
    program: "هندسة الحاسوب",
    university: "جامعة إسطنبول أيدن",
    country: "تركيا",
    image_url: "",
  },
  {
    id: "2",
    student_name: "سارة عبد الله",
    story: "تجهيز المستندات وتوثيقها كان الهاجس الأكبر بالنسبة لي، لكن الفريق قام بكل الإجراءات باحترافية عالية وبدون أي عناء.",
    program: "الطب البشري",
    university: "جامعة القاهرة",
    country: "مصر",
    image_url: "",
  },
  {
    id: "3",
    student_name: "عمر خالد",
    story: "تجربة رائعة جدًا وشفافة من أول يوم. استلمت قبولدي الدراسي وتأشيرتي في وقت قياسي وبدون رسوم استشارة للمرة الأولى.",
    program: "إدارة الأعمال",
    university: "جامعة السيتي",
    country: "ماليزيا",
    image_url: "",
  },
];

export default function StoriesHome() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.StudentStory.filter({ is_visible: true }, { sort: "order", limit: 3 })
      .then((page) => {
        const items = page?.items || [];
        setStories(items.length > 0 ? items : DEFAULT_STORIES);
      })
      .catch(() => {
        setStories(DEFAULT_STORIES);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="border-y border-border/60 bg-card/60" dir="rtl">
      <div className="container-page py-14 sm:py-20">
        <SectionHeading
          eyebrow="قصص النجاح"
          title="قصص نجاح طلابنا"
          description="طلاب بدأوا من نفس السؤال الذي تفكر فيه اليوم، ووصلوا إلى مقاعدهم الدراسية."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-80 rounded-[var(--radius)]" />)
            : stories.map((story, index) => (
                <Reveal key={story.id} delay={index * 0.06}>
                  <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border/70 bg-background text-right">
                    <div className="relative h-52 overflow-hidden bg-primary/5">
                      {story.image_url ? (
                        <Image src={story.image_url} alt={story.student_name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary to-primary/70 font-heading text-4xl text-accent">
                          {story.student_name?.slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <Quote className="h-5 w-5 text-gold" />
                      <p className="line-clamp-4 flex-1 text-sm leading-7 text-muted-foreground">{story.story}</p>
                      <div className="mt-2 border-t border-border/70 pt-3">
                        <p className="font-heading text-sm font-bold text-primary">{story.student_name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {[story.program, story.university, story.country].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/success-stories" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-gold-foreground">
            كل قصص النجاح
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}