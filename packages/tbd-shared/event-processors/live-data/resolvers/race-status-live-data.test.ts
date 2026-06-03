import { RaceResultType, RaceStatus } from "@ppb/tbd-store/clients/sca/sports-content-api-response-types";
import { getApolloClient } from "../../../apollo-client/client";
import { updateRaceStatus } from "./race-status-live-data";

jest.mock("../../../apollo-client/client", () => ({
  getApolloClient: jest.fn(),
}));

describe("updateRaceStatus", () => {
  const identify = jest.fn();
  const modify = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getApolloClient as jest.Mock).mockReturnValue({
      cache: {
        identify,
        modify,
      },
    });
  });

  it("does nothing when payload is undefined", () => {
    updateRaceStatus(undefined);

    expect(getApolloClient).not.toHaveBeenCalled();
  });

  it("updates both deprecated details and horse raceKind details", () => {
    identify.mockReturnValue("Race:urn:race:1");

    updateRaceStatus({
      "urn:race:1": {
        status: RaceStatus.RESULT,
        resultType: RaceResultType.QUICK_RESULT,
      },
    });

    expect(identify).toHaveBeenCalledWith({ __typename: "Race", urn: "urn:race:1" });
    expect(modify).toHaveBeenCalledTimes(1);

    const [{ fields }] = modify.mock.calls[0];

    expect(
      fields.details({
        name: "Race 1",
        status: "OFF",
        resultType: null,
      }),
    ).toEqual({
      name: "Race 1",
      status: "RESULT",
      resultType: "QUICK_RESULT",
    });

    expect(
      fields.raceKind({
        __typename: "HorseRaceKind",
        runners: [],
        details: {
          numberOfRunners: 5,
          status: "OFF",
          resultType: null,
        },
      }),
    ).toEqual({
      __typename: "HorseRaceKind",
      runners: [],
      details: {
        numberOfRunners: 5,
        status: "RESULT",
        resultType: "QUICK_RESULT",
      },
    });
  });

  it("leaves non-horse raceKind values unchanged", () => {
    identify.mockReturnValue("Race:urn:race:2");

    updateRaceStatus({
      "urn:race:2": {
        status: RaceStatus.RESULT,
        resultType: RaceResultType.FULL_RESULT,
      },
    });

    const [{ fields }] = modify.mock.calls[0];
    const cachedRaceKind = {
      __typename: "GreyhoundRaceKind",
      details: {
        numberOfRunners: 6,
      },
      runners: [],
    };

    expect(fields.raceKind(cachedRaceKind)).toBe(cachedRaceKind);
  });

  it("skips cache modification when the race is not in the cache", () => {
    identify.mockReturnValue(undefined);

    updateRaceStatus({
      "urn:race:3": {
        status: RaceStatus.RESULT,
        resultType: RaceResultType.QUICK_RESULT,
      },
    });

    expect(modify).not.toHaveBeenCalled();
  });
});