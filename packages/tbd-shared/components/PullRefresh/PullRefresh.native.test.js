import { render, act } from "@testing-library/react-native";
import { RefreshControl, Platform, NativeModules } from "react-native";

import { colors, tokens } from "@ppb/the-wall-common/base-theme";
import { useHaptics } from "@ppb/the-wall-native/hooks/useHaptics";

import { resetApolloCacheWithAppContext } from "../../apollo-client/client";
import { useRefreshEnabled } from "../../hooks/useRefreshEnabled.native";

jest.mock("../../apollo-client/client", () => ({
  resetApolloCacheWithAppContext: jest.fn(),
}));

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
  NativeModules: {
    LaunchArgumentsModule: {
      getLaunchArguments: jest.fn(() => Promise.resolve({})),
    },
  },
  RefreshControl: jest.fn(() => <refresh-control-mock />),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    PullRefreshIconColour: "#FFB80C",
  },
  colors: {
    NeutralsBackgroundElevation4: "NeutralsBackgroundElevation4",
  },
}));

jest.mock("../../hooks/useRefreshEnabled.native", () => ({
  useRefreshEnabled: jest.fn(() => ({
    refreshEnabled: true,
  })),
}));

jest.mock("@ppb/the-wall-native/hooks/useHaptics", () => ({
  useHaptics: jest.fn(() => ({
    trigger: jest.fn(),
  })),
}));

const setup = ({ launchArgs = {}, platform = "ios" } = { launchArgs: {}, platform: "ios" }) => {
  let PullRefresh;
  jest.isolateModules(() => {
    Platform.OS = platform;
    NativeModules.LaunchArgumentsModule.getLaunchArguments.mockResolvedValue(launchArgs);
    ({ PullRefresh } = require("./PullRefresh.native"));
  });

  return { PullRefresh };
};

