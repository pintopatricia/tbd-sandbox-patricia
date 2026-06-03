import { render, fireEvent } from "@testing-library/react";
import { ActionLink, Divider } from "@ppb/the-wall-web";
import ObbCreatedBetsCard from "./ObbCreatedBetsCard.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import { MatchStatSelection } from "../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.web";

jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header data-testid="fixture-header-mock" />));
jest.mock("../FixtureHeader/FixtureHeader.web", () => jest.fn(() => <fixture-header />));
jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button data-testid="obb-bet-button-mock" />));
jest.mock("../ObbBetButton/ObbBetButton.web", () => jest.fn(() => <obb-bet-button />));
jest.mock("../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web", () => ({
  MatchStatSelection: jest.fn(({ props, children }) => (
    <match-stat-selection-card-mock {...props}>{children}</match-stat-selection-card-mock>
  )),
}));
jest.mock("@ppb/the-wall-web", () => ({
  Divider: jest.fn(() => <divider-mock />),
  ActionLink: jest.fn(({ onClick, ...props }) => (
    <action-link {...props} data-testid="action-link-mock" onClick={onClick} />
  )),
}));

const dispatchPushActionSpy = jest.fn();
const dispatchHandleBetClickSpy = jest.fn();
const dispatchInactiveObbBetButtonClickSpy = jest.fn();
const dispatchLinkClickSpy = jest.fn();

const mockProps = {
  urn: "urn:mock",
  fixtureUrn: "urn:fixture:mock",
  eventUrn: "urn:event:mock",
  eventName: "Mock Event",
  bettingOpportunities: [
    {
      legId: "legId-mock",
      legTemplateId: "legTemplateId-mock",
      title: "Player One & Player Two",
      subtitle: "Score 5+ Goals",
      statsLabel: "5.6 goals on average",
      incidentType: "GOALS",
      quote: {
        odds: "1.2",
      },
    },
  ],
  eventViewLink: {
    viewUrn: "urn:eventView:mock",
    viewUrl: "/event/mock",
  },
  footerViewLink: {
    viewUrn: "urn:footerView:mock",
    viewUrl: "/footer/mock",
  },
  footerLabel: "See all bets",
  isEventInPlay: false,
  fullWidth: false,
  dispatchPushAction: dispatchPushActionSpy,
  dispatchHandleBetClick: dispatchHandleBetClickSpy,
  dispatchLinkClick: dispatchLinkClickSpy,
  dispatchInactiveObbBetButtonClick: dispatchInactiveObbBetButtonClickSpy,
};

