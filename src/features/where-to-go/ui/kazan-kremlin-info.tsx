import { cn } from "@/lib/utils";

interface KazanKremlinInfoProps {
  className?: string;
}

export default function KazanKremlinInfo({ className }: KazanKremlinInfoProps) {
  return (
    <div
      data-slot="kazan-kremlin-info"
      className={cn(
        "flex flex-col px-4 gap-12 bg-white rounded-xl py-2 text-left",
        className
      )}
    >
      <h2 className=" font-manrope font-semibold text-[37px] leading-[100%] tracking-[-0.03em] text-[#0d1723]">
        Экскурсии по <span className="text-primary">Казанскому кремлю</span>
      </h2>

      <p className="text-[#0D1727] text-base leading-relaxed text-left">
        Уникальный комплекс казанского Кремля представляет интерес для туристов
        и исследователей. Здесь расположены мусульманские мечети, православные
        храмы и соборы. Перед белокаменными стенами установлены мифические
        драконы зиланты, ставшие городским символом. Интересные факты о
        казанском Кремле: При строительстве Успенского монастыря было обнаружено
        засыпанное подземелье – тайна для историков и ученых. Легенда о царице
        Сююмбике – она сбросилась с высокой башни, чтобы не быть плененной
        грозным русским царем. Башню Сююмбике сравнивают Пизанской, поскольку
        оба строения наклонены относительно линии горизонта.На белокаменных
        кремлевских стенах расположены три смотровые площадки, открывающие
        живописные виды на берег Казанки, Петропавловский собор и мечеть Кул
        Шариф
      </p>

      <div className="flex gap-4 h-auto text-left">
        <div className="w-[4px] h-auto bg-blue-600"></div>

        <p className="text-[#0D1727] max-w-[670px] text-base leading-relaxed text-left">
          Башню Сююмбике сравнивают Пизанской, поскольку оба строения наклонены
          относительно линии горизонта.На белокаменных кремлевских стенах
          расположены три смотровые площадки, открывающие живописные виды на
          берег Казанки, Петропавловский собор и мечеть Кул Шариф
        </p>
      </div>

      <div className="flex flex-col gap-4 text-left w-full md:w-[60%]">
        <p className="text-[#0D1727] text-base leading-relaxed text-left">
          При строительстве Успенского монастыря было обнаружено засыпанное
          подземелье – тайна для историков и ученых. Легенда о царице Сююмбике –
          она сбросилась с высокой башни, чтобы не быть плененной грозным
          русским царем. Башню Сююмбике сравнивают Пизанской
        </p>
      </div>

      <div className="flex flex-col gap-2 mb-4 md:mb-0 text-left">
        <ul className="space-y-1 text-[#0D1727] text-left">
          <li>• Казанский Кремль</li>
          <li>• Храм всех религий</li>
          <li>• Кул-Шариф (мечеть)</li>
          <li>• Башня Сююмбике</li>
          <li>• Дворец земледельцев</li>
        </ul>
      </div>
    </div>
  );
}