describe("PullRefresh", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when ios", () => {
    describe("when refresh launch argument is true", () => {
      it("should call RefreshControl", async () => {
        const { PullRefresh } = setup({ launchArgs: { pullToRefresh: true }, platform: "ios" });

        const { rerender } = render(<PullRefresh />);

        await act(async () => {
          rerender(<PullRefresh />);
        });

        expect(RefreshControl).toHaveBeenCalled();
      });
    });

    describe("when refresh launch argument is false", () => {
      it("should not call RefreshControl", async () => {
        const { PullRefresh } = setup({ launchArgs: { pullToRefresh: false }, platform: "ios" });

        const { rerender } = render(<PullRefresh something={"something"} />);

        await act(async () => {
          rerender(<PullRefresh something={"something"} />);
        });

        expect(RefreshControl).not.toHaveBeenCalled();
      });
    });

    describe("when refresh launch argument is undefined", () => {
      it("should call RefreshControl", async () => {
        const { PullRefresh } = setup({ launchArgs: { pullToRefresh: undefined }, platform: "ios" });

        const { rerender } = render(<PullRefresh />);

        await act(async () => {
          rerender(<PullRefresh />);
        });

        expect(RefreshControl).toHaveBeenCalled();
      });
    });
  });

  describe("when android", () => {
    describe("when refresh launch argument is true", () => {
      it("should call RefreshControl with enabled as true", async () => {
        const { PullRefresh } = setup({ launchArgs: { pullToRefresh: true }, platform: "android" });

        const { rerender } = render(<PullRefresh />);

        await act(async () => {
          rerender(<PullRefresh />);
        });

        expect(RefreshControl).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }), undefined);
      });
    });

    describe("when refresh launch argument is false", () => {
      it("should call RefreshControl with enabled as false", async () => {
        const { PullRefresh } = setup({ launchArgs: { pullToRefresh: false }, platform: "android" });

        const { rerender } = render(<PullRefresh />);

        await act(async () => {
          rerender(<PullRefresh />);
        });

        expect(RefreshControl).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }), undefined);
      });
    });

    describe("when refresh launch argument is undefined", () => {
      it("should call RefreshControl with enabled as true", async () => {
        const { PullRefresh } = setup({ launchArgs: { pullToRefresh: undefined }, platform: "android" });

        const { rerender } = render(<PullRefresh />);

        await act(async () => {
          rerender(<PullRefresh />);
        });

        expect(RefreshControl).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }), undefined);
      });
    });
  });

  describe("when refresh is disabled", () => {
    it("should call RefreshControl with enabled as false", async () => {
      useRefreshEnabled.mockImplementation(() => ({
        refreshEnabled: false,
      }));

      const { PullRefresh } = setup({ launchArgs: { pullToRefresh: true }, platform: "android" });

      const { rerender } = render(<PullRefresh />);

      await act(async () => {
        rerender(<PullRefresh />);
      });

      expect(RefreshControl).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }), undefined);
    });
  });

  describe("when enabled", () => {
    it("should call RefreshControl with refreshing", async () => {
      const { PullRefresh } = setup();

      const { rerender } = render(<PullRefresh isRefreshing={true} />);

      await act(async () => {
        rerender(<PullRefresh isRefreshing={true} />);
      });

      expect(RefreshControl).toHaveBeenCalledWith(expect.objectContaining({ refreshing: true }), undefined);
    });

    it("should call RefreshControl with colors", async () => {
      const { PullRefresh } = setup();

      const { rerender } = render(<PullRefresh />);

      await act(async () => {
        rerender(<PullRefresh />);
      });

      expect(RefreshControl).toHaveBeenCalledWith(
        expect.objectContaining({ colors: [tokens.PullRefreshIconColour] }),
        undefined,
      );
    });

    it("should call RefreshControl with progressBackgroundColor", async () => {
      const { PullRefresh } = setup();

      const { rerender } = render(<PullRefresh />);

      await act(async () => {
        rerender(<PullRefresh />);
      });

      expect(RefreshControl).toHaveBeenCalledWith(
        expect.objectContaining({ progressBackgroundColor: colors.NeutralsBackgroundElevation4 }),
        undefined,
      );
    });

    it("should call RefreshControl with tintColor", async () => {
      const { PullRefresh } = setup();

      const { rerender } = render(<PullRefresh />);

      await act(async () => {
        rerender(<PullRefresh />);
      });

      expect(RefreshControl).toHaveBeenCalledWith(
        expect.objectContaining({ tintColor: tokens.PullRefreshIconColour }),
        undefined,
      );
    });

    it("should call RefreshControl with onRefresh", async () => {
      const { PullRefresh } = setup();

      const { rerender } = render(<PullRefresh />);

      await act(async () => {
        rerender(<PullRefresh />);
      });

      expect(RefreshControl).toHaveBeenCalledWith(
        expect.objectContaining({ onRefresh: expect.any(Function) }),
        undefined,
      );
    });

    it("should call RefreshControl with spread props", async () => {
      const children = <test />;

      const { PullRefresh } = setup();

      const { rerender } = render(<PullRefresh something={"something"}>{children}</PullRefresh>);

      await act(async () => {
        rerender(<PullRefresh something={"something"}>{children}</PullRefresh>);
      });

      expect(RefreshControl).toHaveBeenCalledWith(
        expect.objectContaining({ children, something: "something" }),
        undefined,
      );
    });

    describe("when onRefresh is triggered", () => {
      it("should call dispatchRefresh with the viewUrn", async () => {
        const dispatchRefreshMock = jest.fn();

        const { PullRefresh } = setup();

        const { rerender } = render(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);

        await act(async () => {
          rerender(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);
        });

        act(() => {
          RefreshControl.mock.calls[0][0].onRefresh();
        });

        expect(dispatchRefreshMock).toHaveBeenCalledWith("urn");
      });

      it("should call resetApolloCacheWithAppContext", async () => {
        const dispatchRefreshMock = jest.fn();

        const { PullRefresh } = setup();

        const { rerender } = render(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);

        await act(async () => {
          rerender(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);
        });

        act(() => {
          RefreshControl.mock.calls[0][0].onRefresh();
        });

        expect(resetApolloCacheWithAppContext).toHaveBeenCalledTimes(1);
      });

      it("should set refreshing as true on RefreshControl", async () => {
        const dispatchRefreshMock = jest.fn();

        const { PullRefresh } = setup();

        const { rerender } = render(
          <PullRefresh isRefreshing={false} viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />,
        );

        await act(async () => {
          rerender(<PullRefresh isRefreshing={false} viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);
        });

        act(() => {
          RefreshControl.mock.calls[0][0].onRefresh();
        });

        expect(RefreshControl).toHaveBeenCalledWith(expect.objectContaining({ refreshing: true }), undefined);
      });
    });

    describe("when isRefreshing changes", () => {
      describe("when isRefreshing changes to true", () => {
        it("should set refreshing as true on RefreshControl", async () => {
          const dispatchRefreshMock = jest.fn();

          const { PullRefresh } = setup();

          const { rerender } = render(
            <PullRefresh isRefreshing={false} viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />,
          );

          await act(async () => {
            rerender(<PullRefresh isRefreshing={true} viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);
          });

          expect(RefreshControl).toHaveBeenCalledWith(expect.objectContaining({ refreshing: true }), undefined);
        });
      });

      describe("when isRefreshing changes to false", () => {
        it("should set refreshing as false on RefreshControl", async () => {
          const dispatchRefreshMock = jest.fn();

          const { PullRefresh } = setup();

          const { rerender } = render(
            <PullRefresh isRefreshing={true} viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />,
          );

          await act(async () => {
            rerender(<PullRefresh isRefreshing={false} viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);
          });

          expect(RefreshControl).toHaveBeenCalledWith(expect.objectContaining({ refreshing: false }), undefined);
        });
      });

      describe("when isRefreshing changes to undefined", () => {
        it("should not set refreshing as undefined on RefreshControl", async () => {
          const dispatchRefreshMock = jest.fn();

          const { PullRefresh } = setup();

          const { rerender } = render(
            <PullRefresh isRefreshing={true} viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />,
          );

          await act(async () => {
            rerender(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);
          });

          expect(RefreshControl).not.toHaveBeenCalledWith(
            expect.objectContaining({ refreshing: undefined }),
            undefined,
          );
        });
      });
    });

    describe("haptic feedback", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("should trigger selection haptic when onRefresh is called", async () => {
        const triggerMock = jest.fn();
        useHaptics.mockReturnValue({ trigger: triggerMock });
        const dispatchRefreshMock = jest.fn();

        const { PullRefresh } = setup();

        const { rerender } = render(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);

        await act(async () => {
          rerender(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);
        });

        act(() => {
          RefreshControl.mock.calls[0][0].onRefresh();
        });

        expect(triggerMock).toHaveBeenCalledWith("selection");
        expect(triggerMock).toHaveBeenCalledTimes(1);
      });

      it("should trigger haptic before dispatchRefresh is called", async () => {
        const triggerMock = jest.fn();
        useHaptics.mockReturnValue({ trigger: triggerMock });
        const dispatchRefreshMock = jest.fn();
        const callOrder = [];

        triggerMock.mockImplementation(() => {
          callOrder.push("trigger");
        });

        dispatchRefreshMock.mockImplementation(() => {
          callOrder.push("dispatchRefresh");
        });

        const { PullRefresh } = setup();

        const { rerender } = render(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);

        await act(async () => {
          rerender(<PullRefresh viewUrn={"urn"} dispatchRefresh={dispatchRefreshMock} />);
        });

        act(() => {
          RefreshControl.mock.calls[0][0].onRefresh();
        });

        expect(callOrder).toEqual(["trigger", "dispatchRefresh"]);
      });
    });
  });
});
