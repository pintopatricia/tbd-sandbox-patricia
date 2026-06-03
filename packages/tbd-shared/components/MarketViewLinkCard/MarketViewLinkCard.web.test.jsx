import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { HighlightedLinkCard } from "@ppb/the-wall-web";
import MarketViewLinkCard from "./MarketViewLinkCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  HighlightedLinkCard: jest.fn(({ children }) => <highlighted-mock>{children}</highlighted-mock>),
}));

const VIEW_LINK_MOCK = { viewUrl: "http://url.fake", viewUrn: "urn:fake:1" };

function renderMarketViewLinkCard({ urn, viewLink, name, badge, dispatchRouterPushAction }) {
  return render(
    <MarketViewLinkCard
      urn={urn}
      viewLink={viewLink}
      name={name}
      badge={badge}
      dispatchRouterPushAction={dispatchRouterPushAction}
    />,
  );
}

describe("MarketViewLinkCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render market view link component", () => {
    renderMarketViewLinkCard({
      urn: "urn:fake:1",
      viewLink: VIEW_LINK_MOCK,
      name: "Outrights",
      badge: "CUP",
      dispatchRouterPushAction: jest.fn(() => {}),
    });

    expect(HighlightedLinkCard).toHaveBeenCalledWith(
      {
        cardIcon: "CUP",
        label: "Outrights",
        onTap: expect.any(Function),
        urn: "urn:fake:1",
        viewLink: { viewUrl: "http://url.fake", viewUrn: "urn:fake:1" },
      },
      undefined,
    );
  });

  it("should dispatch when callback is executed", () => {
    const pushMock = jest.fn(() => {});

    renderMarketViewLinkCard({
      urn: "urn:fake:1",
      viewLink: VIEW_LINK_MOCK,
      name: "Outrights",
      badge: "CUP",
      dispatchRouterPushAction: pushMock,
    });

    const { onTap } = HighlightedLinkCard.mock.calls[0][0];

    onTap({ preventDefault: jest.fn() });

    expect(pushMock).toHaveBeenCalledWith(VIEW_LINK_MOCK);
  });
});
