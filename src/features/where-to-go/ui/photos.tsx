import Image from "next/image";

export default function Photos() {
  return (
    <div className="hidden lg:flex mb-[40px] mt-[40px] gap-3">
      <div className="relative w-[521px] h-[321px] rounded-[18px] overflow-hidden">
        <Image
          src="/images/catalog-filter/catalog3.png"
          alt="Казанский кремль"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative w-[521px] h-[321px] rounded-[18px] overflow-hidden">
        <Image
          src="/images/catalog-filter/catalog1.png"
          alt="Казанский кремль"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative w-[521px] h-[321px] rounded-[18px] overflow-hidden">
        <Image
          src="/images/catalog-filter/catalog2.png"
          alt="Казанский кремль"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/52" />
        <div className="absolute inset-0 flex items-center justify-center font-manrope font-semibold text-[46px] leading-[141%] tracking-[-0.02em] text-white">
          +25
        </div>
      </div>
    </div>
  );
}
