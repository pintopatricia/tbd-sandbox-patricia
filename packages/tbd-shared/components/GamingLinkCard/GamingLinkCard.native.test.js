import { render } from "@testing-library/react-native";
import { HighlightedLinkCard } from "@ppb/the-wall-native/components/HighlightedLinkCard/HighlightedLinkCard";
import { navigate } from "@ppb/tbd-router/native";
import GamingLinkCard from "./GamingLinkCard.native";

jest.mock("@ppb/the-wall-native/components/HighlightedLinkCard/HighlightedLinkCard", () => ({
  HighlightedLinkCard: jest.fn(() => <highlighted-link-card />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

function renderGamingLinkCard({
  urn = "fakeUrn",
  viewLink = {
    viewUrl: "fakeViewUrl",
    viewUrn: "fakeViewUrn",
  },
  name = "fakeName",
  icon = "GAMES",
  dispatchNavigateToGameCategoryViewAction = jest.fn(),
}) {
  return render(
    <GamingLinkCard
      urn={urn}
      viewLink={viewLink}
      name={name}
      icon={icon}
      dispatchNavigateToGameCategoryViewAction={dispatchNavigateToGameCategoryViewAction}
    />,
  );
}

describe("GamingLinkCard component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initialize the component", () => {
    it("should initalize the HighlightedLinkCard", () => {
      renderGamingLinkCard({
        urn: "fakeUrn",
        viewLink: {
          viewUrl: "fakeViewUrl",
          viewUrn: "fakeViewUrn",
        },
        name: "fakeName",
        icon: "GAMES",
        dispatchNavigateToGameCategoryViewAction: jest.fn(),
      });
      expect(HighlightedLinkCard).toHaveBeenCalledTimes(1);
      expect(HighlightedLinkCard).toHaveBeenCalledWith(
        {
          urn: "fakeUrn",
          label: "fakeName",
          cardIcon: "GAMES",
          onTap: expect.any(Function),
          style: { flexDirection: "row" },
        },
        undefined,
      );
    });
  });

  describe("when tapping on the card", () => {
    it("should dispatch UI__NAVIGATE_TO_GAMING_CATEGORY_USING_CATEGORY_LINK_CARD action", () => {
      const spyNavigateToGamingCategoryAction = jest.fn();
      renderGamingLinkCard({
        urn: "fakeUrn",
        viewLink: {
          viewUrl: "fakeViewUrl",
          viewUrn: "fakeViewUrn",
        },
        name: "fakeName",
        icon: "GAMES",
        dispatchNavigateToGameCategoryViewAction: spyNavigateToGamingCategoryAction,
      });
      const { onTap } = HighlightedLinkCard.mock.calls[0][0];
      onTap();

      expect(spyNavigateToGamingCategoryAction).toHaveBeenCalledWith(
        {
          viewUrl: "fakeViewUrl",
          viewUrn: "fakeViewUrn",
        },
        "fakeUrn",
        "GAMES",
        "fakeName",
      );

      expect(navigate).toHaveBeenCalledWith({ viewUrl: "fakeViewUrl", viewUrn: "fakeViewUrn" });
    });
  });
});
