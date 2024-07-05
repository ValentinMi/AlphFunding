"use server";
import { PoolInfos } from "./types";
import { prisma } from "./prisma";

export async function getPools(): Promise<PoolInfos[]> {
  try {
    return await prisma.pool.findMany()
  } catch (e) {
    console.error(e)
    return []
  }
}