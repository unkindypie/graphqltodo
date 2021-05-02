import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import {
  RegularUserFragment,
  useRemoveAccountMutation,
} from "../generated/graphql";
import useCurrentUser from "../hooks/useCurrentUser";

interface UserItemProps extends RegularUserFragment {}

const UserItem: React.FC<UserItemProps> = ({ username, id }) => {
  const { isAdmin: isCurrentUserAdmin } = useCurrentUser();
  const [{ fetching }, removeAccount] = useRemoveAccountMutation();

  const handleRemoveClick = React.useCallback(async () => {
    await removeAccount({ id });
  }, [id, removeAccount]);

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" pb="6">
      <Box flexDir="row" justifyContent="space-between" d="flex" p="1">
        <Link href={`task/${id}`}>
          <Button size="sm">Tasks</Button>
        </Link>
        {isCurrentUserAdmin && (
          <Box flexDir="row" justifyContent="flex-end" d="flex">
            <Button
              size="sm"
              variant="outline"
              borderColor="red.500"
              isLoading={fetching}
              onClick={handleRemoveClick}
            >
              <DeleteIcon mr="2" size="sm" />
              Delete Account
            </Button>
          </Box>
        )}
      </Box>

      <Box
        p="0.5"
        pb="9"
        pt="0"
        flex="1"
        d="flex"
        flexDir="column"
        h="100%"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Box fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
          {username}
        </Box>
      </Box>
    </Box>
  );
};

export default UserItem;
