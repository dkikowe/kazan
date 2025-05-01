import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ChevronRight } from "lucide-react";

const Filters = () => {
  return (
    <div className="flex items-center gap-[0.625rem] h-[3.75rem]">
      <Button
        className="w-1/4 h-full rounded-full flex items-center justify-between px-[1.563rem] py-[1.25rem] text-[#999EA3]"
        variant={"secondary"}
      >
        <span className="ml-[0.625rem]">Поиск по ключевым словам</span>
        <Search size={15} />
      </Button>
      <Button
        className="w-1/4 h-full rounded-full flex items-center justify-between px-[3.563rem] py-[1.25rem]"
        variant={"secondary"}
      >
        <span className="ml-[0.625rem]">Категория любая</span>
        <ChevronRight
          width={5}
          height={9}
          className="object-cover text-foreground"
        />
      </Button>
      <Button
        className="w-1/4 h-full rounded-full flex items-center justify-between px-[1.563rem] py-[1.25rem]"
        variant={"secondary"}
      >
        <span className="ml-[0.625rem]">Тип экскурсии</span>
        <ChevronRight
          width={5}
          height={9}
          className="object-cover text-foreground"
        />
      </Button>
      <Button className="w-1/4 h-full rounded-full flex items-center justify-between px-[1.563rem] py-[1.25rem]">
        <span className="ml-[0.625rem]">Все экскурсии</span>
        <ChevronRight
          width={5}
          height={9}
          className="object-cover text-primary-foreground"
        />
      </Button>
    </div>
  );
};

export default Filters;
