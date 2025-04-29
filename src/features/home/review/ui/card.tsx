"use client";

import { Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ReviewProps {
  id: string;
  type: "white" | "dark" | "video"; // Explicitly define allowed types
  author: string;
  city: string;
  text: string;
  date: string;
  avatarUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

const ReviewCard = (props: ReviewProps) => {
  const isMobile = useIsMobile();
  const cardClassName =
    props.type === "dark"
      ? "bg-[#121824] text-white border-none"
      : "bg-white text-[#161913] border-none";

  if (props.type === "video") {
    return (
      <Card
        className={`w-[280px] md:w-[350px] h-[400px] md:h-[700px] aspect-[7/8] lg:aspect-[2/3] bg-center bg-cover flex lfex-col justify-items-center justify-center items-center rounded-2xl`}
        style={{ backgroundImage: `url(${props.thumbnailUrl || ""})` }}
      >
        <Button
          className="rounded-full aspect-square size-[4rem] md:size-[7.813rem]"
          variant={"glass"}
        >
          <Play fill={"white"} className="size-[1rem] md:size-[1.438rem]" />
        </Button>
      </Card>
    );
  }

  return (
    <Card
      className={`w-[280px] md:w-[350px] h-[400px] md:h-[700px] aspect-[7/8] lg:aspect-[2/3] ${cardClassName} rounded-2xl`}
    >
      <CardHeader>
        <div className="flex items-start gap-[0.75rem] md:gap-[1.063rem] lg:gap-[1.25rem]">
          <Avatar className="aspect-square size-[3rem] md:size-[4.875rem]">
            <AvatarImage
              src={props.avatarUrl}
              alt={props.author}
              className="aspect-square size-[2.5rem] md:size-[3.75rem] lg:size-[4.875rem]"
            />
            <AvatarFallback>{props.author}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="inherit">
              <p
                className={`font-medium ${
                  props.type === "dark" ? "text-white" : "text-[#161913]"
                } leading-[150%] text-[0.75rem] md:text-[0.875rem] lg:text-[1.25rem]`}
              >
                {props.author}
              </p>
              <p
                className={`${
                  props.type === "dark" ? "text-white/80" : "text-[#B8B8B8]"
                } leading-[198%] text-[0.688rem] md:text-[0.813rem] lg:text-[1rem]`}
              >
                {props.city}
              </p>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Image
                  key={index}
                  src={"/icons/star.png"}
                  alt={""}
                  width={18}
                  height={18}
                  className="object-cover size-[0.75rem] md:size-[0.875rem] lg:size-[1.125rem]"
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p
          className={`${
            props.type === "dark" ? "text-white" : "text-[#161913]"
          } leading-[144%] text-[0.75rem] md:text-[0.875rem] lg:text-[1.188rem]`}
        >
          {props.text}
        </p>
      </CardContent>
      <CardFooter className="w-full mt-auto">
        <div className="w-full flex justify-end items-end">
          <p
            className={`${
              props.type === "dark" ? "text-white/80" : "text-[#373737]"
            } leading-[144%] text-[0.688rem] md:text-[0.813rem] lg:text-[1.063rem]`}
          >
            {props.date}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReviewCard;
