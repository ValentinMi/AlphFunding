import React, { useCallback, useEffect, useState } from "react";
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
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Pool } from "../../artifacts/ts";
import { bigIntToNumber, truncateText, weiToAlph } from "../utils";
import { Countdown } from "./Countdown";

interface PoolsListCardProps {
  name: string;
  description: string;
  poolContractAddress: string;
}

export const PoolsListCard: React.FC<PoolsListCardProps> = ({
  name,
  description,
  poolContractAddress,
}) => {
  const [totalCollected, setTotalCollected] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [goal, setGoal] = useState<number>(0);

  const pool = Pool.at(poolContractAddress);

  const fetchContractData = useCallback(async () => {
    let data: any = await pool.view.getTotalCollected();
    setTotalCollected(weiToAlph(BigInt(data.returns)));

    data = await pool.view.getEnd();
    setEnd(bigIntToNumber(data.returns));

    data = await pool.view.getGoal();
    setGoal(bigIntToNumber(data.returns));
  }, [poolContractAddress]);

  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
    >
      <Stack w={"100%"}>
        <CardBody>
          <Flex w={"100%"} justifyContent={"space-between"}>
            <Box w={"80%"}>
              <Heading size="md">{name}</Heading>
              <Text py="2">{truncateText(description, 150)}</Text>
            </Box>
            <Flex direction={"column"} alignItems={"center"}>
              <CircularProgress
                value={(totalCollected / goal) * 100}
                thickness="12px"
              />
              <Text mt={1}>
                {totalCollected}/{goal} ALPH
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
              <Button variant="solid" colorScheme="blue">
                View
              </Button>
            </Link>
            {!!end && (
              <Flex ml={4}>
                <Text mr={2}>ends in:</Text>{" "}
                <Countdown targetDate={new Date(end)} />
              </Flex>
            )}
          </Flex>
        </CardFooter>
      </Stack>
    </Card>
  );
};
