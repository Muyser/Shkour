import PageHero from "@/components/site/PageHero";
import InstitutionDirectory from "@/components/site/InstitutionDirectory";

export default function Institutes() {
  return (
    <div dir="rtl">
      <PageHero
        breadcrumb={<span>المعاهد</span>}
        eyebrow="دليل المعاهد"
        title="المعاهد"
        description="معاهد تقنية ومهنية ومعاهد لغة، تمنحك مهارة عملية أو تمهّد لك الطريق إلى الجامعة."
      />
      <InstitutionDirectory type="institute" />
    </div>
  );
}