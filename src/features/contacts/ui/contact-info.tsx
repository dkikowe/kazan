"use client";

import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ContactInfo() {
  const isMobile = useIsMobile();

  return (
    <div
      className={`bg-white  ${
        isMobile ? "w-full p-4" : "rounded-[20px] p-[30px] shadow-lg w-[428px]"
      }`}
    >
      <div
        className={`flex flex-col gap-[10px] ${
          isMobile ? "space-y-[15px]" : "space-y-[20px]"
        }`}
      >
        {/* Адрес */}
        <div className="flex  items-start gap-[15px]">
          <div
            className={`${
              isMobile ? "w-[20px] h-[20px]" : "w-[24px] h-[24px]"
            } mt-[2px]`}
          >
            <Image
              src="/icons/location.svg"
              alt="Локация"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              className="text-[#3D79F6]"
            />
          </div>
          <div>
            <p
              className={`${
                isMobile ? "text-[14px]" : "text-[16px]"
              } text-[#6E7279]`}
            >
              Адрес головного офиса
            </p>
            <p
              className={`w-[180px] ${
                isMobile ? "text-[14px]" : "text-[16px]"
              }`}
            >
              г. Казань р. Татарстан ул. Баумана 29
            </p>
          </div>
        </div>

        {/* Телефон */}
        <div className="flex items-start gap-[15px]">
          <div
            className={`${
              isMobile ? "w-[20px] h-[20px]" : "w-[24px] h-[24px]"
            } mt-[2px]`}
          >
            <Image
              src="/icons/phone.svg"
              alt="Телефон"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              className="text-[#3D79F6]"
            />
          </div>
          <div>
            <p
              className={`${
                isMobile ? "text-[14px]" : "text-[16px]"
              } text-[#6E7279]`}
            >
              Телефон
            </p>
            <a
              href="tel:+79999999999"
              className={`${
                isMobile ? "text-[14px]" : "text-[16px]"
              } hover:text-[#3D79F6] transition-colors`}
            >
              +7 (800) 500 65-89
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-[15px]">
          <div
            className={`${
              isMobile ? "w-[20px] h-[20px]" : "w-[24px] h-[24px]"
            } mt-[2px]`}
          >
            <Image
              src="/icons/mail.svg"
              alt="Email"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              className="text-[#3D79F6]"
            />
          </div>
          <div>
            <p
              className={`${
                isMobile ? "text-[14px]" : "text-[16px]"
              } text-[#6E7279] text-bold`}
            >
              Электронная почта
            </p>
            <a
              href="mailto:info@kazan-tours.ru"
              className={`${
                isMobile ? "text-[14px]" : "text-[16px]"
              } hover:text-[#3D79F6] transition-colors`}
            >
              dir.bs@mail.ru
            </a>
          </div>
        </div>

        {/* Время работы */}
        <div className="flex items-start gap-[15px]">
          <div
            className={`${
              isMobile ? "w-[20px] h-[20px]" : "w-[24px] h-[24px]"
            } mt-[2px]`}
          >
            <Image
              src="/icons/clock-blue.svg"
              alt="Часы"
              width={isMobile ? 20 : 24}
              height={isMobile ? 20 : 24}
              className="text-[#3D79F6]"
            />
          </div>
          <div>
            <p
              className={`${
                isMobile ? "text-[14px]" : "text-[16px]"
              } text-[#6E7279]`}
            >
              Время работы
            </p>
            <p className={`${isMobile ? "text-[14px]" : "text-[16px]"}`}>
              Пн-Пт: 9:00 - 18:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
