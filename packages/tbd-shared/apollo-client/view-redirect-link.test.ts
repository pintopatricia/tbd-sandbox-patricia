import { type ApolloLink } from "@apollo/client";
import { parse } from "graphql";
import { VIEW_REDIRECT } from "@ppb/tbd-store/actions/router";
import { createViewRedirectLink } from "./view-redirect-link";
import { getApolloClient } from "./client";
import { getStore } from "@ppb/tbd-store/create-store";

jest.mock("./client", () => ({
  getApolloClient: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn(),
}));

jest.mock("./fragments/ViewRedirect.graphql", () => ({
  ViewRedirectQuery: { kind: "Document", definitions: [], __mock: "ViewRedirectQuery" },
}));

const VIEW_URN = "ppb:tbd:view:raceMeeting:7|12345.1500";

const RACE_MEETING_QUERY = parse(/* GraphQL */ `
  query RaceMeetingView($viewURN: URN!) {
    View(viewURN: $viewURN) {
      ...RaceMeetingView
    }
  }
  fragment RaceMeetingView on RaceMeetingView {
    urn
    url
  }
`);

const INLINE_FRAGMENT_QUERY = parse(/* GraphQL */ `
  query MultiViewQuery($viewURN: URN!) {
    View(viewURN: $viewURN) {
      ... on RaceMeetingView {
        urn
      }
      ... on SportView {
        urn
      }
    }
  }
`);

const STRING_LITERAL_VIEW_URN_QUERY = parse(/* GraphQL */ `
  query LiteralView {
    View(viewURN: "ppb:tbd:view:raceMeeting:7|99.1") {
      ...RaceMeetingView
    }
  }
  fragment RaceMeetingView on RaceMeetingView {
    urn
  }
`);

const NO_VIEW_QUERY = parse(/* GraphQL */ `
  query AppContextDetails {
    AppContext {
      urn
    }
  }
`);

const NO_VIEW_URN_ARG_QUERY = parse(/* GraphQL */ `
  query NoViewURN {
    View {
      ...RaceMeetingView
    }
  }
  fragment RaceMeetingView on RaceMeetingView {
    urn
  }
`);

const EMPTY_VIEW_SELECTION_QUERY = parse(/* GraphQL */ `
  query EmptyView($viewURN: URN!) {
    View(viewURN: $viewURN) {
      __typename
    }
  }
`);

const flushAsync = async () => {
  await new Promise(process.nextTick);
  await new Promise(process.nextTick);
};

const buildOperation = (overrides: Partial<{ query: any; operationName: string; variables: Record<string, any> }>) =>
  ({
    query: RACE_MEETING_QUERY,
    operationName: "RaceMeetingView",
    variables: { viewURN: VIEW_URN },
    ...overrides,
  }) as any;

const callLink = (link: ApolloLink, operation: any) => {
  const forwardedSentinel = {} as any;
  const forward = jest.fn(() => forwardedSentinel);
  const result = (link as any).request(operation, forward);
  return { forward, result, forwardedSentinel };
};

