import React from "react";
import { useField, useFormikContext } from "formik";
import {
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  Text,
  FormErrorIcon,
  InputProps,
} from "@chakra-ui/react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> &
  React.InputHTMLAttributes<HTMLTextAreaElement> & {
    name: string;
    label: string;
    as?: any;
  };

const InputField: React.FC<InputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  const { submitCount } = useFormikContext();

  return (
    <FormControl>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
        isInvalid={!!error && submitCount > 0}
      />
      {error && submitCount > 0 && (
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
