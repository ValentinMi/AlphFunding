import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { dateToTimestamp, isDateAtLeastOneWeekInFuture } from "../utils";
import { useWallet } from "@alephium/web3-react";
import { Pool } from "artifacts/ts/Pool";
import { createPool } from "../actions";
import { useRouter } from "next/navigation";

interface PoolFormProps {}

type Inputs = {
  name: string;
  beneficiary: string;
  goal: number;
  end: string;
  description: string;
};

export const PoolForm: React.FC<PoolFormProps> = () => {
  const { signer, account } = useWallet();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (signer) {
        setIsLoading(true);
        const newPool = await Pool.deploy(signer, {
          initialFields: {
            end: BigInt(dateToTimestamp(data.end) * 1000),
            goal: BigInt(data.goal),
            creator: account?.address,
            beneficiary: data.beneficiary,
            totalCollected: BigInt(0),
          },
        });

        if (newPool.contractInstance.address) {
          console.log(
            "Pool created with address",
            newPool.contractInstance.address,
          );
          await createPool({
            poolContractAddress: newPool.contractInstance.address,
            name: data.name,
            description: data.description,
          });
        }

        router.push(`/pools/${newPool.contractInstance.address}`);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!signer) {
    return (
      <Flex w={"100%"} justifyContent={"center"}>
        <Box w={"60%"}>
          <VStack spacing={5}>
            <Box>Connect your wallet to create a pool</Box>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex w={"100%"} justifyContent={"center"}>
      <Box w={"60%"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={5}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                {...register("name", {
                  required: true,
                  minLength: 5,
                  maxLength: 50,
                })}
              />
              {!!errors.name && (
                <FormErrorMessage>
                  {errors.name.type === "required"
                    ? "This field is required"
                    : errors.name.type === "minLength"
                      ? "Name should be at least 5 characters"
                      : "Name should be at most 50 characters"}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.beneficiary}>
              <FormLabel>Beneficiary address</FormLabel>
              <Input
                type="text"
                {...register("beneficiary", {
                  required: true,
                  pattern: /[1-9A-HJ-NP-Za-km-z]{40,}$/,
                })}
              />
              {!!errors.beneficiary && (
                <FormErrorMessage>
                  {errors.beneficiary.type === "required"
                    ? "This field is required"
                    : "Invalid Alephium address"}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.goal}>
              <FormLabel>Goal</FormLabel>
              <NumberInput defaultValue={1} min={0.1}>
                <NumberInputField
                  {...register("goal", { required: true, min: 0.1 })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {!!errors.goal && (
                <FormErrorMessage>
                  {errors.goal.type === "required"
                    ? "This field is required"
                    : "Goal should be at least 0.1 ALPH"}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.end}>
              <FormLabel>End date</FormLabel>
              <Input
                type="date"
                {...register("end", {
                  /*  required: true,
                  pattern:
                    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,*/
                  validate: (value) => isDateAtLeastOneWeekInFuture(value),
                })}
              />
              {!!errors.end ? (
                <FormErrorMessage>
                  {errors.end.type === "required"
                    ? "This field is required"
                    : "Invalid date"}
                </FormErrorMessage>
              ) : (
                <FormHelperText>
                  The end date need to be at least one week in the future
                </FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register("description", {
                  required: true,
                  minLength: 100,
                  maxLength: 1000,
                })}
              />
              {!!errors.description && (
                <FormErrorMessage>
                  {errors.description.type === "required"
                    ? "This field is required"
                    : errors.description.type === "minLength"
                      ? "Description should be at least 100 characters"
                      : "Description should be at most 1000 characters"}
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>
          <Flex justifyContent={"center"}>
            <Button
              colorScheme={"green"}
              type={"submit"}
              mt={6}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
