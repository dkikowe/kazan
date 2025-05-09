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

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", phone: "", comment: "" });
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error("Error sending form:", error);
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
              <label htmlFor="name" className="text-[14px] text-[#6E7279]">
                Имя
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
              <label htmlFor="comment" className="text-[14px] text-[#6E7279]">
                Комментарий
              </label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="min-h-[100px]"
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
