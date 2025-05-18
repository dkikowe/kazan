"use client";

import { useState, useEffect } from "react";
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
import { useSearchParams } from "next/navigation";

// Определяем тип данных экскурсии
interface ExcursionProduct {
  _id: string;
  title: string;
  startTimes: string[];
  images: string[]; // Добавляем массив изображений
  tickets: Array<{
    type: string;
    name: string;
    price: number;
  }>;
}

interface Excursion {
  _id: string;
  title: string;
  description: string;
  images: string[];
  tags: Array<string | { _id: string; name: string; [key: string]: any }>; // Теги могут быть строками или объектами с _id
  isPublished: boolean;
  excursionProduct?: {
    _id: string;
    title: string;
  };
}

const FilterSection = () => {
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [filteredExcursions, setFilteredExcursions] = useState<Excursion[]>([]);
  const [excursionProducts, setExcursionProducts] = useState<
    Record<string, ExcursionProduct>
  >({});
  const [loading, setLoading] = useState(true);
  const tagId = searchParams.get("tag");

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        setLoading(true);
        console.log("Начало загрузки данных для фильтрации...");

        // Получаем данные экскурсий
        const excursionsRes = await fetch("/api/excursions");
        if (!excursionsRes.ok) {
          const errorData = await excursionsRes.json();
          throw new Error(errorData.error || "Ошибка при получении экскурсий");
        }
        const excursionsData = await excursionsRes.json();
        console.log(`Получено ${excursionsData.length} экскурсий`);

        // Фильтруем только опубликованные экскурсии
        const publishedExcursions = excursionsData.filter(
          (excursion: Excursion) => excursion.isPublished
        );
        console.log(
          `Отфильтровано ${publishedExcursions.length} опубликованных экскурсий`
        );

        setExcursions(publishedExcursions);
        setFilteredExcursions(publishedExcursions);

        // Получаем все товары экскурсий
        const productsRes = await fetch("/api/excursion-products");
        if (!productsRes.ok) {
          const errorData = await productsRes.json();
          throw new Error(
            errorData.error || "Ошибка при получении товаров экскурсий"
          );
        }
        const productsData = await productsRes.json();
        console.log(`Получено ${productsData.length} товаров`);

        // Создаем хэш-таблицу товаров для быстрого доступа
        const productsMap: Record<string, ExcursionProduct> = {};
        productsData.forEach((product: ExcursionProduct) => {
          productsMap[product._id] = product;
        });

        setExcursionProducts(productsMap);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExcursions();
  }, []);

  // Обновляем отфильтрованные экскурсии при изменении тега
  useEffect(() => {
    if (tagId) {
      console.log(`Фильтрация по тегу ID: ${tagId}`);
      const filtered = excursions.filter((excursion) =>
        excursion.tags?.some((tag) => {
          if (typeof tag === "string") {
            return tag === tagId;
          }
          return tag._id === tagId;
        })
      );
      console.log(`Найдено ${filtered.length} экскурсий с тегом ${tagId}`);
      setFilteredExcursions(filtered);
    } else {
      console.log("Сброс фильтрации по тегу");
      setFilteredExcursions(excursions);
    }
  }, [tagId, excursions]);

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
            {loading ? (
              <div className="col-span-full flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : filteredExcursions.length === 0 ? (
              <div className="col-span-full text-center py-8">
                Экскурсии не найдены
              </div>
            ) : (
              filteredExcursions.map((excursion) => {
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
                    : "/images/catalog-filter/catalog1.png";

                // Формируем объект с ценами, исходя из типов билетов
                const prices = {
                  adult: "Уточняйте",
                  child: "Уточняйте",
                  retired: "Уточняйте",
                  childUnder7: "Уточняйте",
                };

                if (product && product.tickets) {
                  product.tickets.forEach((ticket) => {
                    if (ticket.type === "adult") {
                      prices.adult = `от ${ticket.price} ₽`;
                    } else if (ticket.type === "child") {
                      prices.child = `от ${ticket.price} ₽`;
                    } else if (
                      ticket.name.toLowerCase().includes("пенсионер") ||
                      ticket.name.toLowerCase().includes("пенсионный")
                    ) {
                      prices.retired = `от ${ticket.price} ₽`;
                    } else if (ticket.name.toLowerCase().includes("до 7")) {
                      prices.childUnder7 =
                        ticket.price === 0
                          ? "Бесплатно"
                          : `от ${ticket.price} ₽`;
                    }
                  });
                }

                return (
                  <CatalogCard
                    key={excursion._id}
                    id={excursion._id}
                    imageUrl={imageUrl}
                    duration="2 часа" // Заглушка для длительности
                    rating={4.9} // Заглушка для рейтинга
                    title={excursion.title}
                    times={product ? product.startTimes : ["Уточняйте"]}
                    prices={prices}
                  />
                );
              })
            )}
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
