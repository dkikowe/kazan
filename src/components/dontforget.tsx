"use client";

import React from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

const DontForget: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full mt-[40px] mb-[40px]">
      <div className="relative w-full">
        <Image
          src={
            isMobile
              ? "/images/catalog-filter/blog/forgetMobile.svg"
              : "/images/catalog-filter/blog/forget.svg"
          }
          alt="Внимание"
          width={1200}
          height={600}
          className="w-full h-auto sm:h-[500px] object-fill"
          priority
        />

        <div className="hidden sm:flex absolute top-[10%] left-[5%] w-[90%] h-[80%] flex flex-col items-center justify-center">
          <h2 className="flex gap-3 text-[#3171f7] font-['Manrope'] font-medium text-[30px] leading-[117%] mb-2">
            Внимание!
            <p className="text-black  text-[30px]">Не забудьте:</p>
          </h2>
          <div className="font-['Manrope'] font-medium text-[16px] leading-[117%] text-[#121212] space-y-1 w-full text-center">
            <ol className="list-decimal list-inside space-y-1 text-center">
              <li>Приходить нужно за 1 час до начала экскурсии.</li>
              <li>Билеты в музей покупаются отдельно.</li>
              <li>
                Экскурсия длится приблизительно 2 часа, поэтому удобная обувь
                приветствуется.
              </li>
              <li>
                Во время экскурсии запрещается фотографировать без разрешения
                экскурсовода.
              </li>
              <li>
                Пожалуйста, не отставайте от группы и следите за указаниями
                экскурсовода.
              </li>
              <li>
                В случае плохой погоды экскурсия может быть перенесена на другое
                время.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DontForget;
