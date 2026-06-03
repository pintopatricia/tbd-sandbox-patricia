import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { getApolloClient } from "../../../apollo-client/client";
import { Exact } from "../../../types/__generated__/graphql";

export async function fetchApolloQuery<T>(urn: string, query: TypedDocumentNode<T, Exact<{ urn: string | string[] }>>) {
  const apolloClient = getApolloClient();

  try {
    const { data } = await apolloClient.query({
      query,
      variables: { urn },
    });
    return data;
  } catch {
    return null;
  }
}
