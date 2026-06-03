import { render } from "@testing-library/react";
import { HighlightedLinkCard } from "@ppb/the-wall-web";
import GamingLinkCard from "./GamingLinkCard.web";
import styles from "./GamingLinkCard.web.css";
import { getStoredNewestReleasedGames, initNewReleases } from "../../helpers/gaming-new-releases.web";

jest.mock("@ppb/the-wall-web", () => ({
  HighlightedLinkCard: jest.fn(() => <highlighted-link-card-mock />),
}));

jest.mock("../../helpers/gaming-new-releases.web", () => ({
  initNewReleases: jest.fn(() => ({ new: [], seen: [] })),
  getStoredNewestReleasedGames: jest.fn(() => []),
}));

const DEFAULT_PROPS = {
  urn: "urn:fake:1",
  viewLink: { viewUrl: "http://url.fake", viewUrn: "urn:fake:1" },
  name: "New Games",
  icon: "Slots",
  zoneTitle: "zoneTitle",
  games: [],
  dispatchPushAction: jest.fn(),
  dispatchNavigateToGameCategoryViewAction: jest.fn(),
};

const renderGamingLinkCard = (props = {}) => render(<GamingLinkCard {...DEFAULT_PROPS} {...props} />);

describe("GamingLinkCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the HighlightedLinkCard component", () => {
    renderGamingLinkCard();

    expect(HighlightedLinkCard).toHaveBeenCalledWith(
      {
        cardIcon: DEFAULT_PROPS.icon,
        className: styles.linkCard,
        label: DEFAULT_PROPS.name,
        onTap: expect.any(Function),
        urn: DEFAULT_PROPS.urn,
        games: undefined,
        viewLink: DEFAULT_PROPS.viewLink,
      },
      undefined,
    );
  });

  it("should dispatch when callback is executed", () => {
    renderGamingLinkCard();

    const { onTap } = HighlightedLinkCard.mock.calls[0][0];

    onTap({ preventDefault: jest.fn() });

    expect(DEFAULT_PROPS.dispatchPushAction).toHaveBeenCalledWith(DEFAULT_PROPS.viewLink);
    expect(DEFAULT_PROPS.dispatchNavigateToGameCategoryViewAction).toHaveBeenCalledWith(
      DEFAULT_PROPS.viewLink,
      DEFAULT_PROPS.urn,
      DEFAULT_PROPS.zoneTitle,
      DEFAULT_PROPS.name,
    );
  });

  it("should call initNewReleases with an empty array when there are no new games", () => {
    getStoredNewestReleasedGames.mockReturnValue(["test1"]);

    renderGamingLinkCard({ games: [], icon: "NEW" });

    expect(initNewReleases).toHaveBeenCalledWith([]);
  });

  it("should call initNewReleases with an array containing the new games", () => {
    getStoredNewestReleasedGames.mockReturnValue(["test1"]);

    renderGamingLinkCard({ games: ["test1"], icon: "NEW" });

    expect(initNewReleases).toHaveBeenCalledWith(["test1"]);
  });
});
