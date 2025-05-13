"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { toast } from "sonner";

interface Excursion {
  _id: string;
  title: string;
  excursionProduct?: {
    _id: string;
    title: string;
  };
  place?: string;
}

interface ExcursionProduct {
  _id: string;
  title: string;
  startTimes: string[];
  meetingPoints: Array<{
    name: string;
    address: string;
  }>;
}

interface Group {
  _id?: string;
  name?: string;
  excursion: string;
  date: string;
  time: string;
  place: string;
  totalSeats: number;
  bookedSeats?: number;
  transport?: string[];
  guide?: {
    name: string;
    phone: string;
  };
  status?: string;
}

const transportOptions = [
  { id: "автобус", label: "Автобус" },
  { id: "теплоход", label: "Теплоход" },
  { id: "пешеход", label: "Пешеходный" },
  { id: "авто", label: "Автомобиль" },
];

export default function CreateGroupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("id");
  const isEditMode = !!groupId;

  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(
    null
  );
  const [productDetails, setProductDetails] = useState<ExcursionProduct | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    excursion: "",
    date: "",
    time: "",
    place: "",
    totalSeats: 0,
    selectedTransport: [] as string[],
    guideName: "",
    guidePhone: "",
  });

  useEffect(() => {
    fetchExcursions();
  }, []);

  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
  }, [groupId]);

  useEffect(() => {
    if (formData.excursion) {
      const excursion = excursions.find((e) => e._id === formData.excursion);
      if (excursion) {
        setSelectedExcursion(excursion);

        // Если есть ссылка на excursionProduct, загружаем его данные
        if (excursion.excursionProduct?._id) {
          fetchProductDetails(excursion.excursionProduct._id);
        } else {
          setProductDetails(null);
          // Если нет привязанного товара, сбрасываем время и место
          setFormData((prev) => ({
            ...prev,
            time: "",
            place: "",
          }));
        }
      }
    } else {
      setSelectedExcursion(null);
      setProductDetails(null);
    }
  }, [formData.excursion, excursions]);

  const fetchExcursions = async () => {
    try {
      const response = await fetch("/api/excursions");
      if (!response.ok) throw new Error("Ошибка при загрузке экскурсий");
      const data = await response.json();
      setExcursions(data);
    } catch (error) {
      console.error("Ошибка при загрузке экскурсий:", error);
      toast.error("Не удалось загрузить список экскурсий");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(`/api/excursion-products/${productId}`);
      if (!response.ok) throw new Error("Ошибка при загрузке данных товара");
      const data = await response.json();
      setProductDetails(data);

      // Устанавливаем время и место из товара
      if (data.startTimes?.length > 0 && !formData.time) {
        setFormData((prev) => ({
          ...prev,
          time: data.startTimes[0],
        }));
      }

      if (data.meetingPoints?.length > 0 && !formData.place) {
        setFormData((prev) => ({
          ...prev,
          place: data.meetingPoints[0].address || "",
        }));
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных товара:", error);
      toast.error("Не удалось загрузить данные о времени и месте встречи");
    }
  };

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}`);
      if (!response.ok) throw new Error("Ошибка при загрузке группы");
      const data = await response.json();
      setFormData({
        name: data.name || "",
        excursion: data.excursion._id,
        date: new Date(data.date).toISOString().split("T")[0],
        time: data.time,
        place: data.place,
        totalSeats: data.totalSeats,
        selectedTransport: data.transport || [],
        guideName: data.guide?.name || "",
        guidePhone: data.guide?.phone || "",
      });
    } catch (error) {
      console.error("Ошибка при загрузке группы:", error);
      toast.error("Не удалось загрузить данные группы");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const groupData: any = {
        name: formData.name,
        excursion: formData.excursion,
        date: formData.date,
        time: formData.time,
        place: formData.place,
        totalSeats: formData.totalSeats,
        transport: formData.selectedTransport,
      };

      // Добавляем данные гида только если указаны имя и телефон
      if (formData.guideName) {
        groupData.guide = {
          name: formData.guideName,
          phone: formData.guidePhone || "",
        };
      }

      const url = groupId ? `/api/groups/${groupId}` : "/api/groups";
      const method = groupId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при сохранении группы");
      }

      toast.success(groupId ? "Группа обновлена" : "Группа создана");
      router.push("/admin/groups");
    } catch (error: any) {
      console.error("Ошибка при сохранении группы:", error);
      toast.error(`Не удалось сохранить группу: ${error.message || error}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/groups")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку
        </Button>
        <h1 className="text-3xl font-bold">
          {groupId ? "Редактирование группы" : "Создание группы"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {groupId
              ? "Редактировать данные группы"
              : "Заполните данные для новой группы"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название группы</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Название группы (необязательно)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excursion">Экскурсия*</Label>
                  <Select
                    value={formData.excursion}
                    onValueChange={(value) =>
                      setFormData({ ...formData, excursion: value })
                    }
                  >
                    <SelectTrigger>
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Дата*</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? (
                          format(new Date(formData.date), "PPP", { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          formData.date ? new Date(formData.date) : undefined
                        }
                        onSelect={(date) =>
                          setFormData({
                            ...formData,
                            date: date ? format(date, "yyyy-MM-dd") : "",
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Время*</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) =>
                      setFormData({ ...formData, time: value })
                    }
                    disabled={!productDetails?.startTimes?.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите время" />
                    </SelectTrigger>
                    <SelectContent>
                      {productDetails?.startTimes?.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seats">Количество мест*</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    value={formData.totalSeats}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalSeats: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="place">Место встречи*</Label>
                <Input
                  id="place"
                  value={formData.place}
                  onChange={(e) =>
                    setFormData({ ...formData, place: e.target.value })
                  }
                  placeholder="Адрес или описание места встречи"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guide-name">Имя экскурсовода</Label>
                  <Input
                    id="guide-name"
                    value={formData.guideName}
                    onChange={(e) =>
                      setFormData({ ...formData, guideName: e.target.value })
                    }
                    placeholder="Имя экскурсовода"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guide-phone">Телефон экскурсовода</Label>
                  <Input
                    id="guide-phone"
                    value={formData.guidePhone}
                    onChange={(e) =>
                      setFormData({ ...formData, guidePhone: e.target.value })
                    }
                    placeholder="+7 999 123-45-67"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Тип транспорта</Label>
                <div className="grid grid-cols-2 gap-2">
                  {transportOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={option.id}
                        checked={formData.selectedTransport.includes(option.id)}
                        onCheckedChange={(checked) => {
                          const newTransport = checked
                            ? [...formData.selectedTransport, option.id]
                            : formData.selectedTransport.filter(
                                (t) => t !== option.id
                              );
                          setFormData({
                            ...formData,
                            selectedTransport: newTransport,
                          });
                        }}
                      />
                      <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/groups")}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Сохранение..." : "Создать группу"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
