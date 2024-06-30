import React, { useEffect, useState } from "react";
import { Contributor } from "../types";
import { useWallet } from "@alephium/web3-react";
import { NodeProvider, ONE_ALPH, web3 } from "@alephium/web3";
import { bigIntToNumber } from "../utils";
import { Contribute } from "./Contribute";
import { Contributors } from "./Contributors";
import { Flex } from "@chakra-ui/react";
import { Pool as PoolContract } from "../artifacts/ts";

interface PoolProps {}

export const Pool: React.FC<PoolProps> = () => {
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [end, setEnd] = useState<number>(null);
  const [owner, setOwner] = useState<string>(null);
  const [goal, setGoal] = useState<number>(0);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const { signer } = useWallet();

  const nodeUrl = process.env.NEXT_PUBLIC_NODE_URL;
  const nodeProvider = new NodeProvider(nodeUrl);
  web3.setCurrentNodeProvider(nodeProvider);
  const poolAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const pool = PoolContract.at(poolAddress);

  const callContribute = async (amount: number) => {
    if (signer) {
      return await pool.transact.contribute({
        args: { amount: BigInt(amount) },
        signer,
        attoAlphAmount: ONE_ALPH * BigInt(amount),
      });
    }
  };

  const fetchContractData = async () => {
    let data: any = await pool.view.getTotalCollected();
    setTotalCollected(bigIntToNumber(data.returns));

    data = await pool.view.getEnd();
    setEnd(bigIntToNumber(data.returns));

    data = await pool.view.getOwner();
    setOwner(data.returns);

    data = await pool.view.getGoal();
    setGoal(bigIntToNumber(data.returns));

    const logs = await nodeProvider.events.getEventsContractContractaddress(
      poolAddress,
      {
        start: 0,
      },
    );

    setContributors(
      logs.events.map((log) => ({
        address: log.fields[0].value as string,
        amount: log.fields[1].value as number,
      })),
    );
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  return (
    <Flex direction={"column"} alignItems={"flex-start"} px={3}>
      <Contribute
        goal={goal}
        totalCollected={totalCollected}
        end={end}
        callContribute={callContribute}
        fetchContractData={fetchContractData}
        owner={owner}
      />
      <Contributors contributors={contributors} />
    </Flex>
  );
};
