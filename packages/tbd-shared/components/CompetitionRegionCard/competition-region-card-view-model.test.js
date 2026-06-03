import { createHydratedCompetitionRegionSelector } from "@ppb/tbd-store/state/application-state-selectors";
import { createCompetitionRegionViewModel } from "./competition-region-card-view-model";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/application-state-selectors");
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    localeCodeBcp47: "pt-BR",
  })),
}));

describe("createCompetitionRegionViewModel", () => {
  afterEach(jest.clearAllMocks);

  describe("when there are no competition regions", () => {
    const state = {
      layouts: {
        cards: {},
      },
    };
    beforeAll(() => {
      createHydratedCompetitionRegionSelector.mockReturnValue(() => undefined);
    });
    it("should return null", () => {
      const result = createCompetitionRegionViewModel()(state, "URN");
      expect(result).toBeNull();
    });
  });

  describe("when there are competition regions", () => {
    const state = {
      layouts: {
        cards: {
          competitionregions: {
            "ppb:tbd:competitionregions:1": {
              urn: "ppb:tbd:competitionregions:1",
              competitionRegions: [
                {
                  urn: "ppb:tbd:country:pt",
                  title: "Region 1",
                  code: "PT",
                  flag: "flag-pt",
                  competitionViewLinks: [
                    {
                      competition: { name: "Competition 1" },
                      viewLink: "viewLink1",
                    },
                  ],
                },
                {
                  urn: "ppb:tbd:country:en",
                  title: "Region 2",
                  code: "EN",
                  competitionViewLinks: [
                    {
                      competition: { name: "Competition 2" },
                      viewLink: "viewLink2",
                    },
                  ],
                },
                {
                  urn: "ppb:tbd:country:es",
                  title: "Region 3",
                  code: "ES",
                  competitionViewLinks: [],
                },
              ],
            },
          },
        },
      },
    };

    const changedState = {
      layouts: {
        cards: {
          competitionregions: {
            "ppb:tbd:competitionregions:1": {
              urn: "ppb:tbd:competitionregions:1",
              changed: true,
              competitionRegions: [
                {
                  urn: "ppb:tbd:country:pt",
                  title: "Region 1",
                  code: "PT",
                  flag: "flag-pt",
                  competitionViewLinks: [
                    {
                      competition: { name: "Competition 1" },
                      viewLink: "viewLink1",
                    },
                  ],
                },
                {
                  urn: "ppb:tbd:country:en",
                  title: "Region 2",
                  code: "EN",
                  competitionViewLinks: [
                    {
                      competition: { name: "Competition 2" },
                      viewLink: "viewLink2",
                    },
                  ],
                },
                {
                  urn: "ppb:tbd:country:es",
                  title: "Region 3",
                  code: "ES",
                  competitionViewLinks: [],
                },
              ],
            },
          },
        },
      },
    };

    const setup = () => {
      createHydratedCompetitionRegionSelector.mockReturnValue(
        () => state.layouts.cards.competitionregions["ppb:tbd:competitionregions:1"].competitionRegions,
      );
    };

    it("should create the correct region view model", () => {
      setup();

      const result = createCompetitionRegionViewModel()(state, "URN");

      expect(result).toEqual([
        {
          urn: "ppb:tbd:country:en",
          title: "I18N.COUNTRIES.EN",
          flag: undefined,
          competitionViewLinks: [
            {
              title: "Competition 2",
              viewLink: "viewLink2",
            },
          ],
        },
        {
          urn: "ppb:tbd:country:pt",
          title: "I18N.COUNTRIES.PT",
          flag: "flag-pt",
          competitionViewLinks: [
            {
              title: "Competition 1",
              viewLink: "viewLink1",
            },
          ],
        },
      ]);
    });

    it("should call createHydratedCompetitionRegionSelector", () => {
      setup();

      createCompetitionRegionViewModel()(state, "URN");

      expect(createHydratedCompetitionRegionSelector).toHaveBeenCalledTimes(1);
    });

    describe("when calling the same selector with the same information", () => {
      it("should return the same reference", () => {
        setup();

        const getCompetitionRegionViewModel = createCompetitionRegionViewModel();

        const firstResponse = getCompetitionRegionViewModel(state, "URN");
        const secondResponse = getCompetitionRegionViewModel(state, "URN");

        expect(firstResponse === secondResponse).toBe(true);
      });
    });

    describe("when calling the same selector with different state", () => {
      it("should return another reference", () => {
        const mockHydratedCompetitionRegionSelector = jest.fn();
        createHydratedCompetitionRegionSelector.mockReturnValue(mockHydratedCompetitionRegionSelector);
        mockHydratedCompetitionRegionSelector.mockReturnValueOnce(
          state.layouts.cards.competitionregions["ppb:tbd:competitionregions:1"].competitionRegions,
        );
        mockHydratedCompetitionRegionSelector.mockReturnValueOnce(
          changedState.layouts.cards.competitionregions["ppb:tbd:competitionregions:1"].competitionRegions,
        );

        const getCompetitionRegionViewModel = createCompetitionRegionViewModel();

        const firstResponse = getCompetitionRegionViewModel(state, "URN");
        const secondResponse = getCompetitionRegionViewModel(changedState, "URN");

        expect(firstResponse === secondResponse).toBe(false);
      });
    });
  });
});
