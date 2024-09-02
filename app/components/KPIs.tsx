import React from "react";
import { useKPIs } from "../hooks/useKPIs";
import {
  Box,
  Divider,
  Flex,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { prettifyAttoAlphAmount } from "@alephium/web3";
import { useAlphPrice } from "../hooks/useAlphPrice";

interface KPIsProps {}

export const KPIs: React.FC<KPIsProps> = () => {
  const { data, isSuccess } = useKPIs();
  const { calculateAlphBagPrice } = useAlphPrice();

  const KPIsList: Array<{
    label: string;
    value: string;
    isTokenAmount?: boolean;
  }> = isSuccess
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
          value: prettifyAttoAlphAmount(data.totalAlphTokenOnPools),
          isTokenAmount: true,
        },
        {
          label: "Total distributed",
          value: prettifyAttoAlphAmount(data.totalAlphTokenDistributed),
          isTokenAmount: true,
        },
      ]
    : [];

  return (
    <Flex direction={"column"} w={"100%"}>
      <StatGroup alignItems={"flex-end"}>
        {KPIsList.map((kpi) => (
          <Stat textAlign={"center"} key={kpi.label}>
            <StatLabel>{kpi.label}</StatLabel>
            <StatNumber>
              {kpi.value} {kpi.isTokenAmount && "ALPH"}{" "}
              {kpi.isTokenAmount && (
                <Box as={"span"} fontSize={"sm"}>
                  (${calculateAlphBagPrice(Number(kpi.value.replace(",", "")))})
                </Box>
              )}
            </StatNumber>
          </Stat>
        ))}
      </StatGroup>
      <Divider mt={1} />
    </Flex>
  );
};
