import { PoolsKPIs } from "../../../types";
import { prisma } from "../../../prisma";
import { NodeProvider, web3 } from "@alephium/web3";
import { Pool } from "../../../../artifacts/ts";

const nodeUrl = process.env.NEXT_PUBLIC_NODE_URL;
const nodeProvider = new NodeProvider(nodeUrl!);
web3.setCurrentNodeProvider(nodeProvider);

export async function GET() {
  const pools = await prisma.pool.findMany({});

  const kpis: PoolsKPIs = {
    totalPools: pools.length,
    totalActivePools: 0,
    totalAlphTokenOnPools: BigInt(0),
    totalAlphTokenDistributed: BigInt(0),
  };

  for (const pool of pools) {
    const poolContract = Pool.at(pool.contractAddress);
    const result = await poolContract.multicall({
      getTotalCollected: {},
      getHasBeenWithdrawn: {},
    });

    kpis.totalAlphTokenOnPools += result.getTotalCollected.returns;

    if (result.getHasBeenWithdrawn.returns) {
      kpis.totalAlphTokenDistributed += result.getTotalCollected.returns;
    } else {
      kpis.totalActivePools += 1;
    }
  }

  return Response.json(kpis);
}
