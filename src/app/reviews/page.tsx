"use client";

import ReviewCard, { ReviewProps } from "@/features/home/review/ui/card";
import Navbar from "@/features/where-to-go/ui/navbar";
import NavbarMobile from "@/features/where-to-go/ui/navbar-mobile";
import Breadcrumbs from "@/features/where-to-go/ui/breadcrumbs";
import { reviews as reviewsData } from "@/features/home/review/data/data";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

const reviews = reviewsData as ReviewProps[];

export default function ReviewsPage() {
  const isMobile = useIsMobile();

  return (
    <main className="bg-white">
      <section className="max-w-[1440px] mx-auto md:py-[20px]  md:px-0">
        <div className="mb-[30px] md:mb-[40px]">
          {isMobile ? (
            <div className="w-full h-[62px] flex items-center justify-center bg-[#E8EBF0] backdrop-blur-[48.7px] px-[20px]">
              <NavbarMobile />
            </div>
          ) : (
            <Navbar />
          )}
        </div>
        <div className="mb-[15px] md:mb-[20px]">
          <div className="flex items-center mb-[20px] md:mb-[30px] gap-[10px] md:gap-[15px] px-5 md:px-0">
            <Link
              href="/"
              className="text-[#6E7279] text-[14px] md:text-[16px]"
            >
              Главная
            </Link>
            <div className="w-1 h-1 rounded-full bg-[#6E7279]" />
            <Link
              href="/reviews"
              className="text-[#000000] text-[14px] md:text-[16px]"
            >
              Отзывы
            </Link>
          </div>
        </div>

        <div className="flex mb-[30px] ml-[20px] md:ml-[0px] flex-col gap-[0.625rem] lg:gap-[1rem]">
          <div>
            <h2 className="mt-[20px] font-semibold leading-[106%] tracking-[-4%] text-[1.75rem] lg:text-[3.375rem] max-w-[31rem]">
              Почитайте отзывы{" "}
              <span className="text-primary">наших клиентов</span>
            </h2>
          </div>
          <div>
            <p className="text-[#535353] leading-[124%] text-[0.875rem] lg:text-[1.063rem]">
              Темы, новости о путешествиях в городах России
            </p>
          </div>
        </div>

        <div className="grid mb-[30px] grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-[0.5rem] md:gap-[1.5rem] lg:gap-[2rem] justify-items-center">
          {reviews.map((review) => (
            <ReviewCard
              className="md:w-[361px] w-[332px]"
              key={review.id}
              {...review}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
