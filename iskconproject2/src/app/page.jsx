import Navbar from "@/sections/navbar/page";
import Hero from "@/sections/hero/page";
import Features from "@/sections/features/page";

import CTA from "@/sections/cta/page";
import Footer from "@/sections/footer/page";
import StatsSection from "@/sections/stats/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <StatsSection />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
