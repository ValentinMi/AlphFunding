import React from "react";
import { useKPIs } from "../hooks/useKPIs";
import {
  Divider,
  Flex,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { prettifyAttoAlphAmount } from "@alephium/web3";

interface KPIsProps {}

export const KPIs: React.FC<KPIsProps> = () => {
  const { data, isSuccess } = useKPIs();

  const KPIsList: Array<{ label: string; value: string }> = isSuccess
    ? [
        {
          label: "Active Pools",
          value: data.totalActivePools.toString(),
        },
        {
          label: "Total Pools",
          value: data.totalPools.toString(),
        },
        {
          label: "TVL",
          value: `${prettifyAttoAlphAmount(data.totalAlphTokenOnPools)} ALPH`,
        },
        {
          label: "Total distributed",
          value: `${prettifyAttoAlphAmount(data.totalAlphTokenDistributed)} ALPH`,
        },
      ]
    : [];

  return (
    <Flex direction={"column"} w={"100%"}>
      <StatGroup>
        {KPIsList.map((kpi) => (
          <Stat textAlign={"center"}>
            <StatLabel>{kpi.label}</StatLabel>
            <StatNumber>{kpi.value}</StatNumber>
          </Stat>
        ))}
      </StatGroup>
      <Divider mt={1} />
    </Flex>
  );
};
