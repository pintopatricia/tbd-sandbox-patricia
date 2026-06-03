import { renderHook } from "@testing-library/react";
import "jest-dom/extend-expect";
import { useAllCompetitionsFilterQuery } from "../../model/useAllCompetitionsFilterQuery.graphql";
import { useActiveCompetitionsVM } from "./ActiveCompetitions.viewmodel";

jest.mock("../../model/useAllCompetitionsFilterQuery.graphql", () => ({
  useAllCompetitionsFilterQuery: jest.fn(),
}));

function setup({ data = null, loading = false } = {}) {
  useAllCompetitionsFilterQuery.mockReturnValue({ data, loading });
}

describe("useActiveCompetitionsVM", () => {
  beforeEach(jest.clearAllMocks);

  describe("when is loading", () => {
    it("should return loading true", async () => {
      setup({ loading: true });
      const { result } = renderHook(() => useActiveCompetitionsVM("urn", ["ids"]));

      expect(result.current).toStrictEqual({ loading: true, selectedCompetitions: [] });
    });
  });

  describe("when is loaded", () => {
    it("should return loading false and corresponding selectedCompetitions", async () => {
      setup({
        loading: false,
        data: {
          Cards: [
            {
              filterOptions: {
                competitionsFilter: {
                  allCompetitions: [
                    {
                      competitions: [
                        {
                          urn: "ppb:competition:1",
                          name: "Competition 1",
                          competitionId: 1,
                        },
                        {
                          urn: "ppb:competition:3",
                          name: "Competition 3",
                          competitionId: 3,
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      });

      const urn = "urn";
      const array = ["ppb:competition:1", "ppb:competition:3"];
      const { result } = renderHook(() => useActiveCompetitionsVM(urn, array));
      expect(result.current).toStrictEqual({
        loading: false,
        selectedCompetitions: [
          { id: "ppb:competition:1", name: "Competition 1" },
          { id: "ppb:competition:3", name: "Competition 3" },
        ],
      });
    });
  });
});
