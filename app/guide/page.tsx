"use client";

import { Layout } from "../components/layout/Layout";
import {
  Container,
  Heading,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react";

export default function Page() {
  return (
    <Layout>
      <Container>
        <Heading as={"h2"}>User guide</Heading>
        <OrderedList textDecor={"underline"} mt={2}>
          <ListItem>Create a pool</ListItem>
          <ListItem>Contribute to a pool</ListItem>
          <ListItem>Refund your contribution</ListItem>
          <ListItem>Collect the donation</ListItem>
        </OrderedList>
        <Heading as={"h3"} mt={2}>
          Create a pool
        </Heading>
        <Text mt={2}>
          To{" "}
          <Text as={"span"} fontWeight={"bold"}>
            create a pool
          </Text>
          , navigate to the "Create" page and connect your wallet if it's not
          already connected.
        </Text>
        <Text mt={2}>
          To create a pool, AlphPool provides a{" "}
          <Text as={"span"} fontWeight={"bold"}>
            simple form
          </Text>{" "}
          where you can specify your pool properties, this is the{" "}
          <Text as={"span"} fontWeight={"bold"}>
            required properties
          </Text>
          :
        </Text>
        <OrderedList mt={2} pl={4}>
          <ListItem>
            <Text as={"span"} fontWeight={"bold"}>
              Name
            </Text>
            : The name of the pool
          </ListItem>
          <ListItem>
            <Text as={"span"} fontWeight={"bold"}>
              Description
            </Text>
            : A description of the pool
          </ListItem>
          <ListItem>
            <Text as={"span"} fontWeight={"bold"}>
              Beneficiary
            </Text>
            : The address of the beneficiary
          </ListItem>
          <ListItem>
            <Text as={"span"} fontWeight={"bold"}>
              Goal
            </Text>
            : The goal amount to reach
          </ListItem>
          <ListItem>
            <Text as={"span"} fontWeight={"bold"}>
              End
            </Text>
            : The end date of the pool (1 week minimum)
          </ListItem>
        </OrderedList>
        <Text mt={2}>
          After the form is filled, click on the "Submit" button, then your
          wallet will ask you to{" "}
          <Text as={"span"} fontWeight={"bold"}>
            sign the contract creation transaction
          </Text>
          , Alephium blockchain required a{" "}
          <Text as={"span"} fontWeight={"bold"}>
            contract minimal deposit of 0.1 ALPH
          </Text>{" "}
          for a contract creation
        </Text>
      </Container>
    </Layout>
  );
}
