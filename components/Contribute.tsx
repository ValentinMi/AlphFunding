import React, { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { SignExecuteScriptTxResult } from "@alephium/web3";

interface ContributeProps {
  totalCollected: number;
  goal: number;
  beneficiary: string;
  creator: string;
  end: number;
  callContribute: (amount: number) => Promise<SignExecuteScriptTxResult>;
  fetchContractData: () => Promise<void>;
}

export const Contribute: React.FC<ContributeProps> = ({
  totalCollected,
  goal,
  owner,
  end,
  callContribute,
  beneficiary,
  creator,
  fetchContractData
}) => {
  const isContributor = false;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [amount, setAmount] = useState<number>(0);

  const handleContribute = async (amount: number) => {
    await callContribute(amount);
    await fetchContractData();
    onClose();
  };

  return (
    <>
      <Flex
        direction={"column"}
        alignItems={"flex-start"}
        justifyContent={"center"}
      >
        <Text>
          Beneficiary:{" "}
          <Link
            isExternal
            href={`https://explorer.alephium.org/addresses/${owner}`}
          >
            {beneficiary}
          </Link>
        </Text>
        <Text>
          Pool creator:{" "}
          <Link
            isExternal
            href={`https://explorer.alephium.org/addresses/${owner}`}
          >
            {creator}
          </Link>
        </Text>
        <Flex justifyContent={"space-between"} w={"100%"} mt={2}>
          <Text>
            {totalCollected} / {goal} ALPH
          </Text>
          {end && <Text>{new Date(end).toLocaleString()}</Text>}
        </Flex>
        <Progress
          hasStripe
          value={(totalCollected / goal) * 100}
          w={"100%"}
          mt={2}
        />
        <Box mt={2}>
          {isContributor ? (
            <Button>Refund</Button>
          ) : (
            <Button colorScheme={"green"} onClick={onOpen}>
              Contribute
            </Button>
          )}
        </Box>
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Contribute
            </AlertDialogHeader>

            <AlertDialogBody>
              <Flex alignItems={"center"} w={"100%"} justifyContent={"center"}>
                <NumberInput
                  defaultValue={0}
                  min={0}
                  w={"100px"}
                  mr={2}
                  onChange={(value) => setAmount(Number(value))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>{" "}
                ALPH
              </Flex>
              <Text mt={2} textAlign={"center"}>
                You can't refund your contribution if the goal is reached or
                before the end of the pool.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={() => handleContribute(amount)}
                ml={3}
              >
                Contribute
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
