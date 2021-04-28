import { Flex, useColorMode, FlexProps } from "@chakra-ui/react";

const bgColor = { light: "gray.50", dark: "gray.900" };
const color = { light: "black", dark: "white" };

export const Container = (props: FlexProps) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      flex="1"
      height="100%"
      minHeight="100vh"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      paddingBottom="100px"
      {...props}
    />
  );
};
