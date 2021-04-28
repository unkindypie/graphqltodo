import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};


export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTask: Task;
  updateTask?: Maybe<Task>;
  deleteTask: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  createTaskKind: TaskKindMutationResponse;
  updateTaskKind?: Maybe<TaskKind>;
  deleteTaskKind: Scalars['Boolean'];
};


export type MutationCreateTaskArgs = {
  options: TaskCreateInput;
};


export type MutationUpdateTaskArgs = {
  options: TaskUpdateInput;
};


export type MutationDeleteTaskArgs = {
  id: Scalars['Float'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  options: UsernamePasswordInput;
};


export type MutationCreateTaskKindArgs = {
  name: Scalars['String'];
};


export type MutationUpdateTaskKindArgs = {
  options: TaskKindUpdateInput;
};


export type MutationDeleteTaskKindArgs = {
  id: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  tasks: Array<Task>;
  task?: Maybe<Task>;
  me: UserResponse;
  taskKinds: Array<TaskKind>;
};


export type QueryTaskArgs = {
  id: Scalars['Float'];
};

export type Task = {
  __typename?: 'Task';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  kind: TaskKind;
  user: User;
  dateTime: Scalars['String'];
};

export type TaskCreateInput = {
  title: Scalars['String'];
  description: Scalars['String'];
  kind: TaskKindInput;
  dateTime: Scalars['DateTime'];
};

export type TaskKind = {
  __typename?: 'TaskKind';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type TaskKindInput = {
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type TaskKindMutationResponse = {
  __typename?: 'TaskKindMutationResponse';
  errors?: Maybe<Array<FieldError>>;
  kind?: Maybe<TaskKind>;
};

export type TaskKindUpdateInput = {
  name: Scalars['String'];
  id: Scalars['Float'];
};

export type TaskUpdateInput = {
  id: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  kind?: Maybe<TaskKindInput>;
  dateTime?: Maybe<Scalars['DateTime']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  updatedAt: Scalars['String'];
  createdAt: Scalars['String'];
  username: Scalars['String'];
  tasks: Array<Task>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type RegularTaskFragment = (
  { __typename?: 'Task' }
  & Pick<Task, 'id' | 'createdAt' | 'updatedAt' | 'title' | 'description' | 'dateTime'>
  & { kind: (
    { __typename?: 'TaskKind' }
    & Pick<TaskKind, 'id' | 'name'>
  ), user: (
    { __typename?: 'User' }
    & Pick<User, 'username' | 'id'>
  ) }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type CreateTaskMutationVariables = Exact<{
  options: TaskCreateInput;
}>;


export type CreateTaskMutation = (
  { __typename?: 'Mutation' }
  & { createTask: (
    { __typename?: 'Task' }
    & RegularTaskFragment
  ) }
);

export type CreateTaskKindMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateTaskKindMutation = (
  { __typename?: 'Mutation' }
  & { createTaskKind: (
    { __typename?: 'TaskKindMutationResponse' }
    & { kind?: Maybe<(
      { __typename?: 'TaskKind' }
      & Pick<TaskKind, 'id' | 'name'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type DeleteTaskMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteTaskMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTask'>
);

export type DeleteTaskKindMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteTaskKindMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTaskKind'>
);

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type UpdateTaskMutationVariables = Exact<{
  options: TaskUpdateInput;
}>;


export type UpdateTaskMutation = (
  { __typename?: 'Mutation' }
  & { updateTask?: Maybe<(
    { __typename?: 'Task' }
    & RegularTaskFragment
  )> }
);

export type UpdateTaskKindMutationVariables = Exact<{
  options: TaskKindUpdateInput;
}>;


export type UpdateTaskKindMutation = (
  { __typename?: 'Mutation' }
  & { updateTaskKind?: Maybe<(
    { __typename?: 'TaskKind' }
    & Pick<TaskKind, 'id' | 'name'>
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type TaskKindsQueryVariables = Exact<{ [key: string]: never; }>;


export type TaskKindsQuery = (
  { __typename?: 'Query' }
  & { taskKinds: Array<(
    { __typename?: 'TaskKind' }
    & Pick<TaskKind, 'name' | 'id'>
  )> }
);

export type TasksQueryVariables = Exact<{ [key: string]: never; }>;


export type TasksQuery = (
  { __typename?: 'Query' }
  & { tasks: Array<(
    { __typename?: 'Task' }
    & RegularTaskFragment
  )> }
);

export const RegularTaskFragmentDoc = gql`
    fragment RegularTask on Task {
  id
  createdAt
  updatedAt
  title
  description
  dateTime
  kind {
    id
    name
  }
  user {
    username
    id
  }
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const CreateTaskDocument = gql`
    mutation CreateTask($options: TaskCreateInput!) {
  createTask(options: $options) {
    ...RegularTask
  }
}
    ${RegularTaskFragmentDoc}`;

export function useCreateTaskMutation() {
  return Urql.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument);
};
export const CreateTaskKindDocument = gql`
    mutation CreateTaskKind($name: String!) {
  createTaskKind(name: $name) {
    kind {
      id
      name
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useCreateTaskKindMutation() {
  return Urql.useMutation<CreateTaskKindMutation, CreateTaskKindMutationVariables>(CreateTaskKindDocument);
};
export const DeleteTaskDocument = gql`
    mutation DeleteTask($id: Float!) {
  deleteTask(id: $id)
}
    `;

export function useDeleteTaskMutation() {
  return Urql.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument);
};
export const DeleteTaskKindDocument = gql`
    mutation DeleteTaskKind($id: Float!) {
  deleteTaskKind(id: $id)
}
    `;

export function useDeleteTaskKindMutation() {
  return Urql.useMutation<DeleteTaskKindMutation, DeleteTaskKindMutationVariables>(DeleteTaskKindDocument);
};
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!) {
  login(options: {username: $username, password: $password}) {
    user {
      ...RegularUser
    }
    errors {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $password: String!) {
  register(options: {username: $username, password: $password}) {
    user {
      ...RegularUser
    }
    errors {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateTaskDocument = gql`
    mutation UpdateTask($options: TaskUpdateInput!) {
  updateTask(options: $options) {
    ...RegularTask
  }
}
    ${RegularTaskFragmentDoc}`;

export function useUpdateTaskMutation() {
  return Urql.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument);
};
export const UpdateTaskKindDocument = gql`
    mutation UpdateTaskKind($options: TaskKindUpdateInput!) {
  updateTaskKind(options: $options) {
    id
    name
  }
}
    `;

export function useUpdateTaskKindMutation() {
  return Urql.useMutation<UpdateTaskKindMutation, UpdateTaskKindMutationVariables>(UpdateTaskKindDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const TaskKindsDocument = gql`
    query TaskKinds {
  taskKinds {
    name
    id
  }
}
    `;

export function useTaskKindsQuery(options: Omit<Urql.UseQueryArgs<TaskKindsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TaskKindsQuery>({ query: TaskKindsDocument, ...options });
};
export const TasksDocument = gql`
    query Tasks {
  tasks {
    ...RegularTask
  }
}
    ${RegularTaskFragmentDoc}`;

export function useTasksQuery(options: Omit<Urql.UseQueryArgs<TasksQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TasksQuery>({ query: TasksDocument, ...options });
};