import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ExcursionCard } from "@/models/excursion-card";
import CommercialExcursion from '@/models/CommercialExcursion';

// Подключение к MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

// GET /api/excursions/[id]
export async function GET(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid excursion ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const excursion = await db
      .collection("excursions")
      .findOne({ _id: new ObjectId(id) });

    if (!excursion) {
      return NextResponse.json(
        { error: "Excursion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(excursion);
  } catch (error) {
    console.error("Error fetching excursion:", error);
    return NextResponse.json(
      { error: "Failed to fetch excursion" },
      { status: 500 }
    );
  }
}

// PUT /api/excursions/[id]
export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid excursion ID" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db
      .collection("excursions")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Excursion not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating excursion:", error);
    return NextResponse.json(
      { error: "Failed to update excursion" },
      { status: 500 }
    );
  }
}

// DELETE /api/excursions/[id]
export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid excursion ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db
      .collection("excursions")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Excursion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting excursion:", error);
    return NextResponse.json(
      { error: "Failed to delete excursion" },
      { status: 500 }
    );
  }
} 