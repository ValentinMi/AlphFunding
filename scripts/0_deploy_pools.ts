import { Pool, PoolTypes } from "../artifacts/ts";
import { faker } from "@faker-js/faker";
import { Settings } from "../alephium.config";
import { Deployer, DeployFunction } from "@alephium/cli";
import { PrismaClient } from "@prisma/client";
import { convertAlphAmountWithDecimals, stringToHex } from "@alephium/web3";

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
      creator: "19jG4CADXWwdaCntVn3qteRUVYmJQxqDHkqyUHERZKwWr",
      beneficiary: "1ABRcKYMz6wDX5p1A48m1kZcYLHq2dNEAcqJsKp6w1J2i",
    });
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
