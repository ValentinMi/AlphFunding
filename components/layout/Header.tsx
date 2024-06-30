import React from "react";
import { Flex, Heading } from "@chakra-ui/react";
import { AlephiumConnectButton } from "@alephium/web3-react";
import { Account } from "@alephium/web3";
import { sliceAddress } from "../../utils";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const displayAccount = (account: Account) => {
    const address = account.address;
    return sliceAddress(address);
  };

  return (
    <Flex w={"100%"} justifyContent={"space-between"} p={3}>
      <Heading>AlphPool</Heading>
      <AlephiumConnectButton displayAccount={displayAccount} />
    </Flex>
  );
};
