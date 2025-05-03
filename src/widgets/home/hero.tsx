// src/widgets/home/hero.tsx
"use client";

import { useEffect, useState } from "react";
import NavbarDark from "../navbar-dark";
import { Button } from "@/components/ui/button";
import { heroCategories } from "@/features/home/hero/data/data";
import CategoryFilter from "@/features/home/hero/ui/category-filter";
import { ArrowUpRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ContactModal from "@/components/contact-modal";
import { ITag } from "@/models/Tag";

const Hero = () => {
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<ITag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        if (!response.ok) {
          throw new Error("Ошибка при загрузке тегов");
        }
        const data = await response.json();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла ошибка");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const categories = tags.map((tag) => ({
    id: tag.slug,
    label: tag.name,
  }));

  return (
    <section
      className={`${
        isMobile ? "min-h-[70vh]" : "h-[80vh]"
      } bg-cover bg-center lg:pt-[1.063rem] w-full`}
      style={{ backgroundImage: "url(/bg.png)" }}
    >
      <NavbarDark />
      <div className="max-w-[1440px] p-[20px] mx-auto h-full flex flex-col justify-between py-[4.625rem]">
        <div className="flex flex-col gap-[2.5rem]">
          <div className="flex flex-col gap-[1.25rem]">
            <h1 className="max-w-[85.25rem] text-white font-medium leading-[106%] tracking-[-4%] text-[1.75rem] lg:text-[4.125rem]">
              Почувствуйте энергетику Казани: откройте для себя город вместе с
              нами!
            </h1>
            <p className="text-white font-medium tracking-[-2%] text-[0.938rem] lg:text-[1.063rem]">
              Легенды Татарстана ждут вас:
              <br />
              отправьтесь в незабываемое путешествие!
            </p>
          </div>
          <div className="flex items-center md:mb-0 mb-[3.25rem]">
            <Button
              className="rounded-full font-medium tracking-[-2%] text-[1.063rem] md:h-[75px] h-[56px] px-[2.375rem]"
              onClick={() => setIsModalOpen(true)}
            >
              Оставить заявку
            </Button>
            <Button
              className="rounded-full  aspect-square md:h-[75px] h-[56px]"
              variant={`${isMobile ? "outline" : "glass"}`}
            >
              <ArrowUpRight />
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-white">Загрузка...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <CategoryFilter categories={categories} />
        )}
      </div>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
