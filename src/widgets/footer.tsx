"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Menu, ArrowUpRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <section className="bg-[#121824]">
      {isMobile ? mobile() : desktop()}
    </section>
  );
};

export default Footer;

const mobile = () => {
  return (
    <div className="flex flex-col gap-[5.313rem] py-[3.5rem] px-[1rem]">
      <div className="flex flex-col gap-[3.625rem]">
        <div className="flex flex-col gap-[2.688rem]">
          <div>
            <p className="font-medium text-[1.238rem] leading-[110%] text-white">
              Ваше идеальное путешествие
              <br /> <span className="text-primary">начинается здесь</span>
            </p>
          </div>
          <div className="flex flex-col gap-[2rem]">
            <div className="flex flex-col gap-[0.813rem]">
              <p className="font-medium text-[0.938rem] leading-[110%] text-[#6E7279]">
                Контакты
              </p>
              <Link
                href={""}
                className="font-medium text-[1.25rem] leading-[100%] tracking-[-2%] text-white transition-all duration-200 hover:text-primary"
              >
                +7 (800)500-65-89
              </Link>
            </div>
            <div>
              <Link
                href={""}
                className="font-medium text-[1.25rem] leading-[133%] tracking-[-2%] text-white transition-all duration-200 hover:text-primary"
              >
                Казань Респ.Татарстан,
                <br /> ул. Баумана 29
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[5rem]">
          <Link
            href={""}
            className="flex flex-col gap-[0.5rem] group text-center"
          >
            <Button
              className="rounded-[0.75rem] aspect-square h-[3.5rem]"
              variant={"default"}
            >
              <MessageCircle fill={"white"} />
            </Button>
            <span className="font-medium text-[0.938rem] leading-[133%] tracking-[-2%] text-[#6E7279]">
              чат
            </span>
          </Link>
          <Link
            href={""}
            className="flex flex-col gap-[0.5rem] group text-center"
          >
            <Button
              className="rounded-[0.75rem] aspect-square h-[3.5rem]"
              variant={"default"}
            >
              <Phone fill={"white"} />
            </Button>
            <span className="font-medium text-[0.938rem] leading-[133%] tracking-[-2%] text-[#6E7279]">
              звонок
            </span>
          </Link>
          <Link
            href={""}
            className="flex flex-col gap-[0.5rem] group text-center"
          >
            <Button
              className="rounded-[0.75rem] aspect-square h-[3.5rem]"
              variant={"default"}
            >
              <Menu />
            </Button>
            <span className="font-medium text-[0.938rem] leading-[133%] tracking-[-2%] text-[#6E7279]">
              меню
            </span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-[0.813rem]">
        <Link
          href={""}
          className="font-medium text-[0.938rem] leading-[100%] text-[#6E7279]"
        >
          Политика конфиденциальности
        </Link>
        <Link
          href={""}
          className="font-medium text-[0.938rem] leading-[100%] text-[#6E7279]"
        >
          Мы в реестре туроператоров РТО 022666
        </Link>
        <Link
          href={""}
          className="font-medium text-[0.938rem] leading-[100%] text-[#6E7279]"
        >
          Экскурсионный сервис Казань © 2025
        </Link>
      </div>
    </div>
  );
};

const desktop = () => {
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

  const links = [
    {
      title: "Каталог",
      href: "/where-to-go",
    },
    {
      title: "Экскурсии",
      href: "/excursions",
    },
    {
      title: "Отзывы",
      href: "/reviews",
    },
  ];

  return (
    <div className="max-w-[90rem] mx-auto grid pt-[6.25rem] pb-[1.75rem] gap-[10.125rem] lg:grid-cols-2 justify-between">
      <div className="max-w-[30.5rem] flex flex-col gap-[2.688rem]">
        <div>
          <p className="font-semibold text-[2.188rem] w-[40rem] leading-[118%] tracking-[-4%] text-white">
            Ваше идеальное путешествие начинается здесь
          </p>
        </div>
        <div className="flex items-center">
          <Button className="rounded-full font-medium tracking-[-2%] text-[0.863rem] h-[3.5rem] px-[2.375rem]">
            Выбрать экскурсию
          </Button>
          <Button
            className="rounded-full  bg-[#2A2D31] hover:bg-[#3A3D42] aspect-square h-full  text-white "
            variant={null}
          >
            <ArrowUpRight />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 justify-between">
        <div className="flex flex-col gap-[2.5rem] justify-self-center">
          <div>
            <p className="font-medium text-[1rem] leading-[141%] tracking-[-2%] text-[#6E7279]">
              Контакты
            </p>
          </div>
          <div className="flex flex-col gap-[2.813rem]">
            <div>
              <Link
                href={""}
                className="font-medium text-[1rem] leading-[133%] tracking-[-2%] text-white transition-all duration-200 hover:text-primary"
              >
                Казань Респ.Татарстан,
                <br /> ул. Баумана 29
              </Link>
            </div>
            <div className="flex flex-col gap-[0.438rem]">
              <Link
                href={""}
                className="font-medium text-[1.25rem] leading-[100%] tracking-[-2%] text-white transition-all duration-200 hover:text-primary"
              >
                +7 (800)500-65-89
              </Link>
              <p className="font-light text-[0.875rem] leading-[100%] tracking-[-2%] text-[#6E7279]">
                Вопросы и предложения
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5rem] justify-self-center">
          <div>
            <p className="font-medium text-[1rem] leading-[141%] tracking-[-2%] text-[#6E7279]">
              Соц.сети
            </p>
          </div>
          <div className="flex flex-col gap-[1.75rem] ">
            <div className="flex flex-col gap-[1.9rem]">
              {socials.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="flex items-center justify-between gap-[1rem]"
                >
                  <span className="font-medium leading-[100%] tracking-[-2%] text-white transition-all duration-200 hover:text-primary">
                    {social.title}
                  </span>
                  <ArrowUpRight className="w-[1.2rem] h-[1.2rem] object-cover text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[2.5rem] justify-self-center">
          <div>
            <p className="font-medium text-[1rem] leading-[141%] tracking-[-2%] text-[#6E7279]">
              Главная
            </p>
          </div>
          <div className="flex flex-col gap-[1.75rem] ">
            <div className="flex flex-col gap-[1.9rem]">
              {links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="flex items-center justify-between max-w-[6.625rem]"
                >
                  <span className="font-medium leading-[100%] tracking-[-2%] text-white transition-all duration-200 hover:text-primary">
                    {link.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-full w-full flex items-center justify-between">
        <div>
          <Link
            href={""}
            className="w-full font-medium text-[1rem] leading-[141%] tracking-[-2%] text-[#6E7279]"
          >
            © 2025 «Казанские экскурсии»
          </Link>
        </div>
        <div>
          <Link
            href={""}
            className="w-full font-medium text-[1rem] leading-[141%] tracking-[-2%] text-[#6E7279] border-b-[#6E7279] border-b-1 pb-1"
          >
            Политика конфиденциальности
          </Link>
        </div>
        <div>
          <Link
            href={""}
            className="w-full font-medium text-[1rem] leading-[141%] tracking-[-2%] text-[#6E7279]"
          >
            Все права защищены
          </Link>
        </div>
      </div>
    </div>
  );
};
