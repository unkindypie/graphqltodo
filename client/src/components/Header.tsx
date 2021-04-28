import { Box, Flex, Link } from "@chakra-ui/layout";
import { Button, Text, useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import useCurrentUser from "../hooks/useCurrentUser";

interface HeaderProps {}

const bgColor = { light: "blue.800", dark: "gray.700" };
const color = { light: "gray.200", dark: "gray.400" };

const Header: React.FC<HeaderProps> = ({}) => {
  const { colorMode } = useColorMode();
  const { isAuthenticated, username, logout } = useCurrentUser();

  return (
    <Box w="100%" p={4} bg={bgColor[colorMode]} color={color[colorMode]}>
      <Flex width="100%" h="16" justify="space-between" alignItems="center">
        <Flex flexDirection="row" alignItems="center" justifyContent="center">
          <NextLink href="/">
            <Text fontSize="24" mr={10} cursor="pointer">
              Todo App
            </Text>
          </NextLink>
          {isAuthenticated && <Text mt="2">Hello, {username}</Text>}
        </Flex>

        <Flex width="200px" justify="space-evenly">
          <NextLink href="/">
            <Link display="flex" alignItems="center">
              Home
            </Link>
          </NextLink>

          {!isAuthenticated && (
            <>
              <NextLink href="/login">
                <Link display="flex" alignItems="center">
                  Login
                </Link>
              </NextLink>

              <NextLink href="/register">
                <Link display="flex" alignItems="center">
                  Register
                </Link>
              </NextLink>
            </>
          )}
        </Flex>
        <Box>
          {isAuthenticated && (
            <Button color="gray.500" mr="10" onClick={logout}>
              Logout
            </Button>
          )}
          <DarkModeSwitch />
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
