import { render } from "@testing-library/react";

import { BetSelectionDetails, Divider, useOnIntersect, TrapWrapper } from "@ppb/the-wall-web";
import { StatusLabelType } from "@ppb/the-wall-common/types";
import { Result } from "@ppb/tbd-store/state/constants";
import { ValueIconName } from "@ppb/the-wall-icons";

import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";
import ConnectedEnhancedTracking from "../EnhancedTracking";
import ConnectedObbEnhancedTracking from "../ObbEnhancedTracking";
import EnhancedTracking from "../EnhancedTracking/EnhancedTracking.web";
import ObbEnhancedTracking from "../ObbEnhancedTracking/ObbEnhancedTracking.web";
import { resolveTrapIconVM } from "../../helpers/greyhound-trap-icon-helper";

import SportsbookBetLegCard from "./SportsbookBetLegCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  BetSelectionDetails: jest.fn((props) => (
    <bet-selection-details-mock {...props}>{props?.sportIcon}</bet-selection-details-mock>
  )),
  Divider: jest.fn(() => <divider-mock />),
  useOnIntersect: jest.fn(() => ({ isIntersecting: true })),
  TrapWrapper: jest.fn(() => <trap-wrapper-mock />),
}));

jest.mock("@ppb/the-wall-icons/SportIcon/SportIcon", () => ({
  SportIcon: jest.fn(() => <sport-icon-mock />),
}));

jest.mock("../EnhancedTracking", () => jest.fn(() => <connected-enhanced-tracking-mock />));

jest.mock("../ObbEnhancedTracking", () => jest.fn(() => <connected-obb-enhanced-tracking-mock />));

jest.mock("../EnhancedTracking/EnhancedTracking.web", () => jest.fn(() => <enhanced-tracking-mock />));

jest.mock("../ObbEnhancedTracking/ObbEnhancedTracking.web", () => jest.fn(() => <obb-enhanced-tracking-mock />));

jest.mock("../../helpers/greyhound-trap-icon-helper", () => ({
  resolveTrapIconVM: jest.fn(() => ({
    size: "small",
    region: "UK",
    trap: 3,
  })),
}));

const props = {
  legParts: [
    {
      previousTitle: "previousTitle",
      title: "title",
      subtitle: "subtitle",
      odd: "odd",
      previousOdd: "previousOdd",
      tertiaryTitle: "tertiaryTitle",
      statusLabel: {
        statusLabel: "label",
        statusLabelType: StatusLabelType.WON,
      },
      racingLabel: "racingLabel",
      is90Min: true,
      isSuperSub: false,
      sportId: "1",
      showSportsIcon: true,
      navigationViewLink: {
        viewUrl: "navigationViewLinkUrl",
        viewUrn: "navigationViewLinkUrn",
      },
      eventUrn: "eventUrn",
      outcomeDefinitionExp: "outcomeDefinitionExp",
      result: Result.PLACED,
      selectionTypeIcon: undefined,
    },
  ],
  dispatchNavigateToViewLinkAction: jest.fn(),
  dispatchPushAction: jest.fn(),
  dispatchSubscribeFixtureUpdates: jest.fn(),
  dispatchUnsubscribeFixtureUpdates: jest.fn(),
};

const renderSportsbookBetLegCard = (compProps = {}) => render(<SportsbookBetLegCard {...props} {...compProps} />);

