import { gql } from "../../types/__generated__/gql";

export const ViewRedirectQuery = gql(/* GraphQL */ `
  query ViewRedirect($viewURN: URN!) {
    View(viewURN: $viewURN) {
      __typename
      urn
      url
    }
  }
`);
