// src/features/hero/ui/category-button.tsx

import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const CategoryButton = ({ label, active, onClick }: Props) => {
  return (
    <Button
      variant={active ? "default" : "glass"}
      className="rounded-full px-[1.125rem] border border-[#858D96] py-[0.875rem] text-[0.938rem] leading-[112%] transition-colors duration-200 hover:bg-primary "
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default CategoryButton;
