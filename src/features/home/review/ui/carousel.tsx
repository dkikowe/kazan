"use client";

import { reviews } from "../data/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ReviewCard, { ReviewProps } from "./card";
import { useIsMobile } from "@/hooks/use-mobile";

const ReviewCarousel = () => {
  const isMobile = useIsMobile();
  const grouped: Record<"white" | "dark" | "video", ReviewProps[]> = {
    white: [],
    dark: [],
    video: [],
  };

  for (const item of reviews) {
    if (
      item.type === "white" ||
      item.type === "dark" ||
      item.type === "video"
    ) {
      grouped[item.type].push(item as ReviewProps);
    }
  }

  const ordered: ReviewProps[] = [];
  const maxLength = Math.max(
    grouped.white.length,
    grouped.dark.length,
    grouped.video.length
  );

  for (let i = 0; i < maxLength; i++) {
    if (grouped.white[i]) ordered.push(grouped.white[i]);
    if (grouped.dark[i]) ordered.push(grouped.dark[i]);
    if (grouped.video[i]) ordered.push(grouped.video[i]);
  }

  return (
    <div className=" lg:max-w-[1440px] w-full  mx-auto px-4">
      <Carousel className="w-full overflow-visible flex flex-col gap-[0.5rem] lg:gap-[2rem]">
        <div className="flex justify-between">
          <div className="flex flex-col gap-[0.625rem] lg:gap-[1rem]">
            <div>
              <h2 className="mt-[40px] font-semibold leading-[106%] tracking-[-4%] text-[1.75rem] lg:text-[3.375rem] max-w-[31rem]">
                Почитайте отзывы{" "}
                <span className="text-primary">наших клиентов</span>
              </h2>
            </div>
            <div>
              <p className="text-[#535353] leading-[124%] text-[0.875rem] lg:text-[1.063rem]">
                Темы, новости о путешествиях в городах России
              </p>
            </div>
          </div>
          <div className="hidden lg:flex justify-end items-end">
            <CarouselPrevious className="size-[4.813rem]" />
            <CarouselNext className="size-[4.813rem]" variant={"default"} />
          </div>
        </div>
        <CarouselContent className={`${isMobile ? "ml-0 gap-4" : "ml-0"}`}>
          {ordered.map((card) => (
            <CarouselItem
              key={card.id}
              className={`${
                isMobile
                  ? " basis-[100%]"
                  : "basis-[20%] md:basis-[45%] lg:basis-[26.5%]"
              }`}
            >
              <ReviewCard {...card} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ReviewCarousel;
