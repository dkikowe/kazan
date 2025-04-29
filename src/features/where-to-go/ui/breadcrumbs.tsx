import Link from "next/link";

export default function Breadcrumbs() {
  return (
    <div className="flex items-center mb-[30px] gap-[15px]">
      <Link href="/" className="text-[#6E7279] text-[16px]">
        Главная
      </Link>
      <div className="w-1 h-1 rounded-full bg-[#6E7279]" />
      <Link href="/where-to-go-kazan" className="text-[#6E7279] text-[16px]">
        Куда сходить в Казани?
      </Link>
      <div className="w-1 h-1 rounded-full bg-[#6E7279]" />
      <span className="text-[#151515] text-[16px]">
        Экскурсия по Казанскому кремлю
      </span>
    </div>
  );
}
