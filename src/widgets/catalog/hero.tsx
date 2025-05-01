// src/widgets/home/hero.tsx
"use client";

import NavbarDark from "../navbar-dark";
import { Button } from "@/components/ui/button";
import { heroCategories } from "@/features/home/hero/data/data";
import CategoryFilter from "@/features/home/hero/ui/category-filter";
import { ArrowUpRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="h-[45vh]  lg:h-[70vh] bg-cover bg-center lg:pt-[1.063rem]"
      style={{ backgroundImage: "url(/bg_catalog.png)" }}
    >
      <NavbarDark />
      <div className="max-w-[1440px] p-[20px] mx-auto h-full flex flex-col justify-between py-[4.625rem]">
        <div className="flex flex-col gap-[2.5rem]">
          <div className="flex flex-col gap-[2.25rem]">
            <h1 className="max-w-[75.25rem] text-white font-medium leading-[106%] tracking-[-4%] text-[1.55rem] lg:text-[4.125rem]">
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
          <CategoryFilter categories={heroCategories} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
