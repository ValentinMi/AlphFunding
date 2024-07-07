"use client";
import { Layout } from "./components/layout/Layout";
import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Page() {
  return (
    <Layout>
      <Flex w={"100%"} alignItems={"center"} direction={"column"}>
        <Heading>Welcome to AlphPool</Heading>
        <HStack mt={2}>
          <Link as={NextLink} href="/pools">
            <Button>View pools</Button>
          </Link>
          <Link as={NextLink} href="/pools/create">
            <Button>Create a pool</Button>
          </Link>
        </HStack>
        <Container centerContent mt={5} textAlign={"center"}>
          Welcome to AlphPool, the decentralized application on the Alephium
          blockchain that empowers you to create and contribute to donation
          pools seamlessly. AlphPool is designed to harness the power of
          blockchain technology to make charitable giving more transparent,
          secure, and efficient.
        </Container>
      </Flex>
    </Layout>
  );
}
