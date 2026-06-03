import { render } from "@testing-library/react-native";
import { FlatList } from "react-native";
import { Card, TBDImage, QuickLink, Divider } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import CompetitionRegionCard from "./CompetitionRegionCard.native";
import { COMPETITION_REGION_CARD_CONTAINER } from "./CompetitionRegionCard.native.selectors";
import styles from "./CompetitionRegionCard.native.styles";

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ children, ...rest }) => <card-mock {...rest}>{children}</card-mock>),
  QuickLink: jest.fn(() => <quicklink-mock />),
  TBDImage: jest.fn(() => <quicklink-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  CollapseIcons: {
    CHEVRON: "chevron-mock",
  },
  CollapseTheme: {
    Default: "default",
  },
  CollapseMode: {
    PRIMARY: "primary",
  },
  CollapseHorizontalPadding: {
    SMALL: "spacing-fake",
  },
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const dispatchNavigateToCompetitionViewMock = jest.fn();

const viewLinkMock = {
  viewUrn: "viewUrn",
  viewUrl: "viewUrl",
};

const CompetitionRegionCardProps = {
  urn: "mockUrn",
  competitionRegions: [
    {
      urn: "ppb:tbd:country:1",
      title: "region",
      flag: "someflag.svg",
      competitionViewLinks: [
        {
          title: "competition 1",
          viewLink: {
            ...viewLinkMock,
          },
        },
        {
          title: "competition 2",
          viewLink: {
            viewUrn: "viewUrn2",
            viewUrl: "viewUrl2",
          },
        },
      ],
    },
  ],
  dispatchNavigateToCompetitionView: dispatchNavigateToCompetitionViewMock,
};

const renderCompetitionRegionCard = (props) => render(<CompetitionRegionCard {...props} />);

describe("Competition Region Card", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there are no competitionRegions", () => {
    it("should not render the component", () => {
      const compRegionCard = renderCompetitionRegionCard({
        ...CompetitionRegionCardProps,
        competitionRegions: null,
      });

      const container = compRegionCard.queryByTestId(COMPETITION_REGION_CARD_CONTAINER);

      expect(container).toBeNull();
    });
  });

  describe("when there are competitionRegions", () => {
    it("should render the component with the correct styles", () => {
      const compRegionCard = renderCompetitionRegionCard({
        ...CompetitionRegionCardProps,
      });

      const container = compRegionCard.queryByTestId(COMPETITION_REGION_CARD_CONTAINER);

      expect(container).not.toBeNull();
      expect(container).toHaveStyle(styles.container);
    });

    it("should render the card wrapper with Divider between items", () => {
      renderCompetitionRegionCard({
        ...CompetitionRegionCardProps,
        competitionRegions: [
          ...CompetitionRegionCardProps.competitionRegions,
          {
            title: "region 2",
            competitionViewLinks: [
              {
                title: "competition 1",
                viewLink: {
                  ...viewLinkMock,
                },
              },
              {
                title: "competition 2",
                viewLink: {
                  viewUrn: "viewUrn2",
                  viewUrl: "viewUrl2",
                },
              },
            ],
          },
        ],
      });

      expect(Divider).toHaveBeenCalledTimes(3);
    });

    describe("and the competition to render is the last one", () => {
      it("shouldn't render the card wrapper with Divider afterwards", () => {
        renderCompetitionRegionCard({
          ...CompetitionRegionCardProps,
        });

        expect(Divider).toHaveBeenCalledTimes(1);
      });
    });

    it("should render one Card component", () => {
      renderCompetitionRegionCard({
        ...CompetitionRegionCardProps,
      });

      expect(Card).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          theme: CardTheme.PRIMARY,
          size: CardHeaderSize.LARGE,
          startOpen: false,
          isCollapsible: true,
        }),
        undefined,
      );
    });

    it("should render the correct collapse header", () => {
      renderCompetitionRegionCard({
        ...CompetitionRegionCardProps,
      });

      render(Card.mock.calls[1][0].startElement);

      expect(TBDImage).toHaveBeenCalledWith({ source: "someflag.svg" }, undefined);
      expect(TBDImage).toHaveBeenCalledTimes(1);

      expect(Card.mock.calls[1][0].title).toBe("region");
    });

    it("should render two Quicklinks", () => {
      renderCompetitionRegionCard({
        ...CompetitionRegionCardProps,
      });

      expect(QuickLink).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          isIndented: true,
          isLightBackground: true,
          item: {
            viewLink: {
              viewUrn: "viewUrn",
              viewUrl: "viewUrl",
            },
            text: "competition 1",
          },
        }),
        undefined,
      );

      expect(QuickLink).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          isIndented: true,
          isLightBackground: true,
          item: {
            viewLink: {
              viewUrn: "viewUrn2",
              viewUrl: "viewUrl2",
            },
            text: "competition 2",
          },
        }),
        undefined,
      );
    });

    it("key extractor should return urn", () => {
       
      const { UNSAFE_getByType } = renderCompetitionRegionCard({
        ...CompetitionRegionCardProps,
      });

      const flatList = UNSAFE_getByType(FlatList);
      const { keyExtractor } = flatList.props;

      expect(keyExtractor({ urn: "mock-urn" })).toBe("competition-region-card-mock-urn");
    });

    describe("when pressing on a quicklink", () => {
      it("should call the onPress callback", () => {
        renderCompetitionRegionCard({
          ...CompetitionRegionCardProps,
        });

        QuickLink.mock.calls[0][0].onPress();

        expect(dispatchNavigateToCompetitionViewMock).toHaveBeenCalledWith("mockUrn", "viewUrl", "competition 1");
        expect(mockNavigate).toHaveBeenCalledWith(viewLinkMock);
      });
    });
  });
});
