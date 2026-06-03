import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createGetMultipleCombinations } from "../SportsbookPlace/sportsbook-place-mapper";
import { createGetConfirmationMultipleCombinations, createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationCombinations: jest.fn().mockReturnValue({}),
  getSportsbookConfirmationLegs: jest.fn().mockReturnValue({}),
}));

jest.mock("../SportsbookPlace/sportsbook-place-mapper", () => ({
  createGetMultipleCombinations: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn().mockReturnValue(jest.fn(() => false)),
  createGetConfirmationMultipleCombinations: jest.fn().mockReturnValue(jest.fn()),
}));

const multipleCombinationsMock = {
  oneLineCombination: {},
  multiLinesCombinations: [
    {
      id: "DOUBLE:[SIMPLE_SELECTION:[924.370613604-541842],SIMPLE_SELECTION:[924.370753634-541840],SIMPLE_SELECTION:[924.370807643-3449256]]",
    },
    {
      id: "TRIXIE:[SIMPLE_SELECTION:[924.370613604-541842],SIMPLE_SELECTION:[924.370753634-541840],SIMPLE_SELECTION:[924.370807643-3449256]]",
    },
    {
      id: "PATENT:[SIMPLE_SELECTION:[924.370613604-541842],SIMPLE_SELECTION:[924.370753634-541840],SIMPLE_SELECTION:[924.370807643-3449256]]",
    },
  ],
};

const confirmMultipleCombinationsMock = {
  oneLineCombination: {},
  multiLinesCombinations: [
    {
      id: "DOUBLE:[SIMPLE_SELECTION:[924.370613604-541842],SIMPLE_SELECTION:[924.370753634-541840],SIMPLE_SELECTION:[924.370807643-3449256]]",
    },
  ],
};

const appState = {
  betslip: {
    betting: { sportsbookBetting: { combinations: {} } },
  },
};

const setupMapStateToProps = ({
  combinations = {},
  confirmCombinations = {},
  isConfirmStep = false,
  betslipCard,
  state = appState,
} = {}) => {
  getBetslipCard.mockReturnValue(betslipCard);
  createGetMultipleCombinations.mockReturnValue(() => combinations);
  createGetConfirmationMultipleCombinations.mockReturnValue(() => confirmCombinations);
  createIsConfirmStep.mockReturnValue(jest.fn(() => isConfirmStep));
  return makeMapStateToProps()(state);
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when mapping multiples", () => {
    it("should call createGetMultipleCombinations", () => {
      setupMapStateToProps({ combinations: multipleCombinationsMock });

      expect(createGetMultipleCombinations).toHaveBeenCalled();
    });

    it("should return multi lines combinations", () => {
      const props = setupMapStateToProps({ betslipCard: true, combinations: multipleCombinationsMock });

      expect(props.multiples).toEqual(multipleCombinationsMock.multiLinesCombinations);
      expect(props.multiples.length).toEqual(3);
    });

    describe("when confirm step is true", () => {
      it("should call createGetConfirmationMultipleCombinations", () => {
        const spy = jest.fn().mockReturnValueOnce(false);

        createGetConfirmationMultipleCombinations.mockReturnValueOnce(spy);

        setupMapStateToProps({ isConfirmStep: true });

        expect(spy).toHaveBeenNthCalledWith(1, appState);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it("should return confirm multi lines combinations", () => {
        const props = setupMapStateToProps({
          isConfirmStep: true,
          betslipCard: true,
          confirmCombinations: confirmMultipleCombinationsMock,
        });

        expect(props.multiples).toEqual(confirmMultipleCombinationsMock.multiLinesCombinations);
      });
    });
  });

  describe("when there are no combinations of several lines", () => {
    it("should return empty object", () => {
      const props = setupMapStateToProps({ combinations: {} });

      expect(props).toEqual({});
    });
  });

  describe("when betslip is empty", () => {
    it("should return empty object", () => {
      const props = setupMapStateToProps();

      expect(props).toEqual({});
    });
  });
});
