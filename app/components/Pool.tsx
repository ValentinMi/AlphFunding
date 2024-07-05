import React, { useCallback, useContext, useEffect, useState } from "react";
import { Contributor } from "../types";
import { useWallet } from "@alephium/web3-react";
import { ONE_ALPH } from "@alephium/web3";
import { bigIntToNumber } from "../utils";
import { Contribute } from "./Contribute";
import { Contributors } from "./Contributors";
import { Flex } from "@chakra-ui/react";
import { Pool as PoolContract } from "../../artifacts/ts";
import { NodeProviderContext } from "../contexts/NodeProvider";

interface PoolProps {
  poolContractAddress: string;
}

export const Pool: React.FC<PoolProps> = ({ poolContractAddress }) => {
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [beneficiary, setBeneficiary] = useState<string>("");
  const [creator, setCreator] = useState<string>("");
  const [goal, setGoal] = useState<number>(0);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const { signer } = useWallet();
  const { nodeProvider} = useContext(NodeProviderContext);

  const pool = PoolContract.at(poolContractAddress);

  const callContribute = async (amount: number) => {
    if (signer) {
      return await pool.transact.contribute({
        args: { amount: BigInt(amount) },
        signer,
        attoAlphAmount: ONE_ALPH * BigInt(amount),
      });
    }
  };

  // @ts-ignore
  const fetchContractData = useCallback(async () => {
    let data: any = await pool.view.getTotalCollected();
    setTotalCollected(bigIntToNumber(data.returns));

    data = await pool.view.getEnd();
    setEnd(bigIntToNumber(data.returns));

    data = await pool.view.getBeneficiary();
    setBeneficiary(data.returns);

    data = await pool.view.getCreator();
    setCreator(data.returns);

    data = await pool.view.getGoal();
    setGoal(bigIntToNumber(data.returns));

    data = await nodeProvider.events.getEventsContractContractaddress(
      poolContractAddress,
      {
        start: 0,
      },
    );

    setContributors(
      data.events.map((log: any) => ({
        address: log.fields[0].value as string,
        amount: log.fields[1].value as number,
      })),
    );
  }, [poolContractAddress]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  return (
    <Flex direction={"column"} alignItems={"flex-start"} px={3}>
      <Contribute
        goal={goal}
        totalCollected={totalCollected}
        end={end}
        callContribute={callContribute}
        fetchContractData={fetchContractData}
        beneficiary={beneficiary}
        creator={creator}
      />
      <Contributors contributors={contributors} />
    </Flex>
  );
};
