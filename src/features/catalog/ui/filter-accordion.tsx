// src/features/catalog/ui/filter-accordion.tsx

"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FilterOption = {
  id: string;
  title: string;
  count: number;
};

interface FilterAccordionProps {
  category: string;
  options: FilterOption[];
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: (filters: Record<string, string[]>) => void;
}

export const FilterAccordion = ({
  category,
  options,
  selectedFilters,
  setSelectedFilters,
}: FilterAccordionProps) => {
  const handleFilterChange = (optionId: string) => {
    const currentCategoryFilters = selectedFilters[category] || [];
    const newCategoryFilters = currentCategoryFilters.includes(optionId)
      ? currentCategoryFilters.filter((id) => id !== optionId)
      : [...currentCategoryFilters, optionId];

    setSelectedFilters({
      ...selectedFilters,
      [category]: newCategoryFilters,
    });
  };

  return (
    <AccordionItem value={category}>
      <AccordionTrigger className="flex justify-between font-medium text-[#151515] leading-[112%] text-[1.063rem]">
        {category}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-[1.438rem]">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2.5">
              <Checkbox
                id={option.id}
                checked={
                  selectedFilters[category]?.includes(option.id) || false
                }
                onCheckedChange={() => handleFilterChange(option.id)}
              />
              <Label
                htmlFor={option.id}
                className="text-[0.938rem] text-[#151515] leading-[112%]"
              >
                {option.title}{" "}
                <span className="text-[0.938rem] text-[#C4C4C4] leading-[112%]">
                  ({option.count})
                </span>
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
