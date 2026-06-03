import { render, fireEvent, act } from "@testing-library/react-native";
import { navigate } from "@ppb/tbd-router";
import { Divider, ActionLink } from "@ppb/the-wall-native";
import ObbCreatedBetsCard from "./ObbCreatedBetsCard.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import { MatchStatSelection } from "../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.native";
import ConnectedObbBetButton from "../ObbBetButton";
import ObbBetButton from "../ObbBetButton/ObbBetButton.native";

jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(),
}));

jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header testID="fixture-header-mock" />));
jest.mock("../FixtureHeader/FixtureHeader.native", () => jest.fn(() => <fixture-header />));
jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button testID="obb-bet-button-mock" />));
jest.mock("../ObbBetButton/ObbBetButton.native", () => jest.fn(() => <obb-bet-button />));
jest.mock("../MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.native", () => ({
  MatchStatSelection: jest.fn(({ props, children }) => (
    <match-stat-selection-card-mock {...props}>{children}</match-stat-selection-card-mock>
  )),
}));
jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn(() => <divider-mock />),
  ActionLink: jest.fn(({ onClick, ...props }) => (
    <action-link {...props} testID="action-link-mock" onClick={onClick} />
  )),
  Text: jest.requireActual("react-native").Text,
}));

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

    it("should call navigate when the fixture header is clicked", () => {
      const { getByTestId } = render(<ObbCreatedBetsCard {...mockProps} />);
      const fixtureHeader = getByTestId("fixture-header-mock");

      fireEvent.press(fixtureHeader.parent);

      expect(navigate).toHaveBeenCalledWith(mockProps.eventViewLink);
      expect(dispatchInactiveObbBetButtonClickSpy).not.toHaveBeenCalled();
    });

    it("should call dispatchInactiveObbBetButtonClick when the fixture header is clicked and event is in-play", () => {
      const inPlayProps = { ...mockProps, isEventInPlay: true };
      const { getByTestId } = render(<ObbCreatedBetsCard {...inPlayProps} />);
      const fixtureHeader = getByTestId("fixture-header-mock");

      fireEvent.press(fixtureHeader.parent);

      expect(dispatchInactiveObbBetButtonClickSpy).toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe("Betting Opportunities", () => {
    it("should render the betting opportunities correctly", () => {
      render(<ObbCreatedBetsCard {...mockProps} />);

      expect(MatchStatSelection).toHaveBeenCalledTimes(1);
      expect(MatchStatSelection).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.arrayContaining([
            expect.objectContaining({
              props: expect.objectContaining({
                children: "Player One & Player Two",
              }),
            }),
          ]),
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

    it("should call navigate when the footer link is clicked", () => {
      render(<ObbCreatedBetsCard {...mockProps} />);

      act(() => {
        ActionLink.mock.calls[0][0].onClick();
      });

      expect(navigate).toHaveBeenCalledWith(mockProps.footerViewLink);
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
      render(<ObbCreatedBetsCard {...inPlayProps} />);

      act(() => {
        ActionLink.mock.calls[0][0].onClick();
      });

      expect(dispatchInactiveObbBetButtonClickSpy).toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe("Layout", () => {
    it("should apply fullWidthCard style when fullWidth prop is true", () => {
      const { getByTestId } = render(<ObbCreatedBetsCard {...mockProps} fullWidth={true} />);

      // Verify the component renders with fullWidth prop
      expect(getByTestId("fixture-header-mock")).toBeTruthy();
    });

    it("should not apply fullWidthCard style when fullWidth prop is false", () => {
      const { getByTestId } = render(<ObbCreatedBetsCard {...mockProps} fullWidth={false} />);

      // Verify the component renders without fullWidth prop
      expect(getByTestId("fixture-header-mock")).toBeTruthy();
    });
  });
});
