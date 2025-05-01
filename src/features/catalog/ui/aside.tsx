// src/features/catalog/ui/aside.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Accordion,
} from "@/components/ui/accordion";
import { FilterAccordion } from "./filter-accordion";
import { catalogFilters } from "../data/data";
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

type FilterOption = {
  id: string;
  title: string;
  count: number;
  checked?: boolean;
};

type CatalogFilters = {
  [category: string]: FilterOption[];
};

interface CatalogAsideProps {
  filters: CatalogFilters;
}

export const CatalogAside = ({ filters }: CatalogAsideProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([800, 7200]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const resetFilters = () => {
    setPriceRange([800, 7200]);
    setSelectedFilters({});
  };

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
      <Accordion type="multiple" defaultValue={Object.keys(catalogFilters)}>
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
        {Object.entries(catalogFilters).map(([category, options]) => (
          <FilterAccordion
            key={category}
            category={category}
            options={options}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        ))}
      </Accordion>
      <Button
        variant={"default"}
        className="w-full rounded-full h-[2.688rem] font-bold leading-[112%] text-[0.938rem]"
      >
        Применить
      </Button>
    </aside>
  );
};

export const CatalogAsideMobile = ({ filters }: CatalogAsideProps) => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([800, 7200]);

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
          <span>Сбросить</span>
        </div>
      </Button>

      {open && (
        <div className="mt-4 space-y-4 px-[1rem] pb-[2.5rem]">
          <Accordion type="multiple" defaultValue={["price"]}>
            {/* Цена */}
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
                      setPriceRange([+e.target.value, priceRange[1]])
                    }
                    className="w-full h-12 rounded-xl border border-muted bg-transparent px-4 text-sm"
                  />
                  <span>–</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], +e.target.value])
                    }
                    className="w-full h-12 rounded-xl border border-muted bg-transparent px-4 text-sm"
                  />
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(val) =>
                    setPriceRange(val as [number, number])
                  }
                  min={800}
                  max={7200}
                  step={100}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Остальные категории */}
            {Object.entries(filters).map(([category, options]) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="capitalize font-medium text-[1.063rem]">
                  {category}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4 pt-2">
                    {options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center gap-2.5"
                      >
                        <Checkbox id={option.id} />
                        <label
                          htmlFor={option.id}
                          className="text-sm text-muted-foreground"
                        >
                          {option.title}{" "}
                          <span className="text-[#C4C4C4]">
                            ({option.count})
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button
            variant={"default"}
            className="w-full rounded-full h-[2.688rem] font-bold leading-[112%] text-[0.938rem]"
          >
            Применить
          </Button>
        </div>
      )}
    </div>
  );
};
