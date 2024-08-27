import { web3 } from "@alephium/web3";
import { useQuery } from "@tanstack/react-query";
import { ContractEvents } from "@alephium/web3/src/api/api-alephium";

const fetchEvents = async (
  poolContractAddress: string,
): Promise<ContractEvents> => {
  const nodeProvider = web3.getCurrentNodeProvider();

  if (nodeProvider) {
    return await nodeProvider.events.getEventsContractContractaddress(
      poolContractAddress,
      {
        start: 0,
      },
    );
  } else {
    throw new Error("No node provider found");
  }
};

export const useEvents = (poolContractAddress: string) => {
  return useQuery<ContractEvents>({
    queryKey: ["events"],
    queryFn: () => fetchEvents(poolContractAddress),
    initialData: {
      events: [],
      nextStart: 0,
    },
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });
};
