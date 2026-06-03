import type { ApolloLink } from "@apollo/client";
import { getStore } from "@ppb/tbd-store/create-store";
import { createCurrentLocationLink } from "./current-location-link";

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn(),
}));

const BASE_URI = "https://api.example.com/graphql";

const setRouterState = (router: { currentUrl?: string; currentUrn?: string }) => {
  (getStore as jest.Mock).mockReturnValue({
    getState: () => ({ router }),
  });
};

const callLink = (link: ApolloLink, operation: { setContext: jest.Mock; operationName?: string }) => {
  const forwardedSentinel = {} as any;
  const forward = jest.fn(() => forwardedSentinel);
  const result = (link as any).request(operation, forward);
  return { forward, result, forwardedSentinel };
};

describe("current-location-link", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("forwards untouched when there is no currentUrl and no currentUrn", () => {
    setRouterState({});
    const operation = { setContext: jest.fn() };
    const { forward } = callLink(createCurrentLocationLink(BASE_URI), operation);

    expect(operation.setContext).not.toHaveBeenCalled();
    expect(forward).toHaveBeenCalledTimes(1);
  });

  it("appends currentUrl as a query param when only the URL is present", () => {
    setRouterState({ currentUrl: "/horse-racing" });
    const operation = { setContext: jest.fn() };
    callLink(createCurrentLocationLink(BASE_URI), operation);

    expect(operation.setContext).toHaveBeenCalledWith({
      uri: `${BASE_URI}?currentUrl=%2Fhorse-racing`,
    });
  });

  it("appends currentViewUrn as a query param when only the urn is present", () => {
    setRouterState({ currentUrn: "ppb:tbd:view:raceMeeting:7|12345.1500" });
    const operation = { setContext: jest.fn() };
    callLink(createCurrentLocationLink(BASE_URI), operation);

    expect(operation.setContext).toHaveBeenCalledWith({
      uri: `${BASE_URI}?currentViewUrn=ppb%3Atbd%3Aview%3AraceMeeting%3A7%7C12345.1500`,
    });
  });

  it("appends both query params when both router fields are present", () => {
    setRouterState({
      currentUrl: "/horse-racing",
      currentUrn: "ppb:tbd:view:raceMeeting:7|12345.1500",
    });
    const operation = { setContext: jest.fn() };
    callLink(createCurrentLocationLink(BASE_URI), operation);

    const callArg = operation.setContext.mock.calls[0][0].uri as string;
    const url = new URL(callArg);
    expect(url.searchParams.get("currentUrl")).toBe("/horse-racing");
    expect(url.searchParams.get("currentViewUrn")).toBe("ppb:tbd:view:raceMeeting:7|12345.1500");
  });

  it("preserves any pre-existing path on the base URI", () => {
    setRouterState({ currentUrl: "/x" });
    const operation = { setContext: jest.fn() };
    callLink(createCurrentLocationLink("https://api.example.com/v2/graphql"), operation);

    const callArg = operation.setContext.mock.calls[0][0].uri as string;
    expect(callArg.startsWith("https://api.example.com/v2/graphql")).toBe(true);
  });

  it("returns whatever forward returns", () => {
    setRouterState({ currentUrl: "/" });
    const { forward, result, forwardedSentinel } = callLink(createCurrentLocationLink(BASE_URI), {
      setContext: jest.fn(),
    });
    expect(forward).toHaveBeenCalledTimes(1);
    expect(result).toBe(forwardedSentinel);
  });
});
