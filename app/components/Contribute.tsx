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
  useDisclosure
} from "@chakra-ui/react";
import { useWallet } from "@alephium/web3-react";

interface ContributeProps {
  callContribute: (amount: number) => Promise<void>;
  connectedAccountIsContributor: boolean;
  isEndReached: boolean;
}

export const Contribute: React.FC<ContributeProps> = ({
  callContribute,
  connectedAccountIsContributor,
  isEndReached
}) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState<number>(0);

  const { connectionStatus } = useWallet();

  const handleContribute = async (amount: number) => {
    await callContribute(amount);
    onClose();
  };

  return (
    <>
      <Box mt={4}>
        <Button
          colorScheme={"green"}
          onClick={onOpen}
          isDisabled={connectionStatus !== "connected"}
          disabled={isEndReached}
        >
          Contribute
        </Button>
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
                You can't refund your contribution if the goal is reached
              </Text>
              {!connectedAccountIsContributor && (
                <Text color={"gray"} mt={4} textAlign={"center"}>
                  As it's your first contribution to this pool, 0.1 ALPH is
                  charged for minimal contract deposit
                </Text>
              )}
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
