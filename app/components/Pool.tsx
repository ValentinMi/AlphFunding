import React, { useCallback, useEffect, useState } from "react";
import { Contributor } from "../types";
import { useWallet } from "@alephium/web3-react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Progress,
  Text,
} from "@chakra-ui/react";
import { Pool as PoolContract, PoolTypes } from "../../artifacts/ts";
import {
  Contribute as ContributeTransaction,
  Refund as RefundTransaction,
  Withdraw as WithdrawTransaction,
} from "artifacts/ts/scripts";
import { DUST_AMOUNT, hexToString, ONE_ALPH, web3 } from "@alephium/web3";
import { Contribute } from "./Contribute";
import { Countdown } from "./Countdown";
import { weiToAlph } from "../utils";
import { Refund } from "./Refund";
import { Contributors } from "./Contributors";

interface PoolProps {
  poolContractAddress: string;
}

export const Pool: React.FC<PoolProps> = ({ poolContractAddress }) => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [connectedAccountIsContributor, setConnectedAccountIsContributor] =
    useState<boolean>(false);
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

      const contributorsMap = new Map();

      contributors.events.forEach((log: any) => {
        const address = log.fields[0].value as string;
        const amount = BigInt(log.fields[1].value); // Ensure the amount is a bigint

        if (contributorsMap.has(address)) {
          // If the address is already in the map, sum the amounts
          contributorsMap.set(address, contributorsMap.get(address) + amount);
        } else {
          // If the address is not in the map, add it
          contributorsMap.set(address, amount);
        }
      });

      // Convert the map back to an array of objects
      const contributorsArray = Array.from(
        contributorsMap,
        ([address, amount]) => ({
          address,
          amount,
        }),
      );

      setContributors(contributorsArray);
    }
  }, []);

  const callContribute = async (amount: number) => {
    if (signer) {
      await ContributeTransaction.execute(signer, {
        initialFields: {
          pool: poolContractAddress,
          amount: ONE_ALPH * BigInt(amount),
        },
        // Add mapEntryDeposit (0.1 ALPH) if user never contributed to the pool
        attoAlphAmount: connectedAccountIsContributor
          ? ONE_ALPH * BigInt(amount)
          : ONE_ALPH * BigInt(amount) + ONE_ALPH / 10n,
      });

      await fetchContractFields();
      await fetchContributors();
    }
  };

  const callRefund = async () => {
    if (signer && connectedAccountIsContributor) {
      await RefundTransaction.execute(signer, {
        initialFields: {
          pool: poolContractAddress,
        },
        attoAlphAmount: DUST_AMOUNT * 2n,
      });

      await fetchContractFields();
      await fetchContributors();
    }
  };

  const callWithdraw = async () => {
    if (
      signer &&
      (account.address === contractFields.beneficiary ||
        account.address === contractFields.creator)
    ) {
      await WithdrawTransaction.execute(signer, {
        initialFields: {
          pool: poolContractAddress,
        },
        attoAlphAmount: DUST_AMOUNT * 2n,
      });
    }
  };

  useEffect(() => {
    if (account) {
      setConnectedAccountIsContributor(
        contributors.some(
          (contributor) => contributor.address === account.address,
        ),
      );
    }
  }, [account, contributors]);

  useEffect(() => {
    fetchContractFields();
  }, []);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  return (
    <Flex direction={"column"}>
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
            mt={2}
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
            <Text mt={2}>
              Pool creator:{" "}
              <Link
                isExternal
                href={`https://explorer.alephium.org/addresses/${contractFields.creator}`}
              >
                {contractFields.creator}
              </Link>
            </Text>
            <Text mt={2}>
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
                <Text mr={2}>Contributions ends in:</Text>{" "}
                <Countdown targetDate={new Date(Number(contractFields.end))} />
              </Flex>
            )}
          </Flex>
          <Progress
            hasStripe
            size="lg"
            colorScheme={"yellow"}
            value={
              (Number(contractFields.totalCollected) /
                Number(contractFields.goal)) *
              100
            }
            w={"100%"}
            mt={2}
          />
          <HStack spacing={3}>
            <Contribute
              callContribute={callContribute}
              connectedAccountIsContributor={connectedAccountIsContributor}
            />
            {connectedAccountIsContributor && (
              <Refund
                callRefund={callRefund}
                accountContributionAmount={
                  contributors.find((c) => c.address === account!.address)
                    ?.amount
                }
              />
            )}
          </HStack>
        </Flex>
      </Flex>
      <Box mt={4}>
        <Contributors contributors={contributors} />
      </Box>
    </Flex>
  );
};
