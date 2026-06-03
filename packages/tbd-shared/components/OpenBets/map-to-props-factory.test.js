import { createFindCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { createFindCardbyURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { MY_BETS_RESET_FILTERS } from "@ppb/tbd-store/actions/my-bets";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createFindCardGroupByURNSelector: jest.fn().mockReturnValue(jest.fn()),
}));
jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createFindCardbyURNSelector: jest.fn().mockReturnValue(jest.fn()),
}));

const DEFAULT_STATE = {
  layouts: {
    cards: {},
    swimlanecardgroups: {},
  },
  entities: {
    throttles: {},
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when a viewlink is available in the card", () => {
    it("should return the viewlink", () => {
      createFindCardbyURNSelector.mockReturnValue(jest.fn().mockReturnValue({ viewOpenBets: { viewUrn: "ppb:urn" } }));

      const props = makeMapStateToProps()(DEFAULT_STATE, { cardURN: "ppb:card:urn" });

      expect(props.viewLink).toEqual({ viewUrn: "ppb:urn" });
    });
  });

  describe("when a viewlink is available in the cardgroup", () => {
    it("should return the viewlink", () => {
      createFindCardbyURNSelector.mockReturnValue(jest.fn().mockReturnValue({ viewOpenBets: undefined }));
      createFindCardGroupByURNSelector.mockReturnValue(
        jest.fn().mockReturnValue({ viewOpenBets: { viewUrn: "ppb:cardgroup:urn" } }),
      );

      const props = makeMapStateToProps()(DEFAULT_STATE, { cardURN: "ppb:card:urn" });

      expect(props.viewLink).toEqual({ viewUrn: "ppb:cardgroup:urn" });
    });
  });

  describe("when a viewlink is available in both", () => {
    it("should return the first available", () => {
      createFindCardbyURNSelector.mockReturnValue(jest.fn().mockReturnValue({ viewOpenBets: { viewUrn: "ppb:urn" } }));
      createFindCardGroupByURNSelector.mockReturnValue(
        jest.fn().mockReturnValue({ viewOpenBets: { viewUrn: "ppb:cardgroup:urn" } }),
      );

      const props = makeMapStateToProps()(DEFAULT_STATE, { cardURN: "ppb:card:urn" });

      expect(props.viewLink).toEqual({ viewUrn: "ppb:cardgroup:urn" });
    });
  });

  describe("when a viewlink is not available", () => {
    it("should return no viewLink", () => {
      createFindCardbyURNSelector.mockReturnValue(jest.fn().mockReturnValue({ viewOpenBets: undefined }));
      createFindCardGroupByURNSelector.mockReturnValue(jest.fn().mockReturnValue({ viewOpenBets: undefined }));

      const props = makeMapStateToProps()(DEFAULT_STATE, { cardURN: "ppb:card:urn" });

      expect(props.viewLink).toBeUndefined();
    });
  });
});

describe("makeMapDispatchToProps", () => {
  describe("dispatchOpenBetsNavigation", () => {
    it("should map dispatchOpenBetsNavigation properly", () => {
      expect(makeMapDispatchToProps().dispatchOpenBetsNavigation).toEqual(expect.any(Function));
    });

    it("should dispatch a PUSH when it's called", () => {
      const dispatchSpy = jest.fn();
      makeMapDispatchToProps(dispatchSpy).dispatchOpenBetsNavigation({ viewUrn: "ppb:urn" });

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: PUSH,
        payload: {
          viewUrn: "ppb:urn",
        },
      });

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: MY_BETS_RESET_FILTERS,
      });
    });
  });
});
