import PageHero from "@/components/site/PageHero";
import InstitutionDirectory from "@/components/site/InstitutionDirectory";

export default function Universities() {
  return (
    <div dir="rtl" className="bg-white min-h-screen">
      <PageHero
        breadcrumb={<span>الجامعات</span>}
        eyebrow="دليل الجامعات"
        title="الجامعات"
        description="جامعات في سبع دول، بتخصصات ودرجات علمية متنوعة. استخدم البحث والفلاتر للوصول إلى خيارك الأنسب."
      />
      <InstitutionDirectory type="university" />
    </div>
  );
}