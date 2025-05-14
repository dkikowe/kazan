// src/features/catalog/ui/aside.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import { FilterAccordion } from "./filter-accordion";
import { getFilters } from "../api/filters";
import { FilterGroup } from "../api/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";

interface CatalogAsideProps {
  initialFilters?: FilterGroup[];
}

export const CatalogAside = ({ initialFilters }: CatalogAsideProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterGroup[]>(initialFilters || []);
  const [priceRange, setPriceRange] = useState<[number, number]>([800, 7200]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [isLoading, setIsLoading] = useState(!initialFilters);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setIsLoading(true);
        const data = await getFilters();
        setFilters(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialFilters) {
      fetchFilters();
    }
  }, [initialFilters]);

  // Инициализация выбранных фильтров из URL при первой загрузке
  useEffect(() => {
    const tagId = searchParams.get("tag");
    if (tagId) {
      setSelectedFilters((prev) => ({
        ...prev,
        Теги: [tagId],
      }));
    }
  }, [searchParams]);

  const resetFilters = () => {
    console.log("Сброс фильтров");
    setPriceRange([800, 7200]);
    setSelectedFilters({});
    router.push("/catalog");
  };

  const applyFilters = () => {
    // Создаем новые параметры запроса
    const params = new URLSearchParams();

    // Добавляем выбранные теги в параметры
    if (selectedFilters["Теги"] && selectedFilters["Теги"].length > 0) {
      const tagId = selectedFilters["Теги"][0];
      console.log("Применение фильтра по тегу:", tagId);
      params.set("tag", tagId); // Поддерживаем пока только один тег
    } else {
      console.log("Нет выбранных тегов для фильтрации");
    }

    // Выводим информацию о выбранных фильтрах
    console.log("Выбранные фильтры:", selectedFilters);

    // Формируем URL для редиректа
    const url = `/catalog${params.toString() ? `?${params.toString()}` : ""}`;
    console.log("Редирект на URL:", url);

    // Перенаправляем на ту же страницу с новыми параметрами
    router.push(url);
  };

  if (isLoading) {
    return (
      <aside className="w-full h-fit p-[0.75rem] rounded-[1.188rem] border lg:p-[1.125rem] bg-white">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full h-fit p-[0.75rem] rounded-[1.188rem] border lg:p-[1.125rem] bg-white">
      <div className="flex items-center justify-between pb-4">
        <p className="text-[1.063rem]">Фильтры</p>
        <div
          className="flex items-center gap-[0.375rem] text-primary cursor-pointer"
          onClick={resetFilters}
        >
          <Image
            src={"/icons/refresh.png"}
            alt={""}
            width={12}
            height={12}
            className="object-cover"
          />
          <p>Сбросить</p>
        </div>
      </div>
      <Accordion type="multiple" defaultValue={filters.map((f) => f.id)}>
        <AccordionItem value="price">
          <AccordionTrigger className="font-medium text-[#151515] leading-[112%] text-[1.063rem]">
            Цена, руб.
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-full h-12 rounded-xl border border-muted bg-transparent px-4 text-sm"
              />
              <span className="text-[1.063rem]">–</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full h-12 rounded-xl border border-muted bg-transparent px-4 text-sm"
              />
            </div>
            <div className="relative px-2">
              <Slider
                min={800}
                max={7200}
                step={100}
                value={priceRange}
                onValueChange={(value) => setPriceRange([value[0], value[1]])}
                className="mb-6"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 cursor-pointer"
                      style={{
                        left: `${
                          ((priceRange[0] - 800) / (7200 - 800)) * 100
                        }%`,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{priceRange[0]}₽</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute left-0 top-0 h-6 w-6 -translate-x-1/2 cursor-pointer"
                      style={{
                        left: `${
                          ((priceRange[1] - 800) / (7200 - 800)) * 100
                        }%`,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{priceRange[1]}₽</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </AccordionContent>
        </AccordionItem>
        {filters.map((filterGroup) => (
          <FilterAccordion
            key={filterGroup.id}
            category={filterGroup.title}
            options={filterGroup.options}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        ))}
      </Accordion>
      <Button
        variant={"default"}
        className="w-full rounded-full h-[2.688rem] font-bold leading-[112%] text-[0.938rem]"
        onClick={applyFilters}
      >
        Применить
      </Button>
    </aside>
  );
};

export const CatalogAsideMobile = ({ initialFilters }: CatalogAsideProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterGroup[]>(initialFilters || []);
  const [priceRange, setPriceRange] = useState<[number, number]>([800, 7200]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [isLoading, setIsLoading] = useState(!initialFilters);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setIsLoading(true);
        const data = await getFilters();
        setFilters(data);
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialFilters) {
      fetchFilters();
    }
  }, [initialFilters]);

  // Инициализация выбранных фильтров из URL при первой загрузке
  useEffect(() => {
    const tagId = searchParams.get("tag");
    if (tagId) {
      setSelectedFilters((prev) => ({
        ...prev,
        Теги: [tagId],
      }));
    }
  }, [searchParams]);

  const resetFilters = () => {
    console.log("Сброс фильтров");
    setPriceRange([800, 7200]);
    setSelectedFilters({});
    router.push("/catalog");
    setOpen(false);
  };

  const applyFilters = () => {
    // Создаем новые параметры запроса
    const params = new URLSearchParams();

    // Добавляем выбранные теги в параметры
    if (selectedFilters["Теги"] && selectedFilters["Теги"].length > 0) {
      const tagId = selectedFilters["Теги"][0];
      console.log("Применение фильтра по тегу:", tagId);
      params.set("tag", tagId); // Поддерживаем пока только один тег
    } else {
      console.log("Нет выбранных тегов для фильтрации");
    }

    // Выводим информацию о выбранных фильтрах
    console.log("Выбранные фильтры:", selectedFilters);

    // Формируем URL для редиректа
    const url = `/catalog${params.toString() ? `?${params.toString()}` : ""}`;
    console.log("Редирект на URL:", url);

    // Перенаправляем на ту же страницу с новыми параметрами
    router.push(url);
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full border rounded-2xl bg-white">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-2xl bg-white">
      <Button
        onClick={() => setOpen(!open)}
        variant="ghost"
        className="w-full h-[2.938rem] flex items-center justify-between text-[1.063rem]"
      >
        <span>Фильтры</span>
        <div className="flex items-center gap-1 text-primary text-sm">
          <Image
            src="/icons/refresh.png"
            alt="refresh"
            width={12}
            height={12}
            className="object-cover"
          />
          <span onClick={resetFilters}>Сбросить</span>
        </div>
      </Button>

      {open && (
        <div className="mt-4 space-y-4 px-[1rem] pb-[2.5rem]">
          <Accordion type="multiple" defaultValue={["price"]}>
            <AccordionItem value="price">
              <AccordionTrigger className="font-medium text-[1.063rem]">
                Цена, руб.
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full h-12 rounded-xl border border-muted bg-transparent px-4 text-sm"
                  />
                  <span className="text-[1.063rem]">–</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full h-12 rounded-xl border border-muted bg-transparent px-4 text-sm"
                  />
                </div>
                <Slider
                  min={800}
                  max={7200}
                  step={100}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                />
              </AccordionContent>
            </AccordionItem>
            {filters.map((filterGroup) => (
              <FilterAccordion
                key={filterGroup.id}
                category={filterGroup.title}
                options={filterGroup.options}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            ))}
          </Accordion>
          <Button
            variant="default"
            className="w-full rounded-full"
            onClick={applyFilters}
          >
            Применить
          </Button>
        </div>
      )}
    </div>
  );
};
