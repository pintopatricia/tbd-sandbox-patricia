import normalizeRunnerViewFragmentIntoRunnerView from "./runner-view-normalizer";

jest.mock("../../cards/bottom-bar-card/bottom-bar-card-normalizer", () => jest.fn(() => "bottom-bar-normalized"));

const BFF_RESPONSE = {
  __typename: "RunnerView",
  urn: "ppb:tbd:view:runner:1.171781097/34000815/0",
  url: "Not Implemented",
  title: "Additional Information",
  items: {
    edges: [
      {
        node: {
          __typename: "RaceRunnerCard",
          urn: "ppb:tbd:card:raceRunner:1.171782025/24000991/0",
          runnerMarketGraph: {
            graphParams: "?marketId=1.171782025&selectionId=24000991&handicap=0&theme=DARK",
            liveData: "livedata",
          },
          market: {
            urn: "market:urn",
          },
          race: {
            __typename: "Race",
            urn: "ppb:race:29939007.1535",
          },
          runner: {
            runnerURN: "ppb:excRunner:1.171782025/24000991/0",
            selectionId: 24000991,
          },
        },
      },
    ],
  },
};

describe("Runner view normalizer", () => {
  describe("normalizeRunnerViewFragmentIntoRunnerView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRunnerViewFragmentIntoRunnerView(BFF_RESPONSE);

      expect(data).toEqual({
        items: [
          {
            typename: "RaceRunnerCard",
            urn: "ppb:tbd:card:raceRunner:1.171782025/24000991/0",
          },
        ],
        typename: "RunnerView",
        url: "Not Implemented",
        urn: "ppb:tbd:view:runner:1.171781097/34000815/0",
        title: "Additional Information",
      });
    });
  });
});
