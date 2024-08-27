import React from "react";
import { Box, Button, Flex, SimpleGrid, VStack } from "@chakra-ui/react";
import { PoolsListCard } from "./PoolsListCard";
import { usePools } from "../hooks/usePools";

interface PoolsListProps {}

export const PoolsList: React.FC<PoolsListProps> = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    usePools();

  const pools = data ? data.pages.flatMap((page) => page.data) : [];

  if (isLoading) {
    return (
      <Flex justifyContent={"center"}>
        <Box>Loading...</Box>
      </Flex>
    );
  }

  if (pools && !pools.length)
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
    <Flex flexDirection={"column"} alignItems={"center"}>
      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
          lg: 3,
        }}
        spacing={10}
      >
        {pools!.map((pool) => (
          <PoolsListCard
            key={pool.id}
            poolContractAddress={pool.contractAddress}
          />
        ))}
      </SimpleGrid>
      {hasNextPage && (
        <Button
          colorScheme={"yellow"}
          size={"lg"}
          variant={"outline"}
          color={"yellow.500"}
          borderColor={"yellow.500"}
          mt={6}
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          View more
        </Button>
      )}
    </Flex>
  );
};
