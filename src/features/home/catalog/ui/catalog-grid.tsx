// src/widgets/home/catalog-grid.tsx


import React from "react";
import { excursionCategories } from "../data/data";
import CardWide from "./card-wide";
import CardTall from "./card-tall";

const CatalogGrid = () => {
  return (
    <div className="flex flex-col gap-[0.625rem]">
      <div className="grid grid-cols-2 gap-[0.625rem]">
        {excursionCategories.slice(0, 2).map((card) => (
          <CardWide key={card.id} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-[0.625rem]">
        {excursionCategories.slice(2).map((card) => (
          <CardTall key={card.id} {...card} />
        ))}
      </div>
    </div>
  );
};

export default CatalogGrid;
