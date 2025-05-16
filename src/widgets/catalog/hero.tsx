// src/widgets/home/hero.tsx
"use client";

import NavbarDark from "../navbar-dark";
import { Button } from "@/components/ui/button";
import { heroCategories } from "@/features/home/hero/data/data";
import CategoryFilter from "@/features/home/hero/ui/category-filter";
import { ArrowUpRight } from "lucide-react";
import { ITag } from "@/models/Tag";
import { useEffect, useState } from "react";

interface TagWithId extends ITag {
  _id: string;
}

const Hero = () => {
  const [tags, setTags] = useState<TagWithId[]>([]);
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
    id: tag._id.toString(),
    label: tag.name,
  }));

  return (
    <section
      className="h-[45vh]  lg:h-[70vh] bg-cover bg-center lg:pt-[1.063rem]"
      style={{ backgroundImage: "url(/bg_catalog.webp)" }}
    >
      <NavbarDark />
      <div className="max-w-[1440px] p-[20px] mx-auto h-full flex flex-col justify-between py-[4.625rem]">
        <div className="flex flex-col gap-[2.5rem]">
          <div className="flex flex-col gap-[2.25rem]">
            <h1 className="max-w-[90.25rem] text-white font-medium leading-[106%] tracking-[-4%] text-[1.55rem] lg:text-[4.125rem]">
              Почувствуйте энергетику Казани: откройте для себя город вместе с
              нами!
            </h1>
            <p className="text-white font-medium tracking-[-2%] text-[0.938rem] lg:text-[1.063rem]">
              Легенды Татарстана ждут вас:
              <br />
              отправьтесь в незабываемое путешествие!
            </p>
          </div>
        </div>
        <div className="hidden lg:block mb-[2.25rem]">
          <CategoryFilter categories={categories} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
