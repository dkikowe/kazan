import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// GET /api/filter-items/[id]
export async function GET(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid filter item ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const filterItem = await db
      .collection("filter-items")
      .findOne({ _id: new ObjectId(id) });

    if (!filterItem) {
      return NextResponse.json(
        { error: "Filter item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(filterItem);
  } catch (error) {
    console.error("Error fetching filter item:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter item" },
      { status: 500 }
    );
  }
}

// PUT /api/filter-items/[id]
export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid filter item ID" },
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
      .collection("filter-items")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Filter item not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating filter item:", error);
    return NextResponse.json(
      { error: "Failed to update filter item" },
      { status: 500 }
    );
  }
}

// DELETE /api/filter-items/[id]
export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid filter item ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db
      .collection("filter-items")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Filter item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting filter item:", error);
    return NextResponse.json(
      { error: "Failed to delete filter item" },
      { status: 500 }
    );
  }
} 