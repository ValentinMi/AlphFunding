"use server";
import { CreatePoolParams, PoolInfos } from "./types";
import { prisma } from "./prisma";

export const getPools = async (): Promise<PoolInfos[]> => {
  try {
    return await prisma.pool.findMany();
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const createPool = async (
  poolParams: CreatePoolParams,
): Promise<PoolInfos | undefined> => {
  try {
    return await prisma.pool.create({
      data: {
        poolContractAddress: poolParams.poolContractAddress,
        name: poolParams.name,
        description: poolParams.description,
      },
    });
  } catch (e) {
    console.error(e);
  }
};
