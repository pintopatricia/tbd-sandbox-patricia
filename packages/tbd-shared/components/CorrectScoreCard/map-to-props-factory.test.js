import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn((translation) => translation.key),
}));

const urnMock = "ppb:tbd:card:correctscorecard:11111";

const stateMock = {
  layouts: {
    cards: {
      correctscorecard: {},
    },
  },
  entities: {
    sportsbookmarkets: {},
  },
};
const getCorrectScoreCardByURN = jest.fn();
const getSportbookMarketByURN = jest.fn();

describe("map-state-props", () => {
  describe("mapStateToProps", () => {
    beforeEach(jest.clearAllMocks);

    describe("when card is not defined", () => {
      it("should return empty object", () => {
        createCardByURNSelector.mockReturnValue(getCorrectScoreCardByURN);
        getCorrectScoreCardByURN.mockReturnValueOnce(undefined);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(stateMock, { urn: urnMock });

        expect(stateToProps).toEqual({});
      });
    });

    describe("when card is defined", () => {
      beforeEach(() => {
        createCardByURNSelector.mockReturnValue(getCorrectScoreCardByURN);
        getCorrectScoreCardByURN.mockReturnValueOnce({
          market: "ppb:tbd:sbkMarket:11111",
          urn: "ppb:tbd:card:111",
          numberOfItemsToDisplay: 5,
        });
      });
      describe("when market is defined", () => {
        let stateToProps;
        beforeEach(() => {
          createSportsbookMarketByURNSelector.mockReturnValue(getSportbookMarketByURN);
          getSportbookMarketByURN.mockReturnValueOnce({
            runners: [
              {
                name: "1-0",
                urn: "ppb:runner:urn:1",
                selectionId: 1234,
              },
              {
                name: "4-0",
                urn: "ppb:runner:urn:2",
                selectionId: 1234,
              },
              {
                name: "1-1",
                urn: "ppb:runner:urn:3",
                selectionId: 1234,
              },
              {
                name: "1-2",
                urn: "ppb:runner:urn:4",
                selectionId: 1234,
              },
              {
                name: "3-0",
                urn: "ppb:runner:urn:5",
                selectionId: 1234,
              },
            ],
          });
          const mapStateToProps = makeMapStateToProps();
          stateToProps = mapStateToProps(stateMock, { urn: urnMock });
        });

        it("should return a state with right props", () => {
          expect(stateToProps).toEqual({
            marketUrn: "ppb:tbd:sbkMarket:11111",
            numberOfItemsToDisplay: 5,
            numberOfLines: 3,
            columns: [
              {
                label: "I18N.CAPTION.HOME",
                runners: [
                  {
                    label: "1-0",
                    runnerUrn: "ppb:runner:urn:1",
                    selectionId: 1234,
                  },
                  {
                    label: "4-0",
                    runnerUrn: "ppb:runner:urn:2",
                    selectionId: 1234,
                  },
                  {
                    label: "3-0",
                    runnerUrn: "ppb:runner:urn:5",
                    selectionId: 1234,
                  },
                ],
              },
              {
                label: "I18N.CAPTION.DRAW",
                runners: [
                  {
                    label: "1-1",
                    runnerUrn: "ppb:runner:urn:3",
                    selectionId: 1234,
                  },
                ],
              },
              {
                label: "I18N.CAPTION.AWAY",
                runners: [
                  {
                    label: "1-2",
                    runnerUrn: "ppb:runner:urn:4",
                    selectionId: 1234,
                  },
                ],
              },
            ],
          });
        });
      });
      describe("when market is not defined", () => {
        it("should return empty object", () => {
          createSportsbookMarketByURNSelector.mockReturnValue(getSportbookMarketByURN);
          getSportbookMarketByURN.mockReturnValueOnce(undefined);

          const mapStateToProps = makeMapStateToProps();
          const stateToProps = mapStateToProps(stateMock, { urn: urnMock });

          expect(stateToProps).toEqual({});
        });
      });
    });

    describe("mapDispatchToProps", () => {
      describe("dispatchToggleShowMoreRunners", () => {
        it("should return the correct action creator", () => {
          const { dispatchToggleShowMoreRunners } = mapDispatchToProps;

          expect(dispatchToggleShowMoreRunners("cardURN")).toEqual({
            payload: { cardUrn: "cardURN" },
            type: "UI__TOGGLE_SHOW_MORE_RUNNERS",
          });
        });
      });
    });
  });
});
