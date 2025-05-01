// src/widgets/home/catalog-grid-mobile.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { excursionCategories } from "../data/data";
import CardMobile from "./card-mobile";

const CatalogGridMobile = () => {
  return (
    <Carousel className="w-full flex flex-col gap-[1.75rem]">
      <div className="w-full overflow-visible">
        <CarouselContent className="ml-0">
          {excursionCategories.map((card) => (
            <CarouselItem key={card.id} className="basis-[98%] snap-center">
              <CardMobile key={card.id} {...card} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
      <Button className="rounded-full w-[85%] h-[56px] mx-auto mb-[40px] py-[1rem] font-medium text-[1rem]">
        Все экскурсии
      </Button>
    </Carousel>
  );
};

export default CatalogGridMobile;
