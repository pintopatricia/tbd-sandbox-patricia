import Max from "./Max";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: {},
  }),
);

describe("Max client", () => {
  it("should call post method with the url", async () => {
    const client = Max("handleBannerActionEndpoint");
    client.handleBannerAction("data", "mocked_action_type");

    expect(fetch).toHaveBeenCalledWith("handleBannerActionEndpoint?actionType=mocked_action_type", {
      body: "data",
      credentials: "include",
      method: "POST",
    });
  });

  it("should return the response", async () => {
    const client = Max("handleBannerActionEndpoint");
    const returnValue = await client.handleBannerAction("data", "mocked_action_type");

    expect(returnValue).toEqual({ json: {}, ok: true, status: 200 });
  });
});
