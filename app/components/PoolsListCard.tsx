import React from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CircularProgress,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { truncateText } from "../utils";
import { prettifyAttoAlphAmount } from "@alephium/web3";
import { usePoolFields } from "../hooks/usePoolFields";
import { Countdown } from "./Countdown";

interface PoolsListCardProps {
  poolContractAddress: string;
}

export const PoolsListCard: React.FC<PoolsListCardProps> = ({
  poolContractAddress,
}) => {
  const { data: contractFields } = usePoolFields(poolContractAddress);

  const isFinished = new Date(Number(contractFields.end)) < new Date();

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="elevated"
      transition={"all 1s"}
      _hover={{
        transform: "scale(1.05)",
        transition: "all 1s",
      }}
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
                size={"70px"}
                value={
                  (Number(
                    prettifyAttoAlphAmount(contractFields.totalCollected),
                  ) /
                    Number(prettifyAttoAlphAmount(contractFields.goal))) *
                  100
                }
                thickness="12px"
              />
              <Text mt={2} textAlign={"right"}>
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
              <HStack>
                {contractFields.hasBeenWithdrawn && (
                  <Badge size={"lg"} variant="solid" colorScheme="orange">
                    Withdrawn
                  </Badge>
                )}
                {isFinished && (
                  <Badge size={"lg"} variant="solid" colorScheme="yellow">
                    Finished
                  </Badge>
                )}
              </HStack>
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
