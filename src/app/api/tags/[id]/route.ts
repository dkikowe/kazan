import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tags/[id]
export async function GET(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid tag ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const tag = await db
      .collection("tags")
      .findOne({ _id: new ObjectId(id) });

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json(
      { error: "Failed to fetch tag" },
      { status: 500 }
    );
  }
}

// PUT /api/tags/[id]
export async function PUT(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid tag ID" },
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
      .collection("tags")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Tag not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id]
export async function DELETE(request: NextRequest) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Invalid tag ID" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Database connection not established");
    }

    const result = await db
      .collection("tags")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
} 