import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { Card, Divider, ScrollableSwimlane, ShowMore } from "@ppb/the-wall-native";

import { ConfigContext } from "../Config/ConfigContext";

import ObbEventPopularsCard from "./ObbEventPopularsCard.native";
import { TimesBacked } from "../TimesBacked/TimesBacked.native";
import { MatchStatSelection } from "../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.native";
import ConnectedObbBetButton from "../ObbBetButton";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("../TimesBacked/TimesBacked.native", () => ({
  TimesBacked: jest.fn(() => <times-backed-mock />),
}));
jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button testID="obb-bet-button-mock" />));
jest.mock("../ObbBetButton/ObbBetButton.native", () => jest.fn(() => <obb-bet-button />));
jest.mock("../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.native", () => ({
  MatchStatSelection: jest.fn(({ props, children }) => (
    <match-stat-selection-card-mock testID="match-stat-selection-mock" {...props}>
      {children}
    </match-stat-selection-card-mock>
  )),
}));
jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => <scrollable-mock {...props}>{children}</scrollable-mock>),
  Divider: jest.fn(() => <divider-mock />),
  StatusLabel: jest.fn(() => <status-label-mock />),
  ShowMore: jest.fn((props) => <show-more-mock testID="show-more-button-mock" {...props} onPress={props.onClick} />),
  Card: jest.fn(({ children }) => <card-mock testID="card">{children}</card-mock>),
  Styled: jest.fn(() => <styled-mock />),
  Text: jest.requireActual("react-native").Text,
}));

const ConfigContextProviderMock = ({ isDesktopLayout, children }) => (
  <ConfigContext.Provider value={{ isDesktopLayout }}>{children}</ConfigContext.Provider>
);

const dispatchObbEventPopularsCardToggleShowMoreSpy = jest.fn();

const defaultProps = {
  title: "Mock Title",
  badgeText: "Mock Badge Text",
  showPopularEvidence: true,
  showStats: true,
  eventName: "Mock Event Name",
  showMoreLabel: "Mock Show More Label",
  initialNumberOfVisibleBettingOpportunities: 3,
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
      const { getByTestId } = result;
      const showMoreButton = getByTestId("show-more-button-mock");

      expect(ShowMore).toHaveBeenCalledTimes(1);
      expect(showMoreButton.props.text).toBe("I18N.SHOW_MORE");
    });

    describe("when clicking the Show More button", () => {
      beforeEach(() => {
        const { getByTestId } = result;

        fireEvent.press(getByTestId("show-more-button-mock"));
      });

      it("should show all the betting opportunities", async () => {
        const { findAllByTestId } = result;
        const obbBetButtons = await findAllByTestId("obb-bet-button-mock");
        expect(obbBetButtons).toHaveLength(3);
      });

      it("should set the opened attribute to true in Show More button", async () => {
        const { getByTestId } = result;
        const showMoreButton = getByTestId("show-more-button-mock");
        expect(showMoreButton.props.opened).toBe(true);
        expect(showMoreButton.props.text).toBe("I18N.SHOW_LESS");
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
          fireEvent.press(getByTestId("show-more-button-mock"));
        });

        it("should hide the additional betting opportunities", async () => {
          const { findAllByTestId } = result;
          const obbBetButtons = await findAllByTestId("obb-bet-button-mock");
          expect(obbBetButtons).toHaveLength(2);
        });

        it("should show the Show More button again", async () => {
          const { getByTestId } = result;
          const showMoreButton = getByTestId("show-more-button-mock");
          expect(showMoreButton.props.opened).toBe(false);
          expect(showMoreButton.props.text).toBe("I18N.SHOW_MORE");
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
