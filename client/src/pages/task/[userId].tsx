import { withUrqlClient } from "next-urql";
import React from "react";
import { Spinner } from "@chakra-ui/spinner";
import { Box, Button, Grid } from "@chakra-ui/react";

import TaskList from "../../components/TaskList";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useTasksQuery } from "../../generated/graphql";
import Wrapper from "../../components/Wrapper";
import useCurrentUser from "../../hooks/useCurrentUser";
import { AddIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const TasksPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [{ data, fetching }] = useTasksQuery({
    variables: { userId: Number(userId) },
  });
  const { isAuthenticated, id } = useCurrentUser();

  return (
    <Wrapper minH="100%">
      {isAuthenticated && userId == id && (
        <Box d="flex" flexDir="row" justifyContent="flex-end" mb="5">
          <Link href="/task/new">
            <Button>
              <AddIcon width="3" mr="1" /> New
            </Button>
          </Link>
        </Box>
      )}
      {fetching ? <Spinner /> : <TaskList items={data!.tasks} />}{" "}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(TasksPage);
