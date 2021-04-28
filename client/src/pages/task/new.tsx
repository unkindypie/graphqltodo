import { withUrqlClient } from "next-urql";
import React from "react";
import { Spinner } from "@chakra-ui/spinner";
import { Box, Grid } from "@chakra-ui/react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import Wrapper from "../../components/Wrapper";
import TaskEditor from "../../components/TaskEditor";

const Index = () => {
  return (
    <Wrapper minH="100%">
      <TaskEditor isNew />
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
