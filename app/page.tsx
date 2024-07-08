"use client";
import { Layout } from "./components/layout/Layout";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Page() {
  return (
    <Layout>
      <Flex w={"100%"} alignItems={"center"} direction={"column"}>
        <Heading as={"h1"} size={"3xl"}>
          Welcome to Alph
          <Box as={"span"} color={"yellow.500"}>
            Pool
          </Box>
        </Heading>
        <Container centerContent mt={5} textAlign={"center"}>
          <Text>
            Welcome to AlphPool, the decentralized application on the Alephium
            blockchain that empowers you to create and contribute to donation
            pools seamlessly. AlphPool is designed to harness the power of
            blockchain technology to make charitable giving more transparent,
            secure, and efficient.
          </Text>
          <HStack mt={5} spacing={8}>
            <Link as={NextLink} href="/pools">
              <Button colorScheme={"blue"}>View pools</Button>
            </Link>
            <Link as={NextLink} href="/pools/create">
              <Button colorScheme={"green"}>Create a pool</Button>
            </Link>
          </HStack>
          <Divider mt={5} />
        </Container>
        <Container>
          <Heading as={"h2"} mt={5}>
            Create Donation Pools
          </Heading>
          <Text mt={3}>
            With AlphPool, you can easily create donation pools for causes you
            care about. Whether you're raising funds for a community project,
            supporting a charity, or helping someone in need, our platform
            provides a straightforward and user-friendly interface to set up and
            manage your donation campaigns.
          </Text>
          <Heading as={"h2"} mt={10}>
            Contribute with Confidence
          </Heading>
          <Text mt={3}>
            Contributors can trust that their donations are handled securely and
            transparently thanks to the robust features of the Alephium
            blockchain. Every transaction is recorded and verifiable, ensuring
            that your contributions reach their intended destination without any
            intermediary interference.
          </Text>
        </Container>
      </Flex>
    </Layout>
  );
}
