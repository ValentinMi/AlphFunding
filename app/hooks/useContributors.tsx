import { useEvents } from "./useEvents";
import { useMemo } from "react";
import { Contributor } from "../types";

export const useContributors = (poolContractAddress: string) => {
  const {
    data: contractEvents,
    isSuccess,
    refetch,
  } = useEvents(poolContractAddress);

  const contributors: Contributor[] = useMemo(() => {
    if (!isSuccess) return [];

    const contributorsMap = new Map<string, bigint>();

    for (const event of contractEvents.events) {
      const address = event.fields[0].value as string;
      const amount = BigInt(event.fields[1].value as string);
      const isRefundEvent = event.eventIndex === 1;

      if (contributorsMap.has(address)) {
        if (isRefundEvent) {
          contributorsMap.delete(address);
        } else {
          contributorsMap.set(address, contributorsMap.get(address)! + amount);
        }
      } else {
        contributorsMap.set(address, amount);
      }
    }

    return Array.from(contributorsMap, ([address, amount]) => ({
      address,
      amount,
    }));
  }, [isSuccess, contractEvents]);

  return { contributors, refetchContributors: refetch };
};
