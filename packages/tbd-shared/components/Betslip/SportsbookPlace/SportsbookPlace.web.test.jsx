import { useContext } from "react";
import { act, render } from "@testing-library/react";
import { QuickStakes } from "@ppb/the-wall-web";
import { buildDepositRedirectPayload } from "../betslip-deposit-redirect-mapper";

import { BetslipSection } from "../Betslip.types";
import { useRefContext } from "../../../hooks/useRefContext";
import { getAuthData } from "../../../config/endpoints";

import { SportsbookPlace } from "./SportsbookPlace.web";
import { EmptyBetslip } from "../EmptyBetslip";
import { SportsbookPlacePanelOrchestrator } from "./snowflakes/SportsbookPlacePanel/SportsbookPlacePanelOrchestrator.web";
import { FooterCustomKeyboard } from "../Keyboard/FooterCustomKeyboard.web";
import { useCollapseStrategy, BetslipCollapseStrategy } from "./hooks/useCollapseStrategy";
import { useExperimentVariant } from "../../../experimentation/hooks/useExperimentVariant";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    setFocusedKeyboardControls: jest.fn(),
    focusedKeyboardControls: {
      focusedInputId: null,
      focusedInputRef: null,
      focusedTargetRef: null,
    },
    isDesktopLayout: false,
  })),
  useRef: jest.fn(() => ({ current: { scrollLeft: 250 } })),
}));

jest.mock("@ppb/the-wall-web", () => ({
  BetslipSportsbookPlacePanel: jest.fn(() => <sportsbook-place-panel-mock />),
  QuickStakes: jest.fn(() => <quick-stakes-mock />),
}));

jest.mock("../Keyboard/FooterCustomKeyboard.web", () => ({
  FooterCustomKeyboard: jest.fn(() => <footer-custom-keyboard-mock />),
}));

jest.mock("../betslip-deposit-redirect-mapper", () => ({
  buildDepositRedirectPayload: jest.fn(() => ({ viewUrn: "viewUrn", viewUrl: "viewUrl" })),
}));

jest.mock("../../../config/endpoints", () => ({
  getAuthData: jest.fn().mockReturnValue({ SSO_URL: "ssoUrlMock" }),
}));

jest.mock("../../../hooks/useRefContext", () => ({
  useRefContext: jest.fn(() => []),
}));

jest.mock("../../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(() => "control"),
}));

jest.mock("../EmptyBetslip", () => ({
  EmptyBetslip: jest.fn(() => <betslip-placeholder-mock />),
}));

jest.mock("./snowflakes/SportsbookPlacePanel/SportsbookPlacePanelOrchestrator.web", () => ({
  SportsbookPlacePanelOrchestrator: jest.fn(({ footerPrefix, children, ...props }) => (
    <sportsbook-place-panel-orchestrator-mock {...props}>
      {footerPrefix || children}
    </sportsbook-place-panel-orchestrator-mock>
  )),
}));

jest.mock(
  "@ppb/tbd-components-flexible-betting-opportunities/components/UpsellSuggestions/view/UpsellSuggestions.web",
  () => jest.fn((props) => <upsell-suggestions-mock {...props} />),
);

jest.mock("./hooks/useCollapseStrategy", () => ({
  ...jest.requireActual("./hooks/useCollapseStrategy"),
  useCollapseStrategy: jest.fn((arg) => arg),
}));

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting",
  },
});

const i18nLabelsMock = {
  priceBoostGroup: "price boosts tab mock",
  singlesGroup: "singles tab mock",
  multiplesGroup: "multiples tab mock",
  systemGroup: "system tab mock",
  totalReturns: "totalReturns mock",
  priceBoosts: "price boosts mock",
  multiples: "multiples mock",
  additionalMultiples: "additional multiples mock",
  multiBetBuilder: "multi bet builder mock",
  betBuilder: "bet builder mock",
  casts: "cast mock",
  singles: "singles mock",
  removeLabel: "removeLabel mock",
  selections: "selections mock",
  odds: "oddsLabel",
  stake: "stakeLabel",
  removeAllSelections: "removeAllSelections mock",
  removeAllQuestion: "removeAllQuestion mock",
  keepSelection: "keepSelection mock",
  clearBetslip: "clearBetslip mock",
  oddsMovementUp: "oddsMovementUp mock",
  oddsMovementDown: "oddsMovementDown mock",
};

