import { useQuery } from "@tanstack/react-query";
import { PoolsKPIs } from "../types";

export const useKPIs = () => {
  return useQuery<PoolsKPIs>({
    queryKey: ["kpis"],
    queryFn: async () => {
      const res = await fetch("/api/pools/kpis", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await res.json();
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });
};
