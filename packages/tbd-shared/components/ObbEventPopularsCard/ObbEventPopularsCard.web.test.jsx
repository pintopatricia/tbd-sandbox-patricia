import React, { act } from "react";
import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { Card, Divider, ScrollableSwimlane, ShowMore } from "@ppb/the-wall-web";

import { ConfigContext } from "../Config/ConfigContext";

import ObbEventPopularsCard from "./ObbEventPopularsCard.web";
import { TimesBacked } from "../TimesBacked/TimesBacked.web";
import { MatchStatSelection } from "../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web";
import ConnectedObbBetButton from "../ObbBetButton";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("../TimesBacked/TimesBacked.web", () => ({
  TimesBacked: jest.fn(() => <times-backed-mock />),
}));
jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button data-testid="obb-bet-button-mock" />));
jest.mock("../ObbBetButton/ObbBetButton.web", () => jest.fn(() => <obb-bet-button />));
jest.mock("../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web", () => ({
  MatchStatSelection: jest.fn(({ props, children }) => (
    <match-stat-selection-card-mock data-testid="match-stat-selection-mock" {...props}>
      {children}
    </match-stat-selection-card-mock>
  )),
}));
jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => <scrollable-mock {...props}>{children}</scrollable-mock>),
  Divider: jest.fn(() => <divider-mock />),
  StatusLabel: jest.fn(() => <status-label-mock />),
  ShowMore: jest.fn(({ text, ...props }) => (
    <show-more-mock data-testid="show-more-button-mock" {...props}>
      {text}
    </show-more-mock>
  )),
  Card: jest.fn(({ children }) => <card-mock data-testid="card">{children}</card-mock>),
  Styled: jest.fn(() => <styled-mock />),
}));

const ConfigContextProviderMock = ({ isDesktopLayout, children }) => (
  <ConfigContext.Provider value={{ isDesktopLayout }}>{children}</ConfigContext.Provider>
);

const dispatchObbEventPopularsCardToggleShowMoreSpy = jest.fn();

const defaultProps = {
  urn: "mock-urn",
  title: "Mock Title",
  badgeText: "Mock Badge Text",
  showPopularEvidence: true,
  showStats: true,
  eventName: "Mock Event Name",
  showMoreLabel: "Mock Show More Label",
  initialNumberOfVisibleBettingOpportunities: 3,
  hasEventStarted: false,
  popularBettingOpportunities: [
    {
      title: `Leg 1 title`,
      subtitle: `Leg 1 subtitle`,
      stats: `Leg 1 stats`,
      legId: "mockLegId1",
      timesBackedLabel: "Mock Times Backed Label",
    },
    {
      title: `Leg 2 title`,
      subtitle: `Leg 2 subtitle`,
      stats: `Leg 2 stats`,
      legId: "mockLegId2",
      timesBackedLabel: "Mock Times Backed Label",
    },
    {
      title: `Leg 3 title`,
      subtitle: `Leg 3 subtitle`,
      stats: `Leg 3 stats`,
      legId: "mockLegId3",
      timesBackedLabel: "Mock Times Backed Label",
    },
  ],
  dispatchObbEventPopularsCardToggleShowMore: dispatchObbEventPopularsCardToggleShowMoreSpy,
};

function renderObbEventPopularsCard({ isDesktop = true, ...props } = {}) {
  const componentProps = { ...defaultProps, ...props };
  return render(
    <ConfigContextProviderMock isDesktopLayout={isDesktop}>
      <ObbEventPopularsCard {...componentProps} />
    </ConfigContextProviderMock>,
  );
}

