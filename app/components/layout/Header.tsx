import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { Account } from "@alephium/web3";
import { sliceAddress } from "../../utils";
import NextLink from "next/link";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const displayAccount = (account: Account) => {
    const address = account.address;
    return sliceAddress(address);
  };

  return (
    <Flex w={"100%"} justifyContent={"space-between"} p={3}>
      <Box as={NextLink} href={"/"}><Heading>AlphPool</Heading></Box>
      <AlephiumConnectButton displayAccount={displayAccount} />
    </Flex>
  );
};
