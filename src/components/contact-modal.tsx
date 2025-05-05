"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    ticketType: "adult",
    paymentType: "full",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          fullName: "",
          phone: "",
          ticketType: "adult",
          paymentType: "full",
        });
        toast.success("Заявка успешно отправлена");
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      } else {
        throw new Error("Failed to submit booking");
      }
    } catch (error) {
      console.error("Error sending form:", error);
      toast.error("Ошибка при отправке заявки");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold text-center">
            Оставить заявку
          </DialogTitle>
        </DialogHeader>
        {isSuccess ? (
          <div className="text-center py-8">
            <p className="text-[18px] font-medium">Заявка отправлена</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-[14px] text-[#6E7279]">
                ФИО
              </label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                className="h-[48px]"
                placeholder="Ваше полное имя"
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
                placeholder="+7 (___) ___-__-__"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="ticketType"
                className="text-[14px] text-[#6E7279]"
              >
                Тип билета
              </label>
              <Select
                value={formData.ticketType}
                onValueChange={(value) =>
                  setFormData({ ...formData, ticketType: value })
                }
              >
                <SelectTrigger className="h-[48px]">
                  <SelectValue placeholder="Выберите тип билета" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Взрослый</SelectItem>
                  <SelectItem value="child">Детский</SelectItem>
                  <SelectItem value="pensioner">Пенсионный</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="paymentType"
                className="text-[14px] text-[#6E7279]"
              >
                Тип оплаты
              </label>
              <Select
                value={formData.paymentType}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentType: value })
                }
              >
                <SelectTrigger className="h-[48px]">
                  <SelectValue placeholder="Выберите тип оплаты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Полная</SelectItem>
                  <SelectItem value="prepayment">Предоплата</SelectItem>
                  <SelectItem value="onsite">На месте</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full h-[48px] bg-[#3171F7] hover:bg-[#3171F7]/90 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Отправить заявку"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