describe("ObbEventPopularsCard", () => {
  let result;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the props are passed", () => {
    beforeEach(() => {
      result = renderObbEventPopularsCard();
    });

    it("should render the component", () => {
      expect(ScrollableSwimlane).toHaveBeenCalledTimes(1);
      expect(Card).toHaveBeenCalledTimes(1);

      expect(TimesBacked).toHaveBeenCalledTimes(3);
      expect(MatchStatSelection).toHaveBeenCalledTimes(3);
      expect(ConnectedObbBetButton).toHaveBeenCalledTimes(3);
      expect(Divider).toHaveBeenCalledTimes(2);
      expect(ShowMore).not.toHaveBeenCalled();
    });
  });

  describe("when initialNumberOfVisibleBettingOpportunities is less than the number of betting opportunities", () => {
    beforeEach(() => {
      result = renderObbEventPopularsCard({
        initialNumberOfVisibleBettingOpportunities: 2,
      });
    });

    it("should render only the initial number of visible betting opportunities", () => {
      expect(TimesBacked).toHaveBeenCalledTimes(2);
      expect(MatchStatSelection).toHaveBeenCalledTimes(2);
      expect(ConnectedObbBetButton).toHaveBeenCalledTimes(2);
      expect(Divider).toHaveBeenCalledTimes(1);
    });

    it("should render the Show More button", () => {
      const { getByText } = result;
      expect(ShowMore).toHaveBeenCalledTimes(1);
      expect(getByText("I18N.SHOW_MORE")).toBeInTheDocument();
    });

    describe("when clicking the Show More button", () => {
      beforeEach(() => {
        const { getByTestId } = result;
        const showMoreButton = getByTestId("show-more-button-mock");
        act(() => {
          showMoreButton.click();
        });
      });

      it("should show all the betting opportunities", async () => {
        const { findAllByTestId } = result;
        const obbBetButtons = await findAllByTestId("obb-bet-button-mock");
        expect(obbBetButtons).toHaveLength(3);
      });

      it("should show the Show Less button", async () => {
        const { getByText } = result;
        expect(getByText("I18N.SHOW_LESS")).toBeInTheDocument();
      });

      it("should dispatch show more action with showMore = true", () => {
        expect(dispatchObbEventPopularsCardToggleShowMoreSpy).toHaveBeenNthCalledWith(
          1,
          defaultProps.urn,
          defaultProps.eventName,
          true,
        );
      });

      describe("when clicking the Show Less button", () => {
        beforeEach(() => {
          const { getByTestId } = result;
          const showMoreButton = getByTestId("show-more-button-mock");
          act(() => {
            showMoreButton.click();
          });
        });

        it("should hide the additional betting opportunities", async () => {
          const { findAllByTestId } = result;
          const obbBetButtons = await findAllByTestId("obb-bet-button-mock");
          expect(obbBetButtons).toHaveLength(2);
        });

        it("should show the Show More button again", async () => {
          const { getByText } = result;
          expect(getByText("I18N.SHOW_MORE")).toBeInTheDocument();
        });

        it("should dispatch show more action with showMore = false", () => {
          expect(dispatchObbEventPopularsCardToggleShowMoreSpy).toHaveBeenNthCalledWith(
            2,
            defaultProps.urn,
            defaultProps.eventName,
            false,
          );
        });
      });
    });
  });

  describe("when initialNumberOfVisibleBettingOpportunities is higher than the number of betting opportunities", () => {
    beforeEach(() => {
      result = renderObbEventPopularsCard({
        initialNumberOfVisibleBettingOpportunities: 20,
      });
    });

    it("should render all the betting opportunities", () => {
      expect(TimesBacked).toHaveBeenCalledTimes(3);
      expect(MatchStatSelection).toHaveBeenCalledTimes(3);
      expect(ConnectedObbBetButton).toHaveBeenCalledTimes(3);
      expect(Divider).toHaveBeenCalledTimes(2);
    });

    it("should not render the Show More button", () => {
      expect(ShowMore).not.toHaveBeenCalled();
    });
  });

  describe("when event has started", () => {
    const dispatchDeleteObbEventPopularsCardMock = jest.fn();

    beforeEach(() => {
      result = renderObbEventPopularsCard({
        hasEventStarted: true,
        dispatchDeleteObbEventPopularsCard: dispatchDeleteObbEventPopularsCardMock,
      });
    });

    it("should dispatch DeleteObbEventPopularsCard action", () => {
      expect(dispatchDeleteObbEventPopularsCardMock).toHaveBeenCalledTimes(1);
    });
  });
});
