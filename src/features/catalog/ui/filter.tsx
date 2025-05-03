"use client";

import { catalogCard } from "../data/card-data";
import { CatalogAside, CatalogAsideMobile } from "./aside";
import CatalogCard from "./card";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const FilterSection = () => {
  const isMobile = useIsMobile();

  return (
    <section className="max-w-[1440px] mx-auto">
      <div className="flex lg:w-[100%] w-[90%] mx-auto flex-col gap-[1.5rem] lg:gap-[2.313rem]">
        <h2 className="font-semibold leading-[100%] tracking-[-3%] text-[1.688rem] lg:text-[2.813rem]">
          <span className="text-primary">Самые актуальные</span> направления
          Казани
        </h2>
        <div className="grid gap-[1.5rem] lg:grid-cols-[18vw_1fr]">
          {isMobile ? <CatalogAsideMobile /> : <CatalogAside />}
          <div className="grid gap-[1.5rem] md:grid-cols-2 lg:grid-cols-3">
            {catalogCard.map((card) => (
              <CatalogCard key={card.id} {...card} />
            ))}
            <Pagination className="col-span-full lg:hidden">
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">9</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">11</PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
