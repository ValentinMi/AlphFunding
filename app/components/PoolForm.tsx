import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  Textarea,
  useSteps,
  VStack,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { dateToTimestamp, isDateAtLeastOneWeekInFuture } from "../utils";
import { useWallet } from "@alephium/web3-react";
import { Pool } from "artifacts/ts/Pool";
import { createPool } from "../actions";
import { useRouter } from "next/navigation";
import { stringToHex } from "@alephium/web3";
import { ArrowLeftIcon } from "@chakra-ui/icons";

interface PoolFormProps {}

type Inputs = {
  name: string;
  beneficiary: string;
  goal: number;
  end: string;
  description: string;
};

const steps = [
  { title: "First", description: "Information" },
  { title: "Second", description: "Beneficiary" },
  { title: "Third", description: "Objectives" },
];

export const PoolForm: React.FC<PoolFormProps> = () => {
  const { signer, account } = useWallet();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { activeStep, setActiveStep } = useSteps({
    index: 1,
    count: steps.length,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<Inputs>();

  const handleStepConfirmation = async () => {
    const isValid = await trigger(
      activeStep === 1
        ? ["name", "description"]
        : activeStep === 2
          ? "beneficiary"
          : activeStep === 3
            ? ["goal", "end"]
            : undefined,
    );
    if (isValid) {
      setActiveStep(activeStep + 1);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (activeStep !== 3) return;
    try {
      if (signer) {
        setIsLoading(true);
        const newPool = await Pool.deploy(signer, {
          initialFields: {
            name: stringToHex(data.name),
            description: stringToHex(data.description),
            end: BigInt(dateToTimestamp(data.end) * 1000),
            goal: BigInt(data.goal * 1e18),
            creator: account!.address,
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
            contractAddress: newPool.contractInstance.address,
          });
        }

        router.push(`/pools/${newPool.contractInstance.address}`);
      }
    } catch (e) {
      console.error(e);
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
    <Flex
      direction={"column"}
      w={"100%"}
      alignItems={"center"}
      h={"50vh"}
      justifyContent={"space-around"}
    >
      <Stepper index={activeStep} size={"lg"} w={"40vw"}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      <Box mt={12} w={"40vw"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={10}>
            {activeStep === 1 && (
              <>
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
                <FormControl isInvalid={!!errors.description}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register("description", {
                      required: true,
                      minLength: 100,
                      maxLength: 1000,
                    })}
                    minHeight={"200px"}
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
              </>
            )}
            {activeStep === 2 && (
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
            )}
            {activeStep === 3 && (
              <>
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
                    defaultValue={""}
                    {...register("end", {
                      required: true,
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
              </>
            )}
          </VStack>

          <Flex direction={"column"} alignItems={"center"} mt={12}>
            <HStack mt={6} spacing={6}>
              {activeStep > 1 && (
                <Button
                  leftIcon={<ArrowLeftIcon />}
                  colorScheme={"gray"}
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  Back
                </Button>
              )}
              {activeStep === 3 ? (
                <Button
                  colorScheme={"green"}
                  type={"submit"}
                  isLoading={isLoading}
                  key={"submit"}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  type={"button"}
                  colorScheme={"green"}
                  isLoading={isLoading}
                  onClick={handleStepConfirmation}
                  key={"confirm"}
                >
                  Confirm
                </Button>
              )}
            </HStack>
            {activeStep === 3 && (
              <Text color={"gray"} mt={4} textAlign={"center"}>
                Create a pool cost 0.1 ALPH for the minimal contract deposit
              </Text>
            )}
          </Flex>
        </form>
      </Box>
    </Flex>
  );
};
