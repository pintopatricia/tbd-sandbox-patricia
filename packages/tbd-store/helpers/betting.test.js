import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { getBetslipCard } from "../state/betslip/betslip-card-selectors";

import {
  getUniqueId,
  getRunnerUniqueTaggingId,
  sanitizeBetId,
  prefixLBRBetId,
  createCustomerRefBuilder,
} from "./betting";

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({})),
}));

const runnerUrn = "R:1";
jest.mock("../state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn(() => ({ taggingMetadata: { selections: { [runnerUrn]: {} } } })),
}));

describe("betting helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("getUniqueId", () => {
    it("should call getUserDetails", () => {
      const appState = { state: "state" };
      getUniqueId(appState);

      expect(getUserDetails).toHaveBeenCalledWith(appState);
      expect(getUserDetails).toHaveBeenCalledTimes(1);
    });

    describe("when user is logged out", () => {
      it("should return uniqueId with random characters and timestamp", () => {
        const timestamp = new Date("1987-05-27 19:15:00").getTime();
        jest.spyOn(Date, "now").mockReturnValueOnce(timestamp);
        jest.spyOn(Math, "random").mockReturnValueOnce(0.12262855080403989);
        const randomString = "4excvja";
        getUserDetails.mockReturnValueOnce({ loggedIn: false });

        const uniqueId = getUniqueId({});

        expect(uniqueId).toBe(`i${randomString}${timestamp}`);
      });
    });

    describe("when user is logged in", () => {
      it("should return uniqueId with account id and timestamp", () => {
        const timestamp = new Date("1987-05-27 19:15:00").getTime();
        jest.spyOn(Date, "now").mockReturnValueOnce(timestamp);
        const accountId = "666";
        getUserDetails.mockReturnValueOnce({ accountId, loggedIn: true });

        const uniqueId = getUniqueId({});

        expect(uniqueId).toBe(`i${accountId}${timestamp}`);
      });
    });
  });

  describe("getRunnerUniqueTaggingId", () => {
    it("should call getBetslipCard", () => {
      const appState = { state: "state" };
      getRunnerUniqueTaggingId(appState, runnerUrn);

      expect(getBetslipCard).toHaveBeenCalledWith(appState);
    });

    it("should return the runner uniqueId", () => {
      getBetslipCard.mockReturnValueOnce({
        taggingMetadata: {
          selections: {
            [runnerUrn]: {
              uniqueId: "uniqueId",
            },
          },
        },
      });
      const uniqueId = getRunnerUniqueTaggingId({}, runnerUrn);

      expect(uniqueId).toEqual("uniqueId");
    });

    describe("when the selections is empty", () => {
      it("should return undefined", () => {
        getBetslipCard.mockReturnValueOnce({
          taggingMetadata: {
            selections: {},
          },
        });
        const uniqueId = getRunnerUniqueTaggingId({}, runnerUrn);

        expect(uniqueId).toBeUndefined();
      });
    });
  });

  describe("sanitizeBetId", () => {
    it('should remove all digits from a given betId before the ":"', () => {
      expect(sanitizeBetId("123:4567890123")).toEqual("4567890123");
    });
  });

  describe("prefixLBRBetId", () => {
    it('should prefix an "1:" to betId', () => {
      expect(prefixLBRBetId("4567890123")).toEqual("1:4567890123");
    });
  });

  describe("createCustomerRefBuilder", () => {
    it("should create different customer ref every 1s padded with 0s on the left", () => {
      jest.useFakeTimers();
      jest.setSystemTime(1000000000);

      const buildCustomerRef = createCustomerRefBuilder();

      const expectedBase = "0000000000100000";
      expect(buildCustomerRef()).toBe(`${expectedBase}0000`);
      expect(buildCustomerRef()).toBe(`${expectedBase}0000`);

      // after 900ms
      jest.setSystemTime(1000000900);
      expect(buildCustomerRef()).toBe(`${expectedBase}0000`);

      // after 1000ms
      jest.setSystemTime(1000001000);
      expect(buildCustomerRef()).toBe(`${expectedBase}1000`);

      // after 1100ms
      jest.setSystemTime(1000001100);
      expect(buildCustomerRef()).toBe(`${expectedBase}1000`);
    });
  });
});