describe("ObbCreatedBetsCard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Fixture Header", () => {
    it("should render the Fixture Header correctly", () => {
      render(<ObbCreatedBetsCard {...mockProps} />);

      expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
        expect.objectContaining({
          component: FixtureHeader,
          fixture: "urn:fixture:mock",
          sporteventURN: "urn:event:mock",
          viewMode: "SMALL",
          showBottomSeparator: false,
          showEventDateBelow: true,
          showHorizontalDuration: false,
        }),
        undefined,
      );
    });

    it("should call dispatchPushAction when the fixture header is clicked", () => {
      const { getByTestId } = render(<ObbCreatedBetsCard {...mockProps} />);
      const fixtureHeader = getByTestId("fixture-header-mock");

      fireEvent.click(fixtureHeader.parentElement);

      expect(dispatchPushActionSpy).toHaveBeenCalledWith(mockProps.eventViewLink);
      expect(dispatchInactiveObbBetButtonClickSpy).not.toHaveBeenCalled();
    });

    it("should call dispatchInactiveObbBetButtonClick when the fixture header is clicked and event is in-play", () => {
      const inPlayProps = { ...mockProps, isEventInPlay: true };
      const { getByTestId } = render(<ObbCreatedBetsCard {...inPlayProps} />);
      const fixtureHeader = getByTestId("fixture-header-mock");

      fireEvent.click(fixtureHeader.parentElement);

      expect(dispatchInactiveObbBetButtonClickSpy).toHaveBeenCalled();
      expect(dispatchPushActionSpy).not.toHaveBeenCalled();
    });
  });

  describe("Betting Opportunities", () => {
    it("should render the betting opportunities correctly", () => {
      render(<ObbCreatedBetsCard {...mockProps} />);

      expect(MatchStatSelection).toHaveBeenCalledTimes(1);
      expect(MatchStatSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.arrayContaining([expect.objectContaining({ props: { children: "Player One & Player Two" } })]),
          subtitle: "Score 5+ Goals",
          stats: "5.6 goals on average",
          children: expect.anything(),
        }),
        undefined,
      );

      // Only the Divider before the footer action link
      expect(Divider).toHaveBeenCalledTimes(1);
    });

    it("should render ObbBetButton for each betting opportunity", () => {
      render(<ObbCreatedBetsCard {...mockProps} />);

      expect(ConnectedObbBetButton).toHaveBeenCalledTimes(1);
      expect(ConnectedObbBetButton).toHaveBeenCalledWith(
        expect.objectContaining({
          cardUrn: "urn:mock",
          eventName: "Mock Event",
          legId: "legId-mock",
          showSecondaryLabel: false,
          onClick: undefined,
          status: undefined,
          component: ObbBetButton,
        }),
        undefined,
      );
    });

    it("should pass onClick handler and closed status to ObbBetButton when event is in-play", () => {
      const inPlayProps = { ...mockProps, isEventInPlay: true };
      render(<ObbCreatedBetsCard {...inPlayProps} />);

      expect(ConnectedObbBetButton).toHaveBeenCalledWith(
        expect.objectContaining({
          onClick: expect.any(Function),
          status: "closed",
        }),
        undefined,
      );
    });

    it("should use legId as the key for betting opportunities", () => {
      render(<ObbCreatedBetsCard {...mockProps} />);

      // Verify React Fragment keys are properly set
      expect(MatchStatSelection).toHaveBeenCalledTimes(1);
    });

    describe("when there are multiple betting opportunities", () => {
      it("should render dividers between them", () => {
        const propsWithMultipleOpportunities = {
          ...mockProps,
          bettingOpportunities: [
            mockProps.bettingOpportunities[0],
            {
              legId: "legId-mock-2",
              playerNames: "Player Three & Player Four",
              outcomeDescription: "To make 3+ shots on target",
              statsLabel: "3.4 shots on target on average",
              incidentType: "SHOTS_ON_TARGET",
              quote: {
                odds: "2.5",
              },
            },
          ],
        };

        render(<ObbCreatedBetsCard {...propsWithMultipleOpportunities} />);

        expect(MatchStatSelection).toHaveBeenCalledTimes(2);
        expect(ConnectedObbBetButton).toHaveBeenCalledTimes(2);

        // One divider between opportunities and one before footer
        expect(Divider).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Footer Action Link", () => {
    it("should render the footer action link correctly", () => {
      render(<ObbCreatedBetsCard {...mockProps} />);

      expect(ActionLink).toHaveBeenCalledWith(
        {
          disabled: false,
          noPadding: true,
          text: "See all bets",
          typography: "Regular",
          onClick: expect.any(Function),
        },
        undefined,
      );
    });

    it("should call dispatchPushAction when the footer link is clicked", () => {
      const { getByTestId } = render(<ObbCreatedBetsCard {...mockProps} />);
      const actionLink = getByTestId("action-link-mock");

      fireEvent.click(actionLink);

      expect(dispatchPushActionSpy).toHaveBeenCalledWith(mockProps.footerViewLink);
      expect(dispatchInactiveObbBetButtonClickSpy).not.toHaveBeenCalled();
    });

    it("should disable the footer link when event is in-play", () => {
      const inPlayProps = { ...mockProps, isEventInPlay: true };
      render(<ObbCreatedBetsCard {...inPlayProps} />);

      expect(ActionLink).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        }),
        undefined,
      );
    });

    it("should call dispatchInactiveObbBetButtonClick when the footer link is clicked and event is in-play", () => {
      const inPlayProps = { ...mockProps, isEventInPlay: true };
      const { getByTestId } = render(<ObbCreatedBetsCard {...inPlayProps} />);
      const actionLink = getByTestId("action-link-mock");

      fireEvent.click(actionLink);

      expect(dispatchInactiveObbBetButtonClickSpy).toHaveBeenCalled();
      expect(dispatchPushActionSpy).not.toHaveBeenCalled();
    });
  });

  describe("Layout", () => {
    it("should apply fullWidth class when fullWidth prop is true", () => {
      const { container } = render(<ObbCreatedBetsCard {...mockProps} fullWidth={true} />);

      const card = container.querySelector('[class*="card"]');
      expect(card).toBeTruthy();
      expect(card.className).toMatch(/fullWidthCard/);
    });

    it("should not apply fullWidth class when fullWidth prop is false", () => {
      const { container } = render(<ObbCreatedBetsCard {...mockProps} fullWidth={false} />);

      const card = container.querySelector('[class*="card"]');
      expect(card).toBeTruthy();
      expect(card.className).not.toMatch(/fullWidthCard/);
    });
  });
});
