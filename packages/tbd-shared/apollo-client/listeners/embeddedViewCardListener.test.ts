import { embeddedViewCardListener } from "./embeddedViewCardListener";
import { APP_CONTEXT__FETCH } from "@ppb/tbd-store/actions/app-context";

const mockSubscribe = jest.fn();
const mockWatchFragment = jest.fn(() => ({
  subscribe: mockSubscribe,
}));
const mockReadFragment = jest.fn();
const mockIdentify = jest.fn((obj) => `${obj.__typename}:${obj.urn}`);

jest.mock("../client", () => ({
  getApolloClient: jest.fn(() => ({
    cache: {
      watchFragment: mockWatchFragment,
      readFragment: mockReadFragment,
      identify: mockIdentify,
    },
  })),
}));

const mockDispatch = jest.fn();
jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn(() => ({
    dispatch: mockDispatch,
  })),
}));

const mockEmbeddedViewCardAppContextFragment = { kind: "Document", definitions: [] };
const mockEmbeddedViewCardFragment = { kind: "Document", definitions: [] };

jest.mock(
  "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/model/EmbeddedViewCard.graphql",
  () => ({
    EmbeddedViewCardAppContextFragment: mockEmbeddedViewCardAppContextFragment,
    EmbeddedViewCardFragment: mockEmbeddedViewCardFragment,
  }),
);

const embeddedViewCardURN = "ppb:tbd:card:embeddedView:personalDetails";
const appContextURN = "ppb:tbd:appContext:appContext";

describe("embeddedViewCardListener", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should setup watchFragment with correct parameters", async () => {
    await embeddedViewCardListener(embeddedViewCardURN);

    expect(mockWatchFragment).toHaveBeenCalledWith({
      fragment: mockEmbeddedViewCardAppContextFragment,
      fragmentName: "EmbeddedViewCardAppContext",
      from: {
        __typename: "AppContextDetails",
        urn: appContextURN,
      },
    });
  });

  it("should subscribe to the observable", async () => {
    await embeddedViewCardListener(embeddedViewCardURN);

    expect(mockSubscribe).toHaveBeenCalledTimes(1);
  });

  describe("when subscription callback is triggered", () => {
    let subscriptionCallback: () => void;

    beforeEach(async () => {
      mockSubscribe.mockImplementation((callback) => {
        subscriptionCallback = callback;
        return { unsubscribe: jest.fn() };
      });

      await embeddedViewCardListener(embeddedViewCardURN);
    });

    it("should read EmbeddedViewCard fragment from cache", () => {
      mockReadFragment.mockReturnValue(null);

      subscriptionCallback();

      expect(mockReadFragment).toHaveBeenCalledWith({
        fragment: mockEmbeddedViewCardFragment,
        fragmentName: "EmbeddedViewCard",
        id: `EmbeddedViewCard:${embeddedViewCardURN}`,
      });
    });

    it("should dispatch APP_CONTEXT__FETCH when appEnv is present", () => {
      const mockData = {
        appEnv: "production",
      };
      mockReadFragment.mockReturnValue(mockData);

      subscriptionCallback();

      expect(mockDispatch).toHaveBeenCalledWith({
        type: APP_CONTEXT__FETCH,
        payload: {
          defaultAppEnv: "production",
        },
      });
    });

    it("should NOT dispatch when appEnv is missing", () => {
      const mockData = {
        appEnv: null,
      };
      mockReadFragment.mockReturnValue(mockData);

      subscriptionCallback();

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should NOT dispatch when readFragment returns null", () => {
      mockReadFragment.mockReturnValue(null);

      subscriptionCallback();

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should handle empty string values", async () => {
      mockSubscribe.mockImplementation((callback) => {
        callback();
        return { unsubscribe: jest.fn() };
      });
      mockReadFragment.mockReturnValue({
        appEnv: "",
      });

      await embeddedViewCardListener(embeddedViewCardURN);

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
