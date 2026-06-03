import { usePlayerViewQuery } from "../model/PlayerView.graphql";
import usePlayerViewVM from "./PlayerView.viewmodel";
import { isPlayerView, isPlayerViewItemPartial } from "./utils/PlayerView.utils";

jest.mock("../model/PlayerView.graphql", () => ({
  usePlayerViewQuery: jest.fn(),
}));

jest.mock("./utils/PlayerView.utils", () => ({
  isPlayerView: jest.fn(),
  isPlayerViewItemPartial: jest.fn(),
}));

const requestCallMockFn = jest.fn();
const requestMock = {
  call: requestCallMockFn,
  called: true,
  loading: false,
};

const VIEW_URN_MOCK = "ppb:tbd:view:player:1|2";

describe("usePlayerViewVM", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    usePlayerViewQuery.mockReturnValue({
      request: requestMock,
      data: {
        card: undefined,
      },
    });
  });

  describe("when the 'data' is undefined", () => {
    it("should resolve the VM as null", () => {
      usePlayerViewQuery.mockReturnValue({
        request: requestMock,
        data: undefined,
      });

      const result = usePlayerViewVM(VIEW_URN_MOCK);

      expect(result.vm.data).toEqual(null);
    });
  });

  describe("when the 'View' is undefined", () => {
    it("should resolve the VM as null", () => {
      usePlayerViewQuery.mockReturnValue({
        request: requestMock,
        data: {
          View: undefined,
        },
      });

      const result = usePlayerViewVM(VIEW_URN_MOCK);

      expect(result.vm.data).toEqual(null);
    });
  });

  describe("when 'View' is defined", () => {
    describe("but it's not a PlayerView", () => {
      it("should resolve the VM as null", () => {
        isPlayerView.mockReturnValue(false);

        usePlayerViewQuery.mockReturnValue({
          request: requestMock,
          data: {
            View: {
              __typename: "SomeOtherType",
              urn: VIEW_URN_MOCK,
            },
          },
        });

        const result = usePlayerViewVM(VIEW_URN_MOCK);

        expect(result.vm.data).toEqual(null);
      });
    });

    describe("and it's a PlayerView", () => {
      it("should resolve the VM with the correct data", () => {
        isPlayerView.mockReturnValue(true);

        usePlayerViewQuery.mockReturnValue({
          request: requestMock,
          data: {
            View: {
              __typename: "PlayerView",
              urn: VIEW_URN_MOCK,
              context: {
                player: {
                  name: "Player Name",
                  position: "Forward",
                  shirtNumber: 10,
                },
              },
            },
          },
        });
        const result = usePlayerViewVM(VIEW_URN_MOCK);

        expect(result.vm.data).toEqual({
          viewHeader: {
            name: "Player Name",
            position: "Forward",
            shirtNumber: 10,
          },
          items: undefined,
        });
      });

      it("should filter out non-PlayerViewItem items", () => {
        isPlayerView.mockReturnValue(true);
        isPlayerViewItemPartial.mockImplementation((item) => item.__typename === "PlayerViewItem");

        usePlayerViewQuery.mockReturnValue({
          request: requestMock,
          data: {
            View: {
              __typename: "PlayerView",
              urn: VIEW_URN_MOCK,
              context: {
                player: {
                  name: "Player Name",
                  position: "Forward",
                  shirtNumber: 10,
                },
              },
              items: {
                edges: [
                  { node: { __typename: "PlayerViewItem", id: "1" } },
                  { node: { __typename: "SomeOtherType", id: "2" } },
                  { node: { __typename: "PlayerViewItem", id: "3" } },
                ],
              },
            },
          },
        });

        const result = usePlayerViewVM(VIEW_URN_MOCK);

        expect(result.vm.data).toEqual({
          viewHeader: {
            name: "Player Name",
            position: "Forward",
            shirtNumber: 10,
          },
          items: [
            { __typename: "PlayerViewItem", id: "1" },
            { __typename: "PlayerViewItem", id: "3" },
          ],
        });
      });

      it("should handle missing player context gracefully", () => {
        isPlayerView.mockReturnValue(true);

        usePlayerViewQuery.mockReturnValue({
          request: requestMock,
          data: {
            View: {
              __typename: "PlayerView",
              urn: VIEW_URN_MOCK,
              context: {
                player: null,
              },
            },
          },
        });

        const result = usePlayerViewVM(VIEW_URN_MOCK);

        expect(result.vm.data).toEqual({
          viewHeader: undefined,
          items: undefined,
        });
      });
    });
  });
});
