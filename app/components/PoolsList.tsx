"use client";
import React, { useEffect, useState } from "react";
import { PoolInfos } from "../types";
import { getPools } from "../actions";
import { SimpleGrid } from "@chakra-ui/react";
import { PoolsListCard } from "./PoolsListCard";

interface PoolsListProps {}

export const PoolsList: React.FC<PoolsListProps> = () => {
  const [pools, setPools] = useState<PoolInfos[]>([]);

  useEffect(() => {
    const fetchPools = async () => {
      const pools = await getPools()
      setPools(pools);
    };
    fetchPools();
  }, []);

  return (
    <SimpleGrid columns={3} spacing={10}>
      {pools.map((pool) => (
        <PoolsListCard key={pool.id} name={pool.name} description={pool.description} poolContractAddress={pool.poolContractAddress} />
      ))}
    </SimpleGrid>
  );
};
