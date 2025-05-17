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
import WhereToGoo from "@/components/WhereToGo";
import BookingForm from "@/components/BookingForm";
import { useIsMobile } from "@/hooks/use-mobile";
import NavbarDark from "@/widgets/navbar-dark";
import Hero from "@/widgets/home/hero";
import Link from "next/link";

// Выберем ID экскурсии для Казанского кремля - это будет ID по умолчанию
// В реальном приложении можно использовать более гибкий подход с роутингом
const DEFAULT_EXCURSION_ID = "65f14a8e68cb82f12499b81e"; // Замените на реальный ID экскурсии о Казанском кремле

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
  excursionId: DEFAULT_EXCURSION_ID,
};

export default function WhereToGo() {
  const isMobile = useIsMobile();
  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [product, setProduct] = useState<ExcursionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [excursionDetails, setExcursionDetails] = useState(
    defaultExcursionDetails
  );

  useEffect(() => {
    const fetchExcursionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Получаем данные экскурсии
        const excursionRes = await fetch(
          `/api/excursions/${DEFAULT_EXCURSION_ID}`
        );

        if (!excursionRes.ok) {
          throw new Error("Не удалось загрузить данные экскурсии");
        }

        const excursionData = await excursionRes.json();

        if (!excursionData.card.isPublished) {
          throw new Error("Экскурсия не найдена");
        }

        setExcursion(excursionData.card);

        // Обновляем данные для отображения
        const newExcursionDetails = {
          ...excursionDetails,
          title: excursionData.card.title || defaultExcursionDetails.title,
          description:
            excursionData.card.description ||
            defaultExcursionDetails.description,
          photos:
            excursionData.card.images && excursionData.card.images.length > 0
              ? excursionData.card.images
              : defaultExcursionDetails.photos,
        };

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

            // Обновляем цены, если товар существует
            if (
              productData &&
              productData.tickets &&
              productData.tickets.length > 0
            ) {
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
                } else if (ticket.name.toLowerCase().includes("пенсионер")) {
                  prices.retired = `от ${ticket.price} ₽`;
                } else if (ticket.name.toLowerCase().includes("до 7")) {
                  prices.childUnder7 =
                    ticket.price === 0 ? "Бесплатно" : `от ${ticket.price} ₽`;
                }
              });

              newExcursionDetails.prices = prices;
            }
          }
        }

        setExcursionDetails(newExcursionDetails);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError(error instanceof Error ? error.message : "Произошла ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchExcursionData();
  }, []);

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
              href="/where-to-go"
              className="text-[#000000] text-[14px] md:text-[16px]"
            >
              {excursionDetails.title}
            </Link>
          </div>
        </div>
        <img
          src="/images/catalog-filter/blog/blog.svg"
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
            ) : (
              <ExcursionDetails {...excursionDetails} />
            )}
          </div>
        </div>
        <div className="hidden md:flex">
          <Photos excursionId={excursion?._id || DEFAULT_EXCURSION_ID} />
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
        <div className="flex flex-col lg:flex-row gap-[20px] md:gap-[30px] mt-[20px] md:mt-[40px]"></div>
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
