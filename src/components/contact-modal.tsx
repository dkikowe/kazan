"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Excursion {
  _id: string;
  title: string;
}

interface Ticket {
  type: "adult" | "child" | "pensioner";
  count: number;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
    excursionId: "",
    paymentMethod: "full",
    date: null as Date | null,
    time: "",
  });

  const [tickets, setTickets] = useState<Ticket[]>([
    { type: "adult", count: 1 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        const response = await fetch("/api/excursions");
        if (!response.ok) {
          throw new Error("Ошибка при загрузке экскурсий");
        }
        const data = await response.json();
        setExcursions(data);
      } catch (error) {
        console.error("Ошибка при загрузке экскурсий:", error);
      }
    };

    if (isOpen) {
      fetchExcursions();

      // Сброс формы при открытии
      setFormData({
        name: "",
        phone: "",
        comment: "",
        excursionId: "",
        paymentMethod: "full",
        date: null,
        time: "",
      });
      setTickets([{ type: "adult", count: 1 }]);
      setAvailableTimes([]);
    }
  }, [isOpen]);

  // Получение доступных времен начала при выборе экскурсии
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!formData.excursionId) {
        setAvailableTimes([]);
        return;
      }

      setIsLoadingTimes(true);

      try {
        // Отправляем запрос, который вернет доступные времена для выбранной экскурсии
        const response = await fetch(
          `/api/excursions/${formData.excursionId}/times`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.availableTimes && Array.isArray(data.availableTimes)) {
            setAvailableTimes(data.availableTimes);
          } else {
            // Если нет данных о временах, установим стандартные
            setAvailableTimes([
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ]);
          }
        } else {
          // В случае ошибки устанавливаем стандартные времена
          setAvailableTimes([
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
          ]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке времен:", error);
        setAvailableTimes([
          "09:00",
          "10:00",
          "11:00",
          "12:00",
          "13:00",
          "14:00",
          "15:00",
          "16:00",
          "17:00",
          "18:00",
        ]);
      } finally {
        setIsLoadingTimes(false);
      }
    };

    fetchAvailableTimes();
  }, [formData.excursionId]);

  // Добавление нового типа билета
  const addTicket = () => {
    setTickets([...tickets, { type: "adult", count: 1 }]);
  };

  // Удаление типа билета
  const removeTicket = (index: number) => {
    if (tickets.length > 1) {
      const newTickets = [...tickets];
      newTickets.splice(index, 1);
      setTickets(newTickets);
    }
  };

  // Обновление типа билета
  const updateTicketType = (
    index: number,
    type: "adult" | "child" | "pensioner"
  ) => {
    const newTickets = [...tickets];
    newTickets[index].type = type;
    setTickets(newTickets);
  };

  // Обновление количества билетов
  const updateTicketCount = (index: number, count: number) => {
    const newTickets = [...tickets];
    newTickets[index].count = count;
    setTickets(newTickets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bookingData = {
        fullName: formData.name,
        phone: formData.phone,
        excursionId: formData.excursionId,
        tickets: tickets,
        paymentType: formData.paymentMethod,
        date: formData.date ? format(formData.date, "yyyy-MM-dd") : null,
        time: formData.time,
        comment: formData.comment,
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        // Проверяем, вернулись ли дополнительные данные о доступных временах
        const data = await response.json();
        if (data.availableTimes && Array.isArray(data.availableTimes)) {
          setAvailableTimes(data.availableTimes);
        }

        setIsSuccess(true);
        setFormData({
          name: "",
          phone: "",
          comment: "",
          excursionId: "",
          paymentMethod: "full",
          date: null,
          time: "",
        });
        setTickets([{ type: "adult", count: 1 }]);

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error("Ошибка отправки формы:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold text-center">
            Оставить заявку
          </DialogTitle>
        </DialogHeader>
        {isSuccess ? (
          <div className="text-center py-8">
            <p className="text-[18px] font-medium">Заявка отправлена</p>
            <p className="text-[14px] text-gray-500 mt-2">
              Наш менеджер свяжется с вами в ближайшее время
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-[14px] text-[#6E7279]">
                ФИО
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="h-[48px]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-[14px] text-[#6E7279]">
                Телефон
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="h-[48px]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="excursion" className="text-[14px] text-[#6E7279]">
                Экскурсия
              </label>
              <Select
                value={formData.excursionId}
                onValueChange={(value) =>
                  setFormData({ ...formData, excursionId: value })
                }
                required
              >
                <SelectTrigger className="h-[48px]">
                  <SelectValue placeholder="Выберите экскурсию" />
                </SelectTrigger>
                <SelectContent>
                  {excursions.map((excursion) => (
                    <SelectItem key={excursion._id} value={excursion._id}>
                      {excursion.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[14px] text-[#6E7279]">Билеты</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTicket}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить
                </Button>
              </div>

              {tickets.map((ticket, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select
                      value={ticket.type}
                      onValueChange={(value: "adult" | "child" | "pensioner") =>
                        updateTicketType(index, value)
                      }
                    >
                      <SelectTrigger className="h-[48px]">
                        <SelectValue placeholder="Тип билета" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adult">Взрослый</SelectItem>
                        <SelectItem value="child">Детский</SelectItem>
                        <SelectItem value="pensioner">Пенсионный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-24">
                    <Select
                      value={ticket.count.toString()}
                      onValueChange={(value) =>
                        updateTicketCount(index, parseInt(value))
                      }
                    >
                      <SelectTrigger className="h-[48px]">
                        <SelectValue placeholder="Кол-во" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {tickets.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTicket(index)}
                      className="h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-[14px] text-[#6E7279]">
                Способ оплаты
              </label>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full">Полная оплата</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prepayment" id="prepayment" />
                  <Label htmlFor="prepayment">Предоплата</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onsite" id="onsite" />
                  <Label htmlFor="onsite">На месте</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[14px] text-[#6E7279]">Дата</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-[48px] justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(formData.date, "dd.MM.yyyy", { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.date || undefined}
                      onSelect={(date) =>
                        setFormData({ ...formData, date: date || null })
                      }
                      initialFocus
                      locale={ru}
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] text-[#6E7279]">Время</label>
                <Select
                  value={formData.time}
                  onValueChange={(value) =>
                    setFormData({ ...formData, time: value })
                  }
                >
                  <SelectTrigger className="h-[48px]">
                    <SelectValue placeholder="Выберите время">
                      {formData.time || (
                        <div className="flex items-center">
                          {isLoadingTimes ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Clock className="mr-2 h-4 w-4" />
                          )}
                          Выберите время
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingTimes ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Загрузка...
                      </div>
                    ) : (
                      availableTimes.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="comment" className="text-[14px] text-[#6E7279]">
                Комментарий
              </label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-[48px] bg-[#3171F7] hover:bg-[#3171F7]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Отправить"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
