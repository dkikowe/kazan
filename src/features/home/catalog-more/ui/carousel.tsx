"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import CatalogMoreCard from "./card";

interface Excursion {
  _id: string;
  title: string;
  description: string;
  images: string[];
  isPublished: boolean;
  excursionProduct?: {
    _id: string;
    title: string;
  };
}

interface ExcursionProduct {
  _id: string;
  title: string;
  images: string[];
}

const CatalogMoreCarousel = () => {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [excursionProducts, setExcursionProducts] = useState<
    Record<string, ExcursionProduct>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Начало загрузки данных для карусели...");

        // Получаем данные экскурсий
        const excursionsRes = await fetch("/api/excursions");
        if (!excursionsRes.ok) {
          throw new Error("Ошибка при получении экскурсий");
        }
        const excursionsData = await excursionsRes.json();

        // Получаем данные товаров
        const productsRes = await fetch("/api/excursion-products");
        if (!productsRes.ok) {
          throw new Error("Ошибка при получении товаров экскурсий");
        }
        const productsData = await productsRes.json();

        // Создаем хэш-таблицу товаров
        const productsMap: Record<string, ExcursionProduct> = {};
        productsData.forEach((product: ExcursionProduct) => {
          productsMap[product._id] = product;
        });

        // Фильтруем и устанавливаем данные
        const publishedExcursions = excursionsData
          .filter((excursion: Excursion) => excursion.isPublished)
          .slice(0, 8);

        setExcursions(publishedExcursions);
        setExcursionProducts(productsMap);

        console.log(
          `Загружено ${publishedExcursions.length} экскурсий и ${productsData.length} товаров`
        );
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Произошла ошибка при загрузке данных"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] text-red-500">
        {error}
      </div>
    );
  }

  if (!excursions.length) {
    return null;
  }

  return (
    <Carousel className="w-full">
      <CarouselContent className="ml-[1rem] gap-4">
        {excursions.map((excursion) => {
          const product = excursion.excursionProduct?._id
            ? excursionProducts[excursion.excursionProduct._id]
            : null;

          const imageUrl =
            product?.images?.[0] ||
            excursion.images?.[0] ||
            "/images/excursions/catalog1.jpg";

          return (
            <CarouselItem
              key={excursion._id}
              className="basis-[85%] md:basis-[45%] lg:basis-[30.5%]"
            >
              <CatalogMoreCard
                id={excursion._id}
                title={excursion.title}
                subtitle={
                  excursion.description?.substring(0, 100) + "..." || ""
                }
                rating={4.9}
                duration="2 часа"
                imageUrl={imageUrl}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default CatalogMoreCarousel;
