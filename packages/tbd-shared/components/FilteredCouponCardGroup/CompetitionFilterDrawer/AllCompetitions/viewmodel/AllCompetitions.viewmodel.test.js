import "jest-dom/extend-expect";
import { useAllCompetitionsFilterQuery } from "../../model/useAllCompetitionsFilterQuery.graphql";
import { useAllCompetitionsVM } from "./AllCompetitions.viewmodel";

jest.mock("../../model/useAllCompetitionsFilterQuery.graphql", () => ({
  useAllCompetitionsFilterQuery: jest.fn(),
}));

jest.mock("../../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

function setup({ data = null, loading = false } = {}) {
  useAllCompetitionsFilterQuery.mockReturnValue({ data, loading });
}

describe("ConnectedAllCompetitions", () => {
  beforeEach(jest.clearAllMocks);

  describe("when is loading", () => {
    it("should return competitions as null and loading as true", async () => {
      setup({ loading: true });
      expect(useAllCompetitionsVM("urn")).toStrictEqual({ loading: true, competitions: null });
    });
  });

  describe("when is loaded", () => {
    describe("if no competition is fetched", () => {
      it("should return loaded false and retrieved competitions", async () => {
        setup({ loading: false });
        expect(useAllCompetitionsVM("urn")).toStrictEqual({ loading: false, competitions: null });
      });
    });
    describe("if has competitions", () => {
      it("should render the component", async () => {
        setup({
          loading: false,
          data: {
            Cards: [
              {
                filterOptions: {
                  competitionsFilter: {
                    allCompetitions: [
                      {
                        country: {
                          code: "GB",
                          flag: {
                            vector: "vector:gb",
                          },
                        },
                        competitions: [
                          {
                            urn: "ppb:competition:1",
                            name: "Competition 1",
                            competitionId: 1,
                          },
                        ],
                      },
                      {
                        country: {
                          code: "PT",
                          flag: {
                            vector: "vector:pt",
                          },
                        },
                        competitions: [
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
        expect(useAllCompetitionsVM("urn")).toStrictEqual({
          loading: false,
          competitions: [
            {
              id: "GB",
              flag: "vector:gb",
              title: "I18N.COUNTRIES.GB",
              items: [
                {
                  id: "ppb:competition:1",
                  isSelected: false,
                  text: "Competition 1",
                },
              ],
            },
            {
              id: "PT",
              flag: "vector:pt",
              title: "I18N.COUNTRIES.PT",
              items: [
                {
                  id: "ppb:competition:3",
                  isSelected: false,
                  text: "Competition 3",
                },
              ],
            },
          ],
        });
      });
    });
  });
});
