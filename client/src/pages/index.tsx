import { withUrqlClient } from "next-urql";
import React from "react";
import Header from "../components/Header";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useTasksQuery } from "../generated/graphql";
import { Spinner } from "@chakra-ui/spinner";

const Index = () => {
  const [{ data, fetching }] = useTasksQuery();

  return (
    <div>
      {fetching && <Spinner />}

      {data?.tasks?.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
