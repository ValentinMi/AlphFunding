import React, { useEffect, useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import {
  Contribute as ContributeTransaction,
  Refund as RefundTransaction,
  Withdraw as WithdrawTransaction,
} from "artifacts/ts/scripts";
import {
  convertAlphAmountWithDecimals,
  DUST_AMOUNT,
  prettifyAttoAlphAmount,
} from "@alephium/web3";
import { Contribute } from "./Contribute";
import { Countdown } from "./Countdown";
import { Refund } from "./Refund";
import { Contributors } from "./Contributors";
import { Withdraw } from "./Withdraw";
import { MdOutlineContentCopy } from "react-icons/md";
import { useContributors } from "../hooks/useContributors";
import { usePoolFields } from "../hooks/usePoolFields";

interface PoolProps {
  poolContractAddress: string;
}

export const Pool: React.FC<PoolProps> = ({ poolContractAddress }) => {
  const { data: contractFields } = usePoolFields(poolContractAddress);
  const [connectedAccountIsContributor, setConnectedAccountIsContributor] =
    useState<boolean>(false);
  const [currentTxId, setCurrentTxId] = useState<string>("");
  const { txStatus } = useTxStatus(currentTxId);

  const { signer, account } = useWallet();

  const { contributors, refetchContributors } =
    useContributors(poolContractAddress);

  const isEndReached = Number(contractFields.end) < Date.now();
  const isGoalReached = contractFields.totalCollected >= contractFields.goal;

  const toast = useToast();

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

      // await fetchContractFields();
      await refetchContributors();
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

      // await fetchContractFields();
      await refetchContributors();
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
    navigator.clipboard.writeText(value);
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
                  Array.from(contributors).find(
                    (c) => c.address === account.address,
                  )?.amount
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
