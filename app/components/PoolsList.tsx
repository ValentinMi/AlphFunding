import React, { useEffect } from "react";
import { Box, Flex, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { PoolsListCard } from "./PoolsListCard";
import { usePools } from "../hooks/usePools";

interface PoolsListProps {}

export const PoolsList: React.FC<PoolsListProps> = () => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage } = usePools();

  const pools = data ? data.pages.flatMap((page) => page.data) : [];

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.offsetHeight
      ) {
        await fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      {isFetchingNextPage && (
        <Flex justifyContent={"center"}>
          <Text>Loading more...</Text>
        </Flex>
      )}
    </Flex>
  );
};
