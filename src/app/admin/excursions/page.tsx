"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Excursion {
  _id: string;
  title: string;
  seoTitle: string;
  isPublished: boolean;
  createdAt: string;
}

export default function ExcursionsPage() {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchExcursions();
  }, []);

  const fetchExcursions = async () => {
    try {
      const response = await fetch("/api/excursions");
      const data = await response.json();
      setExcursions(data);
    } catch (error) {
      toast.error("Ошибка при загрузке экскурсий");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту экскурсию?")) return;

    try {
      const response = await fetch(`/api/excursions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete excursion");

      toast.success("Экскурсия успешно удалена");
      fetchExcursions();
    } catch (error) {
      toast.error("Ошибка при удалении экскурсии");
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление экскурсиями</h1>
        <Button onClick={() => router.push("/admin/excursions/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить экскурсию
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>SEO заголовок</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата создания</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {excursions.map((excursion) => (
            <TableRow key={excursion._id}>
              <TableCell>{excursion.title}</TableCell>
              <TableCell>{excursion.seoTitle}</TableCell>
              <TableCell>
                {excursion.isPublished ? "Опубликовано" : "Черновик"}
              </TableCell>
              <TableCell>
                {new Date(excursion.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(`/admin/excursions/${excursion._id}`)
                  }
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(excursion._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
