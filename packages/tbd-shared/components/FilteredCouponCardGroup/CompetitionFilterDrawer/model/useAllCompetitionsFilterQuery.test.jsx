import { useQuery } from "@apollo/client/react";
import { getCardQuery, useAllCompetitionsFilterQuery } from "./useAllCompetitionsFilterQuery.graphql";

jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(() => "query result"),
}));

describe("useAllCompetitionsFilterQuery", () => {
  it("should call useQuery with urn", () => {
    const result = useAllCompetitionsFilterQuery("some:urn");

    expect(useQuery).toHaveBeenCalledWith(getCardQuery, {
      variables: {
        urn: "some:urn",
      },
    });

    expect(result).toBe("query result");
  });
});
