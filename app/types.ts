export type Contributor = {
  address: string;
  amount: bigint;
};

export type PoolContract = {
  id: number;
  contractAddress: string;
};

export type CreatePoolContract = Omit<PoolContract, "id">;
