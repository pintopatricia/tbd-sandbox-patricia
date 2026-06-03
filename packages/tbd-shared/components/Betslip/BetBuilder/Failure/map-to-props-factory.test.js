import {
  createGetFailureLegIdsByCombinationGroupIdSelector,
  createGetRunnerByCombinationGroupSelector,
  getBettingResolvers,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createNotificationsViewModelBuilder } from "./bet-builder-failure-mapper";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getExperiment = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiment),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors");
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors");
jest.mock("@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors");
jest.mock("./bet-builder-failure-mapper");
jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

beforeEach(jest.clearAllMocks);

describe("makeMapStateToProps", () => {
  function setup({ metadata, runners = ["R:1", "R:2"] }) {
    const state = {
      entities: {
        something: "entitiesMock",
      },
    };
    const baseMetadata = {
      "R:1": {
        type: "RACING",
        racing: {
          venue: "venue",
        },
      },
      "R:2": {
        type: "RACING",
        racing: {
          venue: "venue",
        },
      },
      "R:3": {
        type: "GENERIC",
        eventName: "eventName",
      },
      "R:4": {
        type: "GENERIC",
        eventName: "eventName",
      },
    };
    const getBettingRunnersMetadataMock = jest.fn().mockReturnValueOnce(metadata || baseMetadata);
    const getNotificationsViewModelMock = jest.fn().mockReturnValueOnce([{ notification: "notificationMock" }]);
    const getTotalBetBuilderFailureMock = jest.fn().mockReturnValueOnce(["L:1"]);
    const getRunnersByCombinationGroupMock = jest.fn().mockReturnValueOnce(runners);

    getBettingResolvers.mockReturnValueOnce({
      getMetadata: getBettingRunnersMetadataMock,
    });
    createNotificationsViewModelBuilder.mockReturnValueOnce(getNotificationsViewModelMock);
    createGetFailureLegIdsByCombinationGroupIdSelector.mockReturnValueOnce(getTotalBetBuilderFailureMock);
    createGetRunnerByCombinationGroupSelector.mockReturnValueOnce(getRunnersByCombinationGroupMock);

    return {
      props: makeMapStateToProps()(state, { combinationGroup: 1 }),
      getBettingRunnersMetadataMock,
      getNotificationsViewModelMock,
      getTotalBetBuilderFailureMock,
      getRunnersByCombinationGroupMock,
    };
  }

  describe("when there is no valid runner metadata", () => {
    it("should return a base state with the bare minimum", () => {
      const { props } = setup({ metadata: {} });

      expect(props).toEqual({
        odds: "I18N.BETSLIP.NOT_AVAILABLE",
        legIds: [],
        failedLegIds: [],
        isPopular: false,
        isPackagedCreatedBets: false,
        notifications: [],
        subtitle: "",
        i18n: {
          odds: "I18N.BETSLIP.ODDS",
          stake: "I18N.BETSLIP.STAKE",
          popular: "I18N.BETSLIP.POPULAR",
          createdBets: "I18N.BETSLIP.RAB",
        },
      });
    });
  });

  describe("when there is valid runner metadata", () => {
    it("should call getBettingRunnersMetadata with state", () => {
      const { getBettingRunnersMetadataMock } = setup({});

      expect(getBettingRunnersMetadataMock).toHaveBeenCalledWith({
        entities: {
          something: "entitiesMock",
        },
      });
    });

    it("should call getRunnersByCombinationGroup with the correct combinationGroup", () => {
      const { getRunnersByCombinationGroupMock } = setup({});

      expect(getRunnersByCombinationGroupMock).toHaveBeenCalledWith(
        {
          entities: {
            something: "entitiesMock",
          },
        },
        1,
      );
    });

    it("should call getLegsByRunner with the runnerIds from the combinationGroup", () => {
      const { getRunnersByCombinationGroupMock } = setup({});

      expect(getRunnersByCombinationGroupMock).toHaveBeenCalledWith(
        {
          entities: {
            something: "entitiesMock",
          },
        },
        1,
      );
    });

    it("should call buildNotifications with the runnerIds from the combinationGroup", () => {
      const { getNotificationsViewModelMock } = setup({});

      expect(getNotificationsViewModelMock).toHaveBeenCalledWith(
        {
          entities: {
            something: "entitiesMock",
          },
        },
        ["R:1", "R:2"],
      );
    });

    it("should return the built props", () => {
      const { props } = setup({});

      expect(props).toEqual({
        i18n: {
          odds: "I18N.BETSLIP.ODDS",
          stake: "I18N.BETSLIP.STAKE",
          popular: "I18N.BETSLIP.POPULAR",
          createdBets: "I18N.BETSLIP.RAB",
        },
        legIds: [],
        failedLegIds: ["L:1"],
        isPopular: false,
        isPackagedCreatedBets: false,
        notifications: [{ notification: "notificationMock" }],
        odds: "I18N.BETSLIP.NOT_AVAILABLE",
        subtitle: "venue",
      });
    });

    describe("when retrieving metadata", () => {
      describe("when racing", () => {
        it("should return the subtitle with the venue", () => {
          const { props } = setup({ runners: ["R:1", "R:2"] });

          expect(props.subtitle).toEqual("venue");
        });
      });

      describe("when generic", () => {
        it("should return the subtitle with the event name", () => {
          const { props } = setup({ runners: ["R:3", "R:4"] });

          expect(props.subtitle).toEqual("eventName");
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  it("should map no dispatch props", () => {
    const dispatch = jest.fn();

    expect(mapDispatchToProps(dispatch)).toEqual({});
  });
});
