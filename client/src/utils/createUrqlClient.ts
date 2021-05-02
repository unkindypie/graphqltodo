import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";

import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  DeleteTaskMutation,
  TasksQuery,
  TasksDocument,
  CreateTaskMutation,
  DeleteTaskKindMutation,
  UpdateTaskKindMutation,
  TaskKindsQuery,
  TaskKindsDocument,
  CreateTaskKindMutation,
  RemoveAccountMutation,
  UsersQuery,
  UsersDocument,
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
          removeAccount: (_result, args, cache, info) => {
            betterUpdateQuery<RemoveAccountMutation, UsersQuery>(
              cache,
              {
                query: UsersDocument,
              },
              _result as any,
              (result, query) => {
                if (!result.removeAccount) {
                  return query;
                } else {
                  return {
                    users: query.users?.filter((user) => user.id !== args?.id),
                  };
                }
              }
            );
          },
          deleteTask: (_result, args, cache, info) => {
            betterUpdateQuery<DeleteTaskMutation, TasksQuery>(
              cache,
              {
                query: TasksDocument,
              },
              _result as any,
              (result, query) => {
                if (!result.deleteTask) {
                  return query;
                } else {
                  return {
                    tasks: query.tasks.filter((task) => task.id !== args?.id),
                  };
                }
              }
            );
          },
          createTask: (_result, args, cache, info) => {
            betterUpdateQuery<CreateTaskMutation, TasksQuery>(
              cache,
              {
                query: TasksDocument,
              },
              _result as any,
              (result, query) => {
                if (!result.createTask) {
                  return query;
                } else {
                  if (!query) return query;
                  return {
                    tasks: query.tasks
                      ? [result.createTask, ...query.tasks]
                      : [],
                  };
                }
              }
            );
          },
          deleteTaskKind: (_result, args, cache, info) => {
            betterUpdateQuery<DeleteTaskKindMutation, TaskKindsQuery>(
              cache,
              {
                query: TaskKindsDocument,
              },
              _result as any,
              (result, query) => {
                if (!result.deleteTaskKind) {
                  return query;
                } else {
                  return {
                    taskKinds: query.taskKinds.filter(
                      (kind) => kind.id !== args?.id
                    ),
                  };
                }
              }
            );
          },
          updateTaskKind: (_result, args, cache, info) => {
            betterUpdateQuery<UpdateTaskKindMutation, TaskKindsQuery>(
              cache,
              {
                query: TaskKindsDocument,
              },
              _result as any,
              (result, query) => {
                if (!result.updateTaskKind) {
                  return query;
                } else {
                  return {
                    taskKinds: query.taskKinds.map((kind) =>
                      kind.id === args?.id
                        ? { ...kind, ...result.updateTaskKind }
                        : kind
                    ),
                  };
                }
              }
            );
          },
          createTaskKind: (_result, args, cache, info) => {
            betterUpdateQuery<CreateTaskKindMutation, TaskKindsQuery>(
              cache,
              {
                query: TaskKindsDocument,
              },
              _result as any,
              (result, query) => {
                if (!result.createTaskKind.kind) {
                  return query;
                } else {
                  if (!query) return query;

                  return {
                    taskKinds: [...query.taskKinds, result.createTaskKind.kind],
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
