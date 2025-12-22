import { NextRequest } from "next/server";
import { forwardRequest } from "@/lib/api";

export async function GET(req: NextRequest) {
  return forwardRequest(req, "transactions/balance-overview");
}