import React from "react";
import { Flex, StackDivider, Text, VStack } from "@chakra-ui/react";
import { sliceAddress } from "../utils";
import { Contributor } from "../types";

interface ContributorsProps {
  contributors: Contributor[];
}
export const Contributors: React.FC<ContributorsProps> = ({ contributors }) => {
  return (
    <VStack
      w={"50%"}
      border={"1px solid white"}
      p={1}
      divider={<StackDivider borderColor="gray.200" />}
      spacing={2}
    >
      {contributors.map((contributor) => (
        <Flex
          key={contributor.address}
          justifyContent={"space-between"}
          w={"100%"}
        >
          <Text>{sliceAddress(contributor.address)}</Text>
          <Text>{contributor.amount} ALPH</Text>
        </Flex>
      ))}
    </VStack>
  );
};
