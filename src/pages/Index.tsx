import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { AccommodationsPreview } from "@/components/home/AccommodationsPreview";
import { LocationSection } from "@/components/home/LocationSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <AccommodationsPreview />
      <LocationSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
