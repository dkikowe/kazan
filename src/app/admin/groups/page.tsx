"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Edit,
  Trash2,
  UserPlus,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface Excursion {
  _id: string;
  title: string;
}

interface Group {
  _id: string;
  name?: string;
  date: string;
  time: string;
  place: string;
  totalSeats: number;
  bookedSeats: number;
  status: string;
  transport?: string[];
  guide?: {
    name: string;
    phone: string;
  };
  excursion: {
    _id: string;
    title: string;
  };
}

interface Tourist {
  _id: string;
  name: string;
  phone?: string;
  ticketCount: number;
  isChild: boolean;
}

const transportOptions = [
  { id: "автобус", label: "Автобус" },
  { id: "теплоход", label: "Теплоход" },
  { id: "пешеход", label: "Пешеходный" },
  { id: "авто", label: "Автомобиль" },
];

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showTouristDialog, setShowTouristDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);

  // Форма для добавления туриста
  const [touristName, setTouristName] = useState("");
  const [touristPhone, setTouristPhone] = useState("");
  const [touristTickets, setTouristTickets] = useState("1");
  const [touristIsChild, setTouristIsChild] = useState(false);
  const [tourists, setTourists] = useState<Tourist[]>([]);

  useEffect(() => {
    fetchGroups();
    fetchExcursions();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchTourists(selectedGroup._id);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (search) {
      const filtered = groups.filter((group) => {
        const groupName = group.name || "";
        const excursionTitle =
          excursions.find((e) => e._id === group.excursion._id)?.title || "";

        const searchLower = search.toLowerCase();
        return (
          groupName.toLowerCase().includes(searchLower) ||
          excursionTitle.toLowerCase().includes(searchLower) ||
          new Date(group.date).toLocaleDateString().includes(search) ||
          group.time.includes(search) ||
          group.place.toLowerCase().includes(searchLower)
        );
      });
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [search, groups, excursions]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/groups");
      const data = await response.json();
      setGroups(data);
      setFilteredGroups(data);
    } catch (error) {
      toast.error("Ошибка при загрузке групп");
    } finally {
      setLoading(false);
    }
  };

  const fetchExcursions = async () => {
    try {
      const response = await fetch("/api/excursions");
      const data = await response.json();
      setExcursions(data);
    } catch (error) {
      toast.error("Ошибка при загрузке экскурсий");
    }
  };

  const fetchTourists = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/tourists`);
      if (!response.ok) {
        throw new Error("Ошибка при загрузке туристов");
      }
      const data = await response.json();
      setTourists(data);
    } catch (error) {
      toast.error("Ошибка при загрузке списка туристов");
      setTourists([]);
    }
  };

  const handleCreateGroup = () => {
    router.push("/admin/groups/create");
  };

  const handleEditGroup = (groupId: string) => {
    router.push(`/admin/groups/create?id=${groupId}`);
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    try {
      const response = await fetch(`/api/groups/${selectedGroup._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении группы");
      }

      toast.success("Группа успешно удалена");
      setShowDeleteDialog(false);
      fetchGroups();
    } catch (error) {
      toast.error("Ошибка при удалении группы");
    }
  };

  const handleOpenTouristDialog = (group: Group) => {
    setSelectedGroup(group);
    setShowTouristDialog(true);
  };

  const handleOpenDeleteDialog = (group: Group) => {
    setSelectedGroup(group);
    setShowDeleteDialog(true);
  };

  const handleAddTourist = async () => {
    if (!selectedGroup) return;

    if (!touristName) {
      toast.error("Введите имя туриста");
      return;
    }

    try {
      const touristData = {
        name: touristName,
        phone: touristPhone || undefined,
        ticketCount: parseInt(touristTickets),
        isChild: touristIsChild,
      };

      const response = await fetch(
        `/api/groups/${selectedGroup._id}/tourists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(touristData),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при добавлении туриста");
      }

      toast.success("Турист добавлен успешно");
      resetTouristForm();
      fetchTourists(selectedGroup._id);
      fetchGroups();
    } catch (error) {
      toast.error("Ошибка при добавлении туриста");
    }
  };

  const handleDeleteTourist = async (touristId: string) => {
    if (!selectedGroup) return;

    try {
      const response = await fetch(
        `/api/groups/${selectedGroup._id}/tourists?touristId=${touristId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении туриста");
      }

      toast.success("Турист удален успешно");
      fetchTourists(selectedGroup._id);
      fetchGroups();
    } catch (error) {
      toast.error("Ошибка при удалении туриста");
    }
  };

  const resetTouristForm = () => {
    setTouristName("");
    setTouristPhone("");
    setTouristTickets("1");
    setTouristIsChild(false);
  };

  const formatTransportList = (transportList?: string[]) => {
    if (!transportList || transportList.length === 0) return "Не указан";
    return transportList
      .map((t) => {
        const option = transportOptions.find((opt) => opt.id === t);
        return option ? option.label : t;
      })
      .join(", ");
  };

  const getExcursionTitle = (group: Group) => {
    if (!group.excursion) return "Неизвестная экскурсия";
    return group.excursion.title;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU");
  };

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление группами</h1>
        <Button onClick={handleCreateGroup}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Создать группу
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск групп"
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Экскурсия</TableHead>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>Место</TableHead>
                  <TableHead>Места</TableHead>
                  <TableHead>Экскурсовод</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => (
                  <TableRow key={group._id}>
                    <TableCell>
                      {group.name || `Группа от ${formatDate(group.date)}`}
                    </TableCell>
                    <TableCell>{getExcursionTitle(group)}</TableCell>
                    <TableCell>
                      {formatDate(group.date)}, {group.time}
                    </TableCell>
                    <TableCell>{group.place}</TableCell>
                    <TableCell>
                      <b>{group.bookedSeats}</b> / {group.totalSeats}
                    </TableCell>
                    <TableCell>
                      {group.guide?.name && (
                        <>
                          {group.guide.name}
                          {group.guide.phone && (
                            <div className="text-sm text-muted-foreground">
                              {group.guide.phone}
                            </div>
                          )}
                        </>
                      )}
                      {!group.guide?.name && "Не назначен"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          group.status === "active"
                            ? "default"
                            : group.status === "completed"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {group.status === "active"
                          ? "Активна"
                          : group.status === "completed"
                          ? "Завершена"
                          : "Отменена"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            router.push(`/admin/groups/${group._id}/tourists`)
                          }
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditGroup(group._id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleOpenDeleteDialog(group)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center p-6">
          <CardHeader>
            <CardTitle>Нет групп</CardTitle>
            <CardDescription>
              Создайте новую группу, чтобы начать работу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateGroup}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Создать группу
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Диалог управления туристами */}
      <Dialog open={showTouristDialog} onOpenChange={setShowTouristDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Управление туристами</DialogTitle>
            <DialogDescription>
              {selectedGroup?.name ||
                `Группа от ${
                  selectedGroup ? formatDate(selectedGroup.date) : ""
                }`}
              {selectedGroup && (
                <span className="block mt-1 text-sm">
                  {getExcursionTitle(selectedGroup)} •{" "}
                  {formatDate(selectedGroup.date)}, {selectedGroup.time}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Добавить туриста</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="touristName">Имя*</Label>
                  <Input
                    id="touristName"
                    value={touristName}
                    onChange={(e) => setTouristName(e.target.value)}
                    placeholder="Введите имя туриста"
                  />
                </div>
                <div>
                  <Label htmlFor="touristPhone">Телефон</Label>
                  <Input
                    id="touristPhone"
                    value={touristPhone}
                    onChange={(e) => setTouristPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                <div>
                  <Label htmlFor="touristTickets">Количество билетов*</Label>
                  <Input
                    id="touristTickets"
                    type="number"
                    min="1"
                    value={touristTickets}
                    onChange={(e) => setTouristTickets(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="touristIsChild"
                    checked={touristIsChild}
                    onCheckedChange={(checked) => setTouristIsChild(!!checked)}
                  />
                  <Label htmlFor="touristIsChild">Детский билет</Label>
                </div>
                <Button onClick={handleAddTourist} className="w-full">
                  Добавить туриста
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Список туристов</h3>
              {tourists.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Билетов</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tourists.map((tourist) => (
                      <TableRow key={tourist._id}>
                        <TableCell>{tourist.name}</TableCell>
                        <TableCell>{tourist.phone || "—"}</TableCell>
                        <TableCell>{tourist.ticketCount}</TableCell>
                        <TableCell>
                          {tourist.isChild ? "Детский" : "Взрослый"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteTourist(tourist._id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 bg-muted rounded-md">
                  Нет туристов в группе
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление группы</DialogTitle>
            <DialogDescription>
              Вы действительно хотите удалить группу "
              {selectedGroup?.name ||
                `Группа от ${
                  selectedGroup
                    ? new Date(selectedGroup.date).toLocaleDateString()
                    : ""
                }`}
              "? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
