import { get } from "@flutter-global/uki-channels-http-clients/src/request/request";
import GamingGlobalSearch from "./GamingGlobalSearch";

jest.mock("@flutter-global/uki-channels-http-clients/src/request/request", () => ({
  get: jest.fn(() => Promise.resolve({ data: "response" })),
}));

jest.mock("../../config/application-key", () => ({
  getApplicationKey: jest.fn(() => "fakeKey"),
}));

function createClient(endpoint, options) {
  return GamingGlobalSearch(endpoint, options);
}

describe("GamingGlobalSearch client", () => {
  it("should call get method with the url", async () => {
    const client = createClient("gamingSearchEndpoint");
    client.searchResults("query", "en");

    expect(get).toHaveBeenCalledWith(
      "gamingSearchEndpoint?platform=mobile&product=gaming&q=query&language=en&ugeMigrated=true",
      {
        headers: { "X-Application": "fakeKey" },
        withCredentials: true,
      },
    );
  });

  it("should call get method with xsellsportsbook product on spain jurisdiction", async () => {
    const client = createClient("gamingSearchEndpoint");
    client.searchResults("query", "en", "SPAIN");

    expect(get).toHaveBeenCalledWith(
      "gamingSearchEndpoint?platform=mobile&product=xsellsportsbook&q=query&language=en&ugeMigrated=true",
      {
        headers: { "X-Application": "fakeKey" },
        withCredentials: true,
      },
    );
  });

  it("should call get method with xsellsportsbook product on romania jurisdiction", async () => {
    const client = createClient("gamingSearchEndpoint");
    client.searchResults("query", "ro", "ROMANIA");

    expect(get).toHaveBeenCalledWith(
      "gamingSearchEndpoint?platform=mobile&product=xsellsportsbook&q=query&language=ro&ugeMigrated=true",
      {
        headers: { "X-Application": "fakeKey" },
        withCredentials: true,
      },
    );
  });

  it("should call get method with casino product on denmark jurisdiction", async () => {
    const client = createClient("gamingSearchEndpoint");
    client.searchResults("query", "da", "DENMARK");

    expect(get).toHaveBeenCalledWith(
      "gamingSearchEndpoint?platform=mobile&product=casino&q=query&language=da&ugeMigrated=true",
      {
        headers: { "X-Application": "fakeKey" },
        withCredentials: true,
      },
    );
  });

  it("should call get method with xsellsportsbook product on italy jurisdiction", async () => {
    const client = createClient("gamingSearchEndpoint");
    client.searchResults("query", "en", "ITALY");

    expect(get).toHaveBeenCalledWith(
      "gamingSearchEndpoint?platform=mobile&product=xsellsportsbook&q=query&language=en&ugeMigrated=true",
      {
        headers: { "X-Application": "fakeKey" },
        withCredentials: true,
      },
    );
  });

  it("should call get method with gaming product when jurisdiction isn't Spain or Italy", async () => {
    const client = createClient("gamingSearchEndpoint");
    client.searchResults("query", "en", "INTERNATIONAL");

    expect(get).toHaveBeenCalledWith(
      "gamingSearchEndpoint?platform=mobile&product=gaming&q=query&language=en&ugeMigrated=true",
      {
        headers: { "X-Application": "fakeKey" },
        withCredentials: true,
      },
    );
  });

  it("should call get method with User-Agent header", async () => {
    const client = createClient("gamingSearchEndpoint", {
      overrideUserAgent: "fakeUserAgent",
    });
    client.searchResults("query", "en");

    expect(get).toHaveBeenCalledWith(
      "gamingSearchEndpoint?platform=mobile&product=gaming&q=query&language=en&ugeMigrated=true",
      {
        headers: {
          "X-Application": "fakeKey",
          "User-Agent": "fakeUserAgent",
        },
        withCredentials: true,
      },
    );
  });

  it("should return the response", async () => {
    const client = createClient();
    const returnValue = client.searchResults("query", "en");
    const response = await returnValue;

    expect(response).toEqual("response");
  });
});
