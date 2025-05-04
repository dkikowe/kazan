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
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  ShoppingCart,
  MapPin,
  Clock,
  Users,
  Tag,
  Calendar,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

interface Excursion {
  _id: string;
  title: string;
  description: string;
  duration: string;
  meetingPoint: string;
  maxGroupSize: number;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
}

export default function ExcursionsPage() {
  const router = useRouter();
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredExcursions = excursions.filter((excursion) =>
    excursion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Экскурсии</h1>
            <p className="text-muted-foreground">
              Управление экскурсиями и их товарами
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/excursions/new")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Создать экскурсию
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Поиск экскурсий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExcursions.map((excursion) => (
            <Card
              key={excursion._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                router.push(`/admin/excursions/${excursion._id}/products`)
              }
            >
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  {excursion.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {excursion.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{excursion.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{excursion.meetingPoint}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>До {excursion.maxGroupSize} человек</span>
                  </div>
                  {excursion.tags && excursion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {excursion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Создано:{" "}
                      {new Date(excursion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/admin/excursions/${excursion._id}/products/new`
                        );
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Добавить товар
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/excursions/${excursion._id}`);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      Редактировать
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExcursions.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Экскурсии не найдены</h3>
            <p className="text-muted-foreground mt-2">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
