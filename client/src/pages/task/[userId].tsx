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

  return <TaskList userId={Number(userId)} />;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(TasksPage);
