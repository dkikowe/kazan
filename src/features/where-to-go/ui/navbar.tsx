import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="w-full h-[62px] bg-[#E8EBF0] rounded-[59px] backdrop-blur-[48.7px] px-[20px] flex items-center justify-between">
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
        <Link href="/where-to-go-kazan" className="text-[#0D1723] text-[16px]">
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
          <a href="tel:88005006589" className="text-[#0D1723] text-[16px]">
            8 (800) 500-65-89
          </a>
        </div>
      </div>
    </nav>
  );
}
