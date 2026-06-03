// React Navigation Doc: https://reactnavigation.org/docs/testing
import "react-native-gesture-handler/jestSetup";

import mockComponent from "react-native/jest/mockComponent";
import { setUpTests } from "react-native-reanimated/src/jestUtils";

setUpTests();

jest.mock("react-native/Libraries/Components/Keyboard/Keyboard", () => ({
  dismiss: jest.fn(),
}));

jest.mock("react-native/Libraries/Components/Switch/Switch", () => ({
  default: mockComponent("react-native/Libraries/Components/Switch/Switch"),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((testID, testAccessibility = true, accessibilityLabel) => ({
    testID: testID,
    accessible: testAccessibility,
    ...(accessibilityLabel && { accessibilityLabel: accessibilityLabel }),
  })),
}));

jest.mock("@ppb/the-wall-native/hooks/useHaptics", () => ({
  useHaptics: jest.fn(() => ({
    trigger: jest.fn(),
  })),
}));

jest.mock("@ppb/the-wall-native/api/haptics", () => ({
  setHapticsEnabled: jest.fn(),
  trigger: jest.fn(),
}));

/**
 * Convenient mock for testing components that rely on global.requestAnimationFrame.
 * This ensures that animations and layout updates are properly tested without waiting for real time delays.
 */
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0); // Simulate immediate execution
};
