"use client";
import { Pool } from "../../components/Pool";
import { Layout } from "../../components/layout/Layout";

export default function Page({
  params,
}: {
  params: { contractAddress: string };
}) {
  return (
    <Layout>
      <Pool poolContractAddress={params.contractAddress} />
    </Layout>
  );
}
