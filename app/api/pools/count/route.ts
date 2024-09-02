import { NextRequest } from "next/server";
import { prisma } from "../../../prisma";

export async function GET(request: NextRequest) {
  const poolsCount = await prisma.pool.count();

  return Response.json({ poolsCount });
}
