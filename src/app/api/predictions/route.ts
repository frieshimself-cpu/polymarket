import { NextResponse } from "next/server";
import { getOracleReport } from "@/lib/engine";

// Public JSON feed of the oracle's current board — build bots on it.
// Same cached report the page renders; at most one oracle run per window.
export const revalidate = 1800;

export async function GET() {
  const report = await getOracleReport();
  return NextResponse.json(report, {
    headers: {
      "cache-control": "public, s-maxage=300, stale-while-revalidate=1800",
      "access-control-allow-origin": "*",
    },
  });
}
