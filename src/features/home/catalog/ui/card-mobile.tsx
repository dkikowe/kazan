// src/features/excursion/ui/card-mobile.tsx

import React from "react";
import Image from "next/image";

const CardMobile = ({
  id,
  title,
  subtitle,
  rating,
  imageUrl,
}: {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  imageUrl: string;
}) => {
  return (
    <div className="flex flex-col gap-[1.75rem] items-center  pt-[0.375rem] pb-[2.25rem] h-[429px] w-[95%] rounded-3xl bg-[#191C2D]">
      <div
        className="aspect-square overflow-hidden bg-cover bg-center rounded-2xl w-[95%] h-[248px]"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
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
      </div>
      <div className="flex flex-col gap-[0.938rem] items-center justify-center text-center">
        <h4 className="font-medium text-[1.375rem] leading-[121%] text-white">
          {title}
        </h4>
        <p className="max-w-[13.625rem] mx-auto font-light text-[0.938rem] text-[#C3C4C8]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default CardMobile;
