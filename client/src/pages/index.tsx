import { withUrqlClient } from "next-urql";
import React from "react";
import Header from "../components/Header";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Spinner } from "@chakra-ui/spinner";

const Index = () => {
  const [{ data, fetching }] = usePostsQuery();

  return (
    <div>
      {fetching && <Spinner />}

      {data?.posts?.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
