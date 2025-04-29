import { articles } from "../data/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ArticleCard from "./card";

const ArticleCarouse = () => {
  return (
    <Carousel className="w-full overflow-visible">
      <CarouselContent className="  pt-8">
        {articles.map((card) => (
          <CarouselItem
            key={card.id}
            className="pl-4 basis-[80%] md:basis-[45%] lg:basis-[30.5%]"
          >
            <ArticleCard key={card.id} {...card} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ArticleCarouse;
