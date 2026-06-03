import { GQL } from "@flutter-global/uki-channels-http-clients/index";
import BetLiveHipotheticalsClient from "./bet-live-hypotheticals-client";

const clientRequest = jest.fn(() => Promise.resolve({ data: "response" }));

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  GQL: jest.fn(() => ({ execute: clientRequest })),
}));

jest.mock("./blh_updates_query.graphql", () => "graphqlQuery");

function createClient(url = new URL("http://fakeurl.com"), config = {}) {
  return BetLiveHipotheticalsClient(url, config);
}

describe("BetLiveHipotheticalsClient", () => {
  const blhProps = {
    bets: [
      {
        betType: "SINGLE",
        legs: [
          {
            legNumber: "1",
            runners: [{ id: "123123456", result: "LOSE", marketId: "929.12991182" }],
          },
        ],
      },
    ],
  };

  it("should call GQL client builder with the URL", () => {
    createClient();
    expect(GQL).toHaveBeenCalledWith(new URL("http://fakeurl.com/"), {});
  });

  describe("when we call the getBetsResult method", () => {
    it("should call the GQL request method with the right arguments and return the expected response", async () => {
      const client = createClient();

      const returnValue = await client.getBetsResult(blhProps);
      expect(clientRequest).toHaveBeenCalledWith({
        query: "graphqlQuery",
        variables: blhProps,
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
      await client.getBetsResult(blhProps);
      expect(global.console.warn).toHaveBeenCalledWith(
        "The following errors occurred while fetching bet results from BLH: {Message: error; Description: desc}",
      );
    });
  });
});
