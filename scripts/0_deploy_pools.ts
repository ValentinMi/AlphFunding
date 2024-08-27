import { Pool, PoolTypes } from "../artifacts/ts";
import { faker } from "@faker-js/faker";
import { Settings } from "../alephium.config";
import { Deployer, DeployFunction } from "@alephium/cli";
import { PrismaClient } from "@prisma/client";
import {
  convertAlphAmountWithDecimals,
  stringToHex,
  ZERO_ADDRESS,
} from "@alephium/web3";

const NUMBER_OF_POOLS = 50;

const prisma = new PrismaClient();

const pools: PoolTypes.Fields[] = [];

const deployPools: DeployFunction<Settings> = async (deployer: Deployer) => {
  try {
    createPools();
    const deployedPoolsAddresses: string[] = [];

    for (const pool of pools) {
      const result = await deployPool(
        deployer,
        {
          initialFields: pool,
          alphAmount: pool.totalCollected + convertAlphAmountWithDecimals(0.1)!,
        },
        pools.indexOf(pool),
      );
      deployedPoolsAddresses.push(result.contractInstance.address);
    }

    for (const address of deployedPoolsAddresses) {
      await prisma.pool.create({
        data: {
          contractAddress: address,
        },
      });
    }

    console.log("Pools deployed successfully");
    console.log("Pools addresses: ", deployedPoolsAddresses);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

function createPools() {
  for (let i = 0; i < NUMBER_OF_POOLS; i++) {
    const goal = faker.number.int({ min: 10, max: 50 });
    const totalCollected = faker.number.int({ min: 10, max: goal });

    pools.push({
      totalCollected: convertAlphAmountWithDecimals(totalCollected)!,
      end: BigInt(faker.date.future().getTime()),
      goal: convertAlphAmountWithDecimals(goal)!,
      name: stringToHex(faker.company.name()),
      description: stringToHex(faker.lorem.paragraph(3)),
      beneficiary: process.env.BENEFIARY_ADDRESS || ZERO_ADDRESS,
      creator: process.env.CREATOR_ADDRESS || ZERO_ADDRESS,
      hasBeenWithdrawn: false,
    });

    // Edit the first pool to be finished
    pools[0].end = BigInt(faker.date.past().getTime());
    pools[0].totalCollected = pools[0].goal;
  }
}

async function deployPool(
  deployer: Deployer,
  params: {
    initialFields: PoolTypes.Fields;
    alphAmount: bigint;
  },
  index: number,
) {
  const result = await deployer.deployContract(
    Pool,
    {
      initialFields: params.initialFields,
      initialAttoAlphAmount: params.alphAmount,
    },
    "Pool" + index,
  );
  console.log("Pool contract address: " + result.contractInstance.address);
  return result;
}

export default deployPools;