describe("SportsbookBetLegCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("When the Leg Part has expressionComponents", () => {
    describe("And the bet is not voided", () => {
      it("should render the obb enhanced tracking component", () => {
        const expressionComponents = {
          leftOperand: [
            {
              outcomeId: "SHOTS_ON_TARGET",
              timePeriodId: "MATCH",
              participantId: "playerId_no_stats_mock",
            },
          ],
          operator: ">",
          rightOperand: [
            {
              decimal: 5,
            },
          ],
        };
        const legPartsWithExpressionComponents = { ...props.legParts[0], expressionComponents };
        const { outcomeDefinitionExp, ...legPartsWithoutOutcomeDefinitionExp } = legPartsWithExpressionComponents;
        renderSportsbookBetLegCard({ legParts: [legPartsWithoutOutcomeDefinitionExp] });

        expect(ConnectedObbEnhancedTracking).toHaveBeenCalledTimes(1);
        expect(ConnectedObbEnhancedTracking).toHaveBeenCalledWith(
          {
            component: ObbEnhancedTracking,
            eventUrn: props.legParts[0].eventUrn,
            expressionComponents,
            result: props.legParts[0].result,
          },
          undefined,
        );
      });
    });

    describe("And the bet is voided", () => {
      it("should not render the obb enhanced tracking component", () => {
        const expressionComponents = {
          leftOperand: [
            {
              outcomeId: "SHOTS_ON_TARGET",
              timePeriodId: "MATCH",
              participantId: "playerId_no_stats_mock",
            },
          ],
          operator: ">",
          rightOperand: [
            {
              decimal: 5,
            },
          ],
        };
        const legPartsWithExpressionComponentsAndVoided = {
          ...props.legParts[0],
          expressionComponents,
          result: Result.VOID,
        };
        const { outcomeDefinitionExp, ...legPartsWithoutOutcomeDefinitionExp } =
          legPartsWithExpressionComponentsAndVoided;
        renderSportsbookBetLegCard({ legParts: [legPartsWithoutOutcomeDefinitionExp] });

        expect(ConnectedObbEnhancedTracking).not.toHaveBeenCalled();
      });
    });
  });

  describe("When the Leg Part has not expressionComponents", () => {
    it("should render the component", () => {
      renderSportsbookBetLegCard();

      expect(BetSelectionDetails).toHaveBeenCalledTimes(1);
      expect(BetSelectionDetails).toHaveBeenCalledWith(
        {
          previousTitle: props.legParts[0].previousTitle,
          title: props.legParts[0].title,
          subtitle: props.legParts[0].subtitle,
          tertiaryTitle: props.legParts[0].tertiaryTitle,
          odd: props.legParts[0].odd,
          previousOdd: props.legParts[0].previousOdd,
          statusLabel: props.legParts[0].statusLabel,
          racingLabel: props.legParts[0].racingLabel,
          navigationViewLink: props.legParts[0].navigationViewLink,
          onNavigationPress: expect.any(Function),
          is90Min: props.legParts[0].is90Min,
          selectionTypeIcon: undefined,
          sportIcon: expect.any(Object),
        },
        undefined,
      );

      expect(ConnectedEnhancedTracking).toHaveBeenCalledTimes(1);
      expect(ConnectedEnhancedTracking).toHaveBeenCalledWith(
        {
          component: EnhancedTracking,
          eventUrn: props.legParts[0].eventUrn,
          includeSubstitutions: props.legParts[0].isSuperSub,
          outcomeDefinitionExp: props.legParts[0].outcomeDefinitionExp,
          result: props.legParts[0].result,
        },
        undefined,
      );
    });
  });

  describe("when isSuperSub is false", () => {
    it("should not call dispatchSubscribeFixtureUpdates on mount", () => {
      renderSportsbookBetLegCard({ legParts: [{ ...props.legParts[0], isSuperSub: false }] });

      expect(props.dispatchSubscribeFixtureUpdates).not.toHaveBeenCalled();
    });

    it("should not call dispatchUnsubscribeFixtureUpdates on unmount", () => {
      const { unmount } = renderSportsbookBetLegCard({ legParts: [{ ...props.legParts[0], isSuperSub: false }] });

      unmount();

      expect(props.dispatchUnsubscribeFixtureUpdates).not.toHaveBeenCalled();
    });
  });

  describe("when isSuperSub, fixtureURN, fixtureTypename and participantId are defined", () => {
    const fixtureUpdatesProps = {
      fixtureURN: "fixtureUrn",
      fixtureTypename: "fixtureTypename",
      participantId: "participantId",
      isSuperSub: true,
    };

    it("should call dispatchSubscribeFixtureUpdates on mount", () => {
      renderSportsbookBetLegCard({
        legParts: [{ ...props.legParts[0], ...fixtureUpdatesProps }],
      });

      expect(props.dispatchSubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
      expect(props.dispatchSubscribeFixtureUpdates).toHaveBeenCalledWith(
        fixtureUpdatesProps.fixtureURN,
        fixtureUpdatesProps.fixtureTypename,
        fixtureUpdatesProps.participantId,
        fixtureUpdatesProps.isSuperSub,
      );
    });

    it("should call dispatchUnsubscribeFixtureUpdates on unmount", () => {
      const { unmount } = renderSportsbookBetLegCard({
        legParts: [{ ...props.legParts[0], ...fixtureUpdatesProps }],
      });

      unmount();

      expect(props.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
      expect(props.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledWith(
        fixtureUpdatesProps.fixtureURN,
        fixtureUpdatesProps.fixtureTypename,
      );
    });

    describe("when is not intersecting", () => {
      it("should call dispatchUnsubscribeFixtureUpdates", () => {
        const { rerender } = renderSportsbookBetLegCard({
          legParts: [{ ...props.legParts[0], ...fixtureUpdatesProps }],
        });

        useOnIntersect.mockReturnValueOnce({ isIntersecting: false });

        rerender(<SportsbookBetLegCard {...props} {...fixtureUpdatesProps} />);

        expect(props.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledTimes(1);
        expect(props.dispatchUnsubscribeFixtureUpdates).toHaveBeenCalledWith(
          fixtureUpdatesProps.fixtureURN,
          fixtureUpdatesProps.fixtureTypename,
        );
      });
    });
  });

  describe("when onNavigationPress is triggered", () => {
    it("should dispatch ClickEventAction and PushAction properly", () => {
      renderSportsbookBetLegCard();

      const { onNavigationPress } = BetSelectionDetails.mock.calls[0][0];
      const eventMock = { preventDefault: jest.fn() };
      onNavigationPress(eventMock, props.legParts[0].navigationViewLink);

      expect(eventMock.preventDefault).toHaveBeenCalled();
      expect(props.dispatchNavigateToViewLinkAction).toHaveBeenCalledWith(
        props.legParts[0].navigationViewLink.viewUrl,
        "",
      );
      expect(props.dispatchPushAction).toHaveBeenCalledWith(props.legParts[0].navigationViewLink);
    });
  });

  describe("when showSportsIcon is false", () => {
    it("should render the component with no sportsIcon", () => {
      renderSportsbookBetLegCard({ legParts: [{ ...props.legParts[0], showSportsIcon: false }] });

      expect(BetSelectionDetails).toHaveBeenCalledTimes(1);
      expect(BetSelectionDetails).toHaveBeenCalledWith(
        {
          previousTitle: props.legParts[0].previousTitle,
          title: props.legParts[0].title,
          subtitle: props.legParts[0].subtitle,
          tertiaryTitle: props.legParts[0].tertiaryTitle,
          odd: props.legParts[0].odd,
          previousOdd: props.legParts[0].previousOdd,
          statusLabel: props.legParts[0].statusLabel,
          racingLabel: props.legParts[0].racingLabel,
          navigationViewLink: props.legParts[0].navigationViewLink,
          onNavigationPress: expect.any(Function),
          is90Min: props.legParts[0].is90Min,
          sportIcon: undefined,
        },
        undefined,
      );
    });
  });

  describe("when sport icon component is visible", () => {
    describe.each([Result.WON, Result.WINNING])("and when result is %s", (result) => {
      it("should render the sport icon component with token var(--bet-selection-details-sports-icon-won-colour)", () => {
        renderSportsbookBetLegCard({ legParts: [{ ...props.legParts[0], result }] });

        expect(SportIcon).toHaveBeenCalledWith(
          {
            sportId: "1",
            color: "var(--bet-selection-details-sports-icon-won-colour)",
          },
          undefined,
        );
      });
    });

    describe.each([Result.LOST, Result.LOSING])("and when result is %s", (result) => {
      it("should render the sport icon component with token var(--bet-selection-details-sports-icon-lost-colour)", () => {
        renderSportsbookBetLegCard({ legParts: [{ ...props.legParts[0], result }] });

        expect(SportIcon).toHaveBeenCalledWith(
          {
            sportId: "1",
            color: "var(--bet-selection-details-sports-icon-lost-colour)",
          },
          undefined,
        );
      });
    });

    it("should render the sport icon component with token var(--bet-selection-details-sports-icon-neutral-colour)", () => {
      renderSportsbookBetLegCard({ legParts: [{ ...props.legParts[0], result: undefined }] });

      expect(SportIcon).toHaveBeenCalledWith(
        {
          sportId: "1",
          color: "var(--bet-selection-details-sports-icon-neutral-colour)",
        },
        undefined,
      );
    });
  });

  describe("when selectionTypeIcon is defined", () => {
    it("should render the component with the icon", () => {
      renderSportsbookBetLegCard({
        legParts: [{ ...props.legParts[0], selectionTypeIcon: ValueIconName.SUPER_SUB_MONOCHROME }],
      });

      expect(BetSelectionDetails).toHaveBeenCalledTimes(1);
      expect(BetSelectionDetails).toHaveBeenCalledWith(
        {
          previousTitle: props.legParts[0].previousTitle,
          title: props.legParts[0].title,
          subtitle: props.legParts[0].subtitle,
          tertiaryTitle: props.legParts[0].tertiaryTitle,
          odd: props.legParts[0].odd,
          previousOdd: props.legParts[0].previousOdd,
          statusLabel: props.legParts[0].statusLabel,
          racingLabel: props.legParts[0].racingLabel,
          navigationViewLink: props.legParts[0].navigationViewLink,
          onNavigationPress: expect.any(Function),
          selectionTypeIcon: ValueIconName.SUPER_SUB_MONOCHROME,
          is90Min: props.legParts[0].is90Min,
          sportIcon: expect.any(Object),
        },
        undefined,
      );
    });
  });

  describe("when leg is from Greyhound Racing", () => {
    it("should render the trap icon component with correct view model", () => {
      renderSportsbookBetLegCard({
        legParts: [{ ...props.legParts[0], showSilk: true, sportId: 4339, meetingCountry: "UK", trap: 3 }],
      });

      expect(resolveTrapIconVM).toHaveBeenCalledWith("UK", 3);

      render(BetSelectionDetails.mock.calls[0][0].icon);
      expect(TrapWrapper).toHaveBeenCalledWith(
        {
          size: "small",
          region: "UK",
          trap: 3,
        },
        undefined,
      );
    });
  });

  describe("when there is more than one leg part", () => {
    it("should render the divider component", () => {
      renderSportsbookBetLegCard({
        legParts: [{ ...props.legParts[0] }, { ...props.legParts[0], title: "secondTitle" }],
      });
      expect(BetSelectionDetails).toHaveBeenCalledTimes(2);
      expect(Divider).toHaveBeenCalledTimes(1);
    });
  });
});
