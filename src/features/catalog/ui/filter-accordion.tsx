// src/features/catalog/ui/filter-accordion.tsx

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type FilterOption = {
    id: string;
    title: string;
    count: number;
    checked?: boolean;
};

interface FilterAccordionProps {
    category: string;
    options: FilterOption[];
}

export const FilterAccordion = ({ category, options }: FilterAccordionProps) => {
    return (
        <AccordionItem value={category}>
            <AccordionTrigger className="font-medium text-[#151515] leading-[112%] text-[1.063rem]">
                {category}
            </AccordionTrigger>
            <AccordionContent>
                <div className="flex flex-col gap-[1.438rem]">
                    {options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2.5">
                            <Checkbox id={option.id} checked={option.checked} />
                            <Label
                                htmlFor={option.id}
                                className="text-[0.938rem] text-[#151515] leading-[112%]"
                            >
                                {option.title}{" "}
                                <span className="text-[0.938rem] text-[#C4C4C4] leading-[112%]">({option.count})</span>
                            </Label>
                        </div>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};