"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CatalogMoreCarousel from "@/features/home/catalog-more/ui/carousel";

const CatalogMore = () => {
  const isMobile = useIsMobile();

  return (
    <section className="w-full flex flex-col gap-[2rem]">
      <div className="">{isMobile ? mobileHeader() : desktopHeader()}</div>
      <div className="">
        <CatalogMoreCarousel />
      </div>
    </section>
  );
};

export default CatalogMore;

const desktopHeader = () => {
  return (
    <div className="w-full flex justify-between items-end">
      <div>
        <h2 className="px-4 font-semibold leading-[106%] tracking-[-4%] text-[1.75rem] lg:text-[3.375rem] max-w-[48.875rem]">
          Другие экскурсии, которые{" "}
          <span className="text-primary">вас заинтересуют:</span>
        </h2>
      </div>
      <div>
        <Button variant={"section"} size={"section"} className="rounded-full ">
          <span>Все экскурсии</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

const mobileHeader = () => {
  return (
    <div className="w-full px-4">
      <h2 className="font-semibold leading-[106%] tracking-[-4%] text-[1.45rem] lg:text-[3.375rem] max-w-[340px]">
        Другие экскурсии, которые{" "}
        <span className="text-primary">вас заинтересуют:</span>
      </h2>
    </div>
  );
};