const betslipCardsOrderMock = [
  {
    id: "upsellSuggestions",
    cardsOrder: [BetslipSection.upsellSuggestions],
  },
  {
    id: i18nLabelsMock.priceBoostGroup,
    cardsOrder: [BetslipSection.priceBoostMultis],
  },
  {
    id: i18nLabelsMock.multiplesGroup,
    cardsOrder: [BetslipSection.bbMulti, BetslipSection.betBuilders, BetslipSection.oneLineMultiple],
  },
  {
    id: i18nLabelsMock.systemGroup,
    cardsOrder: [BetslipSection.multiLinesMultiples, BetslipSection.castBets],
  },
  {
    id: i18nLabelsMock.singlesGroup,
    cardsOrder: [BetslipSection.singles],
  },
];

function renderSportsbookPlace({
  betslipCardsOrder = betslipCardsOrderMock,
  collapseStrategy = BetslipCollapseStrategy.FirstOpen,
  betBuilderIds = [],
  boostedCombinationIds = [],
  failedCombinationGroups = [],
  failedCombinationGroupIds = [],
  totalReturns = "1.14",
  totalOriginalReturns = "1.02",
  hasSingles = false,
  hasPlaceError = false,
  isPlaceDisabled = false,
  isSummaryDisabled = false,
  isFreeBetsSelected = false,
  isEligibleToBonus = true,
  isOddsBoosted = true,
  hasOneLineMultiple = false,
  hasMultipleLinesMultiples = false,
  hasMultiBetBuilder = false,
  hasCastBets = false,
  hasBetBuilders = false,
  hasPriceBoost = false,
  hasOnlyOneSingle = false,
  focusedCard,
  firstCombinationId,
  isLoggedIn = false,
  isBetConfirmationStepActive = false,
  isDepositRequired = false,
  requiredDepositValue = 0,
  placeBtnLabel = "place mock",
  placeBtnSecondaryLabel = "placeBtnSecondaryLabel",
  placeBtnLoadingLabel = "placeBtnLoadingLabel",
  reversePlaceBtnLabels = "reversePlaceBtnLabels",
  balanceAfterBet = "balanceAfterBet",
  shouldDisplayPlaceholder = false,
  quickStakes,
  separator,
  i18n = i18nLabelsMock,
  useCustomKeyboard = false,
  dispatchPlacement = jest.fn(),
  dispatchRemoveAll = jest.fn(),
  dispatchKeepSelections = jest.fn(),
  dispatchClearBetslip = jest.fn(),
  dispatchSportsbookBonusToggle = jest.fn(),
  dispatchLogin = jest.fn(),
  dispatchConfirmBet = jest.fn(),
  dispatchDepositRedirect = jest.fn(),
  dispatchNavigate = jest.fn(),
  dispatchAccordionToggle = jest.fn(),
  dispatchTabSwitch = jest.fn(),
  dispatchLoginToPlaceBetAction = jest.fn(),
  freeBetsAlertMessage = "free bets alert mock",
  dispatchFreeBetsRemoveAction = jest.fn(),
  dispatchIncrementPress = jest.fn(),
  marketSelections = [],
} = {}) {
  return render(
    <SportsbookPlace
      betslipCardsOrder={betslipCardsOrder}
      collapseStrategy={collapseStrategy}
      totalReturns={totalReturns}
      totalOriginalReturns={totalOriginalReturns}
      boostedCombinationIds={boostedCombinationIds}
      betBuilderIds={betBuilderIds}
      failedCombinationGroups={failedCombinationGroups}
      failedCombinationGroupIds={failedCombinationGroupIds}
      hasPlaceError={hasPlaceError}
      isPlaceDisabled={isPlaceDisabled}
      isSummaryDisabled={isSummaryDisabled}
      isFreeBetsSelected={isFreeBetsSelected}
      isEligibleToBonus={isEligibleToBonus}
      isOddsBoosted={isOddsBoosted}
      hasSingles={hasSingles}
      hasOneLineMultiple={hasOneLineMultiple}
      hasMultipleLinesMultiples={hasMultipleLinesMultiples}
      hasMultiBetBuilder={hasMultiBetBuilder}
      hasCastBets={hasCastBets}
      hasBetBuilders={hasBetBuilders}
      hasPriceBoost={hasPriceBoost}
      hasOnlyOneSingle={hasOnlyOneSingle}
      focusedCard={focusedCard}
      firstCombinationId={firstCombinationId}
      placeBtnLabel={placeBtnLabel}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      balanceAfterBet={balanceAfterBet}
      isLoggedIn={isLoggedIn}
      isBetConfirmationStepActive={isBetConfirmationStepActive}
      isDepositRequired={isDepositRequired}
      requiredDepositValue={requiredDepositValue}
      shouldDisplayPlaceholder={shouldDisplayPlaceholder}
      quickStakes={quickStakes}
      separator={separator}
      i18n={i18n}
      useCustomKeyboard={useCustomKeyboard}
      dispatchPlacement={dispatchPlacement}
      dispatchRemoveAll={dispatchRemoveAll}
      dispatchKeepSelections={dispatchKeepSelections}
      dispatchClearBetslip={dispatchClearBetslip}
      dispatchSportsbookBonusToggle={dispatchSportsbookBonusToggle}
      dispatchLogin={dispatchLogin}
      dispatchConfirmBet={dispatchConfirmBet}
      dispatchDepositRedirect={dispatchDepositRedirect}
      dispatchNavigate={dispatchNavigate}
      dispatchAccordionToggle={dispatchAccordionToggle}
      dispatchTabSwitch={dispatchTabSwitch}
      dispatchLoginToPlaceBetAction={dispatchLoginToPlaceBetAction}
      freeBetsAlertMessage={freeBetsAlertMessage}
      dispatchFreeBetsRemoveAction={dispatchFreeBetsRemoveAction}
      dispatchIncrementPress={dispatchIncrementPress}
      marketSelections={marketSelections}
    />,
  );
}

