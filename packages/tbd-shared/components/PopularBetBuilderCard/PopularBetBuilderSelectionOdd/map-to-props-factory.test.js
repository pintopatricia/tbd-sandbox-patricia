import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { createOddByRunnerUrnSelector } from "@ppb/tbd-store/state/entities/popular-betting-opportunities/popular-betting-opportunities-selectors";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createFormatedOddForPopularBetBuilderSelectionOddVm } from "./popular-bet-builder-selection-odd-view-model";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock(
  "@ppb/tbd-store/state/entities/popular-betting-opportunities/popular-betting-opportunities-selectors",
  () => ({
    createOddByRunnerUrnSelector: jest.fn(() => jest.fn(() => "4/20")),
  }),
);

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createSportsbookDisplayOddsPreferencesSelector: jest.fn(() => jest.fn(() => "some-odd-format")),
}));

jest.mock("./popular-bet-builder-selection-odd-view-model", () => ({
  createFormatedOddForPopularBetBuilderSelectionOddVm: jest.fn(() => jest.fn(() => "4.20")),
}));

const STATE_MOCK = {
  layouts: {},
  entities: {},
};

const CARD_URN = "some:card:urn";
const IS_RACING = false;
const RUNNER_URN = "some:runner:urn";
const MARKET_ID = "some.market.id";
const FORMATED_ODD = "4.20";

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("mapStateToProps", () => {
    describe("when the odd doesn't exist", () => {
      it("must return an empty object", () => {
        createOddByRunnerUrnSelector.mockReturnValueOnce(() => undefined);

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE_MOCK, {
          cardUrn: CARD_URN,
          isRacing: IS_RACING,
          runnerUrn: RUNNER_URN,
          marketId: MARKET_ID,
        });

        expect(props).toEqual({});
      });
    });

    describe("when the format doesn't exist", () => {
      it("must return an empty object", () => {
        createSportsbookDisplayOddsPreferencesSelector.mockReturnValueOnce(() => undefined);

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE_MOCK, {
          cardUrn: CARD_URN,
          isRacing: IS_RACING,
          runnerUrn: RUNNER_URN,
          marketId: MARKET_ID,
        });

        expect(props).toEqual({});
      });
    });

    describe("when the formated odd doesn't exist", () => {
      it("must return an empty object", () => {
        createFormatedOddForPopularBetBuilderSelectionOddVm.mockReturnValueOnce(() => "");

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE_MOCK, {
          cardUrn: CARD_URN,
          isRacing: IS_RACING,
          runnerUrn: RUNNER_URN,
          marketId: MARKET_ID,
        });

        expect(props).toEqual({});
      });
    });

    describe("when the odd exists", () => {
      it("must return the expected props", () => {
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE_MOCK, {
          cardUrn: CARD_URN,
          isRacing: IS_RACING,
          runnerUrn: RUNNER_URN,
          marketId: MARKET_ID,
        });

        expect(props.odd).toEqual(FORMATED_ODD);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchSportsbookMarketUpdatesSubscribe", () => {
    it("should dispatch a SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES when it's called", () => {
      const { dispatchSportsbookMarketUpdatesSubscribe } = mapDispatchToProps;

      expect(dispatchSportsbookMarketUpdatesSubscribe(MARKET_ID)).toEqual({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId: MARKET_ID,
        },
      });
    });
  });

  describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
    it("should dispatch a UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES when it's called", () => {
      const { dispatchSportsbookMarketUpdatesUnsubscribe } = mapDispatchToProps;

      expect(dispatchSportsbookMarketUpdatesUnsubscribe(MARKET_ID)).toEqual({
        type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId: MARKET_ID,
        },
      });
    });
  });
});
