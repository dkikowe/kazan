import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { ExcursionProduct } from "@/models/excursion-product";

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI || '');
};

// GET /api/excursion-products
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const products = await ExcursionProduct.find()
      .populate('excursionCard')
      .sort({ createdAt: -1 });
    
    return new Response(
      JSON.stringify(products),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching excursion products:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch excursion products" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST /api/excursion-products
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();

    const product = await ExcursionProduct.create(data);
    
    return new Response(
      JSON.stringify(product),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error creating excursion product:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create excursion product" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
} 