"use client";

import React, { useState } from "react";
import Navbar from "@/features/where-to-go/ui/navbar";
import NavbarMobile from "@/features/where-to-go/ui/navbar-mobile";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import ReviewCarousel from "@/features/home/review/ui/carousel";
// Компонент хлебных крошек
const Breadcrumbs = () => {
  return (
    <div className="flex items-center mb-[20px] md:mb-[30px] gap-[10px] md:gap-[15px] px-4 md:px-0">
      <Link href="/" className="text-[#6E7279] text-[14px] md:text-[16px]">
        Главная
      </Link>
      <div className="w-1 h-1 rounded-full bg-[#6E7279]" />
      <Link
        href="/where-to-go-kazan"
        className="text-[#000000] text-[14px] md:text-[16px]"
      >
        Куда сходить в Казани?
      </Link>
    </div>
  );
};

// Компонент карточки экскурсии
const ExcursionCard = ({
  title,
  description,
  imageSrc,
  index,
}: {
  title: string;
  description: string;
  imageSrc: string;
  index: number;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-[20px] md:gap-[30px] mb-[30px] md:mb-[40px] px-4 md:px-0">
      {/* Изображение */}
      <div className="w-full md:w-[665px] h-[200px] md:h-[328px] rounded-[12px] md:rounded-[17.68px] overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Текстовый контент */}
      <div className="flex flex-col justify-around">
        <div>
          <h1 className="text-[#0D171F] max-w-[381px] leading-[120%] text-[24px] md:text-[37px] font-semibold mb-[10px] md:mb-[14px]">
            {title}
          </h1>
          <p className="text-[#0D171F] text-[14px] md:text-[16px] leading-[1.4] md:leading-[21px] max-w-full md:max-w-[581px]">
            {description}
          </p>
        </div>

        {/* Кнопки */}
        <div className="flex  sm:flex-row  md:gap-[1.19px] mt-[20px] md:mt-[0px]">
          <Link href="/blog">
            <button className="lg:w-[253px] w-[192px] h-[42px] md:h-[56px] bg-[#3171F7] rounded-[100px] md:rounded-[118.75px] text-white text-[14px] md:text-[16px] leading-[20px] px-[1.5rem] flex items-center justify-center cursor-pointer">
              Узнать подробнее
            </button>
          </Link>
          <Button
            className="w-[42px] h-[42px] lg:w-[56px] lg:h-[56px] flex-none rounded-full aspect-square h-full"
            size={"card"}
            variant={"black"}
          >
            <ArrowUpRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Компонент пагинации
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // Определяем, какие страницы показывать
  const getPageNumbers = () => {
    const pages = [];

    // Всегда показываем первую страницу
    pages.push(1);

    // Если текущая страница > 3, добавляем многоточие
    if (currentPage > 3) {
      pages.push(-1); // -1 будет означать многоточие
    }

    // Добавляем страницы вокруг текущей
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Если текущая страница < totalPages - 2, добавляем многоточие
    if (currentPage < totalPages - 2) {
      pages.push(-1); // -1 будет означать многоточие
    }

    // Всегда показываем последнюю страницу
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-[1.19px] mt-[30px] md:mt-[40px] w-full px-4 md:px-0 overflow-x-auto pb-2">
      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="text-[#0D171F] text-[14px] leading-[21px] px-[10px]"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-[40px] md:w-[45.33px] h-[40px] md:h-[44px] rounded-[6.67px] flex items-center justify-center ${
              currentPage === page
                ? "bg-[#3171F7] text-white"
                : "bg-[#E8EBF0] text-[#0D171F]"
            }`}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default function WhereToGoKazanPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 11; // Всего 11 страниц по дизайну
  const isMobile = useIsMobile();

  // Данные для карточек экскурсий
  const excursions = [
    {
      title: "Экскурсии по Казанскому кремлю",
      description:
        "Кремль Казани относится к старинным памятникам зодчества, с 2000-го года отнесен к наследию ЮНЕСКО. Известное сооружение хранит истории о временах, когда на территории края жили булгарские племена, правили золотоордынские наместники и ставленники Ивана Грозного.",
      imageSrc: "/images/catalog-filter/catalog1.png",
    },
    {
      title: "Экскурсии по Казанскому кремлю",
      description:
        "Кремль Казани относится к старинным памятникам зодчества, с 2000-го года отнесен к наследию ЮНЕСКО. Известное сооружение хранит истории о временах, когда на территории края жили булгарские племена, правили золотоордынские наместники и ставленники Ивана Грозного.",
      imageSrc: "/images/catalog-filter/catalog2.png",
    },
    {
      title: "Экскурсии по Казанскому кремлю",
      description:
        "Кремль Казани относится к старинным памятникам зодчества, с 2000-го года отнесен к наследию ЮНЕСКО. Известное сооружение хранит истории о временах, когда на территории края жили булгарские племена, правили золотоордынские наместники и ставленники Ивана Грозного.",
      imageSrc: "/images/catalog-filter/catalog3.png",
    },
    {
      title: "Экскурсии по Казанскому кремлю",
      description:
        "Кремль Казани относится к старинным памятникам зодчества, с 2000-го года отнесен к наследию ЮНЕСКО. Известное сооружение хранит истории о временах, когда на территории края жили булгарские племена, правили золотоордынские наместники и ставленники Ивана Грозного.",
      imageSrc: "/images/catalog-filter/catalog4.png",
    },
    {
      title: "Экскурсии по Казанскому кремлю",
      description:
        "Кремль Казани относится к старинным памятникам зодчества, с 2000-го года отнесен к наследию ЮНЕСКО. Известное сооружение хранит истории о временах, когда на территории края жили булгарские племена, правили золотоордынские наместники и ставленники Ивана Грозного.",
      imageSrc: "/images/catalog-filter/catalog5.png",
    },
  ];

  return (
    <main className="bg-white overflow-x-hidden">
      <section className="max-w-[1440px] mx-auto  md:py-[20px]  md:px-0">
        <div className="mb-[30px] md:mb-[40px]">
          {isMobile ? (
            <div className="w-full h-[62px] flex items-center justify-center bg-[#E8EBF0] backdrop-blur-[48.7px] px-[20px]">
              <NavbarMobile />
            </div>
          ) : (
            <Navbar />
          )}
        </div>

        {/* Хлебные крошки */}
        <div className="mb-[15px] md:mb-[20px]">
          <div className=" flex items-center mb-[20px] md:mb-[30px] gap-[10px] md:gap-[15px] px-4 md:px-0">
            <Link
              href="/"
              className="text-[#6E7279] text-[14px] md:text-[16px]"
            >
              Главная
            </Link>
            <div className="w-1 h-1 rounded-full bg-[#6E7279]" />
            <Link
              href="/where-to-go-kazan"
              className="text-[#000000] text-[14px] md:text-[16px]"
            >
              Куда сходить в Казани?
            </Link>
          </div>
        </div>

        {/* Повторяем компонент 5 раз с разделительными линиями */}
        <div className="flex flex-col">
          {excursions.map((excursion, index) => (
            <React.Fragment key={index}>
              <ExcursionCard
                title={excursion.title}
                description={excursion.description}
                imageSrc={excursion.imageSrc}
                index={index}
              />
              {index < excursions.length - 1 && (
                <div className="w-full h-[1px] bg-[#E5E5E5] mb-[30px] md:mb-[40px] mx-4 md:mx-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Пагинация */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {isMobile && <ReviewCarousel />}
      </section>
    </main>
  );
}
