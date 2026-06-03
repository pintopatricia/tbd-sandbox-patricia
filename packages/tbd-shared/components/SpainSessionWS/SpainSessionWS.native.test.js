import { act, render } from "@testing-library/react-native";

import { getWebSocket, handleWebSocketCallbacks } from "./utils";
import SpainSessionWs from "./SpainSessionWS.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    authorizationToken: "testAuthToken123",
    language: "es",
  })),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => ({
  CetContext: {},
}));

jest.mock("./utils", () => ({
  getWebSocket: jest.fn(),
  getNotificationMessage: jest.fn(),
  handleWebSocketCallbacks: jest.fn(),
}));

jest.mock("./SpainSessionNotification.native", () => jest.fn(() => <spain-session-notification-mock />));

const renderSpainSessionWs = ({ shouldOpenWebSocket = true, currencySymbol = "$" } = {}) =>
  render(<SpainSessionWs shouldOpenWebSocket={shouldOpenWebSocket} currencySymbol={currencySymbol} />);

describe("SpainSessionWs Component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initialize the component", () => {
    it("should not open WebSocket connection if shouldOpenWebSocket is false", () => {
      renderSpainSessionWs({ shouldOpenWebSocket: false });

      expect(getWebSocket).not.toHaveBeenCalled();
    });

    it("should open WebSocket connection if shouldOpenWebSocket is true", () => {
      renderSpainSessionWs({ shouldOpenWebSocket: true });

      expect(getWebSocket).toHaveBeenCalled();
    });

    it("should not call handleWebSocketCallbacks if the websocket is not connected", () => {
      getWebSocket.mockReturnValueOnce(null);

      renderSpainSessionWs();

      expect(handleWebSocketCallbacks).not.toHaveBeenCalled();
    });

    it("should close ws connection when component unmounts", () => {
      const mockWebSocket = {
        close: jest.fn(),
      };

      getWebSocket.mockReturnValueOnce(mockWebSocket);

      const { unmount } = renderSpainSessionWs();

      expect(handleWebSocketCallbacks).toHaveBeenCalledTimes(1);
      expect(handleWebSocketCallbacks).toHaveBeenCalledWith(mockWebSocket, expect.any(Function));

      expect(mockWebSocket.close).not.toHaveBeenCalled();

      act(() => {
        unmount();
      });

      expect(mockWebSocket.close).toHaveBeenCalledTimes(1);
    });
  });
});
