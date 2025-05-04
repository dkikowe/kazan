import { ExcursionFormData } from "@/types/excursion";

export async function getExcursion(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/excursions/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch excursion");
  }
  return response.json();
}

export async function updateExcursion(id: string, data: ExcursionFormData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/excursions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update excursion");
  }

  return response.json();
}

export async function createExcursion(data: ExcursionFormData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/excursions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create excursion");
  }

  return response.json();
} 