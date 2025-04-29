// src/widgets/home/catalog.tsx
"use client";

import CatalogGrid from "@/features/home/catalog/ui/catalog-grid";
import CatalogGridMobile from "@/features/home/catalog/ui/catalog-grid-mobile";
import Filters from "@/features/home/catalog/ui/filters";
import { useIsMobile } from "@/hooks/use-mobile";

const Catalog = () => {
  const isMobile = useIsMobile();

  return (
    <section className="bg-[#121824] py-[5rem] lg:py-[5.625rem] w-full">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[2rem] lg:gap-[2.375rem] px-4">
        <div>
          <h2 className="font-medium leading-[106%] tracking-[-4%] text-white text-[1.75rem] lg:text-[3.375rem]">
            Каталог экскурсий
            <br /> по Казани и Татарстану
          </h2>
        </div>
        {isMobile ? "" : <Filters />}
        {isMobile ? <CatalogGridMobile /> : <CatalogGrid />}
      </div>
    </section>
  );
};

export default Catalog;
