import {
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  StarIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  ButtonGroup,
  Flex,
  IconButton,
  IconButtonProps,
  useEditableControls,
} from "@chakra-ui/react";
import React from "react";

const EditableControls = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton
        icon={<CheckIcon />}
        {...(getSubmitButtonProps() as IconButtonProps)}
      />
      <IconButton
        icon={<CloseIcon />}
        {...(getCancelButtonProps() as IconButtonProps)}
      />
    </ButtonGroup>
  ) : null;
};

export default EditableControls;
