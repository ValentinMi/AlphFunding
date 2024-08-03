import React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { Account } from "@alephium/web3";
import { sliceAddress } from "../../utils";
import NextLink from "next/link";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

interface HeaderProps {}

const NAV_MENU_LINKS = [
  {
    name: "Pools",
    href: "/pools",
  },
  {
    name: "Create",
    href: "/pools/create",
  },
  {
    name: "User guide",
    href: "/guide",
  },
];

export const Header: React.FC<HeaderProps> = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const displayAccount = (account: Account) => {
    const address = account.address;
    return sliceAddress(address);
  };

  return (
    <Flex w={"100%"} justifyContent={"space-between"} p={3} h={"10vh"}>
      <Flex alignItems={"baseline"}>
        <Box as={NextLink} href={"/"}>
          <Heading>
            Alph
            <Box as={"span"} color={"yellow.500"}>
              Pool
            </Box>
          </Heading>
        </Box>
        <HStack ml={10} spacing={8} as={"nav"}>
          {NAV_MENU_LINKS.map((link) => (
            <Link key={link.href} as={NextLink} href={link.href}>
              {link.name}
            </Link>
          ))}
        </HStack>
      </Flex>
      <Flex>
        <IconButton
          aria-label={colorMode === "light" ? "Dark mode" : "Light mode"}
          mr={3}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
        <AlephiumConnectButton displayAccount={displayAccount} />
      </Flex>
    </Flex>
  );
};
