import { act, renderHook } from "@testing-library/react-native";

import useLoginWithPendingState from "./useLoginWithPendingState.native";

const mockDispatch = jest.fn();
const mockLogin = jest.fn();
let mockIsFocused = true;
let mockState = {
  entities: {
    userdetails: {
      isAuthenticating: false,
      loggedIn: false,
    },
  },
};

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));

jest.mock("@react-navigation/native", () => ({
  useIsFocused: () => mockIsFocused,
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  useLogin: () => mockLogin,
}));

const setState = ({ isAuthenticating = false, loggedIn = false } = {}) => {
  mockState = {
    entities: {
      userdetails: { isAuthenticating, loggedIn },
    },
  };
};

describe("useLoginWithPendingState", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockIsFocused = true;
    setState();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect(useLoginWithPendingState).toBeDefined();
  });

  it("dispatches AUTH__LOGIN_INITIATED and calls CET useLogin when invoked", () => {
    const { result } = renderHook(() => useLoginWithPendingState());

    act(() => {
      result.current();
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: "AUTH__LOGIN_INITIATED" });
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it("does not start the safety timer while host screen is unfocused", () => {
    mockIsFocused = false;
    setState({ isAuthenticating: true, loggedIn: false });

    renderHook(() => useLoginWithPendingState());

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(mockDispatch).not.toHaveBeenCalledWith({ type: "AUTH__LOGIN_RESOLVED" });
  });

  it("dispatches AUTH__LOGIN_RESOLVED after the safety timeout while focused and authenticating", () => {
    setState({ isAuthenticating: true, loggedIn: false });

    renderHook(() => useLoginWithPendingState());

    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: "AUTH__LOGIN_RESOLVED" });
  });

  it("does not start the safety timer once user is logged in", () => {
    setState({ isAuthenticating: true, loggedIn: true });

    renderHook(() => useLoginWithPendingState());

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(mockDispatch).not.toHaveBeenCalledWith({ type: "AUTH__LOGIN_RESOLVED" });
  });

  it("does not start the safety timer when flag is not set", () => {
    setState({ isAuthenticating: false, loggedIn: false });

    renderHook(() => useLoginWithPendingState());

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(mockDispatch).not.toHaveBeenCalledWith({ type: "AUTH__LOGIN_RESOLVED" });
  });
});
