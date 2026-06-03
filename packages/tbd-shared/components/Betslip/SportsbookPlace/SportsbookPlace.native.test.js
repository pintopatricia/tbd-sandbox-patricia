import { useContext } from "react";
import { act, render } from "@testing-library/react-native";
import { navigateDeposit } from "@ppb/tbd-router/native";
import { QuickStakes } from "@ppb/the-wall-native";

import { BetslipSection } from "../Betslip.types";
import { getEndpoint } from "../../../config/endpoints";

import useLoginWithPendingState from "../../../hooks/useLoginWithPendingState.native";
import { SportsbookPlace } from "./SportsbookPlace.native";
import { SportsbookPlacePanelOrchestrator } from "./snowflakes/SportsbookPlacePanel/SportsbookPlacePanelOrchestrator.native";
import { FooterCustomKeyboard } from "../Keyboard/FooterCustomKeyboard.native";
import { useCollapseStrategy, BetslipCollapseStrategy } from "./hooks/useCollapseStrategy";
import { useExperimentVariant } from "../../../experimentation/hooks/useExperimentVariant";
import { useIsFocused } from "@react-navigation/native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    focusedKeyboardControls: {
      focusedInputId: "focusedInputId",
    },
  })),
}));

const mockLogin = jest.fn();
jest.mock("../../../hooks/useLoginWithPendingState.native", () => ({
  __esModule: true,
  default: jest.fn(() => mockLogin),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  QuickStakes: jest.fn((props) => <quick-stakes-mock {...props}></quick-stakes-mock>),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../Keyboard/FooterCustomKeyboard.native", () => ({
  FooterCustomKeyboard: jest.fn(() => <footer-custom-keyboard-mock />),
}));

jest.mock("./snowflakes/SportsbookPlacePanel/SportsbookPlacePanelOrchestrator.native", () => ({
  SportsbookPlacePanelOrchestrator: jest.fn(({ footerPrefix, children, ...props }) => (
    <sportsbook-place-panel-orchestrator-mock {...props}>
      {footerPrefix || children}
    </sportsbook-place-panel-orchestrator-mock>
  )),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateDeposit: jest.fn(),
}));
jest.mock("../../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "https://www.deposit.com/endpoint"),
}));

jest.mock("../SinglesCard", () => jest.fn(({ props }) => <connected-singles-card-mock {...props} />));
jest.mock("../SinglesCard/SinglesCard.native", () => ({
  SinglesCard: "singles card mock",
}));
jest.mock("../OneLineMultiple", () => jest.fn(({ props }) => <connected-one-line-multiple-mock {...props} />));
jest.mock("../OneLineMultiple/OneLineMultiple.native", () =>
  jest.fn(({ props }) => <one-line-multiple-mock {...props} />),
);
jest.mock("../MultiLinesMultiples", () => jest.fn(({ props }) => <connected-multi-lines-multiples-mock {...props} />));
jest.mock("../MultiLinesMultiples/MultiLinesMultiples.native", () =>
  jest.fn(({ props }) => <multi-lines-multiples-mock {...props} />),
);
jest.mock("../BetBuildersCard", () => jest.fn(({ props }) => <connected-bet-builders-card-mock {...props} />));
jest.mock("../BetBuildersCard/BetBuildersCard.native", () => ({
  BetBuildersCard: "bet builders card mock",
}));
jest.mock("../MultiBetBuilderCard", () => jest.fn(({ props }) => <connected-multi-bet-builder-card-mock {...props} />));
jest.mock("../MultiBetBuilderCard/MultiBetBuilderCard.native", () => ({
  MultiBetBuilderCard: "multi bet builder card mock",
}));
jest.mock("../CastBetsCard", () => jest.fn(({ props }) => <connected-cast-bets-card-mock {...props} />));
jest.mock("../CastBetsCard/CastBetsCard.native", () => ({
  CastBetsCard: "cast bets card mock",
}));
jest.mock("../PriceBoostSection", () => () => "");
jest.mock("../PriceBoostSection/PriceBoostSection.native", () => ({
  PriceBoostSection: "l",
}));

jest.mock(
  "@ppb/tbd-components-flexible-betting-opportunities/components/UpsellSuggestions/view/UpsellSuggestions.native",
  () => jest.fn((props) => <upsell-suggestions-mock {...props} />),
);

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("../betslip-deposit-redirect-mapper", () => ({
  buildDepositRedirectPayload: jest.fn(() => ({ viewUrn: "viewUrn", viewUrl: "viewUrl" })),
}));

jest.mock("../../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(() => "control"),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: jest.fn().mockImplementation(() => true),
}));

const i18nLabelsMock = {
  priceBoostGroup: "price boosts tab mock",
  singlesGroup: "singles tab mock",
  multiplesGroup: "multiples tab mock",
  systemGroup: "system tab mock",
  totalReturns: "totalReturns mock",
  priceBoosts: "price boosts mock",
  multiples: "multiples mock",
  singles: "singles mock",
  removeLabel: "removeLabel mock",
  selections: "selections mock",
  odds: "oddsLabel",
  stake: "stakeLabel",
  oddsMovementUp: "oddsMovementUp mock",
  oddsMovementDown: "oddsMovementDown mock",
};

