import React from "react";
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      {/* Decorate the text using Chakra UI Text component */}
      <Text
        fontSize='24px' // Adjust the font size as needed
        fontWeight='bold' // Adjust the font weight as needed
        color={logoColor} // Use the color based on color mode
        letterSpacing='wide' // Adjust letter spacing as needed
      >
        Billing Software
      </Text>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
