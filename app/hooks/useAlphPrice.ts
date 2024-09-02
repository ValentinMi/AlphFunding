import { useQuery } from "@tanstack/react-query";

export const useAlphPrice = () => {
  const query = useQuery<{ price: number }>({
    queryKey: ["alphPrice"],
    queryFn: async () => {
      const res = await fetch("/api/alphprice");
      return await res.json();
    },
    refetchInterval: 1000 * 60 * 5,
  });

  const calculateAlphBagPrice = (bag: number) => {
    if (!query.isSuccess) return 0;

    return (bag * query.data.price).toFixed(2);
  };

  return { ...query, calculateAlphBagPrice };
};