jest.mock("./hooks/useCollapseStrategy", () => ({
  ...jest.requireActual("./hooks/useCollapseStrategy"),
  useCollapseStrategy: jest.fn((arg) => arg),
}));

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
  tabsExperimentVariant,
  betslipCardsOrder = betslipCardsOrderMock,
  collapseStrategy = BetslipCollapseStrategy.FirstOpen,
  betBuilderIds = [],
  boostedCombinationIds = [],
  failedCombinationGroups = [],
  failedCombinationGroupIds = [],
  totalReturns = "1.14",
  totalOriginalReturns = "1.02",
  hasPlaceError = false,
  isPlaceDisabled = false,
  isPanelDisabled = false,
  isSummaryDisabled = false,
  isFreeBetsSelected = false,
  isEligibleToBonus = true,
  isOddsBoosted = true,
  hasSingles = false,
  hasMultiBetBuilder = false,
  hasOneLineMultiple = false,
  hasMultipleLinesMultiples = false,
  hasCastBets = false,
  hasBetBuilders = false,
  hasPriceBoost = false,
  hasOnlyOneSingle = false,
  focusedCard,
  isLoggedIn = false,
  isBetConfirmationStepActive = false,
  isDepositRequired = false,
  requiredDepositValue = 0,
  placeBtnLabel = "place mock",
  placeBtnSecondaryLabel = "placeBtnSecondaryLabel",
  placeBtnLoadingLabel = "placeBtnLoadingLabel",
  reversePlaceBtnLabels = "reversePlaceBtnLabels",
  balanceAfterBet = "balanceAfterBet",
  quickStakes,
  separator,
  i18n = i18nLabelsMock,
  dispatchPlacement = jest.fn(),
  dispatchRemoveAll = jest.fn(),
  dispatchSportsbookBonusToggle = jest.fn(),
  dispatchConfirmBet = jest.fn(),
  dispatchDepositRedirect = jest.fn(),
  dispatchAccordionToggle = jest.fn(),
  dispatchLoginToPlaceBetAction = jest.fn(),
  dispatchTabSwitch = jest.fn(),
  operatorRegulation = "",
  freeBetsAlertMessage = "free bets alert mock",
  dispatchFreeBetsRemoveAction = jest.fn(),
  dispatchIncrementPress = jest.fn(),
  marketSelections = [],
} = {}) {
  return render(
    <SportsbookPlace
      tabsExperimentVariant={tabsExperimentVariant}
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
      isPanelDisabled={isPanelDisabled}
      isSummaryDisabled={isSummaryDisabled}
      isFreeBetsSelected={isFreeBetsSelected}
      isEligibleToBonus={isEligibleToBonus}
      isOddsBoosted={isOddsBoosted}
      hasSingles={hasSingles}
      hasMultiBetBuilder={hasMultiBetBuilder}
      hasOneLineMultiple={hasOneLineMultiple}
      hasMultipleLinesMultiples={hasMultipleLinesMultiples}
      hasCastBets={hasCastBets}
      hasBetBuilders={hasBetBuilders}
      hasPriceBoost={hasPriceBoost}
      hasOnlyOneSingle={hasOnlyOneSingle}
      focusedCard={focusedCard}
      isLoggedIn={isLoggedIn}
      isBetConfirmationStepActive={isBetConfirmationStepActive}
      isDepositRequired={isDepositRequired}
      requiredDepositValue={requiredDepositValue}
      placeBtnLabel={placeBtnLabel}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      balanceAfterBet={balanceAfterBet}
      quickStakes={quickStakes}
      separator={separator}
      i18n={i18n}
      operatorRegulation={operatorRegulation}
      dispatchPlacement={dispatchPlacement}
      dispatchRemoveAll={dispatchRemoveAll}
      dispatchSportsbookBonusToggle={dispatchSportsbookBonusToggle}
      dispatchConfirmBet={dispatchConfirmBet}
      dispatchDepositRedirect={dispatchDepositRedirect}
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

  describe("upsell suggestions card", () => {
    it("should not display upsell suggestions if betslip is not focused", () => {
      const marketSelectionsMock = [
        { marketUrn: "urn:market:1", selectionUrn: "urn:selection:1" },
        { marketUrn: "urn:market:2", selectionUrn: "urn:selection:2" },
      ];
      useIsFocused.mockImplementationOnce(() => false);
      renderSportsbookPlace({ marketSelections: marketSelectionsMock });

      const upsellSuggestions = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[0].content[0];

      expect(upsellSuggestions).toEqual({
        card: undefined,
        title: "",
        startsOpen: true,
        collapsable: false,
      });
    });

    it("should create upsell suggestions with undefined card and empty title", () => {
      renderSportsbookPlace();

      const upsellSuggestions = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[0].content[0];

      expect(upsellSuggestions).toEqual({
        card: undefined,
        title: "",
        startsOpen: true,
        collapsable: false,
      });
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
  });

  describe("when there is no multi bet builder", () => {
    it("should not create multi bet builder card", () => {
      renderSportsbookPlace({ hasMultiBetBuilder: false });

      const bbMulti = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[0];

      expect(bbMulti).toEqual({
        card: undefined,
        title: i18nLabelsMock.multiBetBuilder,
        startsOpen: true,
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
        startsOpen: true,
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
        startsOpen: true,
        collapsable: true,
      });
    });
  });

  describe("when there are no bet builders", () => {
    it("should call SportsbookPlacePanel with betBuildersCard as undefined", () => {
      renderSportsbookPlace({ betBuilderIds: [] });

      const betBuilders = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[2].content[1];

      expect(betBuilders).toEqual({
        card: undefined,
        title: i18nLabelsMock.betBuilder,
        startsOpen: true,
        collapsable: true,
      });
    });
  });

  describe("when there are combined or failed price boosts", () => {
    it("should create price boost section", () => {
      renderSportsbookPlace({
        hasPriceBoost: true,
      });

      const priceBoostSection = SportsbookPlacePanelOrchestrator.mock.calls[0][0].betslipCards[1].content[0];

      expect(priceBoostSection).toEqual({
        card: expect.any(Object),
        title: i18nLabelsMock.priceBoosts,
        startsOpen: true,
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
        startsOpen: true,
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
        startsOpen: true,
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
        startsOpen: true,
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
        startsOpen: true,
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
        startsOpen: true,
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
        startsOpen: true,
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
        startsOpen: true,
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
        startsOpen: true,
        collapsable: true,
      });
    });
  });

  describe("when focusedCard is set", () => {
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
      it("should call SportsbookPlacePanelOrchestrator", () => {
        renderSportsbookPlace({
          betBuilderIds: ["betBuilder"],
          hasCastBets: true,
          hasOneLineMultiple: true,
          hasMultipleLinesMultiples: true,
          hasBetBuilders: true,
          operatorRegulation: "Operator Regulation Translation",
          tabsExperimentVariant: "tabsExperimentVariantMock",
          failedCombinationGroups: ["failedCombinationGroups"],
          boostedCombinationIds: ["boostedCombinationIds"],
          failedCombinationGroupIds: ["failedCombinationGroupIds"],
          hasSingles: true,
          hasOnlyOneSingle: true,
          hasMultiBetBuilder: true,
          hasPriceBoost: true,
        });

        expect(SportsbookPlacePanelOrchestrator).toHaveBeenCalledWith(
          {
            betslipCards: expect.any(Object),
            isPanelDisabled: false,
            hasFreeBets: true,
            isFreeBetsSelected: false,
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
        it("should call dispatchPlacement with the correct payload", () => {
          const dispatchLoginToPlaceBetAction = jest.fn();
          renderSportsbookPlace({ isLoggedIn: false, dispatchLoginToPlaceBetAction });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchLoginToPlaceBetAction).toHaveBeenCalled();
          expect(useLoginWithPendingState).toHaveBeenCalled();
          expect(mockLogin).toHaveBeenCalled();
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
            confirmFirst: true,
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchPlacement,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchPlacement).not.toHaveBeenCalled();
        });

        it("should call dispatchDepositRedirect with the endpoint", () => {
          getEndpoint.mockReturnValue("https://www.deposit.com/endpoint");
          const dispatchDepositRedirect = jest.fn();

          renderSportsbookPlace({
            confirmFirst: true,
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchDepositRedirect,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(dispatchDepositRedirect).toHaveBeenCalled();
        });

        it("should call navigateDeposit with the endpoint", () => {
          const dispatchPlacement = jest.fn();
          getEndpoint.mockReturnValue("https://www.deposit.com/endpoint");

          renderSportsbookPlace({
            confirmFirst: true,
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            requiredDepositValue: 1337,
            dispatchPlacement,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(navigateDeposit).toHaveBeenCalledWith("https://www.deposit.com/endpoint?amount=1337");
        });

        it("should call getEndpoint", () => {
          const dispatchPlacement = jest.fn();

          renderSportsbookPlace({
            confirmFirst: true,
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchPlacement,
          });

          SportsbookPlacePanelOrchestrator.mock.calls[0][0].onPlaceClick();

          expect(getEndpoint).toHaveBeenCalledWith("DEPOSIT");
        });
      });

      describe("when deposit is not required", () => {
        it("should call dispatchPlacement with the correct payload", () => {
          const dispatchPlacement = jest.fn();

          renderSportsbookPlace({ isLoggedIn: true, isDepositRequired: false, dispatchPlacement });

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
  it("should render the correct footerPrefix component", () => {
    renderSportsbookPlace({
      quickStakes: <QuickStakes />,
      separator: ",",
      isPanelDisabled: false,
    });

    expect(FooterCustomKeyboard).toHaveBeenCalledTimes(1);

    expect(FooterCustomKeyboard).toHaveBeenCalledWith(
      expect.objectContaining({
        prefix: expect.any(Object),
        isDisabled: false,
      }),
      undefined,
    );
  });
  describe("betControlsExperimentVariant", () => {
    it("should call betControlsExperimentVariant with the correct experiment name", () => {
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
