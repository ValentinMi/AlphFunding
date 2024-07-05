import React from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Textarea, VStack } from "@chakra-ui/react";

interface PoolFormProps {}

export const PoolForm: React.FC<PoolFormProps> = () => {
  return (
    <Flex w={"100%"} justifyContent={"center"}>
      <Box w={"60%"}>
        <form>
          <VStack spacing={5}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Beneficiary address</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Goal</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>End</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea />
            </FormControl>
          </VStack>
          <Flex justifyContent={"center"}>
            <Button mt={6}>Submit</Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
