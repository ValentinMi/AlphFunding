import React, { ReactElement } from "react";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface LandingPageBenefitProps {
  index: number;
  title: string;
  description: string;
  icon: IconType;
  CTA?: ReactElement;
}

export const LandingPageBenefit: React.FC<LandingPageBenefitProps> = ({
  index,
  title,
  description,
  icon,
  CTA,
}) => {
  const isEven = index % 2 === 1;

  return (
    <Flex
      direction={isEven ? "row" : "row-reverse"}
      w={"100%"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Flex justifyContent={"center"} w={"50%"}>
        <Icon as={icon} boxSize={"150px"} color={"yellow.500"} />
      </Flex>
      <Flex w={"50%"} justifyContent={"center"}>
        <Box w={"60%"}>
          <Heading as={"h2"} mt={10}>
            {title}
          </Heading>
          <Text mt={3}>{description}</Text>
          {CTA && <Flex mt={5}>{CTA}</Flex>}
        </Box>
      </Flex>
    </Flex>
  );
};
