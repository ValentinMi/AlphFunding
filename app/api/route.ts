import { NextRequest } from "next/server";
import { prisma } from "../prisma";
import { PaginatedPoolContract } from "../types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");

  const pools = await prisma.pool.findMany(
    page
      ? {
          take: 10,
          skip: Number(page) * 10,
        }
      : undefined,
  );

  const response: PaginatedPoolContract = {
    data: pools,
    nextCursor: pools.length === 10 ? Number(page) + 1 : null,
    prevCursor: page ? Number(page) - 1 : null,
  };

  return Response.json(response);
}
