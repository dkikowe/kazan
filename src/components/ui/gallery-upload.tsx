"use client";

import { useState, useRef } from "react";
import { Button } from "./button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function GalleryUpload({ value, onChange }: GalleryUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setIsLoading(true);
      console.log("Начало загрузки файлов:", files.length, "файлов");
      const newUrls: string[] = [];

      for (const file of files) {
        console.log("Загрузка файла:", file.name, file.type, file.size);
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Ошибка при загрузке файла:", error);
          throw new Error(error.error || "Ошибка при загрузке файла");
        }

        const data = await response.json();
        console.log("Файл успешно загружен:", data.url);
        if (data.url) {
          newUrls.push(data.url);
        }
      }

      // Обновляем список URL-ов, сохраняя существующие
      const updatedUrls = [...value, ...newUrls];
      console.log("Обновленный список URL-ов:", updatedUrls);
      onChange(updatedUrls);
      toast.success("Изображения успешно загружены");
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
      toast.error(
        error instanceof Error ? error.message : "Ошибка при загрузке файлов"
      );
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    console.log("Удаление изображения по индексу:", index);
    const newUrls = value.filter((_, i) => i !== index);
    console.log("Новый список URL-ов после удаления:", newUrls);
    onChange(newUrls);
    toast.success("Изображение удалено");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div key={`${url}-${index}`} className="relative aspect-square">
            <Image
              src={url}
              alt={`Изображение ${index + 1}`}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="aspect-square border-2 border-dashed rounded-md flex items-center justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            ) : (
              <ImagePlus className="h-8 w-8" />
            )}
          </Button>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
}
