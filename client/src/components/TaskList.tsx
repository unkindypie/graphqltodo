import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Link,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import React from "react";

import {
  RegularTaskFragment,
  TasksQueryInput,
  useTasksQuery,
} from "../generated/graphql";
import useCurrentUser from "../hooks/useCurrentUser";
import TaskCard from "./TaskCard";
import Wrapper from "./Wrapper";

interface TaskListProps {
  userId?: number;
}

const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const [onlyCompleted, setOnlyCompleted] = React.useState(false);
  const [from, setFrom] = React.useState<string>();
  const [{ data, fetching }] = useTasksQuery({
    variables: {
      options: {
        from: from ? from : undefined,
        userId,
        onlyCompleted: onlyCompleted ? onlyCompleted : undefined,
      },
    },
  });
  const { isAuthenticated } = useCurrentUser();

  const toggleOnlyCompleted = React.useCallback(() => {
    setOnlyCompleted((value) => !value);
  }, []);

  const handleFromChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFrom(e.target.value);
    },
    []
  );

  const handleClearFromClick = React.useCallback(() => {
    setFrom(undefined);
  }, []);

  return (
    <Wrapper minH="100%">
      {isAuthenticated && (
        <Box
          d="flex"
          flexDir="row"
          justifyContent="space-between"
          mb="5"
          flex={1}
          flexWrap="wrap"
        >
          <Box
            d="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
            flex={0.5}
          >
            <FormControl d="flex" flexDir="row" alignItems="center">
              <FormLabel margin={0} mr={2}>
                From:
              </FormLabel>
              <Input
                type="date"
                placeholder="Date"
                onChange={handleFromChange}
                value={from}
              />
              {from && (
                <CloseIcon ml={2} onClick={handleClearFromClick} width={3} />
              )}
            </FormControl>
            <Checkbox
              isChecked={onlyCompleted}
              onChange={toggleOnlyCompleted}
              minWidth="50%"
              ml={4}
            >
              Only uncompleted
            </Checkbox>
          </Box>

          <Link href="/task/new">
            <Button>
              <AddIcon width="3" mr="1" /> New
            </Button>
          </Link>
        </Box>
      )}
      {fetching ? (
        <Spinner />
      ) : (
        <SimpleGrid minChildWidth="300px" spacing="40px">
          {data?.tasks.map((item) => (
            <TaskCard {...item} key={item.id} />
          ))}
        </SimpleGrid>
      )}
    </Wrapper>
  );
};

export default TaskList;
