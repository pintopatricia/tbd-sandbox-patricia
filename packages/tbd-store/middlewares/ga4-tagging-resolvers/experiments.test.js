import { buildExperimentsEvent } from "tagging-library";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { getExperiments } from "../../state/entities/experiments/experiments-selectors";
import { getExperimentEvents } from "./experiments";

jest.mock("tagging-library", () => ({
  buildExperimentsEvent: jest.fn().mockReturnValue("experiments event"),
}));
jest.mock("../../state/entities/experiments/experiments-selectors");
jest.mock("../../state/entities/user-details/user-details-selectors");

const setup = () => {
  getUserDetails.mockReturnValue({ accountId: 12345 });
  getExperiments.mockReturnValue({
    "exp-cashout-button": {
      variant: "color-green",
    },
    "exp-2": {
      variant: "variant-a",
    },
  });
};

describe("Loop GTM resolvers", () => {
  describe("getExperimentEvents", () => {
    it("should return the correct event payload", () => {
      setup();

      const result = getExperimentEvents({});

      expect(buildExperimentsEvent).toHaveBeenCalledTimes(2);
      expect(buildExperimentsEvent).toHaveBeenNthCalledWith(1, {
        accountId: "12345",
        expId: "exp-cashout-button",
        userId: "12345",
        varId: "color-green",
      });
      expect(buildExperimentsEvent).toHaveBeenNthCalledWith(2, {
        accountId: "12345",
        expId: "exp-2",
        userId: "12345",
        varId: "variant-a",
      });
      expect(result.length).toEqual(2);
    });
  });
});
