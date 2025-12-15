import { NextRequest, NextResponse } from "next/server";
import { initializeSocket } from "@/lib/socket-server";

export const dynamic = "force-dynamic";

// This is a workaround for Next.js 16 App Router
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Socket endpoint" });
}
