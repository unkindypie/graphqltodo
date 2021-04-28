import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import EditableControls from "../../components/EditableControls";
import TaskKindItem from "../../components/TaskKindItem";
import Wrapper from "../../components/Wrapper";
import {
  useCreateTaskKindMutation,
  useTaskKindsQuery,
} from "../../generated/graphql";

interface TaskKindsPageProps {}

const TaskKindsPage: React.FC<TaskKindsPageProps> = ({}) => {
  const [{ data, fetching }] = useTaskKindsQuery();
  const [{ fetching: creating }, createTask] = useCreateTaskKindMutation();
  const [controlsKey, setControlsKey] = React.useState<number | undefined>();

  const handleAddSubmit = React.useCallback(
    async (name) => {
      if (creating) return;
      const { data } = await createTask({ name: name });
      if (!data?.createTaskKind.errors) {
        setControlsKey(data!.createTaskKind.kind!.id);
      } else {
        alert(data?.createTaskKind.errors[0].message);
        setControlsKey(Date.now());
      }
    },
    [createTask]
  );

  return (
    <Wrapper>
      {fetching ? (
        <Spinner />
      ) : (
        <SimpleGrid minChildWidth="150px" spacing="30px">
          {data!.taskKinds!.map((kind) => (
            <TaskKindItem {...kind} key={kind.id} />
          ))}
          <Box
            d="flex"
            flexDir="row"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              fontWeight="normal"
              as="h4"
              lineHeight="tight"
              isTruncated
              key={controlsKey}
            >
              <Editable
                // w=""
                m={1}
                defaultValue={"Add new"}
                onSubmit={handleAddSubmit}
                d="flex"
                flexDir="row"
                alignItems="center"
              >
                {creating && <Spinner size="sm" />}
                <AddIcon w="3" mr={1} />

                <EditablePreview />
                <EditableInput mr="2" />
                <EditableControls />
              </Editable>
            </Box>
          </Box>
        </SimpleGrid>
      )}
    </Wrapper>
  );
};

export default TaskKindsPage;
