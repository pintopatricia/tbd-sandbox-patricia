import { render, fireEvent } from "@testing-library/react";
import GamingContext, { GamingContextProvider } from "./GamingContext";

const TestConsumer = () => (
  <GamingContext.Consumer>
    {({ deepLinkUrn, deepLinkUrl, recentlyPlayedUrn, setDeepLinkUrn, setDeepLinkUrl, setRecentlyPlayedUrn }) => (
      <div>
        <div data-testid="deepLinkUrn">{deepLinkUrn ?? "undefined"}</div>
        <div data-testid="deepLinkUrl">{deepLinkUrl ?? "undefined"}</div>
        <div data-testid="recentlyPlayedUrn">{recentlyPlayedUrn ?? "undefined"}</div>

        <button data-testid="setDeepLinkUrn" onClick={() => setDeepLinkUrn("urn:test:deep")} />
        <button data-testid="setDeepLinkUrl" onClick={() => setDeepLinkUrl("https://betfair.com")} />
        <button data-testid="setRecentlyPlayedUrn" onClick={() => setRecentlyPlayedUrn("urn:test:recent")} />
      </div>
    )}
  </GamingContext.Consumer>
);

describe("GamingContextProvider (web)", () => {
  it("provides default values", () => {
    const { getByTestId } = render(
      <GamingContextProvider>
        <TestConsumer />
      </GamingContextProvider>,
    );

    expect(getByTestId("deepLinkUrn").textContent).toBe("undefined");
    expect(getByTestId("deepLinkUrl").textContent).toBe("undefined");
    expect(getByTestId("recentlyPlayedUrn").textContent).toBe("undefined");
  });

  it("updates values via setters", () => {
    const { getByTestId } = render(
      <GamingContextProvider>
        <TestConsumer />
      </GamingContextProvider>,
    );

    fireEvent.click(getByTestId("setDeepLinkUrn"));
    fireEvent.click(getByTestId("setDeepLinkUrl"));
    fireEvent.click(getByTestId("setRecentlyPlayedUrn"));

    expect(getByTestId("deepLinkUrn").textContent).toBe("urn:test:deep");
    expect(getByTestId("deepLinkUrl").textContent).toBe("https://betfair.com");
    expect(getByTestId("recentlyPlayedUrn").textContent).toBe("urn:test:recent");
  });
});
