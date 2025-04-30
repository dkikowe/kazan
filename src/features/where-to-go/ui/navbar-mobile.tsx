"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ChevronRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
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

  const socials = [
    {
      title: "Instagram",
      href: "/",
    },
    {
      title: "Telegram",
      href: "/",
    },
    {
      title: "Vkontakte",
      href: "/",
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
        <SheetTrigger className="lg:hidden">
          <Button className="rounded-[0.375rem] p-[0.438rem]">
            <Menu className="size-[0.875rem] text-primary-foreground" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"top"}
          className="bg-[#121824] max-h-[37.125rem] justify-between"
        >
          <SheetHeader className="bg-[#2A2F3A]">
            <Link href={"/"} className="flex items-center">
              <Image
                src={"/logo.png"}
                alt={""}
                width={40}
                height={40}
                className="object-cover size-[1.875rem] lg:size-[2.375rem]"
              />
              <span className="leading-[94%] tracking-[-4%] text-white text-[0.75rem] lg:text-[1rem]">
                Казанские
                <br /> экскурсии
              </span>
            </Link>
          </SheetHeader>
          <div className="flex flex-col gap-[1.75rem] px-4">
            {links.map((link, index) => (
              <>
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-between text-[#CBCCCF] text-[1rem] leading-[141%] tracking-[-2%] pb-[0.625rem]"
                >
                  <span>{link.title}</span>
                  <ChevronRight className="w-[1.5rem] h-[1.5rem] object-cover text-primary" />
                </Link>
                <Separator />
              </>
            ))}
          </div>
          <SheetFooter>
            <div className="flex flex-col gap-[1.688rem]">
              {socials.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="flex items-center justify-between w-[150px] gap-[3rem]"
                >
                  <span className="font-medium leading-[100%] tracking-[-2%] text-white">
                    {social.title}
                  </span>
                  <ArrowUpRight className="w-[1.2rem] h-[1.2rem] object-cover text-primary" />
                </Link>
              ))}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavbarMobile;
