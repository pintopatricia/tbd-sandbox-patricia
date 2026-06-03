import { usePlayerMarketsCardGroupQuery } from "../model/PlayerMarketsCardGroup.graphql";
import usePlayerMarketsCardGroupVM from "./PlayerMarketsCardGroup.viewmodel";

jest.mock("../model/PlayerMarketsCardGroup.graphql", () => ({
  usePlayerMarketsCardGroupQuery: jest.fn(),
}));

const requestCallMockFn = jest.fn();
const requestMock = {
  call: requestCallMockFn,
  called: true,
  loading: false,
};

const CARD_GROUP_URN_MOCK = "ppb:tbd:view:player:1|2";

describe("usePlayerMarketsCardGroupVM", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    usePlayerMarketsCardGroupQuery.mockReturnValue({
      request: requestMock,
      data: {
        cardGroup: undefined,
      },
    });
  });

  describe("when the 'data' is undefined", () => {
    it("should resolve the VM as null", () => {
      usePlayerMarketsCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: undefined,
      });

      const result = usePlayerMarketsCardGroupVM(CARD_GROUP_URN_MOCK);

      expect(result.vm.data).toEqual(null);
    });
  });

  describe("when the 'cardGroup' is undefined", () => {
    it("should resolve the VM as null", () => {
      usePlayerMarketsCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: {
          cardGroup: undefined,
        },
      });

      const result = usePlayerMarketsCardGroupVM(CARD_GROUP_URN_MOCK);

      expect(result.vm.data).toEqual(null);
    });
  });

  describe("when 'cardGroup' is defined", () => {
    it("should resolve the VM with the correct data", () => {
      usePlayerMarketsCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: {
          cardGroup: {
            __typename: "PlayerMarketsCardGroup",
            urn: CARD_GROUP_URN_MOCK,
            items: {
              edges: [
                {
                  node: {
                    __typename: "SomePlayerMarket",
                    urn: "ppb:tbd:card:playermarket:1",
                  },
                },
                {
                  node: {
                    __typename: "SomePlayerMarket",
                    urn: "ppb:tbd:card:playermarket:2",
                  },
                },
              ],
            },
            fixtureCard: {
              __typename: "FixtureCard",
              urn: "ppb:tbd:card:fixture:1",
            },
          },
        },
      });

      const result = usePlayerMarketsCardGroupVM(CARD_GROUP_URN_MOCK);

      expect(result.vm.data).toEqual({
        urn: CARD_GROUP_URN_MOCK,
        items: [
          {
            __typename: "SomePlayerMarket",
            urn: "ppb:tbd:card:playermarket:1",
          },
          {
            __typename: "SomePlayerMarket",
            urn: "ppb:tbd:card:playermarket:2",
          },
        ],
        fixtureCard: {
          __typename: "FixtureCard",
          urn: "ppb:tbd:card:fixture:1",
        },
        titles: expect.any(Object),
      });
    });
  });
});
