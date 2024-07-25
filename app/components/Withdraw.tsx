import React, { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

interface WithdrawProps {
  callWithdraw: () => Promise<void>;
  isEndReached: boolean;
}

export const Withdraw: React.FC<WithdrawProps> = ({
  callWithdraw,
  isEndReached,
}) => {
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRefund = async () => {
    await callWithdraw();
    onClose();
  };

  return (
    <>
      <Box mt={4}>
        <Tooltip label={!isEndReached && "End is not reached"}>
          <Button
            colorScheme={"blue"}
            onClick={onOpen}
            isDisabled={!isEndReached}
          >
            Withdraw
          </Button>
        </Tooltip>
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
              Withdraw
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text mt={2} textAlign={"center"}>
                By confirming this action, you will withdraw the total collected
                to beneficiary address
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              {/* @ts-ignore*/}
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme={"blue"} onClick={handleRefund} ml={3}>
                Withdraw
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
