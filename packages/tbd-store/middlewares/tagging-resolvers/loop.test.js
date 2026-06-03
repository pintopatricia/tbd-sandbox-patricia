import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { getExperiments } from "../../state/entities/experiments/experiments-selectors";
import { getExperimentLoadEvent } from "./loop";

jest.mock("../../state/entities/experiments/experiments-selectors");
jest.mock("../../state/entities/user-details/user-details-selectors");

describe("Loop GTM resolvers", () => {
  describe("getExperimentLoadEvent", () => {
    const setup = () => {
      getUserDetails.mockReturnValue({ accountId: "12345", bucketId: 999 });
      getExperiments.mockReturnValue({
        "exp-cashout-button": {
          variant: "color-green",
        },
        "exp-2": {
          variant: "variant-a",
        },
      });
    };

    const appState = {
      entities: {
        experiments: {
          "exp-cashout-button": {
            variant: "color-green",
          },
          "exp-2": {
            variant: "variant-a",
          },
        },
      },
    };

    it("should return the correct event payload", () => {
      setup();

      expect(getExperimentLoadEvent(appState)).toEqual([
        {
          event: "ga_event",
          category: "loop",
          action: "color-green",
          label: "exp-cashout-button",
          cd1: "12345",
          cd26: 999,
        },
        {
          event: "ga_event",
          category: "loop",
          action: "variant-a",
          label: "exp-2",
          cd1: "12345",
          cd26: 999,
        },
      ]);
    });
  });
});
