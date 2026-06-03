import { useContext } from "react";
import { render, act } from "@testing-library/react-native";
import { navigateDeposit } from "@ppb/tbd-router/native";
import { SecondaryButton } from "@ppb/the-wall-native";
import { SportsbookPlacePanelContentLayout } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";
import { SportsbookPlacePanel } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.native";
import { BetslipSection } from "../Betslip.types";
import { getEndpoint } from "../../../config/endpoints";

import { SportsbookConfirm } from "./SportsbookConfirm.native";

const mockedUseContext = {
  setFocusedKeyboardControls: jest.fn(),
  setIsBetConfirmationStep: jest.fn(),
  isDesktopLayout: false,
};

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => mockedUseContext),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

const mockLogin = jest.fn();
jest.mock("../../../hooks/useLoginWithPendingState.native", () => ({
  __esModule: true,
  default: jest.fn(() => mockLogin),
}));

jest.mock("@ppb/the-wall-native", () => ({
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));

jest.mock("../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.native", () => ({
  SportsbookPlacePanel: jest.fn(({ secondaryButton }) => (
    <sportsbook-place-panel-mock>{secondaryButton}</sportsbook-place-panel-mock>
  )),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateDeposit: jest.fn(),
}));
jest.mock("../../../config/endpoints");

jest.mock("../SinglesCard", () => jest.fn(({ props }) => <connected-singles-card-mock {...props} />));
jest.mock("../SinglesCard/SinglesCard.native", () => ({
  SinglesCard: "single card mock",
}));

jest.mock("../OneLineMultiple", () => jest.fn(({ props }) => <connected-one-line-multiple-mock {...props} />));
jest.mock("../OneLineMultiple/OneLineMultiple.native", () => ({
  OneLineMultiple: "one line multiple card mock",
}));

jest.mock("../MultiLinesMultiples", () => jest.fn(({ props }) => <connected-multi-lines-multiples-mock {...props} />));
jest.mock("../MultiLinesMultiples/MultiLinesMultiples.native", () => ({
  MultiLinesMultiples: "multi line multiple card mock",
}));

jest.mock("../BetBuildersCard", () => jest.fn(({ props }) => <connected-bet-builders-card-mock {...props} />));
jest.mock("../BetBuildersCard/BetBuildersCard.native", () => ({
  BetBuildersCard: "bet builder card mock",
}));

jest.mock("../MultiBetBuilderCard", () => jest.fn(({ props }) => <connected-multi-bet-builder-card-mock {...props} />));
jest.mock("../MultiBetBuilderCard/MultiBetBuilderCard.native", () => ({
  MultiBetBuilderCard: "multi bet builder card mock",
}));

jest.mock("../CastBetsCard", () => jest.fn(({ props }) => <connected-cast-bets-card-mock {...props} />));
jest.mock("../CastBetsCard/CastBetsCard.native", () => ({
  CastBetsCard: "cast bets card mock",
}));

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

jest.mock("../withJurisdiction/withJurisdiction", () => ({
  withJurisdiction: jest.fn((component) => component),
}));

const commonLabelsI18NMock = {
  multiBetBuilder: "multi bet builder",
  betBuilder: "bet builder",
  multiples: "multiples",
  additionalMultiples: "additional multiples",
  casts: "casts mock",
  singles: "singles mock",
};

const sportsbooksConfirmI18NMock = {
  secondaryButtonLabel: "secondaryButtonLabelMock",
  ...commonLabelsI18NMock,
};

const sportsbookPlacePanelI18NMock = {
  totalReturns: "totalReturnsMock",
  removeLabel: "removeLabelMock",
  oddsLabel: "oddsLabelMock",
  stakeLabel: "stakeLabelMock",
  freeBetsLabel: "freeBetsLabelMock",
  oddsMovementUp: "oddsMovementUpMock",
  oddsMovementDown: "oddsMovementDownMock",
  eachWay: "eachWayMock",
  eachWaySubtitle: "eachWaySubtitleMock",
  ...commonLabelsI18NMock,
};

const betsWithTotalCombinedStakeMock = {
  [BetslipSection.bbMulti]: false,
  [BetslipSection.betBuilders]: false,
  [BetslipSection.oneLineMultiple]: false,
  [BetslipSection.multiLinesMultiples]: false,
  [BetslipSection.castBets]: false,
  [BetslipSection.singles]: true,
};

const singlesCardsOrderMock = {
  id: "Single",
  cardsOrder: [BetslipSection.singles],
};

const multiBetBuilderCardsOrderMock = {
  id: "MultiBetBuilder",
  cardsOrder: [BetslipSection.bbMulti],
};

const oneLineMultipleCardsOrderMock = {
  id: "OneLineMultiple",
  cardsOrder: [BetslipSection.oneLineMultiple],
};

const multiLineMultipleCardsOrderMock = {
  id: "MultiLineMultiple",
  cardsOrder: [BetslipSection.multiLinesMultiples],
};

const betBuilderCardsOrderMock = {
  id: "BetBuilder",
  cardsOrder: [BetslipSection.betBuilders],
};

const castBetCardsOrderMock = {
  id: "CastBet",
  cardsOrder: [BetslipSection.castBets],
};

const betslipCardsOrderMock = [singlesCardsOrderMock];

const sectionsInitialStateMock = {
  bbMulti: true,
  betBuilders: true,
  oneLineMultiple: true,
  multiLinesMultiples: true,
  castBets: true,
  singles: true,
};

const singleCardMock = {
  content: [
    {
      card: expect.any(Object),
      title: sportsbooksConfirmI18NMock.singles,
      startsOpen: true,
      collapsable: true,
    },
  ],
  id: "Single",
};

const betBuilderCardMock = {
  content: [
    {
      card: expect.any(Object),
      title: sportsbooksConfirmI18NMock.betBuilder,
      startsOpen: true,
      collapsable: true,
    },
  ],
  id: "BetBuilder",
};

const multiBetBuilderCardMock = {
  content: [
    {
      card: expect.any(Object),
      title: sportsbooksConfirmI18NMock.multiBetBuilder,
      startsOpen: true,
      collapsable: true,
    },
  ],
  id: "MultiBetBuilder",
};

const oneLineMultiCardMock = {
  content: [
    {
      card: expect.any(Object),
      title: sportsbooksConfirmI18NMock.multiples,
      startsOpen: true,
      collapsable: true,
    },
  ],
  id: "OneLineMultiple",
};

const multiLineMultiCardMock = {
  content: [
    {
      card: expect.any(Object),
      title: sportsbooksConfirmI18NMock.additionalMultiples,
      startsOpen: true,
      collapsable: true,
    },
  ],
  id: "MultiLineMultiple",
};

const castBetCardMock = {
  content: [
    {
      card: expect.any(Object),
      title: sportsbooksConfirmI18NMock.casts,
      startsOpen: true,
      collapsable: true,
    },
  ],
  id: "CastBet",
};

const defaultProps = {
  betBuilderIds: [],
  betslipCardsOrder: betslipCardsOrderMock,
  betsWithTotalCombinedStake: betsWithTotalCombinedStakeMock,
  contentLayout: SportsbookPlacePanelContentLayout.ACCORDION,
  hasPlaceError: false,
  sportsbooksConfirmI18N: sportsbooksConfirmI18NMock,
  sportsbookPlacePanelI18N: sportsbookPlacePanelI18NMock,
  isDepositRequired: false,
  isEligibleToBonus: true,
  isFreeBetsSelected: false,
  isFreeBetsDisabled: false,
  isLoggedIn: false,
  isOddsBoosted: false,
  isPanelDisabled: true,
  isPlaceDisabled: false,
  isSummaryDisabled: false,
  placeBtnLabel: "place mock",
  sectionsInitialState: sectionsInitialStateMock,
  totalOriginalReturns: "1.02",
  totalReturns: "1.14",
  placeBtnSecondaryLabel: "placeBtnSecondaryLabel",
  placeBtnLoadingLabel: "placeBtnLoadingLabel",
  reversePlaceBtnLabels: false,
  freeBetsAlertMessage: "freeBetsAlertMessage",
  balanceAfterBet: "balanceAfterBet",
};

function renderSportsbookConfirm({
  isLoggedIn,
  isDepositRequired,
  betsWithTotalCombinedStake = betsWithTotalCombinedStakeMock,
  betBuilderIds = [],
  sportsbooksConfirmI18N = sportsbooksConfirmI18NMock,
  sportsbookPlacePanelI18N = sportsbookPlacePanelI18NMock,
  betslipCardsOrder = betslipCardsOrderMock,
  sectionsInitialState = sectionsInitialStateMock,
  placeBtnLabel = "place mock",
  contentLayout = SportsbookPlacePanelContentLayout.ACCORDION,
  isEligibleToBonus = true,
  isFreeBetsSelected = false,
  isFreeBetsDisabled = false,
  isOddsBoosted = true,
  totalReturns = "1.14",
  totalOriginalReturns = "1.02",
  hasPlaceError = false,
  isPlaceDisabled = false,
  isSummaryDisabled = false,
  operatorRegulation,
  isPanelDisabled = false,
  placeBtnSecondaryLabel = "placeBtnSecondaryLabel",
  placeBtnLoadingLabel = "placeBtnLoadingLabel",
  reversePlaceBtnLabels = false,
  freeBetsAlertMessage = "freeBetsAlertMessage",
  balanceAfterBet = "balanceAfterBet",
  dispatchPlacement = jest.fn(),
  dispatchLoginToPlaceBetAction = jest.fn(),
  dispatchDepositRedirect = jest.fn(),
  dispatchEdit = jest.fn(),
  dispatchRemoveAll = jest.fn(),
  dispatchAccordionToggle = jest.fn(),
} = {}) {
  return render(
    <SportsbookConfirm
      isLoggedIn={isLoggedIn}
      isDepositRequired={isDepositRequired}
      betsWithTotalCombinedStake={betsWithTotalCombinedStake}
      betBuilderIds={betBuilderIds}
      sportsbooksConfirmI18N={sportsbooksConfirmI18N}
      sportsbookPlacePanelI18N={sportsbookPlacePanelI18N}
      betslipCardsOrder={betslipCardsOrder}
      sectionsInitialState={sectionsInitialState}
      placeBtnLabel={placeBtnLabel}
      contentLayout={contentLayout}
      isEligibleToBonus={isEligibleToBonus}
      isFreeBetsSelected={isFreeBetsSelected}
      isFreeBetsDisabled={isFreeBetsDisabled}
      isOddsBoosted={isOddsBoosted}
      totalReturns={totalReturns}
      totalOriginalReturns={totalOriginalReturns}
      hasPlaceError={hasPlaceError}
      isPlaceDisabled={isPlaceDisabled}
      isSummaryDisabled={isSummaryDisabled}
      operatorRegulation={operatorRegulation}
      isPanelDisabled={isPanelDisabled}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      freeBetsAlertMessage={freeBetsAlertMessage}
      balanceAfterBet={balanceAfterBet}
      dispatchPlacement={dispatchPlacement}
      dispatchLoginToPlaceBetAction={dispatchLoginToPlaceBetAction}
      dispatchDepositRedirect={dispatchDepositRedirect}
      dispatchEdit={dispatchEdit}
      dispatchRemoveAll={dispatchRemoveAll}
      dispatchAccordionToggle={dispatchAccordionToggle}
    />,
  );
}

describe("SportsbookConfirm", () => {
  afterEach(jest.clearAllMocks);

  describe("when it is contentLayout", () => {
    it("should pass down the contentLayout prop", () => {
      renderSportsbookConfirm({ contentLayout: SportsbookPlacePanelContentLayout.ACCORDION });

      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        expect.objectContaining({
          contentLayout: SportsbookPlacePanelContentLayout.ACCORDION,
        }),
        undefined,
      );
      expect(SportsbookPlacePanel).toHaveBeenCalledTimes(1);
    });
  });

  describe("when there is a multi bet builder", () => {
    it("should create a multi bet builder card", () => {
      renderSportsbookConfirm({
        betsWithTotalCombinedStake: { [BetslipSection.bbMulti]: true },
        betslipCardsOrder: [multiBetBuilderCardsOrderMock],
      });

      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        expect.objectContaining({
          betslipCards: [multiBetBuilderCardMock],
        }),
        undefined,
      );

      const multiBetBuilderCardProps = SportsbookPlacePanel.mock.calls[0][0].betslipCards[0].content[0].card.props;

      expect(multiBetBuilderCardProps).toEqual({
        component: "multi bet builder card mock",
      });
    });
  });

  describe("when there are combination bet builders", () => {
    it("should create bet builders card", () => {
      renderSportsbookConfirm({
        betBuilderIds: ["betBuilderId"],
        betslipCardsOrder: [betBuilderCardsOrderMock],
        betsWithTotalCombinedStake: { [BetslipSection.betBuilders]: true },
      });

      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        expect.objectContaining({
          betslipCards: [betBuilderCardMock],
        }),
        undefined,
      );

      const betBuilderCardProps = SportsbookPlacePanel.mock.calls[0][0].betslipCards[0].content[0].card.props;

      expect(betBuilderCardProps).toEqual({
        combinationIds: ["betBuilderId"],
        component: "bet builder card mock",
        failedCombinationGroups: [],
      });
    });
  });

  describe("when there is one line multiples", () => {
    it("should create one line multiples card", () => {
      renderSportsbookConfirm({
        betsWithTotalCombinedStake: { [BetslipSection.oneLineMultiple]: true },
        betslipCardsOrder: [oneLineMultipleCardsOrderMock],
      });

      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        expect.objectContaining({
          betslipCards: [oneLineMultiCardMock],
        }),
        undefined,
      );

      const oneLineMultipleCardProps = SportsbookPlacePanel.mock.calls[0][0].betslipCards[0].content[0].card.props;

      expect(oneLineMultipleCardProps).toEqual({
        component: "one line multiple card mock",
        hasOneLineMultiple: true,
      });
    });
  });

  describe("when there are multi lines multiples", () => {
    describe("and also has one line multiple bets", () => {
      it("should call multi lines multiples card with shouldRenderBetLegs as false", () => {
        renderSportsbookConfirm({
          betsWithTotalCombinedStake: {
            [BetslipSection.multiLinesMultiples]: true,
            [BetslipSection.oneLineMultiple]: true,
          },
          betslipCardsOrder: [multiLineMultipleCardsOrderMock],
        });

        expect(SportsbookPlacePanel).toHaveBeenCalledWith(
          expect.objectContaining({
            betslipCards: [multiLineMultiCardMock],
          }),
          undefined,
        );

        const multiLineMultipleCardProps = SportsbookPlacePanel.mock.calls[0][0].betslipCards[0].content[0].card.props;

        expect(multiLineMultipleCardProps).toEqual({
          component: "multi line multiple card mock",
          shouldRenderBetLegs: false,
        });
      });
    });
    describe("and does not have one line multiple bets", () => {
      it("should call multi lines multiples card with shouldRenderBetLegs as true", () => {
        renderSportsbookConfirm({
          betsWithTotalCombinedStake: {
            [BetslipSection.multiLinesMultiples]: true,
            [BetslipSection.oneLineMultiple]: false,
          },
          betslipCardsOrder: [multiLineMultipleCardsOrderMock],
        });

        expect(SportsbookPlacePanel).toHaveBeenCalledWith(
          expect.objectContaining({
            betslipCards: [multiLineMultiCardMock],
          }),
          undefined,
        );

        const multiLineMultipleCardProps = SportsbookPlacePanel.mock.calls[0][0].betslipCards[0].content[0].card.props;

        expect(multiLineMultipleCardProps).toEqual({
          component: "multi line multiple card mock",
          shouldRenderBetLegs: true,
        });
      });
    });
  });

  describe("when there are cast bets", () => {
    it("should create cast bets cards", () => {
      renderSportsbookConfirm({
        betsWithTotalCombinedStake: { [BetslipSection.castBets]: true },
        betslipCardsOrder: [castBetCardsOrderMock],
      });

      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        expect.objectContaining({
          betslipCards: [castBetCardMock],
        }),
        undefined,
      );

      const castBetCardProps = SportsbookPlacePanel.mock.calls[0][0].betslipCards[0].content[0].card.props;

      expect(castBetCardProps).toEqual({
        component: "cast bets card mock",
      });
    });
  });

  describe("when there are only singles bets", () => {
    it("should create singles bet cards", () => {
      renderSportsbookConfirm();

      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        expect.objectContaining({
          betslipCards: [singleCardMock],
        }),
        undefined,
      );

      const singleCardProps = SportsbookPlacePanel.mock.calls[0][0].betslipCards[0].content[0].card.props;

      expect(singleCardProps).toEqual({
        component: "single card mock",
        hasAvailabilityHints: true,
        shouldFocusStakeField: false,
      });
    });
  });

  describe("when it is the initial render", () => {
    describe("when there is all necessary data", () => {
      it("should call SportsbookPlacePanel", () => {
        renderSportsbookConfirm();

        expect(SportsbookPlacePanel).toHaveBeenCalledWith(
          {
            contentLayout: SportsbookPlacePanelContentLayout.ACCORDION,
            betslipCards: [singleCardMock],
            hasFreeBets: true,
            isFreeBetsSelected: false,
            isPanelDisabled: false,
            notifications: expect.anything(),
            totalReturns: "1.14",
            totalOriginalReturns: "1.02",
            hasPlaceError: true,
            isPlaceDisabled: false,
            isSummaryDisabled: false,
            isOddsBoosted: true,
            showAcceptOddsMovementAlert: false,
            isOddsMovementOn: false,
            oddsMovementLabels: { message: "", detailMessage: "" },
            placeBtnLabel: "place mock",
            i18n: sportsbookPlacePanelI18NMock,
            onPlaceClick: expect.any(Function),
            onRemoveAllClick: expect.any(Function),
            onCollapseToggle: expect.any(Function),
            secondaryButton: expect.anything(),
            onFreeBetsChange: expect.any(Function),
            onOddsMovementPreferencesChange: expect.any(Function),
            isFreeBetsDisabled: true,
            placeBtnSecondaryLabel: "placeBtnSecondaryLabel",
            placeBtnLoadingLabel: "placeBtnLoadingLabel",
            reversePlaceBtnLabels: false,
            freeBetsAlertMessage: "freeBetsAlertMessage",
            balanceAfterBet: "balanceAfterBet",
          },
          undefined,
        );
        expect(SportsbookPlacePanel).toHaveBeenCalledTimes(1);
      });
    });

    it("should not disable the secondary button", () => {
      renderSportsbookConfirm();

      expect(SecondaryButton).toHaveBeenCalledWith(
        {
          disabled: false,
          label: "secondaryButtonLabelMock",
          onTap: expect.any(Function),
        },
        undefined,
      );
    });

    describe("when isDepositRequired is true", () => {
      it("should pass hasPlaceError as true", () => {
        renderSportsbookConfirm({
          isDepositRequired: true,
          isLoggedIn: true,
        });

        expect(SportsbookPlacePanel).toHaveBeenCalledWith(
          expect.objectContaining({
            hasPlaceError: true,
          }),
          undefined,
        );
      });
    });

    describe("when isLoggedIn is true", () => {
      it("should pass hasPlaceError as false", () => {
        renderSportsbookConfirm({
          isLoggedIn: true,
        });

        expect(SportsbookPlacePanel).toHaveBeenCalledWith(
          expect.objectContaining({
            hasPlaceError: false,
          }),
          undefined,
        );
      });
    });

    describe("when performing interactions", () => {
      describe("onPlaceClick", () => {
        describe("when isPanelDisabled is true", () => {
          it("should disable the secondary button", () => {
            renderSportsbookConfirm({
              isPanelDisabled: true,
            });

            expect(SecondaryButton).toHaveBeenCalledWith(
              {
                disabled: true,
                label: "secondaryButtonLabelMock",
                onTap: expect.any(Function),
              },
              undefined,
            );
          });
        });

        describe("when isPanelDisabled changes to false", () => {
          it("should enable the secondary button", () => {
            const { rerender } = renderSportsbookConfirm({
              isPanelDisabled: true,
            });

            expect(SecondaryButton).toHaveBeenCalledTimes(1);
            expect(SecondaryButton).toHaveBeenCalledWith(
              {
                disabled: true,
                label: "secondaryButtonLabelMock",
                onTap: expect.any(Function),
              },
              undefined,
            );

            rerender(<SportsbookConfirm {...defaultProps} isPanelDisabled={false} />);

            expect(SecondaryButton).toHaveBeenCalledTimes(2);
            expect(SecondaryButton).toHaveBeenCalledWith(
              {
                disabled: false,
                label: "secondaryButtonLabelMock",
                onTap: expect.any(Function),
              },
              undefined,
            );
          });
        });

        describe("when logged in", () => {
          it("should call dispatchPlacement with the correct payload", () => {
            const dispatchPlacement = jest.fn();

            renderSportsbookConfirm({
              confirmFirst: true,
              isFreeBetsSelected: true,
              isLoggedIn: true,
              dispatchPlacement,
            });

            act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

            expect(dispatchPlacement).toHaveBeenCalledTimes(1);
          });
        });

        describe("when logged out", () => {
          it("should call dispatchLoginToPlaceBetAction", () => {
            const dispatchLoginToPlaceBetAction = jest.fn();
            renderSportsbookConfirm({ isLoggedIn: false, dispatchLoginToPlaceBetAction });

            act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

            expect(dispatchLoginToPlaceBetAction).toHaveBeenCalled();
            expect(mockLogin).toHaveBeenCalled();
          });
        });

        describe("when deposit is required", () => {
          it("should not call dispatchPlacement", () => {
            const dispatchPlacement = jest.fn();

            renderSportsbookConfirm({
              confirmFirst: true,
              isFreeBetsSelected: true,
              isLoggedIn: true,
              isDepositRequired: true,
              dispatchPlacement,
            });

            act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

            expect(dispatchPlacement).not.toHaveBeenCalled();
          });

          it("should call dispatchDepositRedirect with the endpoint", () => {
            getEndpoint.mockReturnValue("depositEndpoint");
            const dispatchDepositRedirect = jest.fn();

            renderSportsbookConfirm({
              confirmFirst: true,
              isFreeBetsSelected: true,
              isLoggedIn: true,
              isDepositRequired: true,
              dispatchDepositRedirect,
            });

            act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

            expect(dispatchDepositRedirect).toHaveBeenCalled();
          });

          it("should call navigateDeposit with the endpoint", () => {
            const dispatchPlacement = jest.fn();
            getEndpoint.mockReturnValue("depositEndpoint");

            renderSportsbookConfirm({
              confirmFirst: true,
              isFreeBetsSelected: true,
              isLoggedIn: true,
              isDepositRequired: true,
              dispatchPlacement,
            });

            act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

            expect(navigateDeposit).toHaveBeenCalledWith("depositEndpoint");
          });

          it("should call getEndpoint", () => {
            const dispatchPlacement = jest.fn();

            renderSportsbookConfirm({
              confirmFirst: true,
              isFreeBetsSelected: true,
              isLoggedIn: true,
              isDepositRequired: true,
              dispatchPlacement,
            });

            act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

            expect(getEndpoint).toHaveBeenCalledWith("DEPOSIT");
          });

          describe("when deposit is not required", () => {
            it("should call dispatchPlacement with the correct payload", () => {
              const dispatchPlacement = jest.fn();

              renderSportsbookConfirm({ isLoggedIn: true, isDepositRequired: false, dispatchPlacement });

              act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

              expect(dispatchPlacement).toHaveBeenCalled();
            });
          });
        });

        describe("onCollapseToggle", () => {
          it("should call dispatchAccordionToggle", () => {
            const dispatchAccordionToggle = jest.fn();
            renderSportsbookConfirm({ dispatchAccordionToggle });

            SportsbookPlacePanel.mock.calls[0][0].onCollapseToggle();

            expect(dispatchAccordionToggle).toHaveBeenCalledWith();
            expect(dispatchAccordionToggle).toHaveBeenCalledTimes(1);
          });
        });

        describe("handleEditClick", () => {
          it("should call the correct dispatch", () => {
            useContext.mockReturnValue({
              ...mockedUseContext,
            });

            const dispatchEdit = jest.fn();
            renderSportsbookConfirm({ dispatchEdit });

            SecondaryButton.mock.calls[0][0].onTap();

            expect(dispatchEdit).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    it("should clear the focused input field", () => {
      const setFocusedKeyboardControlsSpy = jest.fn();
      useContext.mockReturnValue({
        setFocusedKeyboardControls: setFocusedKeyboardControlsSpy,
      });
      renderSportsbookConfirm();

      const updateFunction = setFocusedKeyboardControlsSpy.mock.calls[0][0];
      const newState = updateFunction({
        focusedInputId: "some-id",
        focusedInputRef: null,
        focusedTargetRef: null,
      });

      expect(newState).toEqual({
        focusedInputId: null,
        focusedInputRef: null,
        focusedTargetRef: null,
      });
      expect(setFocusedKeyboardControlsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
