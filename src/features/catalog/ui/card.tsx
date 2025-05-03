import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
type CatalogCardProps = {
  id: string;
  imageUrl: string;
  duration: string;
  rating: number;
  title: string;
  times: string[];
  prices: {
    adult: string;
    child: string;
    retired: string;
    childUnder7: string;
  };
};

const CatalogCard = ({
  id,
  imageUrl,
  duration,
  rating,
  title,
  times,
  prices,
}: CatalogCardProps) => {
  return (
    <Card className="gap-4 p-0 pb-[1.313rem] lg:pb-[1.813rem] rounded-[0.938rem] lg:rounded-[1.375rem]">
      <CardHeader className="p-0">
        <div
          className="aspect-[3/2] lg:aspect-[4/3] overflow-hidden bg-cover bg-center rounded-t-[0.563rem] lg:rounded-t-[1.25rem] p-[0.875rem]"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="flex items-center gap-[0.5rem]">
            <Badge variant={"glass"} size={"badge"}>
              <Image
                src={"/icons/clocks.svg"}
                alt={""}
                width={15}
                height={15}
                sizes="15"
                className="object-cover"
              />
              <p className="font-medium">{duration}</p>
            </Badge>
            <Badge variant={"glass"} size={"badge"}>
              <Image
                src={"/icons/star.svg"}
                alt={""}
                width={15}
                height={15}
                sizes="15"
                className="object-cover"
              />
              <p className="font-semibold">{rating}/5</p>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-[20px] flex flex-col gap-[1.25rem] lg:gap-[1.563rem]  lg:px-[20px]">
        <div className="flex flex-col gap-[0.938rem]">
          <h4 className="font-medium text-[1rem] leading-[121%] lg:text-[18px]">
            {title}
          </h4>
          <div className="flex flex-col gap-[0.375rem]">
            <p className="leading-[121%] text-[0.813rem] lg:text-[0.938rem]">
              Ежедневно:
            </p>
            <div className="flex flex-wrap gap-[0.375rem]">
              {times.map((time, index) => (
                <div
                  key={index}
                  className="bg-[#F3F4F6] rounded-[0.25rem] px-[0.625rem] py-[0.313rem]"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[0.625rem] text-[0.875rem] lg:text-[0.938rem]">
          <div className="flex justify-between items-center border-b border-dashed border-muted">
            <span>Взрослый</span>
            <span>{prices.adult}</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-muted">
            <span>Детский</span>
            <span>{prices.child}</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-muted">
            <span>Пенсионер</span>
            <span>{prices.retired}</span>
          </div>
          <div className="flex justify-between items-center border-b border-dashed border-muted">
            <span>Дети до 7 лет</span>
            <span>{prices.childUnder7}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="lg:mt-[20px] w-full">
        <div className="w-full flex items-center">
          <Link href={`/where-to-go`}>
            <Button
              className="w-full flex-1 rounded-full px-5 md:w-[253px] font-semibold text-[0.813rem] lg:text-[0.938rem]"
              size={"card"}
            >
              Выбрать экскурсию
            </Button>
          </Link>

          <Button
            className="w-[42px] h-[42px] lg:w-[56px] lg:h-[56px] flex-none rounded-full aspect-square h-full"
            size={"card"}
            variant={"black"}
          >
            <ArrowUpRight />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CatalogCard;
