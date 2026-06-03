import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import {
  BetInfoItemMode,
  FallbackIconType,
  SelectionsBoardTheme,
  TrackingBarStatus,
  StatusLabelSizeType,
  StatusLabelType,
} from "@ppb/the-wall-common/types";
import { SystemIconName, ValueIconName } from "@ppb/the-wall-icons";
import {
  BetInfo,
  BetSegments,
  BetSelectionDetails,
  BetsSummary,
  ForecastTricastSelection,
  SelectionsBoard,
  SelectionsBoardSection,
  SilkWrapper,
  SportsbookBetButton,
  SubHeader,
  BetslipCastBet,
  BetslipBetSummary,
  Alert,
  FreeBets,
  StatusLabel,
} from "@ppb/the-wall-web";
import LottoSelections from "@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.web";
import { DraggableList } from "@ppb/the-wall-web/components/walls/DraggableList/DraggableList";
import { Switch } from "@ppb/the-wall-web/components/bricks/Switch/Switch";
import { BetBuilderSummary } from "./snowflakes/BetBuilderSummary/BetBuilderSummary.web";
import { BetSportsbookReceipt } from "./snowflakes/BetSportsbookReceipt/BetSportsbookReceipt.web";
import { SkyBetClubTracker } from "../../../../SkyBetClubTrackerCard/view/snowflakes/SkyBetClubTracker/SkyBetClubTracker.web";
import { BetSelections } from "./snowflakes/BetSelections/BetSelections.web";
import { SportsbookReceiptPanel } from "./SportsbookReceiptPanel.web";
import { TEST_ID, SCROLLABLE } from "./SportsbookReceiptPanel.web.selectors";
import styles from "./SportsbookReceiptPanel.web.css";

jest.mock("@ppb/the-wall-web", () => ({
  BetInfo: jest.fn(() => <bet-info-mock />),
  BetSegments: jest.fn(() => <bet-segments-mock />),
  BetSelectionDetails: jest.fn((props) => <bet-selection-details-mock>{props.icon}</bet-selection-details-mock>),
  BetsSummary: jest.fn(() => <bets-summary-mock />),
  ForecastTricastSelection: jest.fn(() => <fctc-selection-mock />),
  FreeBets: jest.fn(() => <free-bets />),
  SelectionsBoard: jest.fn(({ children }) => <selections-board-mock>{children}</selections-board-mock>),
  SelectionsBoardSection: jest.fn(({ children }) => (
    <selections-board-section-mock>{children}</selections-board-section-mock>
  )),
  SilkWrapper: jest.fn(() => <silk-wrapper-mock />),
  SportsbookBetButton: jest.fn(() => <sportsbook-bet-button />),
  SubHeader: jest.fn(() => <subheader-mock />),
  BetslipCastBet: jest.fn(({ runners, castTypes, controls }) => (
    <>
      {runners}
      {castTypes}
      {controls}
    </>
  )),
  BetslipBetSummary: jest.fn(() => <combination-summary />),
  Alert: jest.fn(() => <alert-mock />),
  StatusLabel: jest.fn((props) => <status-label-mock {...props} />),
}));

jest.mock("@ppb/the-wall-web/components/walls/DraggableList/DraggableList", () => ({
  DraggableList: jest.fn(({ children }) => <draggable-list-mock>{children}</draggable-list-mock>),
}));

jest.mock("./snowflakes/BetBuilderSummary/BetBuilderSummary.web", () => ({
  BetBuilderSummary: jest.fn(() => <bet-builder-summary />),
}));