describe("view-redirect-link", () => {
  let mockQuery: jest.Mock;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery = jest.fn().mockResolvedValue({ data: undefined });
    mockDispatch = jest.fn();
    (getApolloClient as jest.Mock).mockReturnValue({ query: mockQuery });
    (getStore as jest.Mock).mockReturnValue({ dispatch: mockDispatch });
  });

  it("skips the redirect query for the ViewRedirect operation itself", async () => {
    const link = createViewRedirectLink();
    const { forward } = callLink(link, buildOperation({ operationName: "ViewRedirect" }));
    await flushAsync();
    expect(forward).toHaveBeenCalledTimes(1);
    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("skips when the operation does not query the View field", async () => {
    const link = createViewRedirectLink();
    const { forward } = callLink(
      link,
      buildOperation({ query: NO_VIEW_QUERY, operationName: "AppContextDetails", variables: {} }),
    );
    await flushAsync();
    expect(forward).toHaveBeenCalledTimes(1);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("skips when the View selection set has no concrete expected types", async () => {
    const link = createViewRedirectLink();
    callLink(link, buildOperation({ query: EMPTY_VIEW_SELECTION_QUERY, operationName: "EmptyView" }));
    await flushAsync();
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("skips when the viewURN argument cannot be resolved", async () => {
    const link = createViewRedirectLink();
    callLink(link, buildOperation({ query: NO_VIEW_URN_ARG_QUERY, operationName: "NoViewURN", variables: {} }));
    await flushAsync();
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("fires the ViewRedirect query with the variable-resolved viewURN", async () => {
    mockQuery.mockResolvedValue({
      data: { View: { __typename: "RaceMeetingView", urn: VIEW_URN, url: "/race-meeting" } },
    });
    const link = createViewRedirectLink();
    callLink(link, buildOperation({}));
    await flushAsync();
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { viewURN: VIEW_URN },
        fetchPolicy: "network-only",
      }),
    );
  });

  it("resolves the viewURN from a string literal argument", async () => {
    mockQuery.mockResolvedValue({
      data: { View: { __typename: "RaceMeetingView", urn: "ppb:tbd:view:raceMeeting:7|99.1", url: "/x" } },
    });
    const link = createViewRedirectLink();
    callLink(
      link,
      buildOperation({ query: STRING_LITERAL_VIEW_URN_QUERY, operationName: "LiteralView", variables: {} }),
    );
    await flushAsync();
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { viewURN: "ppb:tbd:view:raceMeeting:7|99.1" } }),
    );
  });

  it("does not dispatch when the returned typename matches an expected type", async () => {
    mockQuery.mockResolvedValue({
      data: { View: { __typename: "RaceMeetingView", urn: VIEW_URN, url: "/race-meeting" } },
    });
    const link = createViewRedirectLink();
    callLink(link, buildOperation({}));
    await flushAsync();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("dispatches VIEW_REDIRECT when the returned typename is not in the expected list", async () => {
    const redirectUrn = "ppb:tbd:view:sport:1";
    const redirectUrl = "/sport/horse-racing";
    mockQuery.mockResolvedValue({
      data: { View: { __typename: "SportView", urn: redirectUrn, url: redirectUrl } },
    });
    const link = createViewRedirectLink();
    callLink(link, buildOperation({}));
    await flushAsync();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: VIEW_REDIRECT,
      payload: { viewUrn: redirectUrn, viewUrl: redirectUrl },
    });
  });

  it("force-redirects on NotFoundView even when caller declared its fragment", async () => {
    const notFoundQuery = parse(/* GraphQL */ `
      query NotFoundCapable($viewURN: URN!) {
        View(viewURN: $viewURN) {
          ... on NotFoundView {
            urn
          }
        }
      }
    `);
    mockQuery.mockResolvedValue({
      data: { View: { __typename: "NotFoundView", urn: "ppb:tbd:view:notFound", url: "/not-found" } },
    });
    const link = createViewRedirectLink();
    callLink(link, buildOperation({ query: notFoundQuery, operationName: "NotFoundCapable" }));
    await flushAsync();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: VIEW_REDIRECT,
      payload: { viewUrn: "ppb:tbd:view:notFound", viewUrl: "/not-found" },
    });
  });

  it("force-redirects on MaintenanceView", async () => {
    mockQuery.mockResolvedValue({
      data: { View: { __typename: "MaintenanceView", urn: "ppb:tbd:view:maintenance", url: "/maintenance" } },
    });
    const link = createViewRedirectLink();
    callLink(link, buildOperation({}));
    await flushAsync();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: VIEW_REDIRECT,
      payload: { viewUrn: "ppb:tbd:view:maintenance", viewUrl: "/maintenance" },
    });
  });

  it("does not dispatch when the returned type is one of multiple inline-fragment expected types", async () => {
    mockQuery.mockResolvedValue({
      data: { View: { __typename: "SportView", urn: "ppb:tbd:view:sport:1", url: "/sport/1" } },
    });
    const link = createViewRedirectLink();
    callLink(link, buildOperation({ query: INLINE_FRAGMENT_QUERY, operationName: "MultiViewQuery" }));
    await flushAsync();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch when the redirect query returns no View", async () => {
    mockQuery.mockResolvedValue({ data: { View: null } });
    const link = createViewRedirectLink();
    callLink(link, buildOperation({}));
    await flushAsync();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("swallows errors from the redirect query without breaking the original operation", async () => {
    mockQuery.mockRejectedValue(new Error("network down"));
    const link = createViewRedirectLink();
    const { forward } = callLink(link, buildOperation({}));
    await flushAsync();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(forward).toHaveBeenCalledTimes(1);
  });

  it("forwards the original operation in every case", async () => {
    mockQuery.mockResolvedValue({
      data: { View: { __typename: "SportView", urn: "ppb:tbd:view:sport:1", url: "/sport/1" } },
    });
    const link = createViewRedirectLink();
    const { forward, result, forwardedSentinel } = callLink(link, buildOperation({}));
    await flushAsync();
    expect(forward).toHaveBeenCalledTimes(1);
    expect(result).toBe(forwardedSentinel);
  });
});
