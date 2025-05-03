import { moreCatalogCategories } from "../data/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CatalogMoreCard from "./card";

const CatalogMoreCarousel = () => {
  return (
    <Carousel className="w-full overflow-visible">
      <CarouselContent className="ml-[1rem] gap-4">
        {moreCatalogCategories.map((card) => (
          <CarouselItem
            key={card.id}
            className=" basis-[85%] md:basis-[45%] lg:basis-[30.5%]"
          >
            <CatalogMoreCard key={card.id} {...card} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default CatalogMoreCarousel;
