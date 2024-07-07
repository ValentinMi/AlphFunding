import React, { useCallback, useEffect, useState } from "react";
import { Contributor } from "../types";
import { useWallet } from "@alephium/web3-react";
import { bigIntToNumber, weiToAlph } from "../utils";
import { Contributors } from "./Contributors";
import { Box, Flex, Link, Progress, Text } from "@chakra-ui/react";
import { Pool as PoolContract } from "../../artifacts/ts";
import { Contribute as ContributeTransaction } from "artifacts/ts/scripts";
import { ONE_ALPH, web3 } from "@alephium/web3";
import { Contribute } from "./Contribute";
import { Countdown } from "./Countdown";

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
  const { signer, account } = useWallet();

  const pool = PoolContract.at(poolContractAddress);

  const callContribute = async (amount: number) => {
    if (signer) {
      return await ContributeTransaction.execute(signer, {
        initialFields: {
          pool: poolContractAddress,
          amount: ONE_ALPH * BigInt(amount),
        },
        attoAlphAmount: ONE_ALPH * BigInt(amount) + ONE_ALPH / 10n,
      });
    }
  };

  const fetchContractData = useCallback(async () => {
    let data: any = await pool.view.getTotalCollected();
    setTotalCollected(weiToAlph(data.returns));

    data = await pool.view.getEnd();
    setEnd(bigIntToNumber(data.returns));

    data = await pool.view.getBeneficiary();
    setBeneficiary(data.returns);

    data = await pool.view.getCreator();
    setCreator(data.returns);

    data = await pool.view.getGoal();
    setGoal(bigIntToNumber(data.returns));

    const nodeProvider = web3.getCurrentNodeProvider();
    if (nodeProvider) {
      console.log("titi", nodeProvider);
      data = await nodeProvider.events.getEventsContractContractaddress(
        poolContractAddress,
        {
          start: 0,
        },
      );

      setContributors(
        data.events.map((log: any) => ({
          address: log.fields[0].value as string,
          amount: log.fields[1].value as bigint,
        })),
      );
    }
  }, [poolContractAddress]);

  const connectedAccountIsContributor = useCallback((): boolean => {
    if (!account) return false;

    return contributors.some(
      (contributor) => contributor.address === account.address,
    );
  }, [account, contributors]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  return (
    <Flex direction={"column"} alignItems={"flex-start"} px={3}>
      <Flex
        direction={"column"}
        alignItems={"flex-start"}
        justifyContent={"center"}
      >
        <Text>
          Beneficiary:{" "}
          <Link
            isExternal
            href={`https://explorer.alephium.org/addresses/${beneficiary}`}
          >
            {beneficiary}
          </Link>
        </Text>
        <Text>
          Pool creator:{" "}
          <Link
            isExternal
            href={`https://explorer.alephium.org/addresses/${creator}`}
          >
            {creator}
          </Link>
        </Text>
        <Text>
          Contract address:{" "}
          <Link
            isExternal
            href={`https://explorer.alephium.org/addresses/${poolContractAddress}`}
          >
            {poolContractAddress}
          </Link>
        </Text>
        <Flex justifyContent={"space-between"} w={"100%"} mt={2}>
          <Text>
            {totalCollected} / {goal} ALPH
          </Text>
          {!!end && (
            <Flex>
              <Text mr={2}>ends in:</Text>{" "}
              <Countdown targetDate={new Date(end)} />
            </Flex>
          )}
        </Flex>
        <Progress
          hasStripe
          value={(totalCollected / goal) * 100}
          w={"100%"}
          mt={2}
        />
      </Flex>
      <Contribute
        callContribute={callContribute}
        fetchContractData={fetchContractData}
        connectedAccountIsContributor={connectedAccountIsContributor()}
      />
      <Box mt={4}>
        <Contributors contributors={contributors} />
      </Box>
    </Flex>
  );
};
