"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  time?: string;
  onSelect: (time: string) => void;
}

export function TimePicker({ time, onSelect }: TimePickerProps) {
  const [inputValue, setInputValue] = React.useState(time || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Проверяем формат времени (ЧЧ:ММ)
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
      onSelect(value);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {time || <span>Выберите время</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <Input
          type="time"
          value={inputValue}
          onChange={handleInputChange}
          className="w-[150px]"
        />
      </PopoverContent>
    </Popover>
  );
}
