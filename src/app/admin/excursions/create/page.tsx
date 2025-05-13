import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";

interface FormData {
  title: string;
  description: string;
  duration: number;
  price: number;
  meetingPoint: string;
  meetingTime: string;
  maxGroupSize: number;
}

export default function CreateExcursionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    duration: 0,
    price: 0,
    meetingPoint: "",
    meetingTime: "",
    maxGroupSize: 0,
  });
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const excursionData = {
        ...formData,
        imageUrl,
      };

      const response = await fetch("/api/excursions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(excursionData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании экскурсии");
      }

      toast.success("Экскурсия успешно создана");
      router.push("/admin/excursions");
    } catch (error) {
      toast.error("Ошибка при создании экскурсии");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Создание экскурсии</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Изображение экскурсии</Label>
          <ImageUpload
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            onRemove={() => setImageUrl("")}
          />
        </div>
      </form>
    </div>
  );
}
