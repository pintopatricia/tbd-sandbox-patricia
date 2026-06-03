import {
  UI__CLICK_ALLMARKETS_LINK,
  UI__NAVIGATE_TO_COMPETITION_VIEW,
  UI__NAVIGATE_TO_RACE_FROM_MARKET,
  UI__TAP_ALL_COMPETITIONS_LINK,
} from "@ppb/tbd-store/actions/navigation";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { UI__SEARCH_AZ_LINK_CLICK } from "@ppb/tbd-store/actions/browse";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";

import {
  dispatchSearchLinkClick,
  makeMapStateToProps,
  mapDispatchToProps,
  navigateToAllCompetitionsViewFromQuickLink,
  navigateToAllMarketsFromAllMarketsLink,
  navigateToCompetitionView,
  navigateToRaceViewFromMarketQuickLink,
  pushAction,
} from "./map-to-props-factory";

const viewLinkMock = {
  viewUrl: "Url 1",
  viewUrn: "fakeUrn1",
};

const linksMock = [
  {
    label: "Link 1",
    viewLink: viewLinkMock,
    icon: 1,
  },
  {
    label: "Link Virtuals",
    viewLink: viewLinkMock,
    icon: "Virtuals",
  },
];

const stateMock = {
  layouts: {
    cards: {
      quickLinks: {
        accordionTitle: "accordion title",
        title: "Match Odds",
        links: linksMock,
      },
    },
  },
};

const urnMock = "urn:fake:allCompetitions:1";
const getQuickLinksCardByURNSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getQuickLinksCardByURNSelector),
}));

describe("makeMapStateToProps", () => {
  it("should create selector for competition view link card", () => {
    makeMapStateToProps();

    expect(createCardByURNSelector).toHaveBeenCalledWith();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when title exists in the state", () => {
      it("should map title and links to props", () => {
        getQuickLinksCardByURNSelector.mockReturnValue({
          title: "Match Odds",
          links: linksMock,
        });

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(stateMock, { urn: urnMock });
        expect(getQuickLinksCardByURNSelector).toHaveBeenCalledWith(
          stateMock.layouts.cards.quicklinks,
          "urn:fake:allCompetitions:1",
        );
        expect(props).toEqual({
          title: "Match Odds",
          links: linksMock,
          accordionExpanded: false,
        });
      });
    });

    describe("when accordion title exists in the state", () => {
      it("should map title, accordion title and links to props", () => {
        getQuickLinksCardByURNSelector.mockReturnValue({
          title: "Match Odds",
          links: linksMock,
          accordionTitle: "accordion title",
        });

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(stateMock, { urn: urnMock });
        expect(getQuickLinksCardByURNSelector).toHaveBeenCalledWith(
          stateMock.layouts.cards.quicklinks,
          "urn:fake:allCompetitions:1",
        );
        expect(props).toEqual({
          title: "Match Odds",
          links: linksMock,
          accordionTitle: "accordion title",
          accordionExpanded: false,
        });
      });
    });

    describe("when accordionExpanded exists in the state", () => {
      it("should accordionExpanded, and links to props", () => {
        getQuickLinksCardByURNSelector.mockReturnValue({
          links: linksMock,
          accordionExpanded: true,
        });

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(stateMock, { urn: urnMock });
        expect(getQuickLinksCardByURNSelector).toHaveBeenCalledWith(
          stateMock.layouts.cards.quicklinks,
          "urn:fake:allCompetitions:1",
        );
        expect(props).toEqual({
          links: linksMock,
          accordionExpanded: true,
        });
      });
    });

    describe("when some props don't exist in the state", () => {
      it("should map title and links to props", () => {
        getQuickLinksCardByURNSelector.mockReturnValue({
          title: null,
          links: linksMock,
          accordionTitle: null,
          accordionExpanded: null,
        });

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(stateMock, { urn: urnMock });
        expect(getQuickLinksCardByURNSelector).toHaveBeenCalledWith(
          stateMock.layouts.cards.quicklinks,
          "urn:fake:allCompetitions:1",
        );
        expect(props).toEqual({
          title: undefined,
          links: linksMock,
          accordionTitle: undefined,
          accordionExpanded: false,
        });
      });
    });
  });
});

describe("navigateToAllCompetitionsViewFromQuickLink", () => {
  beforeEach(jest.clearAllMocks);
  it("should dispatch navigate to all competitions view from quicklink action", () => {
    const href = "href";
    const cardUrn = "cardUrn";
    const text = "Match Odds";

    expect(navigateToAllCompetitionsViewFromQuickLink(href, cardUrn, text)).toEqual({
      payload: {
        cardUrn: "cardUrn",
        href: "href",
        text: "Match Odds",
      },
      type: UI__TAP_ALL_COMPETITIONS_LINK,
    });
  });
});

describe("navigateToRaceViewFromMarketQuickLink", () => {
  beforeEach(jest.clearAllMocks);
  it("should dispatch navigate to race view from quicklink action", () => {
    const url = "url";
    const text = "Win";

    expect(navigateToRaceViewFromMarketQuickLink(url, text)).toEqual({
      payload: {
        url: "url",
        text: "Win",
      },
      type: UI__NAVIGATE_TO_RACE_FROM_MARKET,
    });
  });
});

describe("navigateToCompetitionView", () => {
  beforeEach(jest.clearAllMocks);
  it("should dispatch navigate to competition view from quick link action", () => {
    const url = "url";
    const text = "Win";
    const cardUrn = "cardUrn";

    expect(navigateToCompetitionView(cardUrn, url, text)).toEqual({
      payload: { cardType: "QuickLinksCard", cardUrn, href: url, text },
      type: UI__NAVIGATE_TO_COMPETITION_VIEW,
    });
  });
});

