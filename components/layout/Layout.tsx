import React from "react";
import { Flex } from "@chakra-ui/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex
      h={"100vh"}
      direction={"column"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Header />
      <Flex p={8} direction={"column"} w={"100%"}>
        {children}
      </Flex>
      <Footer />
    </Flex>
  );
};
