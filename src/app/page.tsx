"use client";

import ReviewCarousel from "@/features/home/review/ui/carousel";
import Article from "@/widgets/home/article";
import Catalog from "@/widgets/home/catalog";
import CatalogMore from "@/widgets/home/catalog-more";
import Hero from "@/widgets/home/hero";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <Catalog />
      <section className="bg-[#F1F1F1] space-y-[3.125rem] py-[3.125rem] lg:space-y-[5.625rem] lg:py-[5.625rem] w-full">
        <div className="max-w-[1440px] mx-auto">
          <CatalogMore />
          <Article />
          <ReviewCarousel />
        </div>
      </section>
    </main>
  );
}
