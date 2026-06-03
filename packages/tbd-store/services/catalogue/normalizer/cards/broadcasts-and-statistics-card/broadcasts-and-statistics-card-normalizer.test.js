import normalizeBroadcastsAndStatisticsCardFragmentIntoBroadcastsAndStatisticsCard from "./broadcasts-and-statistics-card-normalizer";

jest.mock("../../../../../state/layout/cards/Card.types", () => ({
  CardType: {
    BROADCASTS_AND_STATISTICS_CARD: "BROADCASTS_AND_STATISTICS_CARD",
  },
}));

describe("normalizeBroadcastsAndStatisticsCardFragmentIntoBroadcastsAndStatisticsCard", () => {
  const fragmentMock = {
    __typename: "BroadcastsAndStatisticsCard",
    urn: "URN",
    eventBroadCasts: {
      liveVideoUrl: "LIVE_VIDEO_URL",
      dataVizUrl: "DATA_VIZ_URL",
    },
    eventBroadCastsIsCollapsed: true,
    statisticsViewLink: {
      viewUrn: "URN",
      viewURL: "URL",
    },
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:1",
    },
  };

  it("should correctly normalize the card", () => {
    expect(normalizeBroadcastsAndStatisticsCardFragmentIntoBroadcastsAndStatisticsCard(fragmentMock)).toEqual({
      data: {
        typename: "BroadcastsAndStatisticsCard",
        urn: fragmentMock.urn,
        broadcasts: {
          liveVideoUrl: fragmentMock.eventBroadCasts.liveVideoUrl,
          dataVizUrl: fragmentMock.eventBroadCasts.dataVizUrl,
        },
        isCollapsed: true,
        statisticsViewLink: {
          viewUrn: fragmentMock.statisticsViewLink.viewUrn,
          viewURL: fragmentMock.statisticsViewLink.viewURL,
        },
        sportevent: "ppb:event:1",
      },
    });
  });
});
