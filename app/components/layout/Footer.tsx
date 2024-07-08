"use client";
import { Flex, Text } from "@chakra-ui/react";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <Flex alignItems={"center"} justifyContent={"center"} p={8}>
      <Text>&copy; All rights reserved Mower {new Date().getFullYear()}</Text>
    </Flex>
  );
};
