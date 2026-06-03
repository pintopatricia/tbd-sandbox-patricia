import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { SportsIconName } from "@ppb/the-wall-icons";
import { CircularImageSize } from "./snowflakes/CircularImage/CircularImage.types";

import { CircularImage } from "./snowflakes/CircularImage/CircularImage.web";
import CompetitionViewLinkCard from "./CompetitionViewLinkCard.web";

jest.mock("./snowflakes/CircularImage/CircularImage.web", () => ({
  CircularImage: jest.fn(() => <circular-mock />),
}));

const VIEW_LINK_MOCK = { viewUrl: "http://url.fake", viewUrn: "urn:fake:1" };
const dispatchNavigateToCompetitionViewMock = jest.fn();
const dispatchRouterPushActionMock = jest.fn();

const renderCompetitionViewLinkCard = ({
  urn = "urn:fake:1",
  viewLink = VIEW_LINK_MOCK,
  name = "Link Text",
  logo = "logo",
  fallbackIcon = SportsIconName.FOOTBALL,
  dispatchNavigateToCompetitionView = dispatchNavigateToCompetitionViewMock,
  dispatchRouterPushAction = dispatchRouterPushActionMock,
} = {}) =>
  render(
    <CompetitionViewLinkCard
      urn={urn}
      viewLink={viewLink}
      name={name}
      logo={logo}
      fallbackIcon={fallbackIcon}
      dispatchNavigateToCompetitionView={dispatchNavigateToCompetitionView}
      dispatchRouterPushAction={dispatchRouterPushAction}
    />,
  );

describe("CompetitionViewLinkCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render circular image component", () => {
    renderCompetitionViewLinkCard();

    expect(CircularImage).toHaveBeenCalledWith(
      {
        imageAlt: "Link Text",
        imageURL: "logo",
        fallbackIcon: SportsIconName.FOOTBALL,
        text: "Link Text",
        size: CircularImageSize.Small,
      },
      undefined,
    );
  });

  describe("when competition view link is clicked", () => {
    describe("when view link is defined", () => {
      beforeEach(() => {
        const { container } = renderCompetitionViewLinkCard();

        container.querySelector("a").click();
      });

      it("should dispatch router push action", () => {
        expect(dispatchRouterPushActionMock).toHaveBeenCalledWith(VIEW_LINK_MOCK);
        expect(dispatchRouterPushActionMock).toHaveBeenCalledTimes(1);
      });

      it("should dispatch navigate to competition view action", () => {
        expect(dispatchNavigateToCompetitionViewMock).toHaveBeenCalledWith(
          VIEW_LINK_MOCK.viewUrl,
          "Link Text",
          "urn:fake:1",
        );
        expect(dispatchNavigateToCompetitionViewMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
