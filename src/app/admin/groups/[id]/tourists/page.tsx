"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Tourist {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  tickets: Array<{
    type: string;
    count: number;
  }>;
  notes?: string;
}

interface Group {
  _id: string;
  name: string;
  excursion: {
    _id: string;
    title: string;
    excursionProduct: {
      _id: string;
    };
  };
  date: string;
  time: string;
  place: string;
  totalSeats: number;
  bookedSeats: number;
  status?: string;
}

interface Ticket {
  type: string;
  name: string;
  price: number;
}

export default function GroupTouristsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [newTourist, setNewTourist] = useState({
    name: "",
    phone: "",
    tickets: [{ type: "", count: 1 }],
    notes: "",
  });

  useEffect(() => {
    fetchGroup();
    fetchTourists();
  }, [id]);

  const fetchGroup = async () => {
    try {
      const response = await fetch(`/api/groups/${id}`);
      if (!response.ok) throw new Error("Ошибка при загрузке группы");
      const data = await response.json();
      console.log("Данные группы:", data);
      setGroup(data);

      // Получаем билеты из товара экскурсии
      if (data.excursion?.excursionProduct?._id) {
        const ticketsResponse = await fetch(
          `/api/excursion-products/${data.excursion.excursionProduct._id}`
        );
        if (!ticketsResponse.ok) throw new Error("Ошибка при загрузке билетов");
        const ticketsData = await ticketsResponse.json();
        console.log("Данные о билетах:", ticketsData.tickets);
        setTickets(ticketsData.tickets || []);
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      toast.error("Не удалось загрузить информацию");
    }
  };

  const fetchTourists = async () => {
    try {
      const response = await fetch(`/api/groups/${id}/tourists`);
      if (!response.ok) throw new Error("Ошибка при загрузке туристов");
      const data = await response.json();
      setTourists(data);
    } catch (error) {
      console.error("Ошибка при загрузке туристов:", error);
      toast.error("Не удалось загрузить список туристов");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTourist = async () => {
    // Валидация формы
    if (!newTourist.name.trim()) {
      toast.error("Введите имя туриста");
      return;
    }

    if (!newTourist.tickets.length || newTourist.tickets.some((t) => !t.type)) {
      toast.error("Выберите тип билета");
      return;
    }

    // Проверяем, что все выбранные типы билетов существуют
    const validTicketTypes = tickets.map((t) => t.type);
    const invalidTickets = newTourist.tickets.filter(
      (t) => !validTicketTypes.includes(t.type)
    );

    if (invalidTickets.length > 0) {
      toast.error("Выбраны несуществующие типы билетов");
      return;
    }

    try {
      const response = await fetch(`/api/groups/${id}/tourists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTourist.name,
          phone: newTourist.phone,
          tickets: newTourist.tickets,
          notes: newTourist.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при добавлении туриста");
      }

      toast.success("Турист успешно добавлен");
      setIsAddDialogOpen(false);
      setNewTourist({
        name: "",
        phone: "",
        tickets: [{ type: "", count: 1 }],
        notes: "",
      });
      fetchTourists();
      fetchGroup();
    } catch (error: any) {
      console.error("Ошибка при добавлении туриста:", error);
      toast.error(error.message || "Не удалось добавить туриста");
    }
  };

  const handleDeleteTourist = async () => {
    if (!selectedTourist) return;

    try {
      const response = await fetch(
        `/api/groups/${id}/tourists?touristId=${selectedTourist._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Ошибка при удалении туриста");

      toast.success("Турист успешно удален");
      setIsDeleteDialogOpen(false);
      setSelectedTourist(null);
      fetchTourists();
      fetchGroup();
    } catch (error) {
      console.error("Ошибка при удалении туриста:", error);
      toast.error("Не удалось удалить туриста");
    }
  };

  // Функции для управления билетами
  const handleTicketTypeChange = (idx: number, value: string) => {
    const updated = [...newTourist.tickets];
    updated[idx].type = value;
    setNewTourist({ ...newTourist, tickets: updated });
  };
  const handleTicketCountChange = (idx: number, value: number) => {
    const updated = [...newTourist.tickets];
    updated[idx].count = value;
    setNewTourist({ ...newTourist, tickets: updated });
  };
  const handleAddTicket = () => {
    setNewTourist({
      ...newTourist,
      tickets: [...newTourist.tickets, { type: "", count: 1 }],
    });
  };
  const handleRemoveTicket = (idx: number) => {
    const updated = [...newTourist.tickets];
    updated.splice(idx, 1);
    setNewTourist({ ...newTourist, tickets: updated });
  };

  const filteredTourists = tourists.filter(
    (tourist) =>
      tourist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tourist.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/groups")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к группам
          </Button>
          <h1 className="text-3xl font-bold">
            {group?.name ||
              `Группа "${group?.excursion?.title || "Экскурсия"}"`}
          </h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить туриста
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить туриста</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Имя*</Label>
                <Input
                  id="name"
                  value={newTourist.name}
                  onChange={(e) =>
                    setNewTourist({ ...newTourist, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={newTourist.phone}
                  onChange={(e) =>
                    setNewTourist({ ...newTourist, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Типы билетов и количество*</Label>
                {newTourist.tickets.map((ticket, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <select
                      value={ticket.type}
                      onChange={(e) =>
                        handleTicketTypeChange(idx, e.target.value)
                      }
                      className="p-2 border rounded"
                      required
                    >
                      <option value="">Выберите тип билета</option>
                      {tickets.map((t) => (
                        <option key={t.type} value={t.type}>
                          {t.name} - {t.price} ₽
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min={1}
                      value={ticket.count}
                      onChange={(e) =>
                        handleTicketCountChange(
                          idx,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-20"
                      required
                    />
                    {newTourist.tickets.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveTicket(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTicket}
                  className="mt-2"
                >
                  + Добавить тип билета
                </Button>
              </div>
              <div>
                <Label htmlFor="notes">Примечания</Label>
                <Input
                  id="notes"
                  value={newTourist.notes}
                  onChange={(e) =>
                    setNewTourist({ ...newTourist, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button onClick={handleAddTourist}>Добавить</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Информация о группе</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Экскурсия</p>
              <p className="text-lg font-semibold">
                {group?.excursion?.title || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего мест</p>
              <p className="text-lg font-semibold">{group?.totalSeats}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Забронировано мест</p>
              <p className="text-lg font-semibold">{group?.bookedSeats}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Поиск по имени или телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Тип билета</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTourists.map((tourist) => (
                <TableRow key={tourist._id}>
                  <TableCell>{tourist.name}</TableCell>
                  <TableCell>{tourist.phone || "-"}</TableCell>
                  <TableCell>
                    {tourist.tickets.map((t, i) => {
                      const ticketInfo = tickets.find(
                        (ticket) => ticket.type === t.type
                      );
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span>{ticketInfo?.name || t.type}</span>
                          <span className="text-gray-500">({t.count} шт.)</span>
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    {tourist.tickets.reduce((sum, t) => sum + t.count, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTourist(tourist);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить туриста</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить туриста {selectedTourist?.name}?</p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteTourist}>
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