jest.mock("./snowflakes/BetSportsbookReceipt/BetSportsbookReceipt.web", () => ({
  BetSportsbookReceipt: jest.fn(() => <bet-sbk-receipt />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/Switch/Switch", () => ({
  Switch: jest.fn(() => <switch-mock />),
}));

jest.mock("../../../../SkyBetClubTrackerCard/view/snowflakes/SkyBetClubTracker/SkyBetClubTracker.web", () => ({
  SkyBetClubTracker: jest.fn(() => <sky-bet-club-tracker-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("./snowflakes/BetSelections/BetSelections.web", () => ({
  BetSelections: jest.fn(() => <multiples-composition />),
}));

const SELECTIONS_MOCK = [
  {
    id: "selection-id-1",
    title: "Selection 1",
    subtitle: "Subtitle 1",
    odd: "1.53",
    silkUrl: "silkUrl1",
    silkFallbackType: FallbackIconType.HorseRacing,
  },
  {
    id: "selection-id-2",
    title: "Selection 2",
    subtitle: "Subtitle 2",
    odd: "1.47",
    silkUrl: "silkUrl2",
    silkFallbackType: FallbackIconType.HorseRacing,
  },
];

const MULTIPLES_MOCK = [
  {
    odds: "2",
    stake: "€2.00",
    returns: "€4",
    title: "Trebles",
    hasAccaInsurance: true,
    hasBonusUsed: false,
    freeBetsLabel: "",
    hasEachWay: true,
    lines: 2,
    betReceiptId: "123",
    regulatorId: "X-123",
    hasMyOddsBoost: false,
  },
  {
    odds: "2.5",
    stake: "€4.00",
    returns: "€10",
    title: "Canadian",
    hasAccaInsurance: false,
    hasBonusUsed: false,
    freeBetsLabel: "",
    hasEachWay: false,
    lines: 1,
    betReceiptId: "124",
    regulatorId: "X-124",
    hasMyOddsBoost: true,
    previousOdds: "1.5",
  },
];

const MULTIPLES_WITH_BONUS_MOCK = [
  {
    ...MULTIPLES_MOCK[0],
    hasBonusUsed: true,
    freeBetsLabel: "freeBetsLabel",
  },
  {
    ...MULTIPLES_MOCK[1],
    hasBonusUsed: false,
    freeBetsLabel: "bonusNotAvailableLabel",
  },
];

const MULTIPLES_WITH_BONUS_WALLETS_MOCK = [
  {
    ...MULTIPLES_MOCK[0],
    generosityAlertMessage: "generosityAlertMessage1",
    generosityIconName: "Value--Free-Bet",
  },
  {
    ...MULTIPLES_MOCK[1],
    generosityAlertMessage: "generosityAlertMessage2",
    generosityIconName: "Value--Free-Bet",
  },
];

const SEGMENTS_ICON_MOCK = <segments-icon-mock />;
const SILK_ICON_MOCK = <silk-icon-mock />;

const ONE_LINE_MOCK = [
  {
    title: "Lotteries",
    subtitle: "UK 49s - Lunchtime Draw",
    odds: "5/1",
    profitOrLiability: "€34",
    stake: "€10.00",
    hasBonusUsed: false,
    freeBetsLabel: "",
    runners: [
      {
        urn: "",
        market: "",
        selectionId: 1,
      },
    ],
    selectionTypeIcon: "fakeIcon",
    betReceiptId: "123",
    regulatorId: "X-123",
  },
];

const SINGLES_MOCK = [
  {
    title: "Benfica",
    subtitle: "Match Odds - Benfica v Porto",
    odds: "13/5",
    previousOdds: "12/6",
    segmentsIcon: SEGMENTS_ICON_MOCK,
    stake: "€10.00",
    profitOrLiability: "€34",
    hasBonusUsed: false,
    freeBetsLabel: "",
    hasEachWay: true,
    eachWaySubtitle: "eachWaySubtitle",
    isPriceBoosted: true,
    is90Min: true,
    selectionTypeIcon: "fakeIcon",
    hasMyOddsBoost: true,
    isGuaranteedPriceSelected: true,
    previousProfitOrLiability: "€28",
    betReceiptId: "123",
    regulatorId: "X-123",
  },
  {
    title: "Ermesinde",
    subtitle: "Match Odds - Boavista v Ermesinde",
    odds: "2.5",
    stake: "€4.00",
    profitOrLiability: "€10",
    hasBonusUsed: false,
    freeBetsLabel: "",
    icon: SILK_ICON_MOCK,
    silkIconAlt: "silkIconAltMock",
    silkFallbackIconType: FallbackIconType.HorseRacing,
    hasEachWay: false,
    eachWaySubtitle: "",
    isPriceBoosted: false,
    hasMyOddsBoost: false,
    betReceiptId: "124",
    regulatorId: "X-124",
  },
];

const SINGLES_WITH_BONUS_MOCK = [
  {
    ...SINGLES_MOCK[0],
    hasBonusUsed: true,
    freeBetsLabel: "freeBetsLabel",
  },
  {
    ...SINGLES_MOCK[1],
    hasBonusUsed: false,
    freeBetsLabel: "bonusNotAvailableLabel",
  },
];

const SINGLES_WITH_BOOST_MOCK = [
  {
    ...SINGLES_MOCK[0],
    isPriceBoosted: true,
    marketType: "PRICE_BOOST",
    boostedInfo: { iconName: ValueIconName.PRICE_BOOST, label: "Price Boost" },
  },
  {
    ...SINGLES_MOCK[1],
    isPriceBoosted: false,
  },
];

const SINGLES_WITH_BONUS_WALLETS_MOCK = [
  {
    ...SINGLES_MOCK[0],
    generosityAlertMessage: "generosityAlertMessage1",
    generosityIconName: "Value--Free-Bet",
  },
  {
    ...SINGLES_MOCK[1],
    generosityAlertMessage: "generosityAlertMessage2",
    generosityIconName: "Value--Free-Bet",
  },
];

const CAST_SELECTIONS_MOCK = [
  {
    id: "selection-id-1",
    horse: "some horse",
    position: 1,
    positionOrdinal: "st",
    silkFallbackType: FallbackIconType.HorseRacing,
    racingSport: 7,
  },
  {
    id: "selection-id-2",
    horse: "another horse",
    position: 2,
    positionOrdinal: "nd",
    silkFallbackType: FallbackIconType.HorseRacing,
    racingSport: 7,
  },
];

const CASTS_MOCK = [
  {
    title: "4:20 Winterfell",
    subtitle: "Straight Forecast",
    selections: CAST_SELECTIONS_MOCK,
    lines: 2,
    stake: "€4",
    returns: "€10",
    betReceiptId: "123",
    regulatorId: "X-123",
    hasBonusUsed: false,
    generosityAlertMessage: "",
    generosityIconName: "",
    freeBetsLabel: "",
  },
  {
    title: "14:00 King's Landing",
    subtitle: "Reverse Forecast",
    selections: CAST_SELECTIONS_MOCK,
    lines: 2,
    stake: "€4",
    returns: "€10",
    betReceiptId: "124",
    regulatorId: "X-124",
    hasBonusUsed: false,
    freeBetsLabel: "",
    generosityAlertMessage: "",
    generosityIconName: "",
  },
];

const CAST_WITH_BONUS_MOCK = [
  {
    ...CASTS_MOCK[0],
    hasBonusUsed: true,
    freeBetsLabel: "freeBetsLabel",
  },
  {
    ...CASTS_MOCK[1],
    hasBonusUsed: false,
    freeBetsLabel: "freeBetsLabel",
  },
];

const CAST_WITH_BONUS_WALLETS_MOCK = [
  {
    ...CASTS_MOCK[0],
    hasBonusUsed: true,
    generosityAlertMessage: "generosityAlertMessage1",
    generosityIconName: "Value--Free-Bet",
  },
  {
    ...CASTS_MOCK[1],
    hasBonusUsed: true,
    generosityAlertMessage: "generosityAlertMessage2",
    generosityIconName: "Value--Free-Bet",
  },
];

const BET_BUILDER_SELECTIONS_MOCK = [
  { id: "S-1", title: "Title", subtitle: "Subtitle", action: "Remove" },
  { id: "S-2", title: "Title 2", subtitle: "Subtitle 2", action: "Remove" },
];

const BET_BUILDERS_MOCK = [
  {
    id: "B-1",
    title: "A v B",
    type: "Double",
    selections: BET_BUILDER_SELECTIONS_MOCK,
    selectionsLabel: "2 Selections",
    odds: "10.10",
    stake: "€4",
    returns: "€10",
    betReceiptId: "123",
    regulatorId: "X-123",
    hasMyOddsBoost: false,
  },
  {
    id: "B-2",
    title: "A v B",
    type: "Double",
    selections: BET_BUILDER_SELECTIONS_MOCK,
    selectionsLabel: "2 Selections",
    odds: "10.10",
    stake: "€4",
    returns: "€10",
    betReceiptId: "124",
    regulatorId: "X-124",
    hasMyOddsBoost: true,
    previousOdds: "9.9",
  },
];

const MULTI_BET_BUILDER_MOCK = {
  title: "Double",
  odds: "10.10",
  stake: "€4",
  returns: "€10",
  betReceiptId: "123",
  regulatorId: "X-123",
  hasMyOddsBoost: true,
  previousOdds: "9.9",
  hasBonusUsed: false,
  generosityAlertMessage: "",
  generosityIconName: "",
  freeBetsLabel: "",
};

const MULTI_BET_BUILDER_WITH_BONUS_MOCK = {
  title: "Double",
  odds: "10.10",
  stake: "€4",
  returns: "€10",
  betReceiptId: "123",
  regulatorId: "X-123",
  hasMyOddsBoost: true,
  previousOdds: "9.9",
  hasBonusUsed: true,
  freeBetsLabel: "freeBetsLabel",
  generosityAlertMessage: "",
  generosityIconName: "",
};

const MULTI_BET_BUILDER_BONUS_WALLETS_MOCK = {
  title: "Double",
  odds: "10.10",
  stake: "€4",
  returns: "€10",
  betReceiptId: "123",
  regulatorId: "X-123",
  hasMyOddsBoost: true,
  previousOdds: "9.9",
  hasBonusUsed: true,
  freeBetsLabel: "",
  generosityAlertMessage: "generosityAlertMessage",
  generosityIconName: "Value--Free-Bet",
};

const MULTI_BET_BUILDER_GROUPS_MOCK = {
  "event:urn:1": {
    urn: "event:urn:1",
    title: "Event 1",
    selections: [
      {
        id: "LEG:1",
        title: "Selection 1",
        subtitle: "Market name - Event name",
        is90Min: true,
        icon: "silkUrl1",
        silkFallbackType: FallbackIconType.HorseRacing,
        racingSport: 7,
      },
    ],
  },
  "event:urn:2": {
    urn: "event:urn:2",
    title: "Event 2",
    selections: [
      {
        id: "LEG:3",
        title: "Selection 3",
        subtitle: "Market name 2 - Event name 2",
        icon: "silkUrl2",
        silkFallbackType: FallbackIconType.HorseRacing,
        racingSport: 7,
      },
    ],
  },
};

function renderSportsbookReceiptPanel({
  multiples = MULTIPLES_MOCK,
  boostedMultiples = [],
  singles = SINGLES_MOCK,
  oneLineBets = [],
  casts = CASTS_MOCK,
  betBuilders = BET_BUILDERS_MOCK,
  multiBetBuilder,
  multiBetBuilderGroups,
  isSummaryDisabled,
  i18n = {
    receiptStatusLabel: "Some receipt status title",
    titleLabel: "Some title",
    selectionsLabel: "Some selectionsLabel",
    boostedMultiplesTitleLabel: "Some boostedMultiplesTitleLabel",
    multiplesTitleLabel: "Some multiplesTitleLabel",
    singlesTitleLabel: "Some singlesTitleLabel",
    castsTitleLabel: "Some castsTitleLabel",
    betBuilderTitleLabel: "Some betBuilderTitleLabel",
    multiBetBuilderTitleLabel: "Some multiBetBuilderTitleLabel",
    totalStakeLabel: "Some totalStakeLabel",
    totalReturnsLabel: "Some totalReturnsLabel",
    oddsLabel: "Some oddsLabel",
    returnsLabel: "Some returnsLabel",
    stakeLabel: "Some stakeLabel",
    eachWayLabel: "eachWayLabel",
    accaInsuranceLabel: "accaInsuranceLabel",
    linesLabel: "linesLabel",
    reUseSelectionsLabel: "reUseSelectionsLabel",
    guaranteedPriceLabel: "guaranteedPriceLabel",
    betReceiptIdLabel: "betReceiptIdLabel",
    regulatorBetIdLabel: "regulatorBetIdLabel",
    confirmationMessage: "Bet placed successfully!",
    priceBoost: "Price Boost",
  },
  onTitleClick = jest.fn(),
  onReUseSelectionsClick = jest.fn(),
  hasShownReceiptIds = false,
  hasBoostSignposting = false,
  onBetIdCopy = jest.fn(),
  onRegulatorBetIdCopy = jest.fn(),
  isDesktop = false,
  topContent = undefined,
  displayAllSubtitleTextSingles = false,
  showReuseSelectionsButton = true,
} = {}) {
  return render(
    <SportsbookReceiptPanel
      onTitleClick={onTitleClick}
      selections={SELECTIONS_MOCK}
      multiples={multiples}
      boostedMultiples={boostedMultiples}
      casts={casts}
      singles={singles}
      oneLineBets={oneLineBets}
      betBuilders={betBuilders}
      multiBetBuilder={multiBetBuilder}
      multiBetBuilderGroups={multiBetBuilderGroups}
      isSummaryDisabled={isSummaryDisabled}
      potentialReturns="Some potentialReturns"
      totalOriginalReturns="Some totalOriginalReturns"
      totalStake="Some totalStake"
      onReUseSelectionsClick={onReUseSelectionsClick}
      i18n={i18n}
      hasShownReceiptIds={hasShownReceiptIds}
      hasBoostSignposting={hasBoostSignposting}
      onBetIdCopy={onBetIdCopy}
      onRegulatorBetIdCopy={onRegulatorBetIdCopy}
      isDesktop={isDesktop}
      topContent={topContent}
      displayAllSubtitleTextSingles={displayAllSubtitleTextSingles}
      showReuseSelectionsButton={showReuseSelectionsButton}
    />,
  );
}

describe("SportsbookReceiptPanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("Scrollable Container", () => {
    describe("when is mobile", () => {
      const { container } = renderSportsbookReceiptPanel({});
      const test = container.querySelector(TEST_ID);
      const scrollableContainer = container.querySelector(SCROLLABLE);

      it("should call scrollableMobile style", () => {
        expect(test).toHaveClass(styles.scrollableMobile);
      });

      it("should not call scrollableDesktop style", () => {
        expect(scrollableContainer).not.toHaveClass(styles.scrollableDesktop);
      });
    });

    describe("when is desktop", () => {
      const { container } = renderSportsbookReceiptPanel({ isDesktop: true });
      const test = container.querySelector(TEST_ID);
      const scrollableContainer = container.querySelector(SCROLLABLE);

      it("should not call scrollableMobile style", () => {
        expect(test).not.toHaveClass(styles.scrollableMobile);
      });

      it("should call scrollableDesktop style", () => {
        expect(scrollableContainer).toHaveClass(styles.scrollableDesktop);
      });
    });
  });

  describe("Confirmation alert", () => {
    it("should have correct text and style", () => {
      renderSportsbookReceiptPanel({});
      expect(Alert).toHaveBeenCalledWith(
        {
          message: "Bet placed successfully!",
          showCloseIcon: false,
          type: "SUCCESS",
        },
        undefined,
      );
    });
  });

  describe("Titles", () => {
    describe("when multiples are empty", () => {
      it("should not display multiples title", () => {
        renderSportsbookReceiptPanel({ multiples: [] });

        expect(SubHeader).not.toHaveBeenCalledWith(
          {
            text: "Some multiplesTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
      });
    });

    describe("when multiples exist", () => {
      it("should have a proper title for multiples", () => {
        renderSportsbookReceiptPanel({
          singles: [],
          casts: [],
          betBuilders: [],
        });

        expect(SubHeader).toHaveBeenCalledWith(
          {
            text: "Some multiplesTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
        expect(SubHeader).toHaveBeenCalledTimes(1);
      });

      describe("when i18n is empty", () => {
        it("should render subHeader component with empty string", () => {
          renderSportsbookReceiptPanel({
            singles: [],
            multiples: [],
            casts: [],
            betBuilders: [],
            multiBetBuilder: MULTI_BET_BUILDER_MOCK,
            multiBetBuilderGroups: MULTI_BET_BUILDER_GROUPS_MOCK,
            i18n: {},
          });

          expect(SubHeader).toHaveBeenCalledWith(
            {
              text: "",
              tagName: "h2",
            },
            undefined,
          );
          expect(SubHeader).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("when boosted multiples exist", () => {
      it("should create titles", () => {
        renderSportsbookReceiptPanel({
          singles: [],
          multiples: [],
          casts: [],
          betBuilders: [],
          boostedMultiples: [
            {
              id: "double",
              title: "Double",
              selections: [],
            },
            {
              id: "treble",
              title: "Treble",
              selections: [],
            },
          ],
        });

        expect(SubHeader).toHaveBeenCalledWith(
          {
            text: "Some boostedMultiplesTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
        expect(SubHeader).toHaveBeenCalledTimes(1);
      });

      it("should create bet selections", () => {
        renderSportsbookReceiptPanel({
          singles: [],
          multiples: [],
          casts: [],
          betBuilders: [],
          boostedMultiples: [
            {
              id: "boost-1",
              selections: [1, 2],
            },
            {
              id: "boost-2",
              selections: [3, 4],
            },
          ],
        });

        expect(BetSelections).toHaveBeenCalledWith(
          {
            title: "Some selectionsLabel",
            selections: SELECTIONS_MOCK,
          },
          undefined,
        );
        expect(BetSelections).toHaveBeenCalledWith(
          {
            title: "Some selectionsLabel",
            selections: SELECTIONS_MOCK,
          },
          undefined,
        );
        expect(BetSelections).toHaveBeenCalledTimes(2);
      });

      it("should create bet summary", () => {
        renderSportsbookReceiptPanel({
          singles: [],
          multiples: [],
          casts: [],
          betBuilders: [],
          boostedMultiples: [
            {
              id: "summary-1",
              odds: 1,
              stake: 11,
              returns: 111,
              hasAccaInsurance: false,
              hasBonusUsed: true,
              freeBetsLabel: "b1 free bets label",
              generosityAlertMessage: "b1 free bets alert message",
              selections: [],
              generosityIconName: "Value--Free-Bet",
            },
            {
              id: "summary-2",
              odds: 2,
              stake: 22,
              returns: 222,
              hasAccaInsurance: true,
              hasBonusUsed: false,
              freeBetsLabel: "b2 free bets label",
              generosityAlertMessage: "b2 free bets alert message",
              selections: [],
              generosityIconName: "Value--Free-Bet",
            },
          ],
        });

        expect(BetslipBetSummary).toHaveBeenCalledWith(
          {
            odds: 1,
            stake: 11,
            returns: 111,
            hasAccaInsurance: false,
            hasBonusUsed: true,
            freeBetsLabel: "b1 free bets label",
            generosityAlertMessage: "b1 free bets alert message",
            generosityIconName: "Value--Free-Bet",
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
          },
          undefined,
        );
        expect(BetslipBetSummary).toHaveBeenCalledWith(
          {
            odds: 2,
            stake: 22,
            returns: 222,
            hasAccaInsurance: true,
            hasBonusUsed: false,
            freeBetsLabel: "b2 free bets label",
            generosityAlertMessage: "b2 free bets alert message",
            generosityIconName: "Value--Free-Bet",
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
          },
          undefined,
        );
        expect(BetslipBetSummary).toHaveBeenCalledTimes(2);
      });
    });

    describe("when single receipts are empty", () => {
      it("should not display singles title", () => {
        renderSportsbookReceiptPanel({ singles: [] });

        expect(SubHeader).not.toHaveBeenCalledWith(
          {
            text: "Some singlesTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
      });
    });

    describe("when single receipts exist", () => {
      it("should have a proper title for singles", () => {
        renderSportsbookReceiptPanel({
          multiples: [],
          casts: [],
          betBuilders: [],
        });

        expect(SubHeader).toHaveBeenCalledWith(
          {
            text: "Some singlesTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
        expect(SubHeader).toHaveBeenCalledTimes(1);
      });
    });

    describe("when casts receipts are empty", () => {
      it("should not display cast bets title", () => {
        renderSportsbookReceiptPanel({ casts: [] });

        expect(SubHeader).not.toHaveBeenCalledWith(
          {
            text: "Some castsTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
      });
    });

    describe("when casts receipts exist", () => {
      it("should have a proper title for cast bets", () => {
        renderSportsbookReceiptPanel({
          singles: [],
          multiples: [],
          betBuilders: [],
        });

        expect(SubHeader).toHaveBeenCalledWith(
          {
            text: "Some castsTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
        expect(SubHeader).toHaveBeenCalledTimes(1);
      });
    });

    describe("when bet builder receipts are empty", () => {
      it("should not display bet builder title", () => {
        renderSportsbookReceiptPanel({ betBuilders: [] });

        expect(SubHeader).not.toHaveBeenCalledWith(
          {
            text: "Some betBuilderTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
      });
    });

    describe("when bet builder receipts exist", () => {
      it("should have a proper title for bet builder", () => {
        renderSportsbookReceiptPanel({
          singles: [],
          multiples: [],
          casts: [],
        });

        expect(SubHeader).toHaveBeenCalledWith(
          {
            text: "Some betBuilderTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
        expect(SubHeader).toHaveBeenCalledTimes(1);
      });
    });

    describe("when multi bet builder receipt is empty", () => {
      it("should not display the multi bet builder title", () => {
        renderSportsbookReceiptPanel({ multiBetBuilder: null, multiBetBuilderGroups: {} });

        expect(SubHeader).not.toHaveBeenCalledWith(
          {
            text: "Some multiBetBuilderTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
      });
    });

    describe("when multi bet builder receipt exists", () => {
      it("should have a proper title for the multi bet builder", () => {
        renderSportsbookReceiptPanel({
          singles: [],
          multiples: [],
          casts: [],
          betBuilders: [],
          multiBetBuilder: MULTI_BET_BUILDER_MOCK,
          multiBetBuilderGroups: MULTI_BET_BUILDER_GROUPS_MOCK,
        });

        expect(SubHeader).toHaveBeenCalledWith(
          {
            text: "Some multiBetBuilderTitleLabel",
            tagName: "h2",
          },
          undefined,
        );
        expect(SubHeader).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("FreeBets", () => {
    describe("when user used bonus from bonus wallet", () => {
      it("should display bonus with receipt", () => {
        renderSportsbookReceiptPanel({
          title: "bet matched",
          singles: SINGLES_WITH_BONUS_MOCK,
          multiples: {},
        });

        expect(BetSportsbookReceipt).toHaveBeenCalledWith(
          {
            title: "Benfica",
            odds: "13/5",
            oddsLabel: "Some oddsLabel",
            previousOdds: "12/6",
            segmentsIcon: SEGMENTS_ICON_MOCK,
            profitOrLiability: "€34",
            previousProfitOrLiability: "€28",
            profitOrLiabilityLabel: "Some returnsLabel",
            stake: "€10.00",
            stakeLabel: "Some stakeLabel",
            subtitle: "Match Odds - Benfica v Porto",
            hasBonusUsed: true,
            freeBetsLabel: "freeBetsLabel",
            hasEachWay: true,
            eachWayLabel: "eachWayLabel",
            eachWaySubtitle: "eachWaySubtitle",
            is90Min: true,
            selectionTypeIcon: "fakeIcon",
            isPriceBoosted: true,
            hasMyOddsBoost: true,
            isGuaranteedPriceSelected: true,
            guaranteedPriceLabel: "guaranteedPriceLabel",
            displayAllSubtitleText: false,
          },
          undefined,
        );
        expect(BetSportsbookReceipt).toHaveBeenCalledTimes(2);
      });
    });

    describe("when user does not use bonus from the bonus wallet", () => {
      it("should not display bonus in the receipt", () => {
        renderSportsbookReceiptPanel({
          singles: SINGLES_MOCK,
          multiples: MULTIPLES_MOCK,
        });

        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          1,
          {
            freeBetsLabel: "",
            hasBonusUsed: false,
            hasEachWay: true,
            hasAccaInsurance: true,
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
            lines: 2,
            odds: "2",
            returns: "€4",
            stake: "€2.00",
            title: "Trebles",
            hasShownReceiptIds: false,
            hasMyOddsBoost: false,
          },
          undefined,
        );
        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          2,
          {
            freeBetsLabel: "",
            hasBonusUsed: false,
            hasEachWay: false,
            hasAccaInsurance: false,
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
            lines: 1,
            odds: "2.5",
            returns: "€10",
            stake: "€4.00",
            title: "Canadian",
            hasShownReceiptIds: false,
            previousOdds: "1.5",
            hasMyOddsBoost: true,
          },
          undefined,
        );
        expect(BetslipBetSummary).toHaveBeenCalledTimes(2);

        expect(FreeBets).not.toHaveBeenCalled();

        expect(Alert).toHaveBeenCalledTimes(1);

        expect(BetSportsbookReceipt).toHaveBeenCalledWith(
          {
            title: "Benfica",
            odds: "13/5",
            oddsLabel: "Some oddsLabel",
            previousOdds: "12/6",
            segmentsIcon: SEGMENTS_ICON_MOCK,
            profitOrLiability: "€34",
            previousProfitOrLiability: "€28",
            profitOrLiabilityLabel: "Some returnsLabel",
            stake: "€10.00",
            stakeLabel: "Some stakeLabel",
            subtitle: "Match Odds - Benfica v Porto",
            hasBonusUsed: false,
            freeBetsLabel: "",
            hasEachWay: true,
            eachWayLabel: "eachWayLabel",
            eachWaySubtitle: "eachWaySubtitle",
            isPriceBoosted: true,
            is90Min: true,
            selectionTypeIcon: "fakeIcon",
            hasMyOddsBoost: true,
            isGuaranteedPriceSelected: true,
            guaranteedPriceLabel: "guaranteedPriceLabel",
            displayAllSubtitleText: false,
          },
          undefined,
        );
        expect(BetSportsbookReceipt).toHaveBeenCalledTimes(2);
      });
      it("should not display bonus in the receipt for multibetbuilder", () => {
        renderSportsbookReceiptPanel({
          multiBetBuilder: MULTI_BET_BUILDER_MOCK,
        });
        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          1,
          {
            title: "Double",
            odds: "10.10",
            stake: "€4",
            returns: "€10",
            hasAccaInsurance: false,
            hasShownReceiptIds: false,
            hasMyOddsBoost: true,
            previousOdds: "9.9",
            previousValue: undefined,
            hasBonusUsed: false,
            generosityAlertMessage: "",
            generosityIconName: "",
            freeBetsLabel: "",
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
          },
          undefined,
        );

        expect(BetSportsbookReceipt).toHaveBeenCalledWith(
          {
            title: "Benfica",
            odds: "13/5",
            oddsLabel: "Some oddsLabel",
            previousOdds: "12/6",
            segmentsIcon: SEGMENTS_ICON_MOCK,
            profitOrLiability: "€34",
            previousProfitOrLiability: "€28",
            profitOrLiabilityLabel: "Some returnsLabel",
            stake: "€10.00",
            stakeLabel: "Some stakeLabel",
            subtitle: "Match Odds - Benfica v Porto",
            hasBonusUsed: false,
            freeBetsLabel: "",
            hasEachWay: true,
            eachWayLabel: "eachWayLabel",
            eachWaySubtitle: "eachWaySubtitle",
            isPriceBoosted: true,
            is90Min: true,
            selectionTypeIcon: "fakeIcon",
            hasMyOddsBoost: true,
            isGuaranteedPriceSelected: true,
            guaranteedPriceLabel: "guaranteedPriceLabel",
            displayAllSubtitleText: false,
          },
          undefined,
        );
        expect(BetSportsbookReceipt).toHaveBeenCalledTimes(2);
      });
    });

    describe("when user does have bonus in the bonus wallet", () => {
      it("should not have used any bonus amount and display bonus unselected", () => {
        renderSportsbookReceiptPanel({
          singles: SINGLES_MOCK,
          multiples: MULTIPLES_MOCK,
        });

        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          1,
          {
            freeBetsLabel: "",
            hasBonusUsed: false,
            hasEachWay: true,
            hasAccaInsurance: true,
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
            lines: 2,
            odds: "2",
            returns: "€4",
            stake: "€2.00",
            title: "Trebles",
            hasShownReceiptIds: false,
            hasMyOddsBoost: false,
          },
          undefined,
        );
        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          2,
          {
            freeBetsLabel: "",
            hasBonusUsed: false,
            hasEachWay: false,
            hasAccaInsurance: false,
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
            lines: 1,
            odds: "2.5",
            returns: "€10",
            stake: "€4.00",
            title: "Canadian",
            hasShownReceiptIds: false,
            hasMyOddsBoost: true,
            previousOdds: "1.5",
          },
          undefined,
        );
        expect(BetslipBetSummary).toHaveBeenCalledTimes(2);

        expect(BetSportsbookReceipt).toHaveBeenCalledWith(
          {
            title: "Benfica",
            odds: "13/5",
            oddsLabel: "Some oddsLabel",
            previousOdds: "12/6",
            segmentsIcon: SEGMENTS_ICON_MOCK,
            profitOrLiability: "€34",
            previousProfitOrLiability: "€28",
            profitOrLiabilityLabel: "Some returnsLabel",
            stake: "€10.00",
            stakeLabel: "Some stakeLabel",
            subtitle: "Match Odds - Benfica v Porto",
            hasBonusUsed: false,
            freeBetsLabel: "",
            hasEachWay: true,
            eachWayLabel: "eachWayLabel",
            eachWaySubtitle: "eachWaySubtitle",
            isPriceBoosted: true,
            is90Min: true,
            selectionTypeIcon: "fakeIcon",
            hasMyOddsBoost: true,
            isGuaranteedPriceSelected: true,
            guaranteedPriceLabel: "guaranteedPriceLabel",
            displayAllSubtitleText: false,
          },
          undefined,
        );
        expect(BetSportsbookReceipt).toHaveBeenCalledTimes(2);
      });
    });

    describe("when user used bonus from bonus wallet but has bonus not available", () => {
      it("should call render BetslipBetSummary and CastBet with no free bets", () => {
        renderSportsbookReceiptPanel({
          singles: SINGLES_WITH_BONUS_MOCK,
          multiples: MULTIPLES_WITH_BONUS_MOCK,
          casts: CAST_WITH_BONUS_MOCK,
        });

        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          1,
          {
            freeBetsLabel: "freeBetsLabel",
            hasBonusUsed: true,
            hasEachWay: true,
            hasAccaInsurance: true,
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
            lines: 2,
            odds: "2",
            returns: "€4",
            stake: "€2.00",
            title: "Trebles",
            hasShownReceiptIds: false,
            hasMyOddsBoost: false,
          },
          undefined,
        );
        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          2,
          {
            freeBetsLabel: "bonusNotAvailableLabel",
            hasBonusUsed: false,
            hasEachWay: false,
            hasAccaInsurance: false,
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
            lines: 1,
            odds: "2.5",
            returns: "€10",
            stake: "€4.00",
            title: "Canadian",
            hasShownReceiptIds: false,
            hasMyOddsBoost: true,
            previousOdds: "1.5",
          },
          undefined,
        );
        expect(BetslipBetSummary).toHaveBeenCalledTimes(2);

        expect(FreeBets).toHaveBeenCalledTimes(1);
      });
      it("should call render BetslipBetSummary for multibetbuilder with FreeBetsLabel", () => {
        renderSportsbookReceiptPanel({
          multiBetBuilder: MULTI_BET_BUILDER_WITH_BONUS_MOCK,
        });
        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          1,
          {
            title: "Double",
            odds: "10.10",
            stake: "€4",
            returns: "€10",
            hasAccaInsurance: false,
            hasShownReceiptIds: false,
            hasMyOddsBoost: true,
            previousOdds: "9.9",
            previousValue: undefined,
            hasBonusUsed: true,
            generosityAlertMessage: "",
            generosityIconName: "",
            freeBetsLabel: "freeBetsLabel",
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
          },
          undefined,
        );
      });
    });

    describe("when generosityAlertMessage is available", () => {
      it("should call render BetslipBetSummary with generosityAlertMessage", () => {
        renderSportsbookReceiptPanel({
          singles: SINGLES_WITH_BONUS_WALLETS_MOCK,
          multiples: MULTIPLES_WITH_BONUS_WALLETS_MOCK,
          casts: CAST_WITH_BONUS_WALLETS_MOCK,
          multiBetBuilder: MULTI_BET_BUILDER_BONUS_WALLETS_MOCK,
        });

        expect(BetslipBetSummary).toHaveBeenCalledTimes(3);

        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            generosityAlertMessage: "generosityAlertMessage",
            generosityIconName: "Value--Free-Bet",
          }),
          undefined,
        );

        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            generosityAlertMessage: "generosityAlertMessage1",
            generosityIconName: "Value--Free-Bet",
          }),
          undefined,
        );

        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          3,
          expect.objectContaining({
            generosityAlertMessage: "generosityAlertMessage2",
            generosityIconName: "Value--Free-Bet",
          }),
          undefined,
        );

        expect(BetSportsbookReceipt).toHaveBeenCalledTimes(2);

        expect(BetSportsbookReceipt).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            generosityAlertMessage: "generosityAlertMessage1",
            generosityIconName: "Value--Free-Bet",
          }),
          undefined,
        );

        expect(BetSportsbookReceipt).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            generosityAlertMessage: "generosityAlertMessage2",
            generosityIconName: "Value--Free-Bet",
          }),
          undefined,
        );

        expect(Alert).toHaveBeenNthCalledWith(
          2,
          {
            message: "generosityAlertMessage1",
            showCloseIcon: false,
            type: "GENEROSITY",
            iconOverload: "Value--Free-Bet",
          },
          undefined,
        );
        expect(Alert).toHaveBeenNthCalledWith(
          3,
          {
            message: "generosityAlertMessage2",
            showCloseIcon: false,
            type: "GENEROSITY",
            iconOverload: "Value--Free-Bet",
          },
          undefined,
        );
      });
    });
  });

  describe("BetsSummary", () => {
    it("should build summary with given values", () => {
      renderSportsbookReceiptPanel({ isSummaryDisabled: true });

      const [callArgs] = BetsSummary.mock.calls[0];

      expect(callArgs.totalStakeLabel).toEqual("Some totalStakeLabel");
      expect(callArgs.totalReturnsLabel).toEqual("Some totalReturnsLabel");
      expect(callArgs.totalReturns).toEqual("Some potentialReturns");
      expect(callArgs.totalOriginalReturns).toEqual("Some totalOriginalReturns");
      expect(callArgs.totalStake).toEqual("Some totalStake");
      expect(callArgs.disabled).toEqual(true);
      expect(BetsSummary).toHaveBeenCalledTimes(1);
    });
  });

  describe("singles", () => {
    function setup({ callNumber }) {
      renderSportsbookReceiptPanel({ singles: SINGLES_MOCK });

      return BetSportsbookReceipt.mock.calls[callNumber][0];
    }

    it("should build two single bet receipts", () => {
      setup({ callNumber: 0 });

      expect(BetSportsbookReceipt).toHaveBeenCalledTimes(2);
    });

    it("should not call with freeBets", () => {
      const { hasBonusUsed } = setup({ callNumber: 0 });

      expect(hasBonusUsed).toBe(false);
    });

    describe("first single receipt", () => {
      it("should call with title", () => {
        const { title } = setup({ callNumber: 0 });

        expect(title).toEqual("Benfica");
      });

      it("should call with subtitle", () => {
        const { subtitle } = setup({ callNumber: 0 });

        expect(subtitle).toEqual("Match Odds - Benfica v Porto");
      });

      it("should call with odds", () => {
        const { odds } = setup({ callNumber: 0 });

        expect(odds).toEqual("13/5");
      });

      it("should call with previousOdds", () => {
        const { previousOdds } = setup({ callNumber: 0 });

        expect(previousOdds).toEqual("12/6");
      });

      it("should call with segmentsIcon", () => {
        const { segmentsIcon } = setup({ callNumber: 0 });

        expect(segmentsIcon).toEqual(SEGMENTS_ICON_MOCK);
      });

      it("should call with stake", () => {
        const { stake } = setup({ callNumber: 0 });

        expect(stake).toEqual("€10.00");
      });

      it("should call with profitOrLiability", () => {
        const { profitOrLiability } = setup({ callNumber: 0 });

        expect(profitOrLiability).toEqual("€34");
      });

      it("should call with previousProfitOrLiability", () => {
        const { previousProfitOrLiability } = setup({ callNumber: 0 });

        expect(previousProfitOrLiability).toEqual("€28");
      });

      it("should call with i18n labels", () => {
        const { oddsLabel, stakeLabel, profitOrLiabilityLabel } = setup({ callNumber: 0 });

        expect(oddsLabel).toEqual("Some oddsLabel");
        expect(stakeLabel).toEqual("Some stakeLabel");
        expect(profitOrLiabilityLabel).toEqual("Some returnsLabel");
      });

      it("should not call with freeBets", () => {
        const { hasBonusUsed } = setup({ callNumber: 0 });

        expect(hasBonusUsed).toBe(false);
      });

      it("should NOT call with silkIcon", () => {
        const { silkIcon } = setup({ callNumber: 0 });

        expect(silkIcon).toBeUndefined();
      });

      it("should NOT call with silkIconAlt", () => {
        const { silkIconAlt } = setup({ callNumber: 0 });

        expect(silkIconAlt).toBeUndefined();
      });

      it("should NOT call with silkFallbackIconType", () => {
        const { silkFallbackIconType } = setup({ callNumber: 0 });

        expect(silkFallbackIconType).toBeUndefined();
      });

      it("should call with hasEachWay", () => {
        const { hasEachWay } = setup({ callNumber: 0 });

        expect(hasEachWay).toBe(true);
      });

      it("should call with eachWayLabel", () => {
        const { eachWayLabel } = setup({ callNumber: 0 });

        expect(eachWayLabel).toBe("eachWayLabel");
      });

      it("should call with eachWaySubtitle", () => {
        const { eachWaySubtitle } = setup({ callNumber: 0 });

        expect(eachWaySubtitle).toBe("eachWaySubtitle");
      });

      it("should call with hasMyOddsBoost", () => {
        const { hasMyOddsBoost } = setup({ callNumber: 0 });

        expect(hasMyOddsBoost).toBe(true);
      });

      it("should call with isPriceBoosted", () => {
        const { isPriceBoosted } = setup({ callNumber: 0 });

        expect(isPriceBoosted).toBe(true);
      });

      it("should call with selectionTypeIcon", () => {
        const { selectionTypeIcon } = setup({ callNumber: 0 });

        expect(selectionTypeIcon).toBe("fakeIcon");
      });
    });

    describe("second single receipt", () => {
      it("should call with title", () => {
        const { title } = setup({ callNumber: 1 });

        expect(title).toEqual("Ermesinde");
      });

      it("should call with subtitle", () => {
        const { subtitle } = setup({ callNumber: 1 });

        expect(subtitle).toEqual("Match Odds - Boavista v Ermesinde");
      });

      it("should call with odds", () => {
        const { odds } = setup({ callNumber: 1 });

        expect(odds).toEqual("2.5");
      });

      it("should call with stake", () => {
        const { stake } = setup({ callNumber: 1 });

        expect(stake).toEqual("€4.00");
      });

      it("should call with profitOrLiability", () => {
        const { profitOrLiability } = setup({ callNumber: 1 });

        expect(profitOrLiability).toEqual("€10");
      });

      it("should call with previousProfitOrLiability", () => {
        const { previousProfitOrLiability } = setup({ callNumber: 1 });

        expect(previousProfitOrLiability).toBeUndefined();
      });

      it("should call with i18n labels", () => {
        const { oddsLabel, stakeLabel, profitOrLiabilityLabel } = setup({ callNumber: 1 });

        expect(oddsLabel).toEqual("Some oddsLabel");
        expect(stakeLabel).toEqual("Some stakeLabel");
        expect(profitOrLiabilityLabel).toEqual("Some returnsLabel");
      });

      it("should call with icon", () => {
        const { icon } = setup({ callNumber: 1 });

        expect(icon).toEqual(SILK_ICON_MOCK);
      });

      it("should call with silkIconAlt", () => {
        const { silkIconAlt } = setup({ callNumber: 1 });

        expect(silkIconAlt).toEqual("silkIconAltMock");
      });

      it("should call with silkFallbackIconType", () => {
        const { silkFallbackIconType } = setup({ callNumber: 1 });

        expect(silkFallbackIconType).toEqual(FallbackIconType.HorseRacing);
      });

      it("should call with hasEachWay", () => {
        const { hasEachWay } = setup({ callNumber: 1 });

        expect(hasEachWay).toBe(false);
      });

      it("should call with eachWayLabel", () => {
        const { eachWayLabel } = setup({ callNumber: 1 });

        expect(eachWayLabel).toBe("eachWayLabel");
      });

      it("should call with hasMyOddsBoost", () => {
        const { hasMyOddsBoost } = setup({ callNumber: 1 });

        expect(hasMyOddsBoost).toBe(false);
      });

      it("should call with eachWaySubtitle", () => {
        const { eachWaySubtitle } = setup({ callNumber: 1 });

        expect(eachWaySubtitle).toBe("");
      });

      it("should call with isPriceBoosted", () => {
        const { isPriceBoosted } = setup({ callNumber: 1 });

        expect(isPriceBoosted).toBe(false);
      });
    });

    describe("when hasShownReceiptIds is true", () => {
      it("should render the BetInfo component", () => {
        renderSportsbookReceiptPanel({
          singles: SINGLES_MOCK,
          multiples: [],
          casts: [],
          betBuilders: [],
          multiBetBuilder: [],
          hasShownReceiptIds: true,
        });

        expect(BetInfo).toHaveBeenCalledTimes(2);

        expect(BetInfo).toHaveBeenNthCalledWith(
          1,
          {
            items: [
              {
                copyContent: {
                  label: "123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
        expect(BetInfo).toHaveBeenNthCalledWith(
          2,
          {
            items: [
              {
                copyContent: {
                  label: "124",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-124",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
      });
    });

    describe("Odds Boost Icon", () => {
      describe("when isPriceBoosted is true", () => {
        describe("when hasBoostSignposting is true", () => {
          it("should render StatusLabel with correct props", () => {
            renderSportsbookReceiptPanel({ singles: [SINGLES_WITH_BOOST_MOCK[0]], hasBoostSignposting: true });

            expect(StatusLabel).toHaveBeenCalledTimes(1);
            expect(StatusLabel).toHaveBeenCalledWith(
              {
                iconName: ValueIconName.PRICE_BOOST,
                statusLabelType: StatusLabelType.ALTERNATIVE_BRANDED,
                statusLabelSize: StatusLabelSizeType.MEDIUM,
                text: "Price Boost",
              },
              undefined,
            );
          });
        });

        describe("when hasBoostSignposting is false", () => {
          it("should not render GenericIcon", () => {
            renderSportsbookReceiptPanel({ singles: [SINGLES_WITH_BOOST_MOCK[0]], hasBoostSignposting: false });

            expect(StatusLabel).not.toHaveBeenCalled();
          });
        });
      });

      describe("when isPriceBoosted is false", () => {
        describe("when hasBoostSignposting is true", () => {
          it("should not render GenericIcon", () => {
            renderSportsbookReceiptPanel({ singles: [SINGLES_WITH_BOOST_MOCK[1]], hasBoostSignposting: true });

            expect(StatusLabel).not.toHaveBeenCalled();
          });
        });

        describe("when hasBoostSignposting is false", () => {
          it("should not render GenericIcon", () => {
            renderSportsbookReceiptPanel({ singles: [SINGLES_WITH_BOOST_MOCK[1]], hasBoostSignposting: false });

            expect(StatusLabel).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("one line bets", () => {
    function setup({ callNumber }) {
      renderSportsbookReceiptPanel({ singles: [], oneLineBets: ONE_LINE_MOCK });

      return BetSportsbookReceipt.mock.calls[callNumber][0];
    }

    it("should build one line bet receipts", () => {
      const receipt = setup({ callNumber: 0 });

      expect(BetSportsbookReceipt).toHaveBeenCalledTimes(1);
      expect(receipt.title).toEqual(expect.any(Object));
    });

    it("should not call with freeBets", () => {
      const { hasBonusUsed } = setup({ callNumber: 0 });

      expect(hasBonusUsed).toBe(false);
    });

    describe("one line bet receipt", () => {
      it("should call title with an object in", () => {
        const { title } = setup({ callNumber: 0 });

        expect(title.type).toBe(LottoSelections);
      });

      it("should call with subtitle", () => {
        const { subtitle } = setup({ callNumber: 0 });

        expect(subtitle).toEqual("UK 49s - Lunchtime Draw");
      });

      it("should call with odds", () => {
        const { odds } = setup({ callNumber: 0 });

        expect(odds).toEqual("5/1");
      });

      it("should call with stake", () => {
        const { stake } = setup({ callNumber: 0 });

        expect(stake).toEqual("€10.00");
      });

      it("should call with profitOrLiability", () => {
        const { profitOrLiability } = setup({ callNumber: 0 });

        expect(profitOrLiability).toEqual("€34");
      });

      it("should call with i18n labels", () => {
        const { oddsLabel, stakeLabel, profitOrLiabilityLabel, eachWayLabel } = setup({
          callNumber: 0,
        });

        expect(oddsLabel).toEqual("Some oddsLabel");
        expect(stakeLabel).toEqual("Some stakeLabel");
        expect(profitOrLiabilityLabel).toEqual("Some returnsLabel");
        expect(eachWayLabel).toBe("eachWayLabel");
      });

      it("should not call with freeBets", () => {
        const { hasBonusUsed } = setup({ callNumber: 0 });

        expect(hasBonusUsed).toBe(false);
      });

      it("should call with hasEachWay always false", () => {
        const { hasEachWay } = setup({ callNumber: 0 });

        expect(hasEachWay).toBe(false);
      });

      it("should call with eachWaySubtitle", () => {
        const { eachWaySubtitle } = setup({ callNumber: 0 });

        expect(eachWaySubtitle).toBe("");
      });

      it("should call with hasMyOddsBoost always false", () => {
        const { hasMyOddsBoost } = setup({ callNumber: 0 });

        expect(hasMyOddsBoost).toBe(false);
      });

      it("should call with isPriceBoosted always false", () => {
        const { isPriceBoosted } = setup({ callNumber: 0 });

        expect(isPriceBoosted).toBe(false);
      });

      it("should call with selectionTypeIcon", () => {
        const { selectionTypeIcon } = setup({ callNumber: 0 });

        expect(selectionTypeIcon).toBe("fakeIcon");
      });
    });

    describe("when hasShownReceiptIds is true", () => {
      it("should render the BetInfo component", () => {
        renderSportsbookReceiptPanel({
          singles: [],
          multiples: [],
          oneLineBets: ONE_LINE_MOCK,
          casts: [],
          betBuilders: [],
          multiBetBuilder: [],
          hasShownReceiptIds: true,
        });

        expect(BetInfo).toHaveBeenCalledTimes(1);

        expect(BetInfo).toHaveBeenCalledWith(
          {
            items: [
              {
                copyContent: {
                  label: "123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
      });
    });
  });

  describe("multiples", () => {
    describe("when building the selections", () => {
      it("should use multiples composition", () => {
        renderSportsbookReceiptPanel();

        expect(BetSelections).toHaveBeenCalledTimes(1);
        expect(BetSelections).toHaveBeenCalledWith(
          {
            selections: SELECTIONS_MOCK,
            title: "Some selectionsLabel",
            onTitleClick: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when building the summaries", () => {
      function setup({ callNumber }) {
        renderSportsbookReceiptPanel();

        return BetslipBetSummary.mock.calls[callNumber][0];
      }

      it("should build two combination multiples", () => {
        setup({ callNumber: 0 });

        expect(BetslipBetSummary).toHaveBeenCalledTimes(2);
      });

      describe("first combination summary", () => {
        it("should call with title", () => {
          const { title } = setup({ callNumber: 0 });

          expect(title).toEqual("Trebles");
        });

        it("should call with odds", () => {
          const { odds } = setup({ callNumber: 0 });

          expect(odds).toEqual("2");
        });

        it("should call with stake", () => {
          const { stake } = setup({ callNumber: 0 });

          expect(stake).toEqual("€2.00");
        });

        it("should call with returns", () => {
          const { returns } = setup({ callNumber: 0 });

          expect(returns).toEqual("€4");
        });

        it("should call with hasEachWay", () => {
          const { hasEachWay } = setup({ callNumber: 0 });

          expect(hasEachWay).toEqual(true);
        });

        it("should call with lines", () => {
          const { lines } = setup({ callNumber: 0 });

          expect(lines).toEqual(2);
        });

        it("should call with hasAccaInsurance", () => {
          const { hasAccaInsurance } = setup({ callNumber: 0 });

          expect(hasAccaInsurance).toEqual(true);
        });

        it("should call with i18n labels", () => {
          const { i18n } = setup({ callNumber: 0 });

          expect(i18n).toEqual({
            oddsLabel: "Some oddsLabel",
            returnsLabel: "Some returnsLabel",
            stakeLabel: "Some stakeLabel",
            eachWayLabel: "eachWayLabel",
            accaInsuranceLabel: "accaInsuranceLabel",
            linesLabel: "linesLabel",
          });
        });
      });

      describe("second combination summary", () => {
        it("should call with title", () => {
          const { title } = setup({ callNumber: 1 });

          expect(title).toEqual("Canadian");
        });

        it("should call with odds", () => {
          const { odds } = setup({ callNumber: 1 });

          expect(odds).toEqual("2.5");
        });

        it("should call with stake", () => {
          const { stake } = setup({ callNumber: 1 });

          expect(stake).toEqual("€4.00");
        });

        it("should call with returns", () => {
          const { returns } = setup({ callNumber: 1 });

          expect(returns).toEqual("€10");
        });

        it("should call with hasEachWay", () => {
          const { hasEachWay } = setup({ callNumber: 1 });

          expect(hasEachWay).toEqual(false);
        });

        it("should call with lines", () => {
          const { lines } = setup({ callNumber: 1 });

          expect(lines).toEqual(1);
        });

        it("should call with hasAccaInsurance", () => {
          const { hasAccaInsurance } = setup({ callNumber: 1 });

          expect(hasAccaInsurance).toEqual(false);
        });

        it("should call with myOddsBoost", () => {
          const { hasMyOddsBoost } = setup({ callNumber: 1 });

          expect(hasMyOddsBoost).toEqual(true);
        });

        it("should call with i18n labels", () => {
          const { i18n } = setup({ callNumber: 1 });

          expect(i18n).toEqual({
            oddsLabel: "Some oddsLabel",
            returnsLabel: "Some returnsLabel",
            stakeLabel: "Some stakeLabel",
            eachWayLabel: "eachWayLabel",
            accaInsuranceLabel: "accaInsuranceLabel",
            linesLabel: "linesLabel",
          });
        });
      });
    });

    describe("when hasShownReceiptIds is true", () => {
      it("should render the BetInfo component", () => {
        renderSportsbookReceiptPanel({
          multiples: MULTIPLES_MOCK,
          singles: [],
          casts: [],
          betBuilders: [],
          multiBetBuilder: [],
          hasShownReceiptIds: true,
        });

        expect(BetInfo).toHaveBeenCalledTimes(2);

        expect(BetInfo).toHaveBeenNthCalledWith(
          1,
          {
            items: [
              {
                copyContent: {
                  label: "123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
        expect(BetInfo).toHaveBeenNthCalledWith(
          2,
          {
            items: [
              {
                copyContent: {
                  label: "124",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-124",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
      });
    });
  });

  describe("cast bets", () => {
    describe("when there are no cast bets", () => {
      it("should not create a DraggableList", () => {
        renderSportsbookReceiptPanel({ casts: [] });

        expect(DraggableList).not.toHaveBeenCalled();
      });
      it("should not create a BetSegments", () => {
        renderSportsbookReceiptPanel({ casts: [] });

        expect(BetSegments).not.toHaveBeenCalled();
      });
    });

    describe("when there are cast bets", () => {
      it("should create a read-only BetslipCastBet for each cast bet and a ForecastTricastSelection for each selection", () => {
        renderSportsbookReceiptPanel();

        expect(BetslipCastBet).toHaveBeenNthCalledWith(
          1,
          {
            isDesktop: false,
            title: "4:20 Winterfell",
            subtitle: "Straight Forecast",
            controls: expect.anything(),
            runners: expect.any(Array),
          },
          undefined,
        );
        expect(BetslipCastBet).toHaveBeenNthCalledWith(
          2,
          {
            isDesktop: false,
            title: "14:00 King's Landing",
            subtitle: "Reverse Forecast",
            controls: expect.anything(),
            runners: expect.any(Array),
          },
          undefined,
        );

        expect(ForecastTricastSelection).toHaveBeenNthCalledWith(
          1,
          {
            id: "selection-id-1",
            position: 1,
            positionOrdinal: "st",
            horse: "some horse",
            icon: expect.any(Object),
          },
          undefined,
        );
        expect(ForecastTricastSelection).toHaveBeenNthCalledWith(
          2,
          {
            id: "selection-id-2",
            position: 2,
            positionOrdinal: "nd",
            horse: "another horse",
            icon: expect.any(Object),
          },
          undefined,
        );
        expect(ForecastTricastSelection).toHaveBeenNthCalledWith(
          3,
          {
            id: "selection-id-1",
            position: 1,
            positionOrdinal: "st",
            horse: "some horse",
            icon: expect.any(Object),
          },
          undefined,
        );
        expect(ForecastTricastSelection).toHaveBeenNthCalledWith(
          4,
          {
            id: "selection-id-2",
            position: 2,
            positionOrdinal: "nd",
            horse: "another horse",
            icon: expect.any(Object),
          },
          undefined,
        );
      });

      it("should create a BetSegments for each cast bet", () => {
        renderSportsbookReceiptPanel();

        expect(BetSegments).toHaveBeenNthCalledWith(
          1,
          {
            leftLabel: "linesLabel",
            leftValue: "2",
            midLabel: "Some stakeLabel",
            midValue: "€4",
            rightLabel: "Some returnsLabel",
            rightValue: "€10",
          },
          undefined,
        );
        expect(BetSegments).toHaveBeenNthCalledWith(
          2,
          {
            leftLabel: "linesLabel",
            leftValue: "2",
            midLabel: "Some stakeLabel",
            midValue: "€4",
            rightLabel: "Some returnsLabel",
            rightValue: "€10",
          },
          undefined,
        );
      });
    });

    describe("when hasShownReceiptIds is true", () => {
      it("should render the BetInfo component", () => {
        renderSportsbookReceiptPanel({
          casts: CASTS_MOCK,
          multiples: [],
          singles: [],
          betBuilders: [],
          multiBetBuilder: [],
          hasShownReceiptIds: true,
        });

        expect(BetInfo).toHaveBeenCalledTimes(2);

        expect(BetInfo).toHaveBeenNthCalledWith(
          1,
          {
            items: [
              {
                copyContent: {
                  label: "123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
        expect(BetInfo).toHaveBeenNthCalledWith(
          2,
          {
            items: [
              {
                copyContent: {
                  label: "124",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-124",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
      });
    });
  });

  describe("bet builders", () => {
    describe("when there are bet builders", () => {
      it("should call BetBuilderSummary for each", () => {
        renderSportsbookReceiptPanel();

        expect(BetBuilderSummary).toHaveBeenNthCalledWith(
          1,
          {
            bet: {
              id: "B-1",
              title: "A v B",
              type: "Double",
              selections: BET_BUILDER_SELECTIONS_MOCK,
              selectionsLabel: "2 Selections",
              odds: "10.10",
              stake: "€4",
              returns: "€10",
              betReceiptId: "123",
              regulatorId: "X-123",
              hasMyOddsBoost: false,
            },
            labels: {
              odds: "Some oddsLabel",
              stake: "Some stakeLabel",
              returns: "Some returnsLabel",
            },
            hasShownReceiptIds: false,
          },
          undefined,
        );
        expect(BetBuilderSummary).toHaveBeenNthCalledWith(
          2,
          {
            bet: {
              id: "B-2",
              title: "A v B",
              type: "Double",
              selections: BET_BUILDER_SELECTIONS_MOCK,
              selectionsLabel: "2 Selections",
              odds: "10.10",
              stake: "€4",
              returns: "€10",
              betReceiptId: "124",
              regulatorId: "X-124",
              hasMyOddsBoost: true,
              previousOdds: "9.9",
            },
            labels: {
              odds: "Some oddsLabel",
              stake: "Some stakeLabel",
              returns: "Some returnsLabel",
            },
            hasShownReceiptIds: false,
          },
          undefined,
        );
      });
    });

    describe("when hasShownReceiptIds is true", () => {
      it("should render the BetInfo component", () => {
        renderSportsbookReceiptPanel({
          betBuilders: BET_BUILDERS_MOCK,
          multiples: [],
          singles: [],
          casts: [],
          multiBetBuilder: [],
          hasShownReceiptIds: true,
        });

        expect(BetInfo).toHaveBeenCalledTimes(2);

        expect(BetInfo).toHaveBeenNthCalledWith(
          1,
          {
            items: [
              {
                copyContent: {
                  label: "123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
        expect(BetInfo).toHaveBeenNthCalledWith(
          2,
          {
            items: [
              {
                copyContent: {
                  label: "124",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-124",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
      });
    });
  });

  describe("multi bet builder", () => {
    describe("when there is a multi bet builder", () => {
      it("should call BetBuilderSummary with the details", () => {
        renderSportsbookReceiptPanel({ multiBetBuilder: MULTI_BET_BUILDER_MOCK });

        expect(BetslipBetSummary).toHaveBeenNthCalledWith(
          1,
          {
            title: "Double",
            odds: "10.10",
            stake: "€4",
            returns: "€10",
            hasAccaInsurance: false,
            hasShownReceiptIds: false,
            hasMyOddsBoost: true,
            previousOdds: "9.9",
            previousValue: undefined,
            hasBonusUsed: false,
            generosityAlertMessage: "",
            generosityIconName: "",
            freeBetsLabel: "",
            i18n: {
              eachWayLabel: "eachWayLabel",
              linesLabel: "linesLabel",
              oddsLabel: "Some oddsLabel",
              returnsLabel: "Some returnsLabel",
              stakeLabel: "Some stakeLabel",
              accaInsuranceLabel: "accaInsuranceLabel",
            },
          },
          undefined,
        );
      });

      it("should call SelectionsBoard with the title", () => {
        renderSportsbookReceiptPanel({ multiBetBuilder: MULTI_BET_BUILDER_MOCK });

        expect(SelectionsBoard).toHaveBeenCalledWith(
          {
            title: "Double",
            theme: SelectionsBoardTheme.Blue,
            children: expect.any(Object),
          },
          undefined,
        );
      });

      describe("when there are groups", () => {
        it("should call SelectionsBoardSection per group", () => {
          renderSportsbookReceiptPanel({
            multiBetBuilder: MULTI_BET_BUILDER_MOCK,
            multiBetBuilderGroups: MULTI_BET_BUILDER_GROUPS_MOCK,
          });

          expect(SelectionsBoardSection).toHaveBeenNthCalledWith(
            1,
            {
              title: "Event 1",
              children: expect.any(Array),
            },
            undefined,
          );
          expect(SelectionsBoardSection).toHaveBeenNthCalledWith(
            2,
            {
              title: "Event 2",
              children: expect.any(Array),
            },
            undefined,
          );
        });

        describe("when listing selections", () => {
          describe("when listing the first selection", () => {
            it("should call BetSelectionDetails with the correct title, subtitle, is90min and icon", () => {
              renderSportsbookReceiptPanel({
                multiBetBuilder: MULTI_BET_BUILDER_MOCK,
                multiBetBuilderGroups: MULTI_BET_BUILDER_GROUPS_MOCK,
              });

              expect(BetSelectionDetails).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                  title: "Selection 1",
                  subtitle: "Market name - Event name",
                  is90Min: true,
                  icon: expect.any(Object),
                }),
                undefined,
              );

              expect(SilkWrapper).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                  silkUrl: "silkUrl1",
                  silkFallbackType: "HORSE_RACING",
                }),
                undefined,
              );
            });

            describe("when the selectionTypeIcon is passed", () => {
              it("should call BetSelectionDetails with the correct selectionTypeIcon", () => {
                renderSportsbookReceiptPanel({
                  multiBetBuilder: MULTI_BET_BUILDER_MOCK,
                  multiBetBuilderGroups: {
                    ...MULTI_BET_BUILDER_GROUPS_MOCK,
                    "event:urn:1": {
                      ...MULTI_BET_BUILDER_GROUPS_MOCK["event:urn:1"],
                      selections: [
                        {
                          ...MULTI_BET_BUILDER_GROUPS_MOCK["event:urn:1"].selections[0],
                          selectionTypeIcon: "FakeIcon",
                        },
                      ],
                    },
                  },
                });

                expect(BetSelectionDetails).toHaveBeenNthCalledWith(
                  1,
                  expect.objectContaining({
                    selectionTypeIcon: "FakeIcon",
                  }),
                  undefined,
                );
              });
            });
          });
        });
      });
    });

    describe("when there is no multi bet builder", () => {
      it("should not render the section", () => {
        renderSportsbookReceiptPanel({ multiBetBuilder: null });

        expect(SelectionsBoard).not.toHaveBeenCalled();
      });
    });

    describe("when hasShownReceiptIds is true", () => {
      it("should render the BetInfo component", () => {
        renderSportsbookReceiptPanel({
          multiBetBuilder: MULTI_BET_BUILDER_MOCK,
          betBuilders: [],
          multiples: [],
          singles: [],
          casts: [],
          hasShownReceiptIds: true,
        });
        expect(SelectionsBoard).toHaveBeenCalledTimes(1);
        expect(BetInfo).toHaveBeenCalledTimes(1);

        expect(BetInfo).toHaveBeenNthCalledWith(
          1,
          {
            items: [
              {
                copyContent: {
                  label: "123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "betReceiptIdLabel",
              },
              {
                copyContent: {
                  label: "X-123",
                  onCopy: expect.any(Function),
                },
                mode: BetInfoItemMode.WITH_COPY,
                title: "regulatorBetIdLabel",
              },
            ],
          },
          undefined,
        );
      });
    });
  });

  describe("re-use selections", () => {
    describe("when a bet is defined", () => {
      it("should call SportsbookBetButton", () => {
        renderSportsbookReceiptPanel({
          i18n: { reUseSelectionsLabel: "reUseSelectionsLabel" },
        });

        expect(SportsbookBetButton).toHaveBeenCalledWith(
          {
            animated: false,
            onClick: expect.any(Function),
            label: "reUseSelectionsLabel",
            icon: SystemIconName.ACC_ADD,
          },
          undefined,
        );
      });
    });
  });

  describe("top content", () => {
    describe("is undefined", () => {
      it("should not render top content", () => {
        renderSportsbookReceiptPanel();

        expect(SkyBetClubTracker).not.toHaveBeenCalled();
      });
    });

    describe("is null", () => {
      it("should not render top content", () => {
        renderSportsbookReceiptPanel({
          skyBetClubTrackerCard: null,
        });

        expect(SkyBetClubTracker).not.toHaveBeenCalled();
      });
    });

    describe("is the sky bet club tracker", () => {
      const skyBetClubTrackerProps = {
        current: 0,
        target: 30,
        sbcStatus: TrackingBarStatus.PENDING,
        fulfilled: false,
        counterLabel: "£0/£30",
        bannerCardTrackerSectionIconPath: "/images/sbc_logo_simplified_V5.png",
        i18n: {
          firstLinePartOne: "Checking your",
          firstLinePartTwo: " Sky Bet Club Status...",
          secondLine: " left to qualify for your reward",
          infoLabelDays: " 3 days",
          primaryButtonLabel: "Go to Sky Bet Club",
          highlightedSupportingText: "Free Bet credited by 7pm Monday.",
          supportingText:
            " Free bet stakes are not returned. Free bet is non-withdrawable. No free bet expiry. Eligibility restrictions apply. Further T&Cs apply.",
        },
      };

      it("should render sky bet club tracker as top content", () => {
        renderSportsbookReceiptPanel({
          topContent: <SkyBetClubTracker {...skyBetClubTrackerProps} />,
        });

        expect(SkyBetClubTracker).toHaveBeenCalledTimes(1);
      });
    });
  });
});
