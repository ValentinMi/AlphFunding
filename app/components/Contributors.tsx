import React from "react";
import {
  Flex,
  Heading,
  Link,
  StackDivider,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { Contributor } from "../types";
import { prettifyAttoAlphAmount } from "@alephium/web3";

interface ContributorsProps {
  contributors: Contributor[];
}
export const Contributors: React.FC<ContributorsProps> = ({ contributors }) => {
  const { colorMode } = useColorMode();

  if (contributors.length === 0) {
    return (
      <Flex
        w={"100%"}
        textAlign={"center"}
        h={"200px"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text>No contributors yet</Text>
      </Flex>
    );
  }

  return (
    <Flex direction={"column"} alignItems={"center"} mt={8}>
      <Heading as={"h2"}>Contributors</Heading>
      <VStack
        borderWidth={1}
        borderStyle={"solid"}
        borderColor={colorMode === "light" ? "black" : "white"}
        py={2}
        px={1}
        divider={<StackDivider borderColor="gray.200" />}
        spacing={2}
        mt={6}
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
            <Text ml={6}>
              {prettifyAttoAlphAmount(contributor.amount)} ALPH
            </Text>
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
};
