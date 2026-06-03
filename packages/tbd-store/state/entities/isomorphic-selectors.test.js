import { getFormattedExperiments } from "./experiments/experiments-selectors";
import {
  createUserPreferencesWithProductSwitcherSelector,
  getProductExclusions,
} from "./user-preferences/user-preferences-selectors";
import { createContextForBFFSelector } from "./isomorphic-selectors";
import { getOverridenThrottles } from "./throttles/throttles-selectors";

jest.mock("./experiments/experiments-selectors", () => ({
  getFormattedExperiments: jest.fn(),
}));

jest.mock("./user-preferences/user-preferences-selectors", () => ({
  createUserPreferencesWithProductSwitcherSelector: jest.fn(() => jest.fn(() => "prefs mock")),
  getProductExclusions: jest.fn(),
}));

jest.mock("./throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(),
}));

describe("createContextForBFFSelector", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should call getPreferences", () => {
    const state = { preferences: "preferences mock" };
    const getPreferences = createUserPreferencesWithProductSwitcherSelector();
    createUserPreferencesWithProductSwitcherSelector.mockReturnValueOnce(getPreferences);

    createContextForBFFSelector()(state);

    expect(getPreferences).toHaveBeenCalledWith("preferences mock");
    expect(getPreferences).toHaveBeenCalledTimes(1);
  });

  it("should call getProductExclusions", () => {
    const state = { preferences: "preferences mock" };

    createContextForBFFSelector()(state);

    expect(getProductExclusions).toHaveBeenCalledWith(state);
    expect(getProductExclusions).toHaveBeenCalledTimes(1);
  });

  it("should call getFormattedExperiments", () => {
    const state = { preferences: "preferences mock" };

    createContextForBFFSelector()(state);

    expect(getFormattedExperiments).toHaveBeenCalledWith(state);
    expect(getFormattedExperiments).toHaveBeenCalledTimes(1);
  });

  it("should call getOverridenThrottles", () => {
    const state = { entities: "entities mock" };

    createContextForBFFSelector()(state);

    expect(getOverridenThrottles).toHaveBeenCalledWith(state);
    expect(getOverridenThrottles).toHaveBeenCalledTimes(1);
  });

  it("should get expected result", () => {
    const state = { preferences: "preferences mock" };

    const getPreferences = jest.fn().mockReturnValueOnce("prefs mock");
    createUserPreferencesWithProductSwitcherSelector.mockReturnValueOnce(getPreferences);
    getProductExclusions.mockReturnValueOnce("exclusions mock");
    getFormattedExperiments.mockReturnValueOnce("experiments mock");
    getOverridenThrottles.mockReturnValueOnce("overriden throttles mock");

    const result = createContextForBFFSelector()(state);

    expect(result).toEqual({
      userPreferences: "prefs mock",
      productExclusions: "exclusions mock",
      experiments: "experiments mock",
      throttleOverrides: "overriden throttles mock",
    });
  });
});
