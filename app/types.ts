export type Contributor = {
  address: string;
  amount: bigint;
};

export type PoolInfos = {
  id: string;
  poolContractAddress: string;
  name: string;
  description: string;
};

export type CreatePoolParams = Omit<PoolInfos, "id">;
