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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useWallet } from "@alephium/web3-react";
import { ExecuteScriptResult } from "@alephium/web3";

interface ContributeProps {
  callContribute: (amount: number) => Promise<ExecuteScriptResult | undefined>;
  fetchContractData: () => Promise<void>;
  connectedAccountIsContributor: boolean;
}

export const Contribute: React.FC<ContributeProps> = ({
  callContribute,
  fetchContractData,
  connectedAccountIsContributor,
}) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState<number>(0);

  const { connectionStatus } = useWallet();

  const handleContribute = async (amount: number) => {
    await callContribute(amount);
    await fetchContractData();
    onClose();
  };

  return (
    <>
      <Box mt={4}>
        {!connectedAccountIsContributor ? (
          <Button
            colorScheme={"green"}
            onClick={onOpen}
            isDisabled={connectionStatus !== "connected"}
          >
            Contribute
          </Button>
        ) : (
          <Button colorScheme={"orange"}>Refund</Button>
        )}
      </Box>
      <AlertDialog
        isOpen={isOpen}
        // @ts-ignore
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
              {/* @ts-ignore*/}
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
