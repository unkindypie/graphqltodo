import { SimpleGrid } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";
import UserItem from "../../components/UserItem";
import Wrapper from "../../components/Wrapper";
import { useUsersQuery } from "../../generated/graphql";

interface UsersPageProps {}

const UsersPage: React.FC<UsersPageProps> = ({}) => {
  const [{ data, fetching }] = useUsersQuery();

  return (
    <Wrapper>
      {fetching ? (
        <Spinner />
      ) : (
        <SimpleGrid minChildWidth="150px" spacing="30px">
          {data!.users!.map((user) => (
            <UserItem {...user} key={user.id} />
          ))}
        </SimpleGrid>
      )}
    </Wrapper>
  );
};

export default UsersPage;
