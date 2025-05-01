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
      <div className="bg-white rounded-[20px] ">
        <Card className="w-full gap-0 lg:w-[404px] h-auto lg:h-[594px] rounded-[12px] md:rounded-[17px] bg-[#E8EBF0]">
          <CardHeader className="p-0">
            <div className="flex items-start gap-[12px] md:gap-[18px] p-[20px] md:p-0 md:px-[20px]">
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
                <p className="text-[#161913] text-[14px] md:text-[16px]  font-normal text-[15px] leading-[121%] text-[#161913] font-manrope ">
                  {role}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-[20px] flex flex-col  md:px-[35px]">
              <p className="text-[#161913]/59 text-[14px] md:text-[16px] font-normal text-[15px] leading-[121%] text-[#161913] font-manrope   mb-[10px] md:mb-[15px]">
                {responseTime}
              </p>
              <Button className="w-full h-[40px] md:h-[43px] rounded-[35px] md:rounded-[45px] bg-[#0D1723]/41 text-white text-[14px] leading-[17px] mb-[20px] md:mb-[10px]">
                Напишите мне
              </Button>
              <div className="h-[1px] w-full bg-[#D0D0D0] mb-[20px] md:mb-[28px]" />
              <p className="text-[#161913] text-[14px] md:text-[16px] leading-[16px] md:leading-[18px] mb-[20px] md:mb-[10px]">
                {format}
              </p>
              <div className="text-[#161913] text-[14px] md:text-[16px] leading-[20px] md:leading-[26px] mb-[20px] md:mb-[24px]">
                {detailsLines.map((line, index) => {
                  // Разделяем строку на заголовок и значение
                  const [title, value] = line.split(": ");

                  return (
                    <p key={index} className="flex gap-1">
                      <span className="text-[#6E7279]">{title}: </span>
                      <span className="flex items-center gap-1 text-[#161913]">
                        {title === "Рейтинг" ? (
                          <svg
                            width="10"
                            height="9"
                            viewBox="0 0 10 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.78862 9C7.70945 8.99947 7.63155 8.98128 7.56129 8.94693L4.99996 7.67924L2.43863 8.94693C2.358 8.98657 2.26722 9.00422 2.17651 8.9979C2.0858 8.99158 1.99876 8.96154 1.92521 8.91117C1.85165 8.86079 1.7945 8.79207 1.76018 8.71276C1.72586 8.63345 1.71575 8.54669 1.73097 8.46226L2.21944 5.7771L0.147208 3.87555C0.0820123 3.81561 0.0359234 3.7397 0.01415 3.65639C-0.00762342 3.57308 -0.00421312 3.4857 0.0239954 3.40412C0.052204 3.32254 0.104086 3.25002 0.173778 3.19475C0.24347 3.13948 0.328192 3.10366 0.418371 3.09135L3.28155 2.69925L4.56222 0.256424C4.60255 0.179455 4.66495 0.114648 4.74236 0.0693319C4.81978 0.0240161 4.90912 0 5.00027 0C5.09143 0 5.18077 0.0240161 5.25818 0.0693319C5.3356 0.114648 5.398 0.179455 5.43833 0.256424L6.71899 2.69925L9.58217 3.09135C9.6723 3.10375 9.75695 3.13963 9.82656 3.19494C9.89617 3.25025 9.94797 3.32278 9.97611 3.40435C10.0042 3.48591 10.0076 3.57326 9.9858 3.65652C9.96399 3.73979 9.9179 3.81565 9.85271 3.87555L7.7811 5.7771L8.26957 8.46226C8.2816 8.52824 8.27819 8.5959 8.25957 8.66051C8.24096 8.72512 8.20758 8.78513 8.16178 8.83634C8.11598 8.88754 8.05886 8.92872 7.99441 8.95699C7.92995 8.98526 7.85972 8.99994 7.78862 9Z"
                              fill="#107CDB"
                            />
                          </svg>
                        ) : null}
                        {value}
                      </span>
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
