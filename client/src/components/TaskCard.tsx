import { DeleteIcon, EditIcon, StarIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import {
  Badge,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Select,
} from "@chakra-ui/react";
import React from "react";
import {
  RegularTaskFragment,
  TaskUpdateInput,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../generated/graphql";
import useCurrentUser from "../hooks/useCurrentUser";
import EditableControls from "./EditableControls";

interface TaskCardProps extends RegularTaskFragment {}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  kind,
  dateTime,
  description,
  user,
  id,
}) => {
  const { id: currentUserId } = useCurrentUser();
  const [_, deleteTask] = useDeleteTaskMutation();
  const [__, updateTask] = useUpdateTaskMutation();

  const isOwn = React.useMemo(() => currentUserId === user.id, [
    currentUserId,
    user,
  ]);

  const defaultDateTime = React.useMemo(
    () => new Date(Number(dateTime)).toISOString(),
    [dateTime]
  );

  const deleteSelf = React.useCallback(async () => {
    await deleteTask({ id });
  }, [id, deleteTask]);

  const updateSelf = React.useCallback(
    async (changed: Partial<TaskUpdateInput>) => {
      await updateTask({ options: { id, ...changed } });
    },
    [id, updateTask]
  );

  const createUpdateHandler = React.useCallback(
    (fieldName: keyof TaskUpdateInput) => {
      return async (newValue: any) => {
        await updateSelf({ [fieldName]: newValue });
      };
    },
    [updateSelf]
  );

  return (
    <Box maxW="md" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="6" pt="3" flex="1" d="flex" flexDir="column" h="100%">
        <Box
          d="flex"
          flexDir="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box d="flex" alignItems="baseline">
            <Badge borderRadius="full" px="2" colorScheme="messenger" mr="2">
              {kind.name}
            </Badge>
            {isOwn && (
              <Badge borderRadius="full" px="2" colorScheme="teal">
                Your
              </Badge>
            )}

            {!isOwn && (
              <Box
                color="gray.500"
                fontWeight="semibold"
                letterSpacing="wide"
                fontSize="xs"
                textTransform="uppercase"
                ml="2"
              >
                {user.username}'s task
              </Box>
            )}
          </Box>
          {isOwn && (
            <Box d="flex" flexDirection="row">
              <IconButton
                aria-label="Edit task"
                icon={<EditIcon />}
                variant="ghost"
                onClick={deleteSelf}
                size="sm"
              />
              <IconButton
                aria-label="Delete task"
                icon={<DeleteIcon />}
                variant="ghost"
                onClick={deleteSelf}
                size="sm"
              />
            </Box>
          )}
        </Box>

        <Box
          mt="3"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          <Editable
            m={1}
            defaultValue={title}
            isPreviewFocusable={isOwn}
            onSubmit={createUpdateHandler("title")}
            d="flex"
            flexDir="row"
            alignItems="flex-start"
          >
            <EditablePreview />
            <EditableInput mr="2" />
            <EditableControls />
          </Editable>
        </Box>

        <Box mt="2">
          <Box as="span" color="gray.600" fontSize="sm">
            <Editable
              defaultValue={description}
              isPreviewFocusable={isOwn}
              onSubmit={createUpdateHandler("description")}
            >
              <EditablePreview />
              <EditableInput as="textarea" />
              <EditableControls />
            </Editable>
          </Box>
        </Box>
        <Box d="flex" flexDir="column" justifyContent="flex-end" flex="1">
          <Box
            d="flex"
            flexDir="row"
            justifyContent="flex-end"
            w="100%"
            color="gray.600"
            fontSize="sm"
          >
            <Editable
              defaultValue={defaultDateTime}
              isPreviewFocusable={isOwn}
              onSubmit={createUpdateHandler("dateTime")}
              flexDirection="row"
              d="flex"
            >
              <EditablePreview />

              <EditableInput type="datetime-local" mr="2" />
              <EditableControls />
            </Editable>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskCard;
