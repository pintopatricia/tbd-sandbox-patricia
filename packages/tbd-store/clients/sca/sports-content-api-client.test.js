import { GQL } from "@flutter-global/uki-channels-http-clients/index";
import SportsContentAPIClient from "./sports-content-api-client";

const clientRequest = jest.fn(() => Promise.resolve({ data: "response" }));

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  GQL: jest.fn(() => ({ execute: clientRequest })),
}));

jest.mock("./sca_updates_query.graphql", () => "graphqlQuery");

function createClient(url = new URL("http://fakeurl.com"), config = {}) {
  return SportsContentAPIClient(url, config);
}

describe("SportsContentAPIClient", () => {
  const scaProps = {
    baseballEventIds: ["00000"],
    basketballEventIds: ["11111"],
    cricketEventIds: ["22222"],
    dartsEventIds: ["3333"],
    footballEventIds: ["33333"],
    raceIds: ["44444"],
    tennisEventIds: ["55555"],
    tableTennisEventIds: ["5555"],
    iceHockeyEventIds: ["66666"],
    rugbyUnionEventIds: ["7777"],
    snookerEventIds: ["88888"],
    australianRulesEventIds: ["12345"],
    isLite: true,
    includeStats: false,
    includePlayers: true,
    footballPlayerIds: ["312", "213"],
    includePlayerStats: false,
    includeSubstitutions: false,
  };

  it("should call GQL client builder with the URL", () => {
    createClient();
    expect(GQL).toHaveBeenCalledWith(new URL("http://fakeurl.com/"), {});
  });

  describe("when we call the getScaUpdates method", () => {
    it("should call the GQL request method with the right arguments and return the expected response", async () => {
      const client = createClient();

      const returnValue = await client.getScaUpdates(scaProps);
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        variables: scaProps,
      });
      expect(returnValue).toBe("response");
    });

    it("should call the GQL request method with the right arguments and return the error response", async () => {
      jest.spyOn(global.console, "warn").mockReturnValue(1);
      const clientRequestWithError = jest.fn(() =>
        Promise.resolve({ errors: [{ message: "error", description: "desc" }] }),
      );
      GQL.mockImplementation(() => ({ execute: clientRequestWithError }));
      const client = createClient();
      await client.getScaUpdates(scaProps);
      expect(global.console.warn).toHaveBeenCalledWith(
        "The following errors occurred while fetching updates from SCA: {Message: error; Description: desc}",
      );
    });
  });
});
