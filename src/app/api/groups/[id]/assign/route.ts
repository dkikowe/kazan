import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Group } from "@/models/Group";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { excursionId, time } = await request.json();

    const group = await Group.findById(params.id);
    if (!group) {
      return NextResponse.json(
        { error: "Группа не найдена" },
        { status: 404 }
      );
    }

    group.excursion = excursionId;
    group.time = time;
    await group.save();

    return NextResponse.json(group);
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка при назначении группы" },
      { status: 500 }
    );
  }
} 