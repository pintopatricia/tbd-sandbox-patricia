import { createSelectorCreator } from "reselect";
import { createOddsMovementSelector } from "./betslip-odds-movement-selectors";

jest.mock("reselect", () => ({
  createSelectorCreator: jest.fn(() => jest.fn()),
  defaultMemoize: jest.fn().mockReturnValue(true),
}));

describe("createOddsMovementSelector", () => {
  describe("comparison function", () => {
    function setup() {
      createOddsMovementSelector();
      const [_, comparisonFn] = createSelectorCreator.mock.calls[0];

      return comparisonFn;
    }
    describe("when both states are empty", () => {
      it("should return true", () => {
        const comparisonFn = setup();
        const previousState = {};
        const currentState = {};

        expect(comparisonFn(previousState, currentState)).toBe(true);
      });
    });
    describe("when all odds movement entries are equal in value", () => {
      it("should return true", () => {
        const comparisonFn = setup();
        const previousState = {
          leg1: {
            id: "leg1",
            value: 1.01,
            movement: "UP",
          },
          leg2: {
            id: "leg2",
            value: 2.02,
            movement: "DOWN",
          },
        };
        const currentState = {
          leg1: {
            id: "leg1",
            value: 1.01,
            movement: "UP",
          },
          leg2: {
            id: "leg2",
            value: 2.02,
            movement: "DOWN",
          },
        };

        expect(comparisonFn(previousState, currentState)).toBe(true);
      });
    });
    describe("when odds movement entries differ", () => {
      it("should return false", () => {
        const comparisonFn = setup();
        const previousState = {
          leg1: {
            id: "leg1",
            value: 1.01,
            movement: "UP",
          },
          leg2: {
            id: "leg2",
            value: 2.02,
            movement: "DOWN",
          },
        };
        const currentState = {
          leg2: {
            id: "leg2",
            value: 2.02,
            movement: "DOWN",
          },
        };

        expect(comparisonFn(previousState, currentState)).toBe(false);
      });
    });
    describe("when one odds movement entry differ in the id property", () => {
      it("should return false", () => {
        const comparisonFn = setup();
        const previousState = {
          leg1: {
            id: "leg1",
            value: 1.01,
            movement: "UP",
          },
        };
        const currentState = {
          leg2: {
            id: "leg2",
            value: 1.01,
            movement: "UP",
          },
        };

        expect(comparisonFn(previousState, currentState)).toBe(false);
      });
    });
    describe("when one odds movement entry differ in the value property", () => {
      it("should return false", () => {
        const comparisonFn = setup();
        const previousState = {
          leg1: {
            id: "leg1",
            value: 1.01,
            movement: "UP",
          },
        };
        const currentState = {
          leg1: {
            id: "leg1",
            value: 2.02,
            movement: "UP",
          },
        };

        expect(comparisonFn(previousState, currentState)).toBe(false);
      });
    });
    describe("when one odds movement entry diffent in the movement property", () => {
      it("should return false", () => {
        const comparisonFn = setup();
        const previousState = {
          leg1: {
            id: "leg1",
            value: 1.01,
            movement: "UP",
          },
        };
        const currentState = {
          leg1: {
            id: "leg1",
            value: 1.01,
            movement: "DOWN",
          },
        };

        expect(comparisonFn(previousState, currentState)).toBe(false);
      });
    });
  });
});
