import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { Card, Image, QuickLink } from "@ppb/the-wall-web";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { COMPETITION_REGION_CARD_HEADER_CONTAINER } from "./CompetitionRegionCard.web.selectors";
import CompetitionRegionCard from "./CompetitionRegionCard.web";
import styles from "./CompetitionRegionCard.web.css";

jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
  QuickLink: jest.fn(({ props, children }) => <quicklink-mock {...props}>{children}</quicklink-mock>),
  Image: jest.fn(() => <image-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));

const viewLinkMock = {
  viewUrn: "VIEWLINKURN",
  viewUrl: "VIEWLINKURL",
};

const competitionRegionsMock = [
  {
    urn: "ppb:tbd:country:1",
    title: "Region 1",
    flag: "someflag.svg",
    competitionViewLinks: [
      {
        title: "Competition 1",
        viewLink: viewLinkMock,
      },
      {
        title: "Competition 2",
        viewLink: viewLinkMock,
      },
    ],
  },
  {
    urn: "ppb:tbd:country:2",
    title: "Region 2",
    competitionViewLinks: [
      {
        title: "Competition 1",
        viewLink: viewLinkMock,
      },
    ],
  },
];

const dispatchNavigateToCompetitionViewMock = jest.fn();
const dispatchPushActionMock = jest.fn();

function renderCompetitionRegionCard({
  competitionRegions,
  urn,
  dispatchNavigateToCompetitionView = dispatchNavigateToCompetitionViewMock,
  dispatchPushAction = dispatchPushActionMock,
}) {
  return render(
    <CompetitionRegionCard
      urn={urn}
      competitionRegions={competitionRegions}
      dispatchNavigateToCompetitionView={dispatchNavigateToCompetitionView}
      dispatchPushAction={dispatchPushAction}
    />,
  );
}

describe("CompetitionRegionCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render Card once (wrapper) when there are no competitionRegions", () => {
    renderCompetitionRegionCard({ competitionRegions: null, urn: "urn1" });
    expect(Card).toHaveBeenCalledTimes(1);
  });

  describe("when there are competitionRegions", () => {
    it("should render Card and Quicklink with correct params", () => {
      renderCompetitionRegionCard({
        competitionRegions: competitionRegionsMock,
        urn: "urn1",
      });

      const { container: containerOne } = render(Card.mock.calls[1][0].startElement);
      const { container: containerTwo } = render(Card.mock.calls[2][0].startElement);

      expect(Image).toHaveBeenCalledWith({ src: "someflag.svg", alt: "" }, undefined);
      expect(Image).toHaveBeenCalledTimes(1);

      expect(containerOne.querySelector(COMPETITION_REGION_CARD_HEADER_CONTAINER)).toHaveClass(
        styles.collapseHeaderContainer,
      );

      expect(Card.mock.calls[1][0].title).toBe("Region 1");

      expect(containerTwo.querySelector(COMPETITION_REGION_CARD_HEADER_CONTAINER)).toBeNull();
      expect(Card.mock.calls[2][0].title).toBe("Region 2");

      expect(Card).toHaveBeenCalledTimes(3);
      expect(Card).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          theme: CardTheme.PRIMARY,
          size: CardHeaderSize.LARGE,
          isCollapsible: true,
          startOpen: false,
        }),
        undefined,
      );
      expect(Card).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          theme: CardTheme.PRIMARY,
          size: CardHeaderSize.LARGE,
          isCollapsible: true,
          startOpen: false,
        }),
        undefined,
      );

      expect(QuickLink).toHaveBeenCalledTimes(3);

      expect(QuickLink).toHaveBeenNthCalledWith(
        1,
        {
          item: { viewLink: viewLinkMock, text: "Competition 1" },
          isIndented: true,
          isLightBackground: true,
          onLinkClick: expect.any(Function),
        },
        undefined,
      );

      expect(QuickLink).toHaveBeenNthCalledWith(
        2,
        {
          item: { viewLink: viewLinkMock, text: "Competition 2" },
          isIndented: true,
          isLightBackground: true,
          onLinkClick: expect.any(Function),
        },
        undefined,
      );

      expect(QuickLink).toHaveBeenNthCalledWith(
        3,
        {
          item: { viewLink: viewLinkMock, text: "Competition 1" },
          isIndented: true,
          isLightBackground: true,
          onLinkClick: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when a competition link is clicked", () => {
    it("should call dispatchPushAction", () => {
      renderCompetitionRegionCard({
        competitionRegions: competitionRegionsMock,
        urn: "urn1",
      });

      const { onLinkClick } = QuickLink.mock.calls[0][0];
      const eventMock = { preventDefault: jest.fn() };

      onLinkClick(eventMock);

      expect(eventMock.preventDefault).toHaveBeenCalled();
      expect(dispatchNavigateToCompetitionViewMock).toHaveBeenCalledWith("urn1", "VIEWLINKURL", "Competition 1");
      expect(dispatchPushActionMock).toHaveBeenCalledWith(viewLinkMock);
    });
  });
});
