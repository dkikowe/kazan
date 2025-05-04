"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { ExcursionProduct } from "@/models/excursion-product";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId, Document } from "mongodb";
import mongoose from "mongoose";

const serviceSchema = z.object({
  title: z.string().min(1, "Название обязательно"),
  description: z.string().min(1, "Описание обязательно"),
  price: z.number().min(0, "Цена должна быть положительной"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
}

interface IExcursionProduct {
  _id: string;
  title: string;
  services: Service[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServicesPage({ params }: PageProps) {
  const { id } = await params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<IExcursionProduct | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  // Fetch product data
  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/excursion-products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      setProduct(data);
      setServices(data.services || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  // Handle service operations
  const addService = async (service: Service) => {
    if (!product) return;
    try {
      setSaving(true);
      const response = await fetch(`/api/excursion-products/${id}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
      });

      if (!response.ok) throw new Error("Failed to add service");

      setServices([...services, service]);
    } catch (error) {
      console.error("Error adding service:", error);
    } finally {
      setSaving(false);
    }
  };

  const removeService = async (service: Service) => {
    if (!product) return;
    try {
      setSaving(true);
      const response = await fetch(
        `/api/excursion-products/${id}/services/${service._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove service");

      setServices(services.filter((s) => s._id !== service._id));
    } catch (error) {
      console.error("Error removing service:", error);
    } finally {
      setSaving(false);
    }
  };

  // Load product data on mount
  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Управление услугами</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Услуги для {product.title}
        </h2>
        {/* Services list */}
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="flex items-center justify-between p-4 border rounded"
            >
              <div>
                <h3 className="font-medium">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
                <p className="text-sm font-medium">{service.price} ₸</p>
              </div>
              <button
                onClick={() => removeService(service)}
                className="text-red-500 hover:text-red-700"
                disabled={saving}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
