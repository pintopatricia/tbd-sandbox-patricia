import { PUSH } from "@ppb/tbd-store/actions/router";
import { UI__NAVIGATE_TO_COMPETITION_VIEW } from "@ppb/tbd-store/actions/navigation";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createCompetitionRegionViewModel } from "./competition-region-card-view-model";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getCompetitionRegionCardByURNSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getCompetitionRegionCardByURNSelector),
}));

jest.mock("./competition-region-card-view-model", () => ({
  createCompetitionRegionViewModel: jest.fn(),
}));

const stateMock = {
  layouts: {
    cards: {
      competitionregions: {
        "ppb:tbd:competitionregions:1": {
          urn: "ppb:tbd:competitionregions:1",
        },
      },
    },
  },
  entities: {
    competitions: {
      "ppb:competition:123": {
        urn: "ppb:competition:123",
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the selectors", () => {
    makeMapStateToProps();
    expect(createCardByURNSelector).toHaveBeenCalledWith();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
    expect(createCompetitionRegionViewModel).toHaveBeenCalledWith();
    expect(createCompetitionRegionViewModel).toHaveBeenCalledTimes(1);
  });

  it("should return the mapStateToProps function", () => {
    const mapStateToProps = makeMapStateToProps();
    expect(mapStateToProps).toEqual(expect.any(Function));
  });

  describe("mapStateToProps", () => {
    it("should get the competitionRegionCard by its URN", () => {
      createCardByURNSelector.mockReturnValue(getCompetitionRegionCardByURNSelector);
      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: "ppb:tbd:competitionRegionCard:1" });
      expect(getCompetitionRegionCardByURNSelector).toHaveBeenCalledTimes(1);
      expect(getCompetitionRegionCardByURNSelector).toHaveBeenCalledWith(
        {
          "ppb:tbd:competitionregions:1": {
            urn: "ppb:tbd:competitionregions:1",
          },
        },
        "ppb:tbd:competitionRegionCard:1",
      );
    });

    describe("when competitionRegionCard is undefined", () => {
      it("should return empty object", () => {
        createCardByURNSelector.mockReturnValue(getCompetitionRegionCardByURNSelector);
        getCompetitionRegionCardByURNSelector.mockReturnValueOnce(undefined);

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:competitionRegionCard:1" });
        expect(props).toEqual({});
      });
    });

    describe("when competitionRegionCard is defined", () => {
      it("should call getCompetitionRegionViewModel with the correct args", () => {
        createCardByURNSelector.mockReturnValue(getCompetitionRegionCardByURNSelector);
        getCompetitionRegionCardByURNSelector.mockReturnValueOnce(stateMock.layouts.cards.competitionregions);

        const getCompetitionRegionViewModel = jest.fn();
        createCompetitionRegionViewModel.mockReturnValue(getCompetitionRegionViewModel);

        const mapStateToProps = makeMapStateToProps();

        mapStateToProps(stateMock, { urn: "ppb:tbd:competitionRegionCard:1" });

        expect(getCompetitionRegionViewModel).toHaveBeenCalledWith(stateMock, "ppb:tbd:competitionRegionCard:1");
      });

      it("should return the correct props", () => {
        createCardByURNSelector.mockReturnValue(getCompetitionRegionCardByURNSelector);
        getCompetitionRegionCardByURNSelector.mockReturnValueOnce(stateMock.layouts.cards.competitionregions);

        const getCompetitionRegionViewModel = jest.fn();
        createCompetitionRegionViewModel.mockReturnValue(getCompetitionRegionViewModel);
        getCompetitionRegionViewModel.mockReturnValueOnce([
          {
            title: "Region 1",
            competitionViewLinks: [
              {
                title: "Competition 1",
                viewLink: "VIEWLINK",
              },
              {
                title: "Competition 2",
                viewLink: "VIEWLINK",
              },
            ],
          },
          {
            title: "Region 2",
            competitionViewLinks: [
              {
                title: "Competition 1",
                viewLink: "VIEWLINK",
              },
            ],
          },
        ]);

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:competitionRegionCard:1" });

        expect(getCompetitionRegionViewModel).toHaveBeenCalledWith(stateMock, "ppb:tbd:competitionRegionCard:1");

        expect(props).toEqual({
          competitionRegions: [
            {
              title: "Region 1",
              competitionViewLinks: [
                {
                  title: "Competition 1",
                  viewLink: "VIEWLINK",
                },
                {
                  title: "Competition 2",
                  viewLink: "VIEWLINK",
                },
              ],
            },
            {
              title: "Region 2",
              competitionViewLinks: [
                {
                  title: "Competition 1",
                  viewLink: "VIEWLINK",
                },
              ],
            },
          ],
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchPushAction", () => {
    it("should dispatch push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;

      expect(dispatchPushAction({ viewUrl: "viewUrl", viewUrn: "viewUrn" })).toEqual({
        type: PUSH,
        payload: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
      });
    });
  });

  describe("dispatchNavigateToCompetitionView", () => {
    it("should dispatch navigate to competition view action", () => {
      const { dispatchNavigateToCompetitionView } = mapDispatchToProps;
      const cardUrn = "cardUrn";
      const name = "Competition Name";
      const viewLink = {
        viewUrn: "viewUrn",
        viewUrl: "viewUrn",
      };
      expect(dispatchNavigateToCompetitionView(cardUrn, viewLink.viewUrl, name)).toEqual({
        type: UI__NAVIGATE_TO_COMPETITION_VIEW,
        payload: { cardType: "CompetitionRegionCard", cardUrn, href: viewLink.viewUrl, text: name },
      });
    });
  });
});
