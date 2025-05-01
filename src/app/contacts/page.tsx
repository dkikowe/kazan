"use client";

import Navbar from "@/features/where-to-go/ui/navbar";
import NavbarMobile from "@/features/where-to-go/ui/navbar-mobile";
import Breadcrumbs from "@/features/where-to-go/ui/breadcrumbs";
import ContactInfo from "@/features/contacts/ui/contact-info";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ContactsPage() {
  const isMobile = useIsMobile();

  return (
    <main className="bg-white w-full">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-[30px] md:mb-[40px]  md:mt-[20px]">
          {isMobile ? (
            <div className="w-full h-[62px] flex items-center justify-center bg-[#E8EBF0] backdrop-blur-[48.7px] px-[20px]">
              <NavbarMobile />
            </div>
          ) : (
            <nav className="w-full h-[62px] bg-[#ffffff] rounded-[59px] backdrop-blur-[48.7px] px-[20px] flex items-center justify-between">
              <div className="flex items-center ">
                <Link href="/" className="flex items-center gap-4">
                  <Image
                    src="/icons/header-white-icon.svg"
                    alt="Логотип"
                    width={24}
                    height={24}
                    className="text-[#3171F7]"
                  />
                  <span className="text-[#0D1723] flex  text-[14px] font-medium">
                    Казанские <br />
                    экскурсии
                  </span>
                </Link>
              </div>

              <div className="flex items-center gap-[87px]">
                <Link href="/catalog" className="text-[#0D1723] text-[16px]">
                  Экскурсии
                </Link>
                <Link
                  href="/where-to-go-kazan"
                  className="text-[#0D1723] text-[16px]"
                >
                  Куда сходить в Казани?
                </Link>
                <Link href="/reviews" className="text-[#0D1723] text-[16px]">
                  Отзывы
                </Link>
                <Link href="/contacts" className="text-[#0D1723] text-[16px]">
                  Контакты
                </Link>
              </div>

              <div className="flex items-center gap-[27px]">
                <div className="flex items-center gap-[8px]">
                  <Image
                    src="/icons/phone.svg"
                    alt="Телефон"
                    width={17}
                    height={17}
                    className="text-[#3171F7]"
                  />
                  <a
                    href="tel:88005006589"
                    className="text-[#0D1723] text-[16px]"
                  >
                    8 (800) 500-65-89
                  </a>
                </div>
              </div>
            </nav>
          )}
        </div>
        <div className="mb-[15px] md:mb-[20px] px-4 md:px-0">
          <div className="flex items-center mb-[20px] md:mb-[30px] gap-[10px] md:gap-[15px] px-4 md:px-0">
            <Link
              href="/"
              className="text-[#6E7279] text-[14px] md:text-[16px]"
            >
              Главная
            </Link>
            <div className="w-1 h-1 rounded-full bg-[#6E7279]" />
            <Link
              href="/contacts"
              className="text-[#000000] text-[14px] md:text-[16px]"
            >
              Контакты
            </Link>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-col w-full">
          {/* Карта на весь экран для мобильной версии */}
          <div className="relative w-full h-[400px]">
            <Image
              src="/images/contacts/mapMobile.svg"
              alt="Карта"
              fill
              className="object-cover"
            />

            {/* Иконка локации поверх карты */}
            <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10">
              <svg
                width="133"
                height="167"
                viewBox="0 0 133 167"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M66.5 0.583008C29.9255 0.583008 0.166691 30.3418 0.166691 66.8749C-0.0737674 120.315 63.9794 164.625 66.5 166.416C66.5 166.416 133.074 120.315 132.833 66.9163C132.833 30.3418 103.075 0.583008 66.5 0.583008ZM66.5 100.083C48.1754 100.083 33.3334 85.2409 33.3334 66.9163C33.3334 48.5918 48.1754 33.7497 66.5 33.7497C84.8246 33.7497 99.6667 48.5918 99.6667 66.9163C99.6667 85.2409 84.8246 100.083 66.5 100.083Z"
                  fill="#3D79F6"
                />
              </svg>
            </div>
          </div>

          {/* Компонент ContactInfo под картой */}
          <div className="w-full px-4 py-6">
            <ContactInfo />
          </div>
        </div>
      ) : (
        <div className="relative w-[100vw] h-[calc(100vh-200px)] md:h-[calc(100vh-250px)]">
          {/* Карта на весь экран */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/contacts/map.svg"
              alt="Карта"
              fill
              className="object-cover"
            />
          </div>

          {/* Компонент ContactInfo поверх карты */}
          <div className="absolute top-[150px] left-[250px] md:left-[200px] z-10">
            <ContactInfo />
          </div>

          {/* Иконка локации поверх карты справа от компонента */}
          <div className="absolute top-[150px] left-[calc(428px+300px)] md:left-[calc(428px+450px)] z-10">
            <Image
              src="/images/contacts/loc.svg"
              alt="Локация"
              width={350}
              height={350}
              className="text-[#3D79F6]"
            />
          </div>
        </div>
      )}
    </main>
  );
}
