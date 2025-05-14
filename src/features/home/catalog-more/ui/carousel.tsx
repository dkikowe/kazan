"use client";

import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
  startTimes: string[];
  images: string[];
}

const CatalogMoreCarousel = () => {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [excursionProducts, setExcursionProducts] = useState<
    Record<string, ExcursionProduct>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        // Получаем данные экскурсий
        const excursionsRes = await fetch("/api/excursions");
        const excursionsData = await excursionsRes.json();

        // Фильтруем только опубликованные экскурсии и ограничиваем до 8
        const publishedExcursions = excursionsData
          .filter((excursion: Excursion) => excursion.isPublished)
          .slice(0, 8);

        setExcursions(publishedExcursions);

        // Получаем все товары экскурсий
        const productsRes = await fetch("/api/excursion-products");
        const productsData = await productsRes.json();

        // Создаем хэш-таблицу товаров для быстрого доступа
        const productsMap: Record<string, ExcursionProduct> = {};
        productsData.forEach((product: ExcursionProduct) => {
          productsMap[product._id] = product;
        });

        setExcursionProducts(productsMap);
      } catch (error) {
        console.error("Ошибка при получении данных для карусели:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExcursions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (excursions.length === 0) {
    return <div className="text-center p-8">Экскурсии не найдены</div>;
  }

  return (
    <Carousel className="w-full overflow-visible">
      <CarouselContent className="ml-[1rem] gap-4">
        {excursions.map((excursion) => {
          // Получаем связанный товар для экскурсии
          const product =
            excursion.excursionProduct && excursion.excursionProduct._id
              ? excursionProducts[excursion.excursionProduct._id]
              : null;

          // Используем первое изображение из товара экскурсии, если оно есть
          // Иначе используем первое изображение экскурсии или заглушку
          const imageUrl =
            product && product.images && product.images.length > 0
              ? product.images[0]
              : excursion.images && excursion.images.length > 0
              ? excursion.images[0]
              : "/images/excursions/catalog1.jpg";

          return (
            <CarouselItem
              key={excursion._id}
              className="basis-[85%] md:basis-[45%] lg:basis-[30.5%]"
            >
              <CatalogMoreCard
                id={excursion._id}
                title={excursion.title}
                subtitle={excursion.description.substring(0, 100) + "..."}
                rating={4.9} // Заглушка для рейтинга
                duration="2 часа" // Заглушка для длительности
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
