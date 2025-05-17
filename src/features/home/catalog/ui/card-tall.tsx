// src/features/excursion/ui/card-tall.tsx

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CardTall = ({
  id,
  title,
  subtitle,
  rating,
  imageUrl,
  duration,
  addressMeeting,
}: {
  id: string;
  title: string;
  subtitle: string;
  rating: number;
  imageUrl: string;
  duration?: {
    hours: number;
    minutes: number;
  };
  addressMeeting?: string;
}) => {
  const formatDuration = () => {
    if (!duration) return "";
    const hours = duration.hours;
    const minutes = duration.minutes;
    if (hours === 0) return `${minutes} мин`;
    if (minutes === 0) return `${hours} ч`;
    return `${hours} ч ${minutes} мин`;
  };

  return (
    <div
      className="aspect-[4/5] w-full rounded-3xl overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="w-full h-full px-[1.875rem] pt-[1.875rem]">
        <div className="w-full flex justify-between text-white">
          <div className="flex flex-col gap-[1rem]">
            <div className="flex items-start">
              <Image
                src={"/icons/star.png"}
                alt={""}
                width={26}
                height={28}
                sizes="26"
                className="object-cover"
              />
              <p className="font-semibold text-[1.375rem] leading-[99%] tracking-[-3%]">
                {rating}/5
              </p>
            </div>
            <h4 className="font-medium text-[1.875rem] leading-[115%] tracking-[-2%]">
              {title}
            </h4>
            <p className="font-semibold text-[1.125rem] tracking-[-2%]">
              {subtitle}
            </p>
            {duration && (
              <p className="font-medium text-[1rem] tracking-[-2%]">
                {formatDuration()}
              </p>
            )}
            {addressMeeting && (
              <p className="font-medium text-[1rem] tracking-[-2%] flex items-center gap-2">
                <Image
                  src={"/icons/location.svg"}
                  alt=""
                  width={16}
                  height={16}
                  className="object-cover"
                />
                {addressMeeting}
              </p>
            )}
          </div>
          <div className="p-0">
            <Button
              className="rounded-full h-[79px] w-[79px] aspect-square"
              variant={"glass"}
            >
              <ArrowUpRight className="w-12 h-12 stroke-[2]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTall;
