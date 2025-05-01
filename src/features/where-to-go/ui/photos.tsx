import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PhotosProps {
  photos?: string[];
}

export default function Photos({ photos = [] }: PhotosProps) {
  const isMobile = useIsMobile();

  if (!photos.length) return null;

  if (isMobile) {
    return (
      <Carousel className="w-full">
        <CarouselContent className="gap-4">
          {photos.map((photo, index) => (
            <CarouselItem key={index} className="px-2 my-2">
              <div className="relative w-full h-[200px]">
                <Image
                  src={photo}
                  alt={`Фото ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
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
    <div className="flex mb-[40px] mt-[40px] gap-3">
      <div className="relative w-[521px] h-[321px] rounded-[18px] overflow-hidden">
        <Image
          src="/images/catalog-filter/catalog3.png"
          alt="Казанский кремль"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative w-[521px] h-[321px] rounded-[18px] overflow-hidden">
        <Image
          src="/images/catalog-filter/catalog1.png"
          alt="Казанский кремль"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative w-[521px] h-[321px] rounded-[18px] overflow-hidden">
        <Image
          src="/images/catalog-filter/catalog2.png"
          alt="Казанский кремль"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/52" />
        <div className="absolute inset-0 flex items-center justify-center font-manrope font-semibold text-[46px] leading-[141%] tracking-[-0.02em] text-white">
          +25
        </div>
      </div>
    </div>
  );
}
