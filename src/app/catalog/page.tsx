"use client";

import FilterSection from "@/features/catalog/ui/filter";
import Hero from "@/widgets/catalog/hero";
import ReviewCarousel from "@/features/home/review/ui/carousel";
import Article from "@/widgets/home/article";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Catalog() {
  const isMobile = useIsMobile();
  return (
    <main className="bg-[#F1F1F1] w flex flex-col gap-[1.688rem] lg:gap-[4.813rem] pb-[3.125rem] lg:pb-[5.625rem]">
      <Hero />
      <FilterSection />
      {isMobile && <Article />}
      <ReviewCarousel />
    </main>
  );
}
