import React, { useCallback, useEffect, useState } from "react";
import { Contributor } from "../types";
import { useTxStatus, useWallet } from "@alephium/web3-react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Progress,
  Tag,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { Pool as PoolContract, PoolTypes } from "../../artifacts/ts";
import {
  Contribute as ContributeTransaction,
  Refund as RefundTransaction,
  Withdraw as WithdrawTransaction,
} from "artifacts/ts/scripts";
import {
  convertAlphAmountWithDecimals,
  DUST_AMOUNT,
  hexToString,
  prettifyAttoAlphAmount,
  web3,
} from "@alephium/web3";
import { Contribute } from "./Contribute";
import { Countdown } from "./Countdown";
import { Refund } from "./Refund";
import { Contributors } from "./Contributors";
import { Withdraw } from "./Withdraw";
import { MdOutlineContentCopy } from "react-icons/md";

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
  const [currentTxId, setCurrentTxId] = useState<string>("");
  const { txStatus } = useTxStatus(currentTxId);

  const { signer, account } = useWallet();

  const isEndReached = Number(contractFields.end) < Date.now();
  const isGoalReached = contractFields.totalCollected >= contractFields.goal;

  const { onCopy, setValue } = useClipboard("");
  const toast = useToast();

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
      const contributeResult = await ContributeTransaction.execute(signer, {
        initialFields: {
          pool: poolContractAddress,
          amount: convertAlphAmountWithDecimals(amount)!,
        },
        // Add mapEntryDeposit (0.1 ALPH) if user never contributed to the pool
        attoAlphAmount: connectedAccountIsContributor
          ? convertAlphAmountWithDecimals(amount)
          : convertAlphAmountWithDecimals(amount + 0.1)!,
      });

      setCurrentTxId(contributeResult.txId);

      await fetchContractFields();
      await fetchContributors();
    }
  };

  const callRefund = async () => {
    if (signer && connectedAccountIsContributor) {
      const refundResult = await RefundTransaction.execute(signer, {
        initialFields: {
          pool: poolContractAddress,
        },
        attoAlphAmount: DUST_AMOUNT * 2n,
      });

      setCurrentTxId(refundResult.txId);

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
      const withdrawResult = await WithdrawTransaction.execute(signer, {
        initialFields: {
          pool: poolContractAddress,
        },
        attoAlphAmount: DUST_AMOUNT * 2n,
      });

      setCurrentTxId(withdrawResult.txId);
    }
  };

  const handleCopy = (value: string) => {
    setValue(value);
    onCopy();
    toast({
      title: "Copied !",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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

  useEffect(() => {
    if (txStatus) {
      if (txStatus.type === "Confirmed") {
        toast({
          title: "Transaction confirmed",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else if (txStatus.type === "MemPooled") {
        toast({
          title: currentTxId,
          status: "loading",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [txStatus]);

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
                as={"span"}
                onClick={() => handleCopy(contractFields.beneficiary)}
              >
                {contractFields.beneficiary} <Icon as={MdOutlineContentCopy} />
              </Link>
            </Text>
            <Text mt={2}>
              Pool creator:{" "}
              <Link
                as={"span"}
                onClick={() => handleCopy(contractFields.creator)}
              >
                {contractFields.creator} <Icon as={MdOutlineContentCopy} />
              </Link>
            </Text>
            <Text mt={2}>
              Contract address:{" "}
              <Link as={"span"} onClick={() => handleCopy(poolContractAddress)}>
                {poolContractAddress} <Icon as={MdOutlineContentCopy} />
              </Link>
            </Text>
          </Flex>
          <Flex justifyContent={"space-between"} w={"100%"} mt={8}>
            <Text>
              {prettifyAttoAlphAmount(contractFields.totalCollected)} /{" "}
              {prettifyAttoAlphAmount(contractFields.goal)} ALPH
            </Text>
            {isEndReached ? (
              <Tag size={"lg"} variant="solid" colorScheme="teal">
                Finished
              </Tag>
            ) : (
              <Flex ml={4}>
                <Text mr={2}>ends in:</Text>{" "}
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
            {!isEndReached && (
              <Contribute
                callContribute={callContribute}
                connectedAccountIsContributor={connectedAccountIsContributor}
                isEndReached={isEndReached}
              />
            )}
            {connectedAccountIsContributor && !isEndReached && (
              <Refund
                callRefund={callRefund}
                accountContributionAmount={
                  account &&
                  contributors.find((c) => c.address === account.address)
                    ?.amount
                }
                isEndReached={isEndReached}
                isGoalReached={isGoalReached}
              />
            )}
            {account &&
              (account.address === contractFields.beneficiary ||
                account.address === contractFields.creator) && (
                <Withdraw
                  callWithdraw={callWithdraw}
                  isEndReached={isEndReached}
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
