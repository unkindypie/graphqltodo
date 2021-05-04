import { withUrqlClient } from "next-urql";
import React from "react";

import TaskList from "../components/TaskList";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  return <TaskList />;
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
