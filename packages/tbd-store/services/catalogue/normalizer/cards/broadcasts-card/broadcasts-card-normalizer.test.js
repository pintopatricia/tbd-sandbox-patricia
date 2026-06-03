import normalizeBroadcastsCardFragmentIntoBroadcastsCard from "./broadcasts-card-normalizer";

jest.mock("../../../../../state/layout/cards/Card.types", () => ({
  CardType: {
    BROADCASTS_CARD: "BROADCASTS_CARD",
  },
}));

describe("normalizeBroadcastsCardFragmentIntoBroadcastsCard", () => {
  const fragmentMock = {
    __typename: "BroadcastCard",
    urn: "URN",
    broadcasts: {
      liveVideoUrl: "LIVE_VIDEO_URL",
      dataVizUrl: "DATA_VIZ_URL",
    },
    isCollapsed: true,
  };

  it("should correctly normalize the card", () => {
    expect(normalizeBroadcastsCardFragmentIntoBroadcastsCard(fragmentMock)).toEqual({
      data: {
        typename: "BroadcastCard",
        urn: fragmentMock.urn,
        broadcasts: {
          liveVideoUrl: fragmentMock.broadcasts.liveVideoUrl,
          dataVizUrl: fragmentMock.broadcasts.dataVizUrl,
        },
        isCollapsed: true,
      },
    });
  });
});
