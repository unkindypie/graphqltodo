import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";

import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { SSRExchange } from "next-urql";

export const createUrqlClient = (ssrExchange: SSRExchange) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" as const },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result as any,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: {
                      user: result.login.user,
                      __typename: "UserResponse",
                      errors: null,
                    },
                  };
                }
              }
            );
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result as any,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: {
                      user: result.register.user,
                      __typename: "UserResponse",
                      errors: null,
                    },
                  };
                }
              }
            );
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result as any,
              (result, query) => {
                if (!result.logout) {
                  return query;
                } else {
                  return {
                    me: {
                      user: null,
                      __typename: "UserResponse",
                      errors: null,
                    },
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
