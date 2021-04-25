import React from "react";
import { useRouter } from "next/router";

import { useMeQuery, User, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface CurrentUserContextValue extends Partial<User> {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

let CurrentUserContext: React.Context<CurrentUserContextValue>;

const defaultValue: CurrentUserContextValue = {
  isAuthenticated: false,
  loading: true,
  logout: () => {},
};

const {
  Consumer: CurrentUserConsumer,
  Provider,
} = (CurrentUserContext = React.createContext<CurrentUserContextValue>(
  defaultValue
));

export { CurrentUserConsumer, CurrentUserContext };

export const CurrentUserProvider = ({
  children,
}: React.ComponentProps<any>) => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });

  const [_, requestLogout] = useLogoutMutation();

  const router = useRouter();
  const [
    contextState,
    setContextState,
  ] = React.useState<CurrentUserContextValue>(defaultValue);

  React.useEffect(() => {
    if (!fetching) {
      if (!data?.me.errors && data?.me.user) {
        setContextState({
          ...contextState,
          ...data?.me.user,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        setContextState({
          isAuthenticated: false,
          loading: false,
          logout: () => {},
        });
        router.push("/login");
      }
    }
  }, [data, fetching]);

  const logout = React.useCallback(async () => {
    try {
      await requestLogout();
    } catch (err) {
      console.log(err);
    }
  }, [requestLogout, contextState]);

  const wrappedContextState = React.useMemo(() => {
    return { ...contextState, logout };
  }, [contextState, logout]);

  return <Provider value={wrappedContextState}>{children}</Provider>;
};
