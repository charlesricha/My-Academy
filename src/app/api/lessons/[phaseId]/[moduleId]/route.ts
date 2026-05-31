import { getLessonContent } from "@/lib/lessons";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ phaseId: string; moduleId: string }> }
) {
  const { phaseId, moduleId } = await params;
  const content = await getLessonContent(phaseId, moduleId);
  
  return NextResponse.json({ content });
}
