import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const urlParts = request.url.split("/");
    const serviceId = urlParts.pop();
    const id = urlParts[urlParts.length - 2];

    if (!id || !serviceId) {
      return NextResponse.json(
        { error: "Invalid product or service ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db
      .collection("excursion-products")
      .updateOne(
        { _id: new ObjectId(id) },
        { $pull: { services: { _id: serviceId } as any } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Product not found or service not deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
} 