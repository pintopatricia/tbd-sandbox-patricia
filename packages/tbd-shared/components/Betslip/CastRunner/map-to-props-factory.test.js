import {
  getBettingResolvers,
  getSportsbookBettingRunners,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { buildBaseCastRunner, buildOrderedCastRunner } from "../betslip-mapper";

import { makeMapStateToProps } from "./map-to-props-factory";

const getUserDetails = jest.fn();

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingRunners: jest.fn(() => ({})),
  getBettingResolvers: jest.fn().mockReturnValue({ getMetadata: jest.fn() }),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createBettingRunnersMetadataSelector: jest.fn(() => jest.fn(() => ({}))),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("../betslip-mapper", () => ({
  buildBaseCastRunner: jest.fn().mockReturnValue({ base: "base" }),
  buildOrderedCastRunner: jest.fn().mockReturnValue({ ordered: "ordered" }),
}));

describe("ConnectedCastRunner map-to-props-factory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    function setupMapStateToProps({
      appState = { entities: { throttles: {} } },
      ownProps = {
        id: "runnerId",
        isOrderable: true,
      },
      runners = {},
      getBettingMetadata = jest.fn(() => ({})),
    } = {}) {
      getSportsbookBettingRunners.mockReturnValue(runners);
      getBettingResolvers.mockReturnValue({ getMetadata: getBettingMetadata });
      getUserDetails.mockReturnValue("userDetails");

      return makeMapStateToProps()(appState, ownProps);
    }

    it("should call getBettingResolvers", () => {
      setupMapStateToProps();

      expect(getBettingResolvers).toHaveBeenCalled();
    });

    it("should call getBettingMetadata with the state", () => {
      const getBettingMetadata = jest.fn(() => ({}));
      setupMapStateToProps({ appState: { entities: { entity: "entity", throttles: {} } }, getBettingMetadata });

      expect(getBettingMetadata).toHaveBeenCalledWith({ entities: { entity: "entity", throttles: {} } });
    });

    it("should return the built runner with the id", () => {
      const getBettingMetadata = jest.fn(() => ({ "R:1": { name: "name" } }));
      const runners = { "R:1": { id: "R:1" } };

      const props = setupMapStateToProps({
        appState: { entities: { entity: "entity", throttles: {} } },
        getBettingMetadata,
        runners,
        ownProps: { id: "R:1", isOrderable: true },
      });

      expect(props).toEqual({ ordered: "ordered", id: "R:1" });
    });

    describe("when the runner can be ordered", () => {
      it("should call buildOrderedCastRunner with the runner and relevant metadata", () => {
        const getBettingMetadata = jest.fn(() => ({ "R:1": { name: "name" } }));
        const runners = { "R:1": { id: "R:1" } };

        setupMapStateToProps({
          appState: { entities: { entity: "entity", throttles: {} } },
          getBettingMetadata,
          runners,
          ownProps: { id: "R:1", isOrderable: true },
        });

        expect(buildOrderedCastRunner).toHaveBeenCalledWith({ id: "R:1" }, { name: "name" }, "userDetails");
      });
    });

    describe("when the runner does not have order", () => {
      it("should call buildBaseCastRunner with the runner and relevant metadata", () => {
        const getBettingMetadata = jest.fn(() => ({ "R:1": { name: "name" } }));
        const runners = { "R:1": { id: "R:1" } };

        setupMapStateToProps({
          appState: { entities: { entity: "entity", throttles: {} } },
          getBettingMetadata,
          runners,
          ownProps: { id: "R:1", isOrderable: false },
        });

        expect(buildBaseCastRunner).toHaveBeenCalledWith({ name: "name" }, "userDetails");
      });
    });
  });
});
