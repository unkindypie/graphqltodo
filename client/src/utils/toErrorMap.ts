import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};

  for (let { field, message } of errors) {
    errorMap[field] = message;
  }

  return errorMap;
};
