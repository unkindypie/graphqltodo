import React from "react";
import { useField } from "formik";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Text,
  FormErrorIcon,
} from "@chakra-ui/react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
        isInvalid={!!error}
      />
      {error && (
        <Text color="#C53030" mt={2} ml={1} fontSize={15}>
          <FormErrorIcon />
          {error}
        </Text>
      )}
      {/* {<FormErrorMessage>{error}</FormErrorMessage>} */}
    </FormControl>
  );
};

export default InputField;