describe("SportsbookPlace", () => {
  afterEach(jest.clearAllMocks);

  describe("on mount", () => {
    it("should render the correct footerPrefix component", () => {
      renderSportsbookPlace({
        quickStakes: <QuickStakes />,
        separator: "£",
        isPanelDisabled: false,
        isDesktop: true,
      });

      expect(FooterCustomKeyboard).toHaveBeenCalledTimes(1);

      expect(FooterCustomKeyboard).toHaveBeenCalledWith(
        expect.objectContaining({
          prefix: expect.any(Object),
          separator: "£",
          isDisabled: false,
        }),
        undefined,
      );
    });
    describe("when focusedCard is not 'singles'", () => {
      it("should clear focusedInputId", () => {
        const setFocusedKeyboardControlsSpy = jest.fn();
        useContext.mockReturnValue({
          focusedKeyboardControls: {
            focusedInputId: null,
            focusedInputRef: null,
            focusedTargetRef: null,
          },
          setFocusedKeyboardControls: setFocusedKeyboardControlsSpy,
        });
        renderSportsbookPlace({ focusedCard: BetslipSection.bbMulti });

        expect(setFocusedKeyboardControlsSpy).toHaveBeenCalledWith(expect.any(Function));

        const updateFn = setFocusedKeyboardControlsSpy.mock.calls[0][0];
        expect(
          updateFn({
            focusedInputId: null,
            focusedInputRef: null,
            focusedTargetRef: null,
          }),
        ).toEqual({
          focusedInputId: null,
          focusedInputRef: null,
          focusedTargetRef: null,
        });

        expect(setFocusedKeyboardControlsSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when focusedCard is 'singles'", () => {
      describe("when focusedCombinationId is equal to firstCombinationId", () => {
        it("should not clear focusedInputId", () => {
          const setFocusedKeyboardControlsSpy = jest.fn();
          useContext.mockReturnValue({
            focusedKeyboardControls: {
              focusedInputId: "input-id",
              focusedCombinationId: "combination-id",
              focusedInputRef: null,
              focusedTargetRef: null,
            },
            setFocusedKeyboardControls: setFocusedKeyboardControlsSpy,
          });

          renderSportsbookPlace({ focusedCard: BetslipSection.singles, firstCombinationId: "combination-id" });

          expect(setFocusedKeyboardControlsSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe("experimentVariant", () => {
      it("should call useExperimentVariant with the correct experiment name", () => {
        renderSportsbookPlace();

        expect(useExperimentVariant).toHaveBeenCalledWith("betslip-bet-controls-order");
      });

      it("should pass betControlsExperimentVariant to priceBoostMultisCard when hasPriceBoost is true", () => {
        useExperimentVariant.mockReturnValue("variant-a");

        renderSportsbookPlace({ hasPriceBoost: true, boostedCombinationIds: ["id"] });

        const priceBoostCard = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[1].content[0];
        expect(priceBoostCard.card.props.betControlsExperimentVariant).toBe("variant-a");
      });

      it("should pass betControlsExperimentVariant to multiBetBuilderCard when hasMultiBetBuilder is true", () => {
        useExperimentVariant.mockReturnValue("variant-b");

        renderSportsbookPlace({ hasMultiBetBuilder: true });

        const bbMultiCard = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[0];
        expect(bbMultiCard.card.props.betControlsExperimentVariant).toBe("variant-b");
      });

      it("should pass betControlsExperimentVariant to betBuildersCard when hasBetBuilders is true", () => {
        useExperimentVariant.mockReturnValue("variant-c");

        renderSportsbookPlace({ hasBetBuilders: true, betBuilderIds: ["id"] });

        const betBuildersCard = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[1];
        expect(betBuildersCard.card.props.betControlsExperimentVariant).toBe("variant-c");
      });

      it("should pass betControlsExperimentVariant to oneLineMultiple when hasOneLineMultiple is true", () => {
        useExperimentVariant.mockReturnValue("variant-d");

        renderSportsbookPlace({ hasOneLineMultiple: true });

        const oneLineMultiple = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[2];
        expect(oneLineMultiple.card.props.betControlsExperimentVariant).toBe("variant-d");
      });
    });
  });

  it("should call useRefContext", () => {
    renderSportsbookPlace();

    expect(useRefContext).toHaveBeenCalledWith();
    expect(useRefContext).toHaveBeenCalledTimes(1);
  });

  describe("upsell suggestions card", () => {
    it("should create upsell suggestions card with empty title and not collapsable", () => {
      renderSportsbookPlace();

      const upsellSuggestions = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[0].content[0];

      expect(upsellSuggestions.card).toBeDefined();
      expect(upsellSuggestions.title).toBe("");
      expect(upsellSuggestions.startsOpen).toBe(false);
      expect(upsellSuggestions.collapsable).toBe(false);
    });

    it("should pass marketSelections to UpsellSuggestions", () => {
      const marketSelectionsMock = [
        { marketUrn: "urn:market:1", selectionUrn: "urn:selection:1" },
        { marketUrn: "urn:market:2", selectionUrn: "urn:selection:2" },
      ];

      renderSportsbookPlace({ marketSelections: marketSelectionsMock });

      const upsellSuggestions = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[0].content[0];

      expect(upsellSuggestions.card.props.marketSelections).toEqual(marketSelectionsMock);
    });

    it("should pass isDesktop to UpsellSuggestions", () => {
      useContext.mockReturnValue({
        focusedKeyboardControls: {
          focusedInputId: null,
          focusedInputRef: null,
          focusedTargetRef: null,
        },
        setFocusedKeyboardControls: jest.fn(),
        isDesktopLayout: true,
      });

      renderSportsbookPlace();

      const upsellSuggestions = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[0].content[0];

      expect(upsellSuggestions.card.props.isDesktop).toBe(true);
    });
  });

  describe("when there is no multi bet builder", () => {
    it("should not create multi bet builder card", () => {
      renderSportsbookPlace({ hasMultiBetBuilder: false });

      const bbMulti = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[0];

      expect(bbMulti).toEqual({
        card: undefined,
        title: i18nLabelsMock.multiBetBuilder,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there is a multi bet builder", () => {
    it("should create a multi bet builder card", () => {
      renderSportsbookPlace({
        hasMultiBetBuilder: true,
        useCustomKeyboard: true,
      });

      const bbMulti = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[0];

      expect(bbMulti).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.multiBetBuilder,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there are bet builders failed combination groups", () => {
    it("should create bet builders card with the failed combination groups", () => {
      renderSportsbookPlace({
        betBuilderIds: [],
        failedCombinationGroups: ["FAILED_COMBINATION_GROUP_1", "FAILED_COMBINATION_GROUP_2"],
        hasBetBuilders: true,
      });

      const betBuilders = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[1];

      expect(betBuilders.card.props).toEqual(
        expect.objectContaining({
          failedCombinationGroups: ["FAILED_COMBINATION_GROUP_1", "FAILED_COMBINATION_GROUP_2"],
        }),
      );
    });
  });

  describe("when there are combination bet builders", () => {
    it("should create bet builders card", () => {
      renderSportsbookPlace({
        betBuilderIds: ["BET_ID"],
        hasBetBuilders: true,
      });

      const betBuilders = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[1];

      expect(betBuilders).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.betBuilder,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there are price boosts", () => {
    it("should create price boost section", () => {
      renderSportsbookPlace({
        hasPriceBoost: true,
      });

      const priceBoostSection = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[1].content[0];

      expect(priceBoostSection).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.priceBoosts,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there is no one line multiples", () => {
    it("should not create one line multiple card", () => {
      renderSportsbookPlace({ hasOneLineMultiple: false });

      const oneLineMultiple = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[2];

      expect(oneLineMultiple).toEqual({
        card: undefined,
        title: i18nLabelsMock.multiples,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there is one line multiples", () => {
    it("should create one line multiples card", () => {
      renderSportsbookPlace({ hasOneLineMultiple: true });

      const oneLineMultiple = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[2];

      expect(oneLineMultiple).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.multiples,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there are no multi lines multiples", () => {
    it("should not create multi lines multiples card", () => {
      renderSportsbookPlace({ hasMultipleLinesMultiples: false });

      const multiLinesMultiples = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[3].content[0];

      expect(multiLinesMultiples).toEqual({
        card: undefined,
        title: i18nLabelsMock.additionalMultiples,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there are multi lines multiples", () => {
    it("should create multi lines multiples card", () => {
      renderSportsbookPlace({ hasMultipleLinesMultiples: true });

      const multiLinesMultiples = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[3].content[0];

      expect(multiLinesMultiples).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.additionalMultiples,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there are no cast bets", () => {
    it("should not create cast bets cards", () => {
      renderSportsbookPlace({ hasCastBets: false });

      const castBets = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[3].content[1];

      expect(castBets).toEqual({
        card: undefined,
        title: i18nLabelsMock.casts,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there are cast bets", () => {
    it("should create cast bets cards", () => {
      renderSportsbookPlace({ hasCastBets: true });

      const castBets = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[3].content[1];

      expect(castBets).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.casts,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there is one single bet", () => {
    it("should produce a non collapsable content", () => {
      renderSportsbookPlace({ hasSingles: true, hasOnlyOneSingle: true });

      const singles = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[4].content[0];

      expect(singles).toEqual(
        expect.objectContaining({
          collapsable: false,
        }),
      );
    });
  });

  describe("when there are only singles bets", () => {
    it("should create singles bet cards", () => {
      renderSportsbookPlace({ hasSingles: true });

      const singles = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[4].content[0];

      expect(singles).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.singles,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when there are not only singles bets", () => {
    it("should create singles bet cards", () => {
      renderSportsbookPlace({ hasSingles: true, hasMultipleLinesMultiples: true });

      const singles = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[4].content[0];

      expect(singles).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.singles,
        startsOpen: expect.any(Boolean),
        collapsable: true,
      });
    });
  });

  describe("when focusedCard is setted", () => {
    it("should call SportsbookPlacePanel with the betslip section defined to focusedCard", () => {
      renderSportsbookPlace({
        hasMultiBetBuilder: true,
        useCustomKeyboard: true,
        focusedCard: BetslipSection.bbMulti,
      });

      expect(SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[0].card.props).toEqual(
        expect.objectContaining({ shouldFocusStakeField: true }),
      );
      expect(SportsbookPlacePanelOrchestrator).toHaveBeenCalledTimes(1);
    });
  });

  describe("when it is the initial render", () => {
    describe("when there is all necessary data", () => {
      it("should call SportsbookPlacePanel", () => {
        useExperimentVariant.mockReturnValue("control");

        useContext.mockReturnValue({
          focusedKeyboardControls: {
            focusedInputId: null,
            focusedInputRef: null,
            focusedTargetRef: null,
          },
          setFocusedKeyboardControls: jest.fn(),
          isDesktopLayout: false,
        });

        renderSportsbookPlace({
          betBuilderIds: ["betBuilder"],
          failedCombinationGroups: ["failedCombinationGroups"],
          boostedCombinationIds: ["boostedCombinationIds"],
          failedCombinationGroupIds: ["failedCombinationGroupIds"],
          hasSingles: true,
          hasOnlyOneSingle: true,
          hasOneLineMultiple: true,
          hasMultipleLinesMultiples: true,
          hasMultiBetBuilder: true,
          hasCastBets: true,
          hasPriceBoost: true,
          hasBetBuilders: true,
        });

        expect(SportsbookPlacePanelOrchestrator).toHaveBeenCalledWith(
          {
            hasFreeBets: true,
            isFreeBetsSelected: false,
            betslipCards: expect.any(Object),
            footerPrefix: expect.anything(),
            notifications: expect.anything(),
            totalReturns: "1.14",
            totalOriginalReturns: "1.02",
            hasPlaceError: true,
            isPlaceDisabled: false,
            isSummaryDisabled: false,
            isOddsBoosted: true,
            placeBtnLabel: "place mock",
            placeBtnSecondaryLabel: "placeBtnSecondaryLabel",
            placeBtnLoadingLabel: "placeBtnLoadingLabel",
            reversePlaceBtnLabels: "reversePlaceBtnLabels",
            balanceAfterBet: "balanceAfterBet",
            betControlsExperimentVariant: "control",
            i18n: i18nLabelsMock,
            isDesktop: false,
            onPlaceClick: expect.any(Function),
            onRemoveAllClick: expect.any(Function),
            onFreeBetsChange: expect.any(Function),
            onCollapseToggle: expect.any(Function),
            onTabSwitch: expect.any(Function),
            freeBetsAlertMessage: "free bets alert mock",
            onFreeBetsRemovePress: expect.any(Function),
            isLoggedIn: false,
            hasSingles: true,
            hasOnlyOneSingle: true,
            hasOneLineMultiple: true,
            hasMultipleLinesMultiples: true,
            hasMultiBetBuilder: true,
            hasCastBets: true,
            hasPriceBoost: true,
            hasBetBuilders: true,
            betBuilderIds: ["betBuilder"],
            failedCombinationGroups: ["failedCombinationGroups"],
            boostedCombinationIds: ["boostedCombinationIds"],
            failedCombinationGroupIds: ["failedCombinationGroupIds"],
            isDesktopLayout: false,
          },
          undefined,
        );
        expect(SportsbookPlacePanelOrchestrator).toHaveBeenCalledTimes(1);
      });

      it("should apply collapse strategy with given strategy", () => {
        renderSportsbookPlace({
          collapseStrategy: BetslipCollapseStrategy.FirstOpen,
          betBuilderIds: ["betBuilder"],
          hasMultiBetBuilder: true,
          hasCastBets: true,
          hasOneLineMultiple: true,
          hasMultipleLinesMultiples: true,
          hasBetBuilders: true,
        });

        expect(useCollapseStrategy).toHaveBeenCalledWith(expect.any(Array), BetslipCollapseStrategy.FirstOpen);
        expect(useCollapseStrategy).toHaveBeenCalledTimes(1);
      });
    });

    describe("when isDepositRequired is true", () => {
      it("should pass hasPlaceError as true", () => {
        renderSportsbookPlace({
          isDepositRequired: true,
          isLoggedIn: true,
        });

        expect(SportsbookPlacePanelOrchestrator).toHaveBeenCalledWith(
          expect.objectContaining({
            hasPlaceError: true,
          }),
          undefined,
        );
      });
    });

    describe("when isLoggedIn is true", () => {
      it("should pass hasPlaceError as false", () => {
        renderSportsbookPlace({
          isLoggedIn: true,
        });

        expect(SportsbookPlacePanelOrchestrator).toHaveBeenCalledWith(
          expect.objectContaining({
            hasPlaceError: false,
          }),
          undefined,
        );
      });
    });
  });

  describe("when has a desktop layout available", () => {
    it("should pass down the isDesktop prop", () => {
      useContext.mockReturnValue({
        focusedKeyboardControls: {
          focusedInputId: null,
          focusedInputRef: null,
          focusedTargetRef: null,
        },
        setFocusedKeyboardControls: jest.fn(),
        isDesktopLayout: true,
      });

      renderSportsbookPlace();

      expect(SportsbookPlacePanelOrchestrator).toHaveBeenCalledWith(
        expect.objectContaining({
          isDesktop: true,
        }),
        undefined,
      );
      expect(SportsbookPlacePanelOrchestrator).toHaveBeenCalledTimes(1);
    });
  });

  describe("when there are no bets", () => {
    it("should display the placeholder", () => {
      useContext.mockReturnValue({
        focusedKeyboardControls: {
          focusedInputId: null,
          focusedInputRef: null,
          focusedTargetRef: null,
        },
        setFocusedKeyboardControls: jest.fn(),
        isDesktopLayout: true,
      });

      renderSportsbookPlace({ shouldDisplayPlaceholder: true });

      expect(EmptyBetslip).toHaveBeenCalledTimes(1);
      expect(SportsbookPlacePanelOrchestrator).not.toHaveBeenCalled();
    });
  });

  describe("when performing interactions", () => {
    describe("onPlaceClick", () => {
      describe("when logged in", () => {
        it("should call dispatchPlacement with the correct payload", () => {
          const dispatchPlacement = jest.fn();

          renderSportsbookPlace({ confirmFirst: true, isFreeBetsSelected: true, isLoggedIn: true, dispatchPlacement });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchPlacement).toHaveBeenCalledTimes(1);
        });
      });

      describe("when logged out", () => {
        const dispatchLogin = jest.fn();
        const dispatchLoginToPlaceBetAction = jest.fn();

        it("should call dispatchLogin with the correct payload", () => {
          renderSportsbookPlace({ isLoggedIn: false, dispatchLogin, dispatchLoginToPlaceBetAction });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchLoginToPlaceBetAction).toHaveBeenCalled();

          expect(dispatchLogin).toHaveBeenCalledWith("ssoUrlMock&url=https%3A%2F%2Fwww.betfair.com%2Fbetting");
          expect(dispatchLogin).toHaveBeenCalledTimes(1);
        });

        describe("when getAuthData returns null", () => {
          it("should call dispatchLoginToPlaceBetAction and dispatchLogin with the correct payload", () => {
            getAuthData.mockReturnValueOnce(null);

            renderSportsbookPlace({
              dispatchLogin,
              isLoggedIn: false,
              dispatchLoginToPlaceBetAction,
            });

            SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

            expect(dispatchLoginToPlaceBetAction).toHaveBeenCalled();

            expect(dispatchLogin).toHaveBeenCalledWith("undefined&url=https%3A%2F%2Fwww.betfair.com%2Fbetting");
          });
        });
      });

      describe("when confirm bet step throttle is enabled", () => {
        it("should call dispatchConfirmBet", () => {
          const dispatchConfirmBet = jest.fn();

          renderSportsbookPlace({
            isBetConfirmationStepActive: true,
            isFreeBetsSelected: true,
            isLoggedIn: true,
            dispatchConfirmBet,
          });
          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchConfirmBet).toHaveBeenCalledTimes(1);
        });
      });

      describe("when confirm bet step is disabled", () => {
        it("should call dispatchPlacement", () => {
          const dispatchPlacement = jest.fn();

          renderSportsbookPlace({
            confirmFirst: true,
            isBetConfirmationStepActive: false,
            isFreeBetsSelected: true,
            isLoggedIn: true,
            dispatchPlacement,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchPlacement).toHaveBeenCalledTimes(1);
        });
      });

      describe("when deposit is required", () => {
        it("should not call dispatchPlacement", () => {
          const dispatchPlacement = jest.fn();

          renderSportsbookPlace({
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchPlacement,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchPlacement).not.toHaveBeenCalled();
        });

        it("should call dispatchDepositRedirect", () => {
          const dispatchDepositRedirect = jest.fn();

          renderSportsbookPlace({
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            requiredDepositValue: 1337,
            dispatchDepositRedirect,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(buildDepositRedirectPayload).toHaveBeenCalledWith("https://www.betfair.com/betting", 1337);
          expect(dispatchDepositRedirect).toHaveBeenCalled();
        });

        it("should call dispatchNavigate", () => {
          const dispatchNavigate = jest.fn();

          renderSportsbookPlace({
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchNavigate,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchNavigate).toHaveBeenCalledWith("viewUrn", "viewUrl");
        });
      });

      describe("when deposit is not required", () => {
        it("should call dispatchPlacement with the correct payload", () => {
          const dispatchPlacement = jest.fn();

          renderSportsbookPlace({
            isLoggedIn: true,
            isDepositRequired: false,
            dispatchPlacement,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchPlacement).toHaveBeenCalled();
        });
      });
    });

    describe("onRemoveAllClick", () => {
      it("should call dispatchRemoveAll", () => {
        const dispatchRemoveAll = jest.fn();

        renderSportsbookPlace({ dispatchRemoveAll });

        act(() => {
          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onRemoveAllClick();
        });

        expect(dispatchRemoveAll).toHaveBeenCalledTimes(1);
      });
    });

    describe("onFreeBetsChange", () => {
      it("should call dispatchSportsbookBonusToggle with the correct payload", () => {
        const dispatchSportsbookBonusToggle = jest.fn();

        renderSportsbookPlace({ isFreeBetsSelected: true, dispatchSportsbookBonusToggle });

        SportsbookPlacePanelOrchestrator.mock.calls[0][0].onFreeBetsChange();

        expect(dispatchSportsbookBonusToggle).toHaveBeenCalledWith(true);
        expect(dispatchSportsbookBonusToggle).toHaveBeenCalledTimes(1);
      });
    });

    describe("onCollapseToggle", () => {
      it("should call dispatchAccordionToggle", () => {
        const dispatchAccordionToggle = jest.fn();
        renderSportsbookPlace({ dispatchAccordionToggle });

        SportsbookPlacePanelOrchestrator.mock.calls[0][0].onCollapseToggle();

        expect(dispatchAccordionToggle).toHaveBeenCalledWith();
        expect(dispatchAccordionToggle).toHaveBeenCalledTimes(1);
      });
    });

    describe("onTabSwitch", () => {
      it("should call dispatchTabSwitch", () => {
        const dispatchTabSwitch = jest.fn();
        renderSportsbookPlace({ dispatchTabSwitch });

        SportsbookPlacePanelOrchestrator.mock.calls[0][0].onTabSwitch();

        expect(dispatchTabSwitch).toHaveBeenCalledWith();
        expect(dispatchTabSwitch).toHaveBeenCalledTimes(1);
      });
    });
  });
});
