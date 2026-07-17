import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "estateflow-pro",
    version: "1.0.0",
    dataMode: process.env.NEXT_PUBLIC_DATA_MODE ?? "demo",
    timestamp: new Date().toISOString()
  }, { status: 200, headers: { "Cache-Control": "no-store" } });
}
