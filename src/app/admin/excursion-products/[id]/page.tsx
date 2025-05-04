"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Users,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { ExcursionProduct } from "@/models/excursion-product";
import { connectToDatabase } from "@/lib/mongodb";

interface NavigationButtonsProps {
  id: string;
  title: string;
}

function NavigationButtons({ id, title }: NavigationButtonsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold">Товар: {title}</h1>
      <Button
        variant="outline"
        onClick={() => router.push(`/admin/excursion-products/${id}/edit`)}
      >
        <Pencil className="h-4 w-4 mr-2" />
        Редактировать
      </Button>
    </div>
  );
}

interface DateRange {
  start: string;
  end: string;
}

interface Ticket {
  type: string;
  price: number;
}

interface MeetingPoint {
  location: string;
  time: string;
}

interface PaymentOption {
  type: string;
  description: string;
}

interface Group {
  minSize: number;
  maxSize: number;
  price: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  await connectToDatabase();
  const product = await ExcursionProduct.findById(id).populate("excursionCard");

  if (!product) {
    throw new Error("Product not found");
  }

  return (
    <div className="container mx-auto py-8">
      <NavigationButtons id={id} title={product.excursionCard.title} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Периоды продаж</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.dateRanges.map((range: DateRange, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(range.start).toLocaleDateString()} -{" "}
                    {new Date(range.end).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Билеты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.tickets.map((ticket: Ticket, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span>{ticket.type}</span>
                  <span className="font-medium">{ticket.price} ₽</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Места встречи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.meetingPoints.map(
                (point: MeetingPoint, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{point.location}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{point.time}</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Способы оплаты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.paymentOptions.map(
                (option: PaymentOption, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">{option.type}</span>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">
                      {option.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Группы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.groups.map((group: Group, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {group.minSize} - {group.maxSize} человек
                  </span>
                  <span className="font-medium ml-auto">{group.price} ₽</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статус публикации</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {product.isPublished ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Опубликован</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Не опубликован</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
