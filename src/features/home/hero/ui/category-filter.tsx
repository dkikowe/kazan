// src/features/category/ui/category-filter.tsx

"use client";

import React from "react";
import CategoryButton from "./category-button";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCategory } from "../hooks/useCategory";

interface Category {
  id: string;
  label: string;
}

interface Props {
  categories: Category[];
}

const CategoryFilter = ({ categories }: Props) => {
  const { activeId, toggle } = useCategory();
  const isMobile = useIsMobile();

  const visibleCategories = isMobile ? categories.slice(0, 8) : categories;

  return (
    <div className="flex flex-wrap lg:gap-2 gap-1">
      {visibleCategories.map((category) => (
        <CategoryButton
          key={category.id}
          id={category.id}
          label={category.label}
          active={activeId === category.id}
          onClick={() => toggle(category.id)}
        />
      ))}

      {isMobile ? (
        <div className="w-full mt-4">
          <Button variant="default" className="rounded-full w-full h-[43px]">
            Больше тегов
          </Button>
        </div>
      ) : (
        <Button variant="glass" className="md:h-[45px] rounded-full">
          Ещё
        </Button>
      )}
    </div>
  );
};

export default CategoryFilter;
