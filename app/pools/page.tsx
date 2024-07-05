"use client";
import { Layout } from "../components/layout/Layout";
import { PoolsList } from "../components/PoolsList";

export default function Page({ params }: { params: { contractAddress: string } }) {
  return <Layout>
    <PoolsList />
  </Layout>
}