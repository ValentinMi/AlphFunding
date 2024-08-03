import React from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CircularProgress,
  Flex,
  Heading,
  Link,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { PoolTypes } from "../../artifacts/ts";
import { truncateText } from "../utils";
import { Countdown } from "./Countdown";
import { prettifyAttoAlphAmount } from "@alephium/web3";
import { usePoolFields } from "../hooks/usePool";

interface PoolsListCardProps {
  poolContractAddress: string;
}

type PoolListCardFields = Omit<PoolTypes.Fields, "beneficiary" | "creator">;

export const PoolsListCard: React.FC<PoolsListCardProps> = ({
  poolContractAddress,
}) => {
  const { data: contractFields } = usePoolFields(poolContractAddress);

  const isFinished = new Date(Number(contractFields.end)) < new Date();

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      boxShadow={"md"}
      borderColor={"yellow.500"}
      borderWidth={2}
      backgroundColor={"rgba(255, 255, 255, 0.1)"}
    >
      <Stack w={"100%"}>
        <CardBody>
          <Flex w={"100%"} justifyContent={"space-between"}>
            <Box w={"80%"}>
              <Heading size="md">{contractFields.name}</Heading>
              <Text py="2" mt={2}>
                {truncateText(contractFields.description, 150)}
              </Text>
            </Box>
            <Flex direction={"column"} alignItems={"flex-end"}>
              <CircularProgress
                color={"yellow.500"}
                value={
                  (Number(
                    prettifyAttoAlphAmount(contractFields.totalCollected),
                  ) /
                    Number(prettifyAttoAlphAmount(contractFields.goal))) *
                  100
                }
                thickness="12px"
              />
              <Text mt={1} textAlign={"right"}>
                {prettifyAttoAlphAmount(contractFields.totalCollected)} /{" "}
                {prettifyAttoAlphAmount(contractFields.goal)} ALPH
              </Text>
            </Flex>
          </Flex>
        </CardBody>
        <CardFooter>
          <Flex
            justifyContent={"space-between"}
            alignItems={"flex-end"}
            w={"100%"}
          >
            <Link as={NextLink} href={`/pools/${poolContractAddress}`}>
              <Button
                variant="outline"
                colorScheme="yellow"
                color={"yellow.500"}
                borderColor={"yellow.500"}
              >
                View
              </Button>
            </Link>
            {isFinished ? (
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
        </CardFooter>
      </Stack>
    </Card>
  );
};
