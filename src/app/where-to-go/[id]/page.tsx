"use client";

import { useState, useEffect } from "react";
import GuideCard from "@/features/where-to-go/ui/guide-card";
import ExcursionDetails from "@/features/where-to-go/ui/excursion-details";
import Navbar from "@/features/where-to-go/ui/navbar";
import NavbarMobile from "@/features/where-to-go/ui/navbar-mobile";
import Breadcrumbs from "@/features/where-to-go/ui/breadcrumbs";
import Photos from "@/features/where-to-go/ui/photos";
import ReviewCarousel from "@/features/home/review/ui/carousel";
import ArticleCarouse from "@/features/home/article/ui/carousel";
import KazanKremlinInfo from "@/features/where-to-go/ui/kazan-kremlin-info";
import DontForget from "@/components/dontforget";
import WhereToGoo from "@/components/WhereToGoo";
import BookingForm from "@/components/BookingForm";
import { useIsMobile } from "@/hooks/use-mobile";
import NavbarDark from "@/widgets/navbar-dark";
import Hero from "@/widgets/home/hero";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ExcursionProduct {
  _id: string;
  title: string;
  startTimes: string[];
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
  whatYouWillSee?: {
    title: string;
    items: string[];
  };
  isPublished: boolean;
  excursionProduct?: {
    _id: string;
    title: string;
  };
  duration?: {
    hours: number;
    minutes: number;
  };
  addressMeeting?: string;
}

const guides = [
  {
    id: "1",
    name: "Рената",
    role: "Представитель команды гидов в Казани",
    avatarUrl: "/images/catalog-filter/blog/guide.png",
    responseTime: "Обычно отвечает в течение 15 минут",
    format: "Индивидуальный формат для 1–4 человек:",
    details:
      "Длительность: 3.5 часа\nДети: Можно с детьми\nКак проходит: На машине\nРейтинг: 5.0 (22 отзыва)",
    price: "от 9 000₽",
  },
  // Добавьте больше гидов по необходимости
];

// Данные по умолчанию, которые будут отображаться, пока загружаются данные из API
const defaultExcursionDetails = {
  title: "Экскурсии по Казанскому кремлю",
  description:
    "Кремль Казани относится к старинным памятникам зодчества, с 2000-го года отнесен к наследию ЮНЕСКО. Известное сооружение хранит истории о временах, когда на территории края жили булгарские племена, правили золотоордынские наместники и ставленники Ивана Грозного. Профессиональный гид агентства, сопровождающий туристов в поездке, расскажет гостям необычную историю казанского Кремля. Путешественники узнают легенду о царице Сююмбике, смогут увидеть стены и внутренние застройки музея-заповедника.",
  duration: {
    hours: 2,
    minutes: 15,
  },
  addressMeeting: "ул.Баумана, 29",
  rating: "4.9/5",
  photos: [
    "/images/catalog-filter/catalog1.png",
    "/images/catalog-filter/catalog2.png",
    "/images/catalog-filter/catalog3.png",
    "/images/catalog-filter/catalog4.png",
    "/images/catalog-filter/catalog5.png",
  ],
  prices: {
    adult: "от 1500 ₽",
    child: "от 1500 ₽",
    retired: "от 1500 ₽",
    childUnder7: "Бесплатно",
  },
};

