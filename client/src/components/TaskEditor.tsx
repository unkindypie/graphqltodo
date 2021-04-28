import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import {
  Box,
  Button,
  FormLabel,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useRouter } from "next/router";

import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { toErrorMap } from "../utils/toErrorMap";
import {
  RegularTaskFragment,
  useCreateTaskMutation,
  useTaskKindsQuery,
} from "../generated/graphql";

interface TaskEditorProps {
  isNew?: boolean;
  task?: RegularTaskFragment;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Field is required."),
  description: Yup.string().required("Field is required."),
  dateTime: Yup.mixed().required("Field is required."),
  kind: Yup.mixed().required("Field is required."),
});

const TaskEditor: React.FC<TaskEditorProps> = ({}) => {
  const router = useRouter();
  const [{ data, fetching: tasksLoading }] = useTaskKindsQuery();
  const [_, createTask] = useCreateTaskMutation();
  const { taskKinds } = data ?? {};

  const handleSubmit = React.useCallback(
    async ({ kind, ...values }, { setErrors }) => {
      const selectedKind = taskKinds!.find((k) => k.id == kind);
      const response = await createTask({
        options: {
          ...values,
          kind: { id: selectedKind?.id, name: selectedKind?.name },
        },
      });
      if (!response.error) {
        router.push("/");
      }
    },
    [taskKinds]
  );

  const formik = useFormik({
    initialValues: { title: "" },
    onSubmit: handleSubmit,
    validationSchema,
  });

  const { isSubmitting, values, errors, handleChange } = formik;

  return (
    <Wrapper variant="small">
      <FormikProvider value={formik}>
        <Form>
          <Box d="flex" flexDir="column">
            <InputField name="title" placeholder="Title" label="Title" />

            <Box mt="4">
              {tasksLoading ? (
                <Spinner size="sm" />
              ) : (
                <InputField as={Select} name="kind" label="Kind">
                  {taskKinds?.map((kind) => (
                    <option value={kind.id} key={kind.id}>
                      {kind.name}
                    </option>
                  ))}
                </InputField>
              )}
            </Box>

            <Box mt={4}>
              <InputField
                name="description"
                placeholder="Description"
                label="Description"
                as="textarea"
                width="100%"
                style={{ minHeight: "70px", paddingTop: "10px" }}
              />
            </Box>
            <InputField
              name="dateTime"
              label="Date & Time"
              type="datetime-local"
            />

            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              width="24"
              ml="auto"
            >
              Save
            </Button>
          </Box>
        </Form>
      </FormikProvider>
    </Wrapper>
  );
};
export default TaskEditor;
