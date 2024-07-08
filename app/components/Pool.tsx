import React, { useCallback, useEffect, useState } from "react";
import { Contributor } from "../types";
import { useWallet } from "@alephium/web3-react";
import { Contributors } from "./Contributors";
import { Box, Flex, Heading, Link, Progress, Text } from "@chakra-ui/react";
import { Pool as PoolContract, PoolTypes } from "../../artifacts/ts";
import { Contribute as ContributeTransaction } from "artifacts/ts/scripts";
import { hexToString, ONE_ALPH, web3 } from "@alephium/web3";
import { Contribute } from "./Contribute";
import { Countdown } from "./Countdown";
import { weiToAlph } from "../utils";

interface PoolProps {
  poolContractAddress: string;
}

export const Pool: React.FC<PoolProps> = ({ poolContractAddress }) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [contractFields, setContractFields] = useState<PoolTypes.Fields>({
    name: "",
    beneficiary: "",
    creator: "",
    goal: 10n,
    end: 0n,
    totalCollected: 0n,
    description: "",
  });
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

  const fetchContractFields = async () => {
    try {
      const fields: PoolTypes.Fields = {} as PoolTypes.Fields;

      let data: any;

      data = await pool.view.getName();
      fields.name = hexToString(data.returns);

      data = await pool.view.getDescription();
      fields.description = hexToString(data.returns);

      data = await pool.view.getBeneficiary();
      fields.beneficiary = data.returns;

      data = await pool.view.getCreator();
      fields.creator = data.returns;

      data = await pool.view.getGoal();
      fields.goal = data.returns;

      data = await pool.view.getEnd();
      fields.end = data.returns;

      data = await pool.view.getTotalCollected();
      fields.totalCollected = data.returns;

      setContractFields(fields);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchContributors = useCallback(async () => {
    const nodeProvider = web3.getCurrentNodeProvider();
    if (nodeProvider) {
      const contributors =
        await nodeProvider.events.getEventsContractContractaddress(
          poolContractAddress,
          {
            start: 0,
          },
        );

      setContributors(
        contributors.events.map((log: any) => ({
          address: log.fields[0].value as string,
          amount: log.fields[1].value as bigint,
        })),
      );
    }
  }, []);

  const connectedAccountIsContributor = useCallback((): boolean => {
    if (!account) return false;

    return contributors.some(
      (contributor) => contributor.address === account.address,
    );
  }, [account, contributors]);

  useEffect(() => {
    fetchContractFields();
  }, []);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  return (
    <Flex px={3} direction={{ base: "column", lg: "row" }}>
      <Flex direction={"column"} w={"50%"}>
        <Heading>{contractFields.name}</Heading>
        <Text mt={8} maxW={"90%"}>
          {contractFields.description}
        </Text>
      </Flex>
      <Flex direction={"column"} w={"50%"}>
        <Flex
          direction={"column"}
          alignItems={"flex-start"}
          justifyContent={"center"}
          mt={8}
        >
          <Text>
            Beneficiary:{" "}
            <Link
              isExternal
              href={`https://explorer.alephium.org/addresses/${contractFields.beneficiary}`}
            >
              {contractFields.beneficiary}
            </Link>
          </Text>
          <Text>
            Pool creator:{" "}
            <Link
              isExternal
              href={`https://explorer.alephium.org/addresses/${contractFields.creator}`}
            >
              {contractFields.creator}
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
        </Flex>
        <Flex justifyContent={"space-between"} w={"100%"} mt={8}>
          <Text>
            {Number(weiToAlph(contractFields.totalCollected))} /{" "}
            {Number(weiToAlph(contractFields.goal))} ALPH
          </Text>
          {!!contractFields.end && (
            <Flex>
              <Text mr={2}>ends in:</Text>{" "}
              <Countdown targetDate={new Date(Number(contractFields.end))} />
            </Flex>
          )}
        </Flex>
        <Progress
          hasStripe
          value={
            (Number(contractFields.totalCollected) /
              Number(contractFields.goal)) *
            100
          }
          w={"100%"}
          mt={2}
        />
        <Contribute
          callContribute={callContribute}
          fetchContractFields={fetchContractFields}
          connectedAccountIsContributor={connectedAccountIsContributor()}
        />
        <Box mt={4}>
          <Contributors contributors={contributors} />
        </Box>
      </Flex>
    </Flex>
  );
};
