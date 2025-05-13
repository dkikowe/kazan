import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Group } from "@/models/Group";
import { Tourist } from "@/models/Tourist";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const excursionId = searchParams.get('excursionId');
    
    let query = {};
    if (excursionId) {
      query = { excursion: excursionId };
    }
    
    const groups = await Group.find(query)
      .populate('excursion', 'title')
      .populate('guide', 'name phone')
      .sort({ date: 1 });
      
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Ошибка при получении групп:", error);
    return NextResponse.json(
      { error: "Ошибка при получении групп" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const group = await Group.create(body);
    return NextResponse.json(group);
  } catch (error) {
    console.error("Ошибка при создании группы:", error);
    return NextResponse.json(
      { error: "Ошибка при создании группы" },
      { status: 500 }
    );
  }
} 