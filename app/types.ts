export type Contributor = {
  address: string;
  amount: bigint;
};

export type PoolContract = {
  id: number;
  contractAddress: string;
};

export type PaginatedPoolContract = {
  data: PoolContract[];
  nextCursor: number | null;
  prevCursor: number | null;
};

export type CreatePoolContract = Omit<PoolContract, "id">;
