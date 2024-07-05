import React from "react";
import { Box, Flex, Heading, IconButton, useColorMode } from "@chakra-ui/react";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { Account } from "@alephium/web3";
import { sliceAddress } from "../../utils";
import NextLink from "next/link";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  const displayAccount = (account: Account) => {
    const address = account.address;
    return sliceAddress(address);
  };

  return (
    <Flex w={"100%"} justifyContent={"space-between"} p={3}>
      <Box as={NextLink} href={"/"}>
        <Heading>AlphPool</Heading>
      </Box>
      <Flex>
        <IconButton aria-label={"toto"} mr={3} icon={colorMode === "light" ? <MoonIcon/> : <SunIcon />} onClick={toggleColorMode} />
        <AlephiumConnectButton displayAccount={displayAccount} />
      </Flex>
    </Flex>
  );
};
