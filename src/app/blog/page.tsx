"use client";

import React from "react";
import Hero from "../../widgets/catalog/hero";
import KazanKremlinInfo from "@/features/where-to-go/ui/kazan-kremlin-info";
import Photos from "@/features/where-to-go/ui/photos";
import DontForget from "@/components/dontforget";
import CatalogMore from "@/widgets/home/catalog-more";
import Article from "@/widgets/home/article";
import ReviewCarousel from "@/features/home/review/ui/carousel";
const excursionDetails = {
  title: "Экскурсии по Казанскому кремлю",
  description:
    "Кремль Казани относится к старинным памятникам зодчества, с 2000-го года отнесен к наследию ЮНЕСКО. Известное сооружение хранит истории о временах, когда на территории края жили булгарские племена, правили золотоордынские наместники и ставленники Ивана Грозного. Профессиональный гид агентства, сопровождающий туристов в поездке, расскажет гостям необычную историю казанского Кремля. Путешественники узнают легенду о царице Сююмбике, смогут увидеть стены и внутренние застройки музея-заповедника.",
  duration: "2 часа 15 минут",
  location: "ул.Баумана, 29",
  rating: "4.9/5",
  photos: [
    "/images/catalog-filter/catalog1.png",
    "/images/catalog-filter/catalog2.png",
    "/images/catalog-filter/catalog3.png",
    "/images/catalog-filter/catalog4.png",
    "/images/catalog-filter/catalog5.png",
  ],
  prices: {
    adult: "от 1500 ₽",
    child: "от 1500 ₽",
    retired: "от 1500 ₽",
    childUnder7: "Бесплатно",
  },
};

export default function BlogPage() {
  return (
    <main className="bg-white overflow-x-hidden">
      <Hero />
      <section className="max-w-[1440px] mx-auto  md:py-[40px]  md:px-0">
        <KazanKremlinInfo />
        <Photos photos={excursionDetails.photos} />
        <DontForget />
        <div className="flex flex-col mb-[30px] md:mb-[40px]">
          <h2 className="p-4 font-semibold mb-[20px] md:mb-[40px] leading-[106%] text-left md:text-left tracking-[-4%] text-[1.5rem] md:text-[1.75rem] lg:text-[3.375rem] max-w-full md:max-w-[50rem]">
            <span className="text-primary"> Посмотрите видео </span>,с
            экскурсией <span> и эмоциями наших клиентов</span>
          </h2>
          <div className="relative">
            <img
              src="/images/catalog-filter/blog/video.svg"
              className="w-full"
              alt=""
            />
            <img
              src="/icons/playVideo.svg"
              alt=""
              className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        <CatalogMore />
        <Article />
        <ReviewCarousel />
      </section>
    </main>
  );
}
