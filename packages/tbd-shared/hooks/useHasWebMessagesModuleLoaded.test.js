import { useSelector } from "react-redux";
import { useIsWebMessagesModuleLoaded } from "./useHasWebMessagesModuleLoaded";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("useIsWebMessagesModuleLoaded", () => {
  it("should return true when user preferences are in the store", () => {
    useSelector.mockImplementation((fn) => fn({ entities: { webMessages: { isModuleLoaded: true } } }));
    expect(useIsWebMessagesModuleLoaded()).toBe(true);
  });

  it("should return false when user preferences are not in the store", () => {
    useSelector.mockImplementation((fn) => fn({ entities: { webMessages: null } }));
    expect(useIsWebMessagesModuleLoaded()).toBe(false);
    useSelector.mockImplementation((fn) => fn({ entities: null }));
    expect(useIsWebMessagesModuleLoaded()).toBe(false);
  });
});
