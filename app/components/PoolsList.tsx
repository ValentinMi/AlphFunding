import React, { useEffect, useState } from "react";
import { PoolContract } from "../types";
import { getPools } from "../actions";
import { Box, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { PoolsListCard } from "./PoolsListCard";

interface PoolsListProps {}

export const PoolsList: React.FC<PoolsListProps> = () => {
  const [pools, setPools] = useState<PoolContract[]>([]);

  useEffect(() => {
    const fetchPools = async () => {
      const pools = await getPools();
      setPools(pools);
    };
    fetchPools();
  }, []);

  if (!pools.length)
    return (
      <Flex w={"100%"} justifyContent={"center"}>
        <Box w={"60%"}>
          <VStack spacing={5}>
            <Box>No pools available</Box>
          </VStack>
        </Box>
      </Flex>
    );

  return (
    <SimpleGrid
      columns={{
        base: 1,
        md: 2,
        lg: 3,
      }}
      spacing={10}
    >
      {pools.map((pool) => (
        <PoolsListCard
          key={pool.id}
          poolContractAddress={pool.contractAddress}
        />
      ))}
    </SimpleGrid>
  );
};
