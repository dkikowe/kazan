// src/features/excursion/ui/card-more.tsx

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const CardMore = ({
  id,
  title,
  subtitle,
  rating,
  duration,
  imageUrl,
}: {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  duration: string;
  imageUrl: string;
}) => {
  return (
    <div className="flex flex-col gap-[1.75rem] px-[0.25rem] pt-[0.25rem] pb-[1.25rem] h-full rounded-3xl bg-white">
      <div
        className="aspect-[3/2] lg:aspect-[4/3] overflow-hidden bg-cover bg-center rounded-t-2xl"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="flex items-center gap-[0.5rem]">
          <div className="px-[0.75rem] pt-[0.75rem]">
            <div className="flex items-center rounded-full bg-white w-fit px-[0.875rem] py-[0.75rem]">
              <Image
                src={"/icons/star.png"}
                alt={""}
                width={15}
                height={15}
                sizes="15"
                className="object-cover"
              />
              <p className="font-semibold text-[0.875rem] leading-[99%] tracking-[-3%]">
                {rating}/5
              </p>
            </div>
          </div>
          <div className="px-[0.75rem] pt-[0.75rem]">
            <div className="flex items-center rounded-full bg-white w-fit px-[0.875rem] py-[0.75rem]">
              <Image
                src={"/icons/clock.png"}
                alt={""}
                width={11}
                height={11}
                sizes="11"
                className="object-cover"
              />
              <p className="font-medium text-[0.875rem] leading-[141%] tracking-[-2%]">
                {duration}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[2rem]">
        <div className="flex flex-col gap-[0.938rem]">
          <h4 className="font-medium text-[1rem] leading-[121%] lg:text-[1.375rem]">
            {title}
          </h4>
          <p className="mx-auto font-light text-[0.875rem] lg:text-[1.125rem]">
            {subtitle}
          </p>
        </div>
        <div className="w-full flex items-center h-[2.5rem]">
          <Button className="rounded-full h-full font-semibold text-[0.813rem] lg:text-[0.938rem]">
            Выбрать экскурсию
          </Button>
          <Button className="rounded-full aspect-square h-full">
            <ArrowUpRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardMore;
