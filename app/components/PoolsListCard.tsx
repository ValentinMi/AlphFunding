import React, { useEffect, useState } from "react";
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
import { Pool, PoolTypes } from "../../artifacts/ts";
import { truncateText } from "../utils";
import { Countdown } from "./Countdown";
import { hexToString, prettifyAttoAlphAmount } from "@alephium/web3";

interface PoolsListCardProps {
  poolContractAddress: string;
}

type PoolListCardFields = Omit<PoolTypes.Fields, "beneficiary" | "creator">;

export const PoolsListCard: React.FC<PoolsListCardProps> = ({
  poolContractAddress,
}) => {
  const [contractFields, setContractFields] = useState<PoolListCardFields>({
    totalCollected: 0n,
    end: 0n,
    goal: 0n,
    name: "",
    description: "",
  });

  const pool = Pool.at(poolContractAddress);

  const fetchContractFields = async () => {
    const fields: PoolListCardFields = {} as any;

    let data: any = await pool.view.getTotalCollected();
    fields.totalCollected = data.returns;

    data = await pool.view.getEnd();
    fields.end = data.returns;

    data = await pool.view.getGoal();
    fields.goal = data.returns;

    data = await pool.view.getName();
    fields.name = hexToString(data.returns);

    data = await pool.view.getDescription();
    fields.description = hexToString(data.returns);

    setContractFields(fields);
  };

  const isFinished = new Date(Number(contractFields.end)) < new Date();

  useEffect(() => {
    fetchContractFields();
  }, [fetchContractFields]);

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
