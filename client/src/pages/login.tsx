import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import { Box, Button, Text } from "@chakra-ui/react";
import * as Yup from "yup";
import { useRouter } from "next/router";

import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface LoginProps {}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Field is required."),
  password: Yup.string().required("Field is required."),
});

const Login: React.FC<LoginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = React.useCallback(async (values, { setErrors }) => {
    const response = await login(values);
    if (response.data?.login.errors) {
      setErrors(toErrorMap(response.data.login.errors));
    } else {
      router.push("/");
    }
  }, []);

  const formik = useFormik({
    initialValues: { username: "" },
    onSubmit: handleSubmit,
    validationSchema,
  });

  const { isSubmitting, values, errors, handleChange } = formik;

  return (
    <Wrapper variant="small">
      <Text fontSize="xl" mb={5}>
        Log In
      </Text>
      <FormikProvider value={formik}>
        <Form>
          <InputField name="username" placeholder="Username" label="Username" />
          <Box mt={4}>
            <InputField
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
            />
          </Box>

          <Button mt={4} isLoading={isSubmitting} type="submit">
            Login
          </Button>
        </Form>
      </FormikProvider>
    </Wrapper>
  );
};
export default Login;
