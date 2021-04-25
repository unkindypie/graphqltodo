import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

const useCurrentUser = () => {
  const context = React.useContext(CurrentUserContext);

  return context;
};

export default useCurrentUser;
