import { Box, BoxProps } from "@chakra-ui/layout";
import React from "react";

interface WrapperProps extends BoxProps {
  variant?: "small" | "regular";
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
  ...rest
}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
      {...rest}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
