import React from "react";
import { Box, Flex, Link, StackDivider, Text, VStack } from "@chakra-ui/react";
import { Contributor } from "../types";

interface ContributorsProps {
  contributors: Contributor[];
}
export const Contributors: React.FC<ContributorsProps> = ({ contributors }) => {
  if (contributors.length === 0) {
    return (
      <Box w={"100%"} textAlign={"center"}>
        <Text>No contributors yet</Text>
      </Box>
    );
  }

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
          <Text>
            <Link
              isExternal
              href={`https://explorer.alephium.org/addresses/${contributor.address}`}
            >
              {contributor.address}
            </Link>
          </Text>
          <Text>{contributor.amount} ALPH</Text>
        </Flex>
      ))}
    </VStack>
  );
};
