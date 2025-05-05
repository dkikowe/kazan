import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// GET /api/filter-groups/[id]
export async function GET(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid filter group ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const filterGroup = await db
      .collection("filter-groups")
      .findOne({ _id: new ObjectId(id) });

    if (!filterGroup) {
      return NextResponse.json(
        { error: "Filter group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(filterGroup);
  } catch (error) {
    console.error("Error fetching filter group:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter group" },
      { status: 500 }
    );
  }
}

// PUT /api/filter-groups/[id]
export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid filter group ID" },
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
      .collection("filter-groups")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Filter group not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating filter group:", error);
    return NextResponse.json(
      { error: "Failed to update filter group" },
      { status: 500 }
    );
  }
}

// DELETE /api/filter-groups/[id]
export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid filter group ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db
      .collection("filter-groups")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Filter group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting filter group:", error);
    return NextResponse.json(
      { error: "Failed to delete filter group" },
      { status: 500 }
    );
  }
} 