import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { RegularTaskFragment } from "../generated/graphql";
import TaskCard from "./TaskCard";

interface TaskListProps {
  items: RegularTaskFragment[];
}

const TaskList: React.FC<TaskListProps> = ({ items }) => {
  return (
    <SimpleGrid minChildWidth="300px" spacing="40px">
      {items.map((item) => (
        <TaskCard {...item} key={item.id} />
      ))}
    </SimpleGrid>
  );
};

export default TaskList;
