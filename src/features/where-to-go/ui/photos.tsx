import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface PhotosProps {
  excursionId: string;
}

export default function Photos({ excursionId }: PhotosProps) {
  const isMobile = useIsMobile();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!excursionId) return;

      try {
        setLoading(true);
        setError(null);
        console.log("Начало загрузки изображений для экскурсии:", excursionId);

        // Получаем данные экскурсии
        const excursionRes = await fetch(`/api/excursions/${excursionId}`);
        if (!excursionRes.ok) {
          throw new Error("Не удалось загрузить данные экскурсии");
        }

        const excursionData = await excursionRes.json();
        console.log("Получены данные экскурсии:", excursionData);

        // Если есть связанный товар, получаем его данные
        if (excursionData.card?.excursionProduct?._id) {
          console.log(
            "Найден связанный товар:",
            excursionData.card.excursionProduct._id
          );

          const productRes = await fetch(
            `/api/excursion-products/${excursionData.card.excursionProduct._id}`
          );

          if (!productRes.ok) {
            throw new Error("Не удалось загрузить данные товара");
          }

          const productData = await productRes.json();
          console.log("Получены данные товара:", productData);

          // Используем изображения из товара
          if (
            productData.images &&
            Array.isArray(productData.images) &&
            productData.images.length > 0
          ) {
            console.log(
              "Установка изображений из товара:",
              productData.images.length
            );
            setImages(productData.images);
          } else if (
            excursionData.card.images &&
            Array.isArray(excursionData.card.images) &&
            excursionData.card.images.length > 0
          ) {
            console.log(
              "В товаре нет изображений, используем изображения из экскурсии"
            );
            setImages(excursionData.card.images);
          } else {
            console.log("Нет доступных изображений");
            setImages([]);
          }
        } else if (
          excursionData.card?.images &&
          Array.isArray(excursionData.card.images) &&
          excursionData.card.images.length > 0
        ) {
          console.log(
            "Связанный товар не найден, используем изображения из экскурсии"
          );
          setImages(excursionData.card.images);
        } else {
          console.log("Нет доступных изображений");
          setImages([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке изображений:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Произошла ошибка при загрузке изображений"
        );
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [excursionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[321px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[321px] text-red-500">
        {error}
      </div>
    );
  }

  if (!images.length) {
    return null;
  }

  // Берем только первые три фотографии для десктопа
  const displayPhotos = images.slice(0, 3);
  const remainingCount = images.length - 3;

  if (isMobile) {
    return (
      <Carousel className="w-full">
        <CarouselContent className="gap-4">
          {images.map((photo, index) => (
            <CarouselItem key={index} className="px-2 my-2">
              <div className="relative w-full h-[200px]">
                <Image
                  src={photo}
                  alt={`Фото ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    );
  }

  return (
    <div className="flex mb-[40px] mt-[40px] gap-3 max-w-[1440px] mx-auto">
      {displayPhotos.map((photo, index) => (
        <div
          key={index}
          className="relative w-[521px] h-[321px] rounded-[18px] overflow-hidden"
        >
          <Image
            src={photo}
            alt={`Фото ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {index === 2 && remainingCount > 0 && (
            <>
              <div className="absolute inset-0 bg-black/52" />
              <div className="absolute inset-0 flex items-center justify-center font-manrope font-semibold text-[46px] leading-[141%] tracking-[-0.02em] text-white">
                +{remainingCount}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
