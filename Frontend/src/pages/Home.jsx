
import HeroSection from "@/components/home/HeroSection";
import ServicesHome from "@/components/home/ServicesHome";
import CountriesHome from "@/components/home/CountriesHome";
import InstitutionsHome from "@/components/home/InstitutionsHome";
import ProgramsHome from "@/components/home/ProgramsHome";
import StepsSection from "@/components/home/StepsSection";
import CertificatesSection from "@/components/home/CertificatesSection";
import AttestationSection from "@/components/home/AttestationSection";
import GalleryHome from "@/components/home/GalleryHome";
import WhyUsSection from "@/components/home/WhyUsSection";
import FaqHome from "@/components/home/FaqHome";
import WhatsAppCta from "@/components/home/WhatsAppCta";
import SectionHeading from "@/components/site/SectionHeading";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesHome />
      <CountriesHome />
      <InstitutionsHome />
      <ProgramsHome />

      <section className="bg-white py-12 sm:py-24" dir="rtl">
      <div className="container-page">
        <SectionHeading
          eyebrow="خطوات التقديم"
          title="أربع خطوات فقط تفصلك عن مقعدك"
          description="بسيطة، واضحة، وبدون حساب أو تعقيد. ابدأ متى شئت."
        />
        <div className="mt-8 sm:mt-12">
          <StepsSection />
        </div>
      </div>
    </section>

      <CertificatesSection />
      <AttestationSection />
      <GalleryHome />
      <WhyUsSection />
      <FaqHome />
      <WhatsAppCta />
    </>
  );
}