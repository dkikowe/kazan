"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

const NavbarMobile = () => {
  const pathname = usePathname();

  const links = [
    {
      title: "Экскурсии",
      href: "/catalog",
    },
    {
      title: "Куда сходить в Казани?",
      href: "/where-to-go-kazan",
    },
    {
      title: "Отзывы",
      href: "/reviews",
    },
    {
      title: "Контакты",
      href: "/contacts",
    },
  ];

  return (
    <div className="flex items-center justify-between w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icons/header-white-icon.svg"
          alt="Логотип"
          width={24}
          height={24}
          className="text-[#3171F7]"
        />
        <span className="text-[#0D1723] flex text-[13px] font-normal font-['Manrope',sans-serif] leading-[94%] tracking-[-0.01em]">
          Казанские <br />
          экскурсии
        </span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 bg-[#3171F7]">
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top" className="bg-[#121824] max-h-[35.125rem]">
          <SheetHeader className="bg-[#2A2F3A] p-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/icons/header-white-icon.svg"
                alt="Логотип"
                width={24}
                height={24}
                className="text-[#3171F7]"
              />
              <span className="text-white text-[14px] font-medium ml-4">
                Казанские <br />
                экскурсии
              </span>
            </Link>
          </SheetHeader>
          <div className="flex flex-col gap-[1.75rem] px-4 py-6">
            {links.map((link, index) => (
              <div key={index}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between text-[#CBCCCF] text-[16px] pb-[0.625rem] ${
                    pathname === link.href ? "text-white font-medium" : ""
                  }`}
                >
                  <span>{link.title}</span>
                  <ChevronRight className="w-[0.438rem] h-[0.75rem] object-cover text-[#3171F7]" />
                </Link>
                <Separator className="bg-[#2A2F3A] my-2" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-[8px] px-4 py-4">
            <Image
              src="/icons/phone.svg"
              alt="Телефон"
              width={17}
              height={17}
              className="text-[#3171F7]"
            />
            <a href="tel:88005006589" className="text-white text-[16px]">
              8 (800) 500-65-89
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavbarMobile;
