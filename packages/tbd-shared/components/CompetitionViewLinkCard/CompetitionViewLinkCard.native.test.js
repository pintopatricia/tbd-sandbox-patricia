import { render, fireEvent } from "@testing-library/react-native";

import { SportsIconName } from "@ppb/the-wall-icons";
import { CircularImageSize } from "./snowflakes/CircularImage/CircularImage.types";
import { CircularImage } from "./snowflakes/CircularImage/CircularImage.native";

import CompetitionViewLinkCard from "./CompetitionViewLinkCard.native";
import { COMPETITION_VIEW_LINK_CARD } from "./CompetitionViewLinkCard.native.selectors";

jest.mock("./snowflakes/CircularImage/CircularImage.native", () => ({
  CircularImage: jest.fn(({ props }) => <circular-image-mock {...props} />),
}));

jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

const VIEW_LINK_MOCK = { viewUrl: "http://url.fake", viewUrn: "urn:fake:1" };
const dispatchNavigateToCompetitionViewMock = jest.fn();
const dispatchRouterPushActionMock = jest.fn();

const renderComponent = ({
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

describe("CompetitionViewLinkCard native", () => {
  beforeEach(jest.clearAllMocks);

  it("should render circular image component", () => {
    renderComponent();

    expect(CircularImage).toHaveBeenCalledWith(
      {
        imageURL: "logo",
        fallbackIcon: SportsIconName.FOOTBALL,
        text: "Link Text",
        size: CircularImageSize.Small,
      },
      undefined,
    );
    expect(CircularImage).toHaveBeenCalledTimes(1);
  });

  describe("when competition view link is clicked", () => {
    describe("when view link is defined", () => {
      it("should dispatch navigate to competition view action", () => {
        const { getByTestId } = renderComponent();

        fireEvent.press(getByTestId(COMPETITION_VIEW_LINK_CARD));

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
