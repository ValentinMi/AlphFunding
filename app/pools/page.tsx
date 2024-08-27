"use client";
import { Layout } from "../components/layout/Layout";
import { PoolsList } from "../components/PoolsList";
import { KPIs } from "../components/KPIs";
import { Box } from "@chakra-ui/react";

export default function Page({
  params,
}: {
  params: { contractAddress: string };
}) {
  return (
    <Layout>
      <Box mb={5}>
        <KPIs />
      </Box>
      <PoolsList />
    </Layout>
  );
}