export default function WhereToGoPage() {
  const isMobile = useIsMobile();
  const params = useParams();
  const id = params.id as string;

  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [product, setProduct] = useState<ExcursionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [excursionDetails, setExcursionDetails] = useState(
    defaultExcursionDetails
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const fetchExcursionData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Начало загрузки данных экскурсии с ID: ${id}`);

        const response = await fetch(`/api/excursions/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Не удалось загрузить данные экскурсии"
          );
        }

        const data = await response.json();
        console.log("Получены данные экскурсии:", data);

        if (!data.isPublished) {
          throw new Error("Экскурсия не опубликована");
        }

        setExcursion(data);

        // Если есть товар экскурсии, загружаем его данные
        if (data.excursionProduct?._id) {
          console.log(
            `Загрузка данных товара экскурсии с ID: ${data.excursionProduct._id}`
          );
          const productResponse = await fetch(
            `/api/excursion-products/${data.excursionProduct._id}`
          );

          if (!productResponse.ok) {
            const errorData = await productResponse.json();
            throw new Error(
              errorData.error || "Не удалось загрузить данные товара экскурсии"
            );
          }

          const productData = await productResponse.json();
          console.log("Получены данные товара:", productData);
          setProduct(productData);

          // Обновляем детали экскурсии данными из товара
          setExcursionDetails({
            ...defaultExcursionDetails,
            title: data.title || defaultExcursionDetails.title,
            description:
              data.description || defaultExcursionDetails.description,
            duration:
              productData.duration ||
              data.duration ||
              defaultExcursionDetails.duration,
            addressMeeting:
              productData.addressMeeting ||
              data.addressMeeting ||
              defaultExcursionDetails.addressMeeting,
            photos:
              productData.images?.length > 0
                ? productData.images
                : data.images?.length > 0
                ? data.images
                : defaultExcursionDetails.photos,
          });

          // Обновляем цены из товара
          if (productData.tickets?.length > 0) {
            const prices = {
              adult: "Уточняйте",
              child: "Уточняйте",
              retired: "Уточняйте",
              childUnder7: "Уточняйте",
            };

            productData.tickets.forEach((ticket: any) => {
              if (
                ticket.type === "adult" ||
                ticket.name.toLowerCase().includes("взрослый")
              ) {
                prices.adult = `от ${ticket.price} ₽`;
              } else if (
                ticket.type === "child" ||
                ticket.name.toLowerCase().includes("детский")
              ) {
                prices.child = `от ${ticket.price} ₽`;
              } else if (ticket.name.toLowerCase().includes("пенсионный")) {
                prices.retired = `от ${ticket.price} ₽`;
              } else if (ticket.name.toLowerCase().includes("до 7")) {
                prices.childUnder7 =
                  ticket.price === 0 ? "Бесплатно" : `от ${ticket.price} ₽`;
              }
            });

            console.log("Обновленные цены:", prices);
            setExcursionDetails((prev) => ({
              ...prev,
              prices,
            }));
          }
        } else {
          // Если товара нет, используем данные из экскурсии
          setExcursionDetails({
            ...defaultExcursionDetails,
            title: data.title || defaultExcursionDetails.title,
            description:
              data.description || defaultExcursionDetails.description,
            duration: data.duration || defaultExcursionDetails.duration,
            addressMeeting:
              data.addressMeeting || defaultExcursionDetails.addressMeeting,
            photos:
              data.images?.length > 0
                ? data.images
                : defaultExcursionDetails.photos,
          });
        }
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

    if (id) {
      fetchExcursionData();
    }
  }, [id]);

  return (
    <main className="bg-white overflow-x-hidden">
      <section className="max-w-[1440px] mx-auto  md:py-[20px]  md:px-0">
        <div className="mb-[30px] md:mb-[40px]">
          {isMobile ? (
            <div>
              <Hero />
            </div>
          ) : (
            <Navbar />
          )}
        </div>
        <div className="mb-[15px] md:mb-[20px]">
          <div className="hidden md:flex items-center mb-[20px] md:mb-[30px] gap-[10px] md:gap-[15px] px-4 md:px-0">
            <Link
              href="/"
              className="text-[#6E7279] text-[14px] md:text-[16px]"
            >
              Главная
            </Link>
            <div className="w-1 h-1 rounded-full bg-[#6E7279]" />
            <Link
              href="/where-to-go-kazan"
              className="text-[#6E7279] text-[14px] md:text-[16px]"
            >
              Куда сходить в Казани?
            </Link>
            <div className="w-1 h-1 rounded-full bg-[#6E7279]" />

            <Link
              href={`/where-to-go/${id}`}
              className="text-[#000000] text-[14px] md:text-[16px]"
            >
              {excursionDetails.title}
            </Link>
          </div>
        </div>
        <img
          src="/images/catalog-filter/blog/blog.jpg"
          className="hidden md:block mb-[30px] md:mb-[40px] mt-[20px] md:mt-[40px] w-full"
          alt=""
        />

        <div className="flex flex-col lg:flex-row gap-[20px] md:gap-12">
          <div className="w-full lg:w-[400px] order-2 lg:order-1">
            {guides.map((guide) => (
              <GuideCard key={guide.id} {...guide} />
            ))}
          </div>
          <div className="w-full lg:w-[830px] order-1 lg:order-2">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <ExcursionDetails
                title={excursionDetails.title}
                description={excursionDetails.description}
                duration={excursionDetails.duration}
                addressMeeting={excursionDetails.addressMeeting}
                rating={excursionDetails.rating}
                prices={excursionDetails.prices}
                excursionId={id}
              />
            )}
          </div>
        </div>
        <div className="hidden md:flex">
          <Photos excursionId={id} />
        </div>
        <div className="hidden md:block">
          <KazanKremlinInfo />
        </div>
        <div className="mt-[30px] md:mt-[40px] mb-[30px] md:mb-[40px]">
          <DontForget />
        </div>

        <div className="flex flex-col mb-[30px] md:mb-[40px]">
          <h2 className="p-4 font-semibold mb-[20px] md:mb-[40px] leading-[106%] text-left md:text-left tracking-[-4%] text-[1.5rem] md:text-[1.75rem] lg:text-[3.375rem] max-w-full md:max-w-[50rem]">
            <span className="text-primary"> Посмотрите видео </span>,с
            экскурсией <span> и эмоциями наших клиентов</span>
          </h2>
          <div className="relative">
            <img
              src="/images/catalog-filter/blog/video.svg"
              className="w-full"
              alt=""
            />
            <img
              src="/icons/playVideo.svg"
              alt=""
              className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <span className="font-semibold px-4 text-[28px] md:text-[37px] leading-[100%] tracking-[-0.03em] text-[#12213a] font-manrope text-center md:text-left">
          Бронирование экскурсии
        </span>
        <div className="flex flex-col lg:flex-row gap-[20px] md:gap-[30px] mt-[20px] md:mt-[40px]">
          <WhereToGoo
            excursionId={id}
            onTimeSelect={setSelectedTime}
            onTicketsChange={setSelectedTickets}
          />
          <BookingForm
            excursionId={id}
            selectedTime={selectedTime || undefined}
            tickets={selectedTickets}
          />
        </div>
        <div className="flex flex-col gap-[0.625rem] lg:gap-[1rem] ">
          <div>
            <h2 className="font-semibold mt-[50px] leading-[106%] tracking-[-4%] text-[1.75rem] px-4 lg:mt-[50px] lg:text-[3.375rem] max-w-[60rem] text-left md:text-left">
              <span className="text-primary"> Похожие экскурсии</span>, которые{" "}
              <span>могут вам понравиться</span>
            </h2>
          </div>
          <div>
            <p className="text-[#535353] leading-[124%] text-[0.875rem] px-4 lg:text-[1.063rem] text-left md:text-left">
              Путешествуйте вместе с нами
            </p>
          </div>
        </div>
        <div className="mt-[0px] flex flex-col gap-[40px] mb-[20px]">
          <ArticleCarouse />
        </div>
        <ReviewCarousel />
      </section>
    </main>
  );
}
