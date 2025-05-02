// src/widgets/navbar-dark.tsx

"use client";

import Image from "next/image";
import Link from "next/link";

import { Menu, ChevronRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavbarDark = () => {
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
    <header className="max-w-[1440px] mx-auto bg-white/10 flex items-center justify-between px-[1rem] py-[0.75rem] rounded-none lg:rounded-full">
      <Link href={"/"} className="flex items-center">
        <Image
          src={"/icons/logodark.png"}
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
      <nav className="hidden lg:flex items-center gap-[5.313rem] text-white text-[1rem] leading-[94%] tracking-[-1%]">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="transition-colors duration-200 hover:text-primary"
          >
            {link.title}
          </Link>
        ))}
      </nav>
      <Link href={"/"} className="hidden gap-2 lg:flex items-center">
        <Image
          src={"/icons/phone.svg"}
          alt={""}
          width={20}
          height={20}
          className="object-cover size-[1.063rem]"
        />
        <span className="leading-[94%] tracking-[-1%] text-white lg:text-[1.125rem] transition-colors duration-200 hover:text-primary">
          8 (800) 500-65-89
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
          className="bg-[#121824] max-h-[44.125rem] justify-between "
        >
          <SheetHeader className="backdrop-blur-[48.7px] bg-[rgba(255,255,255,0.1)] ">
            <Link href={"/"} className="flex items-center">
              <Image
                src={"/icons/logodark.png"}
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
          <div className="flex flex-col gap-[0.75rem] mb-[20px] px-4">
            {links.map((link, index) => (
              <>
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-between text-[#CBCCCF] mt-[20px] text-[1rem] leading-[141%] tracking-[-2%] pb-[0.625rem]"
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
              <p className="font-medium text-[16px] leading-[141%] tracking-[-0.02em] text-[#a5a5a5] font-manrope">
                Соц. сети
              </p>
              {socials.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="flex items-center justify-between w-[120px] gap-[0.3rem]"
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
    </header>
  );
};

export default NavbarDark;
