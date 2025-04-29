"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface GuideCardProps {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  responseTime: string;
  format: string;
  details: string;
  price: string;
}

const GuideCard = ({
  id,
  name,
  role,
  avatarUrl,
  responseTime,
  format,
  details,
  price,
}: GuideCardProps) => {
  // Разбиваем строку details на отдельные строки
  const detailsLines = details.split("\n");

  return (
    <div className="max-w-[1440px] mx-auto">
      <div className="bg-white rounded-[20px] p-6">
        <Card className="w-full lg:w-[404px] h-auto lg:h-[744px] rounded-[12px] md:rounded-[17px] bg-[#E8EBF0]">
          <CardHeader className="p-0">
            <div className="flex items-start gap-[12px] md:gap-[18px] p-[20px] md:p-[20px]">
              <div className="relative w-[100px] md:w-[130px] h-[80px] md:h-[100px] rounded-full overflow-hidden">
                <Image
                  src={avatarUrl}
                  alt={name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col gap-[5px] md:gap-[7px]">
                <h3 className="font-medium text-[18px] md:text-[22px] leading-[22px] md:leading-[26px] text-[#161913]">
                  {name}
                </h3>
                <p className="text-[#161913] text-[14px] md:text-[16px] leading-[20px] md:leading-[36px]">
                  {role}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-[20px] flex flex-col  md:px-[35px]">
              <p className="text-[#161913]/59 text-[14px] md:text-[16px] leading-[16px] md:leading-[18px] mb-[15px] md:mb-[15px]">
                {responseTime}
              </p>
              <Button className="w-full h-[40px] md:h-[43px] rounded-[35px] md:rounded-[45px] bg-[#0D1723]/41 text-white text-[14px] leading-[17px] mb-[20px] md:mb-[10px]">
                Напишите мне
              </Button>
              <div className="h-[1px] w-full bg-[#D0D0D0] mb-[20px] md:mb-[28px]" />
              <p className="text-[#161913] text-[14px] md:text-[16px] leading-[16px] md:leading-[18px] mb-[20px] md:mb-[27px]">
                {format}
              </p>
              <div className="text-[#161913] text-[14px] md:text-[16px] leading-[20px] md:leading-[26px] mb-[20px] md:mb-[24px]">
                {detailsLines.map((line, index) => {
                  // Разделяем строку на заголовок и значение
                  const [title, value] = line.split(": ");

                  return (
                    <p key={index} className="mb-[10px]">
                      <span className="text-[#6E7279]">{title}: </span>
                      <span className="text-[#161913]">{value}</span>
                    </p>
                  );
                })}
              </div>
              <div className="h-[1px] w-full bg-[#D0D0D0] mb-[15px]" />
              <div className="flex flex-col gap-[15px] md:gap-[20px] mb-[20px] md:mb-[24px]">
                <p className="text-[#161913] text-[14px] md:text-[16px] leading-[16px] md:leading-[18px]">
                  Цена:
                </p>
                <p className="text-[#161913] text-[28px] md:text-[36px] leading-[36px] md:leading-[46px]">
                  {price}
                </p>
              </div>
              <Button className="w-full h-[45px] md:h-[49px] rounded-[30px] md:rounded-[35px] bg-[#3171F7] text-white text-[14px] md:text-[16px] leading-[17px] md:leading-[20px]">
                Заказать тур
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuideCard;
