import { render } from "@testing-library/react";

import { getCookie } from "../../helpers/cookies.web";

import { getWebSocket, handleWebSocketCallbacks } from "./utils";
import SpainSessionWs from "./SpainSessionWS.web";

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("../../helpers/cookies.web", () => ({
  getCookie: jest.fn(),
}));

jest.mock("./utils", () => ({
  getWebSocket: jest.fn(),
  getNotificationMessage: jest.fn(),
  handleWebSocketCallbacks: jest.fn(),
}));

const renderSpainSessionWs = ({ shouldOpenWebSocket = true, currencySymbol = "$" } = {}) =>
  render(<SpainSessionWs shouldOpenWebSocket={shouldOpenWebSocket} currencySymbol={currencySymbol} />);

describe("SpainSessionWs", () => {
  beforeEach(jest.clearAllMocks);

  it("should not open WebSocket connection if shouldOpenWebSocket is false", () => {
    renderSpainSessionWs({ shouldOpenWebSocket: false });

    expect(getWebSocket).not.toHaveBeenCalled();
  });

  it("should not open WebSocket connection if shouldOpenWebSocket is true and authToken is invalid", () => {
    getCookie.mockReturnValueOnce(null);

    renderSpainSessionWs({ shouldOpenWebSocket: true });

    expect(getWebSocket).not.toHaveBeenCalled();
  });

  it("should try to open WebSocket connection if shouldOpenWebSocket is true and authToken is valid", () => {
    getCookie.mockReturnValueOnce("123abc");

    renderSpainSessionWs({ shouldOpenWebSocket: true });

    expect(getWebSocket).toHaveBeenCalledTimes(1);
    expect(getWebSocket).toHaveBeenCalledWith("123abc");
  });

  it("should not call handleWebSocketCallbacks if the websocket is not connected", () => {
    getCookie.mockReturnValueOnce("123abc");
    getWebSocket.mockReturnValueOnce(null);

    renderSpainSessionWs();

    expect(handleWebSocketCallbacks).not.toHaveBeenCalled();
  });

  it("should close ws connection when component unmounts", () => {
    const mockWebSocket = {
      close: jest.fn(),
    };

    getCookie.mockReturnValueOnce("123abc");
    getWebSocket.mockReturnValueOnce(mockWebSocket);

    const { unmount } = renderSpainSessionWs();

    expect(handleWebSocketCallbacks).toHaveBeenCalledTimes(1);
    expect(handleWebSocketCallbacks).toHaveBeenCalledWith(mockWebSocket, expect.any(Function));

    expect(mockWebSocket.close).not.toHaveBeenCalled();

    unmount();

    expect(mockWebSocket.close).toHaveBeenCalledTimes(1);
  });
});
