import { useQuery } from "@tanstack/react-query";
import { Pool as PoolContract, PoolTypes } from "../../artifacts/ts";
import { hexToString } from "@alephium/web3";

const fetchPoolFields = async (poolContractAddress: string) => {
  const pool = PoolContract.at(poolContractAddress);

  const result = await pool.multicall({
    getName: {},
    getDescription: {},
    getBeneficiary: {},
    getCreator: {},
    getGoal: {},
    getEnd: {},
    getTotalCollected: {},
  });

  const fields: PoolTypes.Fields = {} as PoolTypes.Fields;

  fields.name = hexToString(result.getName.returns);
  fields.description = hexToString(result.getDescription.returns);
  fields.beneficiary = result.getBeneficiary.returns;
  fields.creator = result.getCreator.returns;
  fields.goal = result.getGoal.returns;
  fields.end = result.getEnd.returns;
  fields.totalCollected = result.getTotalCollected.returns;

  return fields;
};

export const usePoolFields = (poolContractAddress: string) => {
  return useQuery<PoolTypes.Fields>({
    queryKey: ["pool", poolContractAddress],
    queryFn: () => fetchPoolFields(poolContractAddress),
    initialData: {
      name: "",
      beneficiary: "",
      creator: "",
      goal: 0n,
      end: 0n,
      totalCollected: 0n,
      description: "",
    },
  });
};
