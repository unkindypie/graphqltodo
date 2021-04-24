import React from "react";
import { Form, useFormik, FormikProvider } from "formik";
import { Box, Button } from "@chakra-ui/react";
import * as Yup from "yup";
import { Container } from "../components/Container";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";

interface RegisterProps {}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Field is required."),
  password: Yup.string().required("Field is required."),
});

const Register: React.FC<RegisterProps> = ({}) => {
  const handleSubmit = React.useCallback(() => {}, []);

  const formik = useFormik({
    initialValues: { username: "" },
    onSubmit: handleSubmit,
    validationSchema,
  });

  const { isSubmitting, values, errors, handleChange } = formik;

  console.log(errors);

  return (
    <Container height="100vh">
      <Wrapper variant="small">
        <FormikProvider value={formik}>
          <Form>
            <InputField
              name="username"
              placeholder="Username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
            </Box>

            <Button mt={4} isLoading={isSubmitting} type="submit">
              Submit
            </Button>
          </Form>
        </FormikProvider>
      </Wrapper>
    </Container>
  );
};
export default Register;
