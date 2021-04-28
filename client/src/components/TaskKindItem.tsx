import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import {
  TaskKind,
  useDeleteTaskKindMutation,
  useUpdateTaskKindMutation,
} from "../generated/graphql";
import EditableControls from "./EditableControls";

interface TaskKindItemProps extends TaskKind {}

const TaskKindItem: React.FC<TaskKindItemProps> = ({ id, name }) => {
  const [{ fetching: updating }, updateTaskKind] = useUpdateTaskKindMutation();
  const [{ fetching: deleting }, deleteTaskKind] = useDeleteTaskKindMutation();

  const handleNameSubmit = React.useCallback(
    async (newName) => {
      if (updating) return;
      await updateTaskKind({ options: { id, name: newName } });
    },
    [updateTaskKind, id]
  );

  const deleteSelf = React.useCallback(async () => {
    if (deleting) return;
    await deleteTaskKind({ id });
  }, [id, deleteTaskKind]);

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box flexDir="row" justifyContent="flex-end" d="flex">
        <IconButton
          aria-label="Delete task"
          icon={<DeleteIcon />}
          variant="ghost"
          onClick={deleteSelf}
          size="sm"
        />
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
      >
        <Box fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
          <Editable
            m={1}
            defaultValue={name}
            onSubmit={handleNameSubmit}
            d="flex"
            flexDir="row"
            alignItems="flex-start"
          >
            <EditablePreview />
            <EditableInput mr="2" />
            <EditableControls />
          </Editable>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskKindItem;
