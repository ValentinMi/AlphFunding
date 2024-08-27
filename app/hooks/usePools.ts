import { useInfiniteQuery } from "@tanstack/react-query";
import { PaginatedPoolContract } from "../types";

const fetchPaginatedPools = async ({
  pageParam = 0,
}): Promise<PaginatedPoolContract> => {
  const res = await fetch(`/api/pools?page=${pageParam}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await res.json();
};

export const usePools = () => {
  return useInfiniteQuery<PaginatedPoolContract>({
    queryKey: ["pools"],
    queryFn: ({ pageParam }) =>
      fetchPaginatedPools({ pageParam: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor,
  });
};
