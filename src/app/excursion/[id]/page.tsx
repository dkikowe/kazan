"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ExcursionProduct {
  _id: string;
  title: string;
  startTimes: string[];
  tickets: Array<{
    type: string;
    name: string;
    price: number;
  }>;
  dateRanges: Array<{
    start: string;
    end: string;
    excludedDates?: string[];
  }>;
  meetingPoints: Array<{
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  isPublished: boolean;
}

interface Excursion {
  _id: string;
  title: string;
  description: string;
  seoTitle: string;
  images: string[];
  whatYouWillSee?: {
    title: string;
    items: string[];
  };
  isPublished: boolean;
  excursionProduct?: {
    _id: string;
    title: string;
  };
}

export default function ExcursionPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [product, setProduct] = useState<ExcursionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExcursionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Получаем данные экскурсии
        const excursionRes = await fetch(`/api/excursions/${id}`);

        if (!excursionRes.ok) {
          throw new Error("Не удалось загрузить данные экскурсии");
        }

        const excursionData = await excursionRes.json();

        if (!excursionData.card.isPublished) {
          throw new Error("Экскурсия не найдена");
        }

        setExcursion(excursionData.card);

        // Если есть связанный товар, получаем его данные
        if (
          excursionData.card.excursionProduct &&
          excursionData.card.excursionProduct._id
        ) {
          const productRes = await fetch(
            `/api/excursion-products/${excursionData.card.excursionProduct._id}`
          );

          if (productRes.ok) {
            const productData = await productRes.json();
            setProduct(productData);
          }
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError(error instanceof Error ? error.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchExcursionData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !excursion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Ошибка</h1>
        <p>{error || "Экскурсия не найдена"}</p>
        <Button onClick={() => router.push("/catalog")}>
          Вернуться к списку экскурсий
        </Button>
      </div>
    );
  }

  // Выбираем первое изображение или используем заглушку
  const mainImage =
    excursion.images && excursion.images.length > 0
      ? excursion.images[0]
      : "/images/catalog-filter/catalog1.png";

  return (
    <main className="bg-[#F1F1F1] py-8 md:py-12">
      <div className="container max-w-screen-xl mx-auto px-4">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 mb-4 md:mb-6 text-sm hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Вернуться к каталогу
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Левая колонка с изображением */}
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt={excursion.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Правая колонка с информацией */}
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                {excursion.title}
              </h1>

              <div>
                <h2 className="text-lg font-semibold mb-2">Описание</h2>
                <p className="text-gray-700">{excursion.description}</p>
              </div>

              {excursion.whatYouWillSee &&
                excursion.whatYouWillSee.items &&
                excursion.whatYouWillSee.items.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {excursion.whatYouWillSee.title || "Что вы увидите"}
                    </h2>
                    <ul className="list-disc pl-5 text-gray-700">
                      {excursion.whatYouWillSee.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {product && (
                <>
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Время начала</h2>
                    <div className="flex flex-wrap gap-2">
                      {product.startTimes.map((time, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1"
                        >
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {product.tickets && product.tickets.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Цены</h2>
                      <div className="space-y-2">
                        {product.tickets.map((ticket, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center border-b border-dashed border-gray-200 pb-1"
                          >
                            <span>{ticket.name}</span>
                            <span className="font-medium">
                              {ticket.price} ₽
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.meetingPoints &&
                    product.meetingPoints.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold mb-2">
                          Точки сбора
                        </h2>
                        <div className="space-y-2">
                          {product.meetingPoints.map((point, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded">
                              <p className="font-medium">{point.name}</p>
                              <p className="text-sm text-gray-600">
                                {point.address}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </>
              )}

              <Button className="mt-4 w-full md:w-auto">Забронировать</Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