describe("dispatchSearchLinkClick", () => {
  beforeEach(jest.clearAllMocks);
  it("should dispatch search AZ Link click action", () => {
    const viewLink = { viewUrn: "urn", viewUrl: "url" };
    const text = "text";
    const title = "title";

    expect(dispatchSearchLinkClick(text, viewLink, title)).toEqual({
      payload: {
        url: "url",
        text: "text",
        title: "title",
      },
      type: UI__SEARCH_AZ_LINK_CLICK,
    });
  });
});

describe("navigateToAllMarketsFromAllMarketsLink", () => {
  beforeEach(jest.clearAllMocks);
  it("should dispatch navigate to all markets from all markets link action", () => {
    const destinationUrl = "destinationUrl";

    expect(navigateToAllMarketsFromAllMarketsLink(destinationUrl)).toEqual({
      payload: { destinationUrl },
      type: UI__CLICK_ALLMARKETS_LINK,
    });
  });
});

describe("pushAction", () => {
  beforeEach(jest.clearAllMocks);
  it("should dispatch push action", () => {
    const viewLink = { viewUrl: "url" };

    expect(pushAction(viewLink)).toEqual({
      payload: viewLink,
      type: PUSH,
    });
  });
});

describe("mapDispatchToProps", () => {
  let result;
  beforeEach(jest.clearAllMocks);

  describe("navigateToQuickLink", () => {
    const text = "Match Odds";
    let viewLink;
    const { navigateToQuickLink } = mapDispatchToProps;

    describe("when viewUrn ends with allCompetitions:1", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: "Url 1",
          viewUrn: "ppb:tbd:view:allCompetitions:1",
        };
        result = navigateToQuickLink(viewLink, text, urnMock);
      });

      it("should return right data", () => {
        expect(result).toEqual({
          payload: { cardUrn: "urn:fake:allCompetitions:1", href: "Url 1", text: "Match Odds" },
          type: "UI__TAP_ALL_COMPETITIONS_LINK",
        });
      });
    });

    describe("when viewUrn includes allMarkets", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: "Url 1",
          viewUrn: "ppb:tbd:view:allMarkets:1111",
        };

        result = navigateToQuickLink(viewLink, text, urnMock);
      });

      it("should return right data", () => {
        expect(result).toEqual({ payload: { destinationUrl: "Url 1" }, type: "UI__CLICK_ALLMARKETS_LINK" });
      });
    });

    describe("when viewUrn includes 'event'", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: "Url 1",
          viewUrn: "ppb:tbd:view:event:1111",
        };

        result = navigateToQuickLink(viewLink, text, urnMock);
      });

      it("should return right data", () => {
        expect(result).toEqual({
          payload: { text: "Match Odds", url: "Url 1" },
          type: "UI__NAVIGATE_TO_EVENT_FROM_MARKET",
        });
      });
    });

    describe("when viewUrn includes 'race'", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: "Url 1",
          viewUrn: "ppb:tbd:view:race:1111",
        };

        result = navigateToQuickLink(viewLink, text, urnMock);
      });

      it("should return right data", () => {
        expect(result).toEqual({
          payload: { text: "Match Odds", url: "Url 1" },
          type: "UI__NAVIGATE_TO_RACE_FROM_MARKET",
        });
      });
    });

    describe("when viewUrn includes 'sport'", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: "Url 1",
          viewUrn: "ppb:tbd:view:sport:1",
        };
        const title = "Top Sports";
        result = navigateToQuickLink(viewLink, text, urnMock, title);
      });

      it("should return right data", () => {
        expect(result).toEqual({
          payload: { text: "Match Odds", url: "Url 1", title: "Top Sports" },
          type: "UI__SEARCH_AZ_LINK_CLICK",
        });
      });
    });

    describe("when viewUrn includes 'view:generic:virtuals'", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: "Url 1",
          viewUrn: "ppb:tbd:view:generic:virtuals",
        };

        result = navigateToQuickLink(viewLink, "Virtuais Sexy", urnMock);
      });

      it("should return right data", () => {
        expect(result).toEqual({ payload: { text: "Virtuais Sexy", url: "Url 1" }, type: "UI__SEARCH_AZ_LINK_CLICK" });
      });
    });

    describe("when viewUrn includes 'view:generic:inplay'", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: "Url 1",
          viewUrn: "ppb:tbd:view:generic:inplay",
        };

        result = navigateToQuickLink(viewLink, "In-play", urnMock);
      });

      it("should return right data", () => {
        expect(result).toEqual({ payload: { text: "In-play", url: "Url 1" }, type: "UI__SEARCH_AZ_LINK_CLICK" });
      });
    });

    describe("when viewUrn includes 'view:competition'", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: "Url 1",
          viewUrn: "ppb:tbd:view:competition:1",
        };

        result = navigateToQuickLink(viewLink, text, urnMock);
      });

      it("should return right data", () => {
        expect(result).toEqual({
          payload: {
            cardType: "QuickLinksCard",
            cardUrn: "urn:fake:allCompetitions:1",
            href: "Url 1",
            text: "Match Odds",
          },
          type: "UI__NAVIGATE_TO_COMPETITION_VIEW",
        });
      });
    });

    describe("when doesn't have a viewUrl", () => {
      beforeEach(() => {
        viewLink = {
          viewUrl: null,
          viewUrn: "ppb:tbd:view:allCompetitions:1",
        };
        result = navigateToQuickLink(viewLink, text, urnMock);
      });

      it("should return right data", () => {
        expect(result).toEqual({});
      });
    });
  });
});
