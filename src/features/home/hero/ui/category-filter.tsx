// src/features/category/ui/category-filter.tsx

"use client";

import React, { useState } from "react";
import CategoryButton from "./category-button";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCategory } from "../hooks/useCategory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Фильтруем только активные категории
  const activeCategories = categories.filter(
    (category) => category.label && category.id
  );

  const visibleCategories = isMobile
    ? activeCategories.slice(0, 8)
    : activeCategories;

  const handleMoreClick = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
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
            <Button
              variant="default"
              className="rounded-full w-full h-[43px]"
              onClick={handleMoreClick}
            >
              Больше тегов
            </Button>
          </div>
        ) : (
          <Button
            variant="glass"
            className="md:h-[45px] rounded-full"
            onClick={() => setIsDialogOpen(true)}
          >
            Ещё
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Все теги</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {activeCategories.map((category) => (
              <CategoryButton
                key={category.id}
                id={category.id}
                label={category.label}
                active={activeId === category.id}
                onClick={() => {
                  toggle(category.id);
                  setIsDialogOpen(false);
                }}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryFilter;
