"use client";
import { Layout } from "./components/layout/Layout";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BiDonateHeart } from "react-icons/bi";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { LandingPageBenefit } from "./components/LandingPageBenefit";
import { KPIs } from "./components/KPIs";

export default function Page() {
  const benefits = [
    {
      title: "Create Donation Pools",
      description:
        "With AlphFunding, you can easily create donation pools for causes you care about. Whether you're raising funds for a community project, supporting a charity, or helping someone in need, our platform provides a straightforward and user-friendly interface to set up and manage your donation campaigns.",
      icon: BiDonateHeart,
      CTA: (
        <Link as={NextLink} href="/pools/create">
          <Button
            colorScheme={"yellow"}
            size={"lg"}
            variant={"outline"}
            color={"yellow.500"}
            borderColor={"yellow.500"}
          >
            Create a pool
          </Button>
        </Link>
      ),
    },
    {
      title: "Contribute with Confidence",
      description:
        "Contributors can trust that their donations are handled securely and transparently thanks to the robust features of the Alephium blockchain. Every transaction is recorded and verifiable, ensuring that your contributions reach their intended destination without any intermediary interference.",
      icon: VscWorkspaceTrusted,
      CTA: (
        <Link as={NextLink} href="/pools">
          <Button
            colorScheme={"yellow"}
            size={"lg"}
            variant={"outline"}
            color={"yellow.500"}
            borderColor={"yellow.500"}
          >
            View pools
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Layout>
      <Flex
        as={"section"}
        w={"100%"}
        alignItems={"center"}
        direction={"column"}
      >
        <Flex
          h={"80vh"}
          direction={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Heading as={"h1"} size={"4xl"} mt={"-10vh"}>
            Welcome to Alph
            <Box as={"span"} color={"yellow.500"}>
              Funding
            </Box>
          </Heading>
          <Container centerContent mt={5} textAlign={"center"}>
            <Text>
              Welcome to AlphFunding, the decentralized application on the
              Alephium blockchain that empowers you to create and contribute to
              donation pools seamlessly. AlphFunding is designed to harness the
              power of blockchain technology to make charitable giving more
              transparent, secure, and efficient.
            </Text>
          </Container>
          <HStack mt={10} spacing={8}>
            <Link as={NextLink} href="/pools">
              <Button
                colorScheme={"yellow"}
                size={"lg"}
                variant={"outline"}
                color={"yellow.500"}
                borderColor={"yellow.500"}
              >
                View pools
              </Button>
            </Link>
            <Link as={NextLink} href="/pools/create">
              <Button
                colorScheme={"yellow"}
                variant={"outline"}
                size={"lg"}
                color={"yellow.500"}
                borderColor={"yellow.500"}
              >
                Create a pool
              </Button>
            </Link>
          </HStack>
        </Flex>
        <Flex as={"section"} w={"100%"}>
          <KPIs />
        </Flex>
        <Flex
          as={"section"}
          h={"100vh"}
          direction={"column"}
          justifyContent={"space-around"}
        >
          {benefits.map((benef, index) => (
            <LandingPageBenefit index={index} {...benef} />
          ))}
        </Flex>
      </Flex>
    </Layout>
  );
}
