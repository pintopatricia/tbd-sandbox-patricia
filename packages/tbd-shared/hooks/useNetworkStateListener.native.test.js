import { renderHook } from "@testing-library/react-native";
import NetInfo from "@react-native-community/netinfo";
import { NETWORK_STATUS__UPDATE } from "@ppb/tbd-store/actions/network-status";
import { setInternetStatus } from "@ppb/tbd-store/middlewares/http-poller/internet-status";
import useNetworkStateListener from "./useNetworkStateListener.native";

const storeMock = {
  dispatch: jest.fn(),
};

jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
}));

jest.mock("@splunk/otel-react-native", () => ({
  SplunkRum: {
    instance: {
      globalAttributes: {
        setAll: jest.fn(),
      },
    },
  },
}));

jest.mock("@ppb/tbd-store/middlewares/http-poller/internet-status", () => ({
  setInternetStatus: jest.fn(),
}));

describe("useNetworkStateListener", () => {
  beforeEach(jest.clearAllMocks);

  it("should be defined", () => {
    expect(useNetworkStateListener).toBeDefined();
  });

  describe("when useNetworkStateListener is called", () => {
    describe("and store is undefined", () => {
      beforeEach(() => {
        renderHook(() => useNetworkStateListener());
      });

      it("shouldn't call addEventListener", () => {
        expect(NetInfo.addEventListener).not.toHaveBeenCalled();
      });
    });

    describe("and store is defined", () => {
      beforeEach(() => {
        renderHook(() => useNetworkStateListener(storeMock));
      });

      it("should call addEventListener", () => {
        expect(NetInfo.addEventListener).toHaveBeenCalled();
      });

      describe("and the listener function returns an online state", () => {
        beforeEach(() => {
          NetInfo.addEventListener.mock.calls[0][0]({ isInternetReachable: true, isConnected: true });
          renderHook(() => useNetworkStateListener(storeMock));
        });

        it("should dispatch a NETWORK_STATUS__UPDATE action with online status payload", () => {
          expect(storeMock.dispatch).toHaveBeenCalledWith({
            type: NETWORK_STATUS__UPDATE,
            payload: {
              networkStatus: "ONLINE",
            },
          });
        });

        it("should call the 'setInternetStatus' function with the 'online' status", () => {
          expect(setInternetStatus).toHaveBeenCalledWith(true);
        });
      });

      describe("and the listener function returns an unknown state", () => {
        beforeEach(() => {
          NetInfo.addEventListener.mock.calls[0][0]({ isInternetReachable: null });
          renderHook(() => useNetworkStateListener(storeMock));
        });

        it("should dispatch a NETWORK_STATUS__UPDATE action with online status payload", () => {
          expect(storeMock.dispatch).toHaveBeenCalledWith({
            type: NETWORK_STATUS__UPDATE,
            payload: {
              networkStatus: "ONLINE",
            },
          });
        });

        it("should call the 'setInternetStatus' function with the 'online' status", () => {
          expect(setInternetStatus).toHaveBeenCalledWith(true);
        });
      });

      describe("when unmounted", () => {
        it("should call the unsubscribe function returned by addEventListener", () => {
          const unsubscribeMock = jest.fn();
          NetInfo.addEventListener.mockReturnValue(unsubscribeMock);

          const { unmount } = renderHook(() => useNetworkStateListener(storeMock));

          unmount();

          expect(unsubscribeMock).toHaveBeenCalled();
        });
      });

      describe("and the listener function returns an offline state were internet is not reachable", () => {
        describe("and the device is connected", () => {
          beforeEach(() => {
            NetInfo.addEventListener.mock.calls[0][0]({ isInternetReachable: false, isConnected: true });
            renderHook(() => useNetworkStateListener(storeMock));
          });

          it("should dispatch a NETWORK_STATUS__UPDATE action with online status payload", () => {
            expect(storeMock.dispatch).toHaveBeenCalledWith({
              type: NETWORK_STATUS__UPDATE,
              payload: {
                networkStatus: "ONLINE",
              },
            });
          });

          it("should call the 'setInternetStatus' function with the 'online' status", () => {
            expect(setInternetStatus).toHaveBeenCalledWith(true);
          });
        });
        describe("and the device is not connected", () => {
          beforeEach(() => {
            NetInfo.addEventListener.mock.calls[0][0]({ isInternetReachable: false, isConnected: false });
            renderHook(() => useNetworkStateListener(storeMock));
          });

          it("should dispatch a NETWORK_STATUS__UPDATE action with offline status payload", () => {
            expect(storeMock.dispatch).toHaveBeenCalledWith({
              type: NETWORK_STATUS__UPDATE,
              payload: {
                networkStatus: "OFFLINE",
              },
            });
          });

          it("should call the 'setInternetStatus' function with the 'online' status", () => {
            expect(setInternetStatus).toHaveBeenCalledWith(false);
          });
        });
      });
    });
  });
});
