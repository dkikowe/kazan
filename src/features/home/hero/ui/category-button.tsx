// src/features/category/ui/category-button.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const CategoryButton = ({ id, label, active, onClick }: Props) => {
  return (
    <Button
      variant={active ? "default" : "glass"}
      className={cn(
        "rounded-full h-[43px] px-[1.25rem] text-[0.938rem] font-medium",
        active && "bg-primary text-primary-foreground hover:bg-primary/90",
        !active && "bg-white/10 text-white hover:bg-white/20"
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default CategoryButton;
