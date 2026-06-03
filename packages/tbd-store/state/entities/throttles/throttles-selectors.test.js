import { createGetThrottleSelector, getThrottles, getOverridenThrottles } from "./throttles-selectors";

const stateMock = {
  entities: {
    throttles: {
      FOO: { isActive: true },
    },
  },
};

describe("createGetThrottleSelector selector", () => {
  describe("when throttle exists", () => {
    it("must return the throttle", () => {
      const getThrottle = createGetThrottleSelector();
      const throttle = getThrottle(stateMock.entities.throttles, "FOO");

      expect(throttle).toEqual({ isActive: true });
    });
  });

  describe("when throttle does not exist", () => {
    it("must return undefined", () => {
      const getThrottle = createGetThrottleSelector();
      const throttle = getThrottle(stateMock.entities.throttles, "NON EXISTENT THROTTLE");

      expect(throttle).toEqual(undefined);
    });
  });
});

describe("getThrottles selector", () => {
  it("must return the throttles from the state", () => {
    const throttles = getThrottles(stateMock);
    expect(throttles).toEqual({
      FOO: { isActive: true },
    });
  });

  it("must throw an error when no throttles are set in the state", () => {
    const throttles = () => getThrottles({});
    expect(throttles).toThrow("non existent throttles");
  });
});

describe("getOverridenThrottles", () => {
  const overridesMock = {
    throttles: {
      FOO1: { isActive: true, isOverriden: true },
      BAR1: { isActive: true, isOverriden: false },
      BAZ1: { isActive: false, isOverriden: true },
      FOO2: { isActive: true, isOverriden: true },
      BAR2: { isActive: true },
    },
  };

  it("must return only the overriden throttles from the state", () => {
    const overridenThrottles = getOverridenThrottles(overridesMock);
    expect(overridenThrottles).toEqual({
      throttlesOn: ["FOO1", "FOO2"],
      throttlesOff: ["BAZ1"],
    });
  });
});
