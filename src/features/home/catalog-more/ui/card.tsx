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

const CatalogMoreCard = ({
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
    <Card className="p-0 gap-4 w-[310px] h-[438px] lg:w-auto lg:h-auto pb-[1.313rem] lg:pb-[1.813rem] rounded-[0.938rem] lg:rounded-[1.375rem]">
      <CardHeader className="px-[0.313rem] pt-[0.313rem]">
        <div
          className="aspect-[3/2.04]  lg:aspect-[4/3] overflow-hidden bg-cover bg-center rounded-[0.563rem] lg:rounded-t-[1.25rem] p-[0.875rem]"
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
      <CardContent className="p-0 px-[0.563rem] lg:px-[0.938rem]">
        <div className="flex flex-col gap-[0.938rem]">
          <h4 className="font-medium text-[1rem] leading-[121%] lg:text-[1.375rem]">
            {title}
          </h4>
          <p className=" text-left max-w-[18.75rem] font-light text-[0.875rem] lg:text-[1.125rem]">
            {subtitle}
          </p>
        </div>
      </CardContent>
      <CardFooter className="w-full mt-[1.625rem]">
        <div className="w-full flex items-center">
          <Button
            className="w-full flex-1 rounded-full font-semibold text-[0.813rem] lg:text-[0.938rem]"
            size={"card"}
          >
            Выбрать экскурсию
          </Button>
          <Button
            className="w-[40px] h-[40px] lg:w-[56px] lg:h-[56px] rounded-full aspect-square"
            variant="black"
          >
            <ArrowUpRight className="size-[15px]" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CatalogMoreCard;
