import { useContext } from "react";
import { render, act } from "@testing-library/react";
import { SecondaryButton } from "@ppb/the-wall-web";
import { SportsbookPlacePanelContentLayout } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";

import { BetslipSection } from "../Betslip.types";
import { useRefContext } from "../../../hooks/useRefContext";
import { getAuthData } from "../../../config/endpoints";

import { SportsbookConfirm } from "./SportsbookConfirm.web";
import { SportsbookPlacePanel } from "../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.web";

const mockedUseContext = {
  setFocusedKeyboardControls: jest.fn(),
  setIsBetConfirmationStep: jest.fn(),
  isDesktopLayout: false,
};

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => mockedUseContext),
}));

jest.mock("@ppb/the-wall-web", () => ({
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));

jest.mock("../SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.web", () => ({
  SportsbookPlacePanel: jest.fn(({ secondaryButton }) => (
    <sportsbook-place-panel-mock>{secondaryButton}</sportsbook-place-panel-mock>
  )),
}));

jest.mock("../../../config/endpoints", () => ({
  getAuthData: jest.fn().mockReturnValue({ SSO_URL: "ssoUrlMock" }),
}));

jest.mock("../../../hooks/useRefContext", () => ({
  useRefContext: jest.fn(() => []),
}));

jest.mock("../betslip-deposit-redirect-mapper", () => ({
  buildDepositRedirectPayload: jest.fn(() => ({ viewUrn: "viewUrn", viewUrl: "viewUrl" })),
}));

jest.mock("../withJurisdiction/withJurisdiction", () => ({
  withJurisdiction: jest.fn((component) => component),
}));

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting",
  },
});

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
  singlesGroup: "singles mock",
  multiplesGroup: "multiples mock",
  systemGroup: "system mock",
  secondaryButtonLabel: "secondaryButtonLabelMock",
  ...commonLabelsI18NMock,
};

const betslipCardsOrderMock = [
  {
    id: sportsbookPlacePanelI18NMock.multiplesGroup,
    cardsOrder: [BetslipSection.bbMulti, BetslipSection.betBuilders, BetslipSection.oneLineMultiple],
  },
  {
    id: sportsbookPlacePanelI18NMock.systemGroup,
    cardsOrder: [BetslipSection.multiLinesMultiples, BetslipSection.castBets],
  },
  {
    id: sportsbookPlacePanelI18NMock.singlesGroup,
    cardsOrder: [BetslipSection.singles],
  },
];

const betsWithTotalCombinedStakeMock = {
  bbMulti: false,
  betBuilders: false,
  castBets: false,
  multiLinesMultiples: false,
  oneLineMultiple: false,
  singles: false,
};

const sectionsInitialStateMock = {
  bbMulti: false,
  betBuilders: false,
  castBets: false,
  multiLinesMultiples: false,
  oneLineMultiple: false,
  singles: false,
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
  betBuilderIds = [],
  betslipCardsOrder = betslipCardsOrderMock,
  betsWithTotalCombinedStake = betsWithTotalCombinedStakeMock,
  contentLayout = SportsbookPlacePanelContentLayout.ACCORDION,
  hasPlaceError = false,
  sportsbooksConfirmI18N = sportsbooksConfirmI18NMock,
  sportsbookPlacePanelI18N = sportsbookPlacePanelI18NMock,
  isDepositRequired = false,
  isEligibleToBonus = true,
  isFreeBetsSelected = false,
  isFreeBetsDisabled = false,
  isLoggedIn = false,
  isOddsBoosted = false,
  isPanelDisabled = false,
  isPlaceDisabled = false,
  isSummaryDisabled = false,
  operatorRegulation,
  placeBtnLabel = "place mock",
  sectionsInitialState = sectionsInitialStateMock,
  totalOriginalReturns = "1.02",
  totalReturns = "1.14",
  placeBtnSecondaryLabel = "placeBtnSecondaryLabel",
  placeBtnLoadingLabel = "placeBtnLoadingLabel",
  reversePlaceBtnLabels = false,
  freeBetsAlertMessage = "freeBetsAlertMessage",
  balanceAfterBet = "balanceAfterBet",
  dispatchAccordionToggle = jest.fn(),
  dispatchDepositRedirect = jest.fn(),
  dispatchEdit = jest.fn(),
  dispatchLogin = jest.fn(),
  dispatchLoginToPlaceBetAction = jest.fn(),
  dispatchNavigate = jest.fn(),
  dispatchPlacement = jest.fn(),
  dispatchRemoveAll = jest.fn(),
} = {}) {
  return render(
    <SportsbookConfirm
      betBuilderIds={betBuilderIds}
      betslipCardsOrder={betslipCardsOrder}
      betsWithTotalCombinedStake={betsWithTotalCombinedStake}
      contentLayout={contentLayout}
      hasPlaceError={hasPlaceError}
      sportsbooksConfirmI18N={sportsbooksConfirmI18N}
      sportsbookPlacePanelI18N={sportsbookPlacePanelI18N}
      isDepositRequired={isDepositRequired}
      isEligibleToBonus={isEligibleToBonus}
      isFreeBetsSelected={isFreeBetsSelected}
      isFreeBetsDisabled={isFreeBetsDisabled}
      isLoggedIn={isLoggedIn}
      isOddsBoosted={isOddsBoosted}
      isPanelDisabled={isPanelDisabled}
      isPlaceDisabled={isPlaceDisabled}
      isSummaryDisabled={isSummaryDisabled}
      operatorRegulation={operatorRegulation}
      placeBtnLabel={placeBtnLabel}
      sectionsInitialState={sectionsInitialState}
      totalOriginalReturns={totalOriginalReturns}
      totalReturns={totalReturns}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      freeBetsAlertMessage={freeBetsAlertMessage}
      balanceAfterBet={balanceAfterBet}
      dispatchAccordionToggle={dispatchAccordionToggle}
      dispatchDepositRedirect={dispatchDepositRedirect}
      dispatchEdit={dispatchEdit}
      dispatchLogin={dispatchLogin}
      dispatchLoginToPlaceBetAction={dispatchLoginToPlaceBetAction}
      dispatchNavigate={dispatchNavigate}
      dispatchPlacement={dispatchPlacement}
      dispatchRemoveAll={dispatchRemoveAll}
    />,
  );
}

describe("SportsbookConfirm", () => {
  afterEach(jest.clearAllMocks);

  it("should call useRefContext", () => {
    renderSportsbookConfirm();

    expect(useRefContext).toHaveBeenCalledWith();
    expect(useRefContext).toHaveBeenCalledTimes(1);
  });

  describe("when it is the initial render", () => {
    describe("when there is all necessary data", () => {
      it("should call SportsbookPlacePanel", () => {
        renderSportsbookConfirm({
          betBuilderIds: ["betBuilder"],
          hasCastBets: true,
          hasOneLineMultiple: true,
          hasMultipleLinesMultiples: true,
          hasBetBuilders: true,
        });

        expect(SportsbookPlacePanel).toHaveBeenCalledWith(
          {
            contentLayout: SportsbookPlacePanelContentLayout.ACCORDION,
            hasFreeBets: true,
            isFreeBetsSelected: false,
            isOddsBoosted: false,
            totalReturns: "1.14",
            totalOriginalReturns: "1.02",
            hasPlaceError: true,
            isPlaceDisabled: false,
            isSummaryDisabled: false,
            placeBtnLabel: "place mock",
            isDesktop: false,
            i18n: sportsbookPlacePanelI18NMock,
            isPanelDisabled: false,
            showAcceptOddsMovementAlert: false,
            isOddsMovementOn: false,
            oddsMovementLabels: { message: "", detailMessage: "" },
            betslipCards: expect.anything(),
            notifications: expect.anything(),
            onPlaceClick: expect.any(Function),
            onRemoveAllClick: expect.any(Function),
            onCollapseToggle: expect.any(Function),
            secondaryButton: expect.anything(),
            onOddsMovementPreferencesChange: expect.any(Function),
            onFreeBetsChange: expect.any(Function),
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

    it("should clear the focused input field", () => {
      const setFocusedKeyboardControlsSpy = jest.fn();
      useContext.mockReturnValue({
        ...mockedUseContext,
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

  describe("when betsWithTotalCombinedStake has", () => {
    const cases = [
      {
        type: BetslipSection.singles,
        betsWithTotalCombinedStake: { [BetslipSection.singles]: true },
        title: sportsbooksConfirmI18NMock.singles,
      },
      {
        type: BetslipSection.oneLineMultiple,
        betsWithTotalCombinedStake: { [BetslipSection.oneLineMultiple]: true },
        title: sportsbooksConfirmI18NMock.multiples,
      },
      {
        type: BetslipSection.multiLinesMultiples,
        betsWithTotalCombinedStake: { [BetslipSection.multiLinesMultiples]: true },
        title: sportsbooksConfirmI18NMock.additionalMultiples,
      },
      {
        type: BetslipSection.betBuilders,
        betsWithTotalCombinedStake: { [BetslipSection.betBuilders]: true },
        title: sportsbooksConfirmI18NMock.betBuilder,
      },
      {
        type: BetslipSection.bbMulti,
        betsWithTotalCombinedStake: { [BetslipSection.bbMulti]: true },
        title: sportsbooksConfirmI18NMock.multiBetBuilder,
      },
      {
        type: BetslipSection.castBets,
        betsWithTotalCombinedStake: { [BetslipSection.castBets]: true },
        title: sportsbooksConfirmI18NMock.casts,
      },
    ];

    it.each(cases)("property $type has value true", ({ betsWithTotalCombinedStake, title }) => {
      renderSportsbookConfirm({ betsWithTotalCombinedStake });

      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        expect.objectContaining({
          betslipCards: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              content: expect.arrayContaining([
                expect.objectContaining({
                  card: expect.any(Object),
                  title,
                  startsOpen: false,
                  collapsable: true,
                }),
              ]),
            }),
          ]),
        }),
        undefined,
      );
    });
  });

  describe("when has multi line multiple bets", () => {
    describe("and also has one line multiple bets", () => {
      it("should call MultiLinesMultiples card with shouldRenderBetLegs as false", () => {
        renderSportsbookConfirm({
          betsWithTotalCombinedStake: {
            ...betsWithTotalCombinedStakeMock,
            multiLinesMultiples: true,
            oneLineMultiple: true,
          },
        });

        const { card: multiLinesMultiplesCard } = SportsbookPlacePanel.mock.calls[0][0].betslipCards[1].content[0];
        const { shouldRenderBetLegs } = multiLinesMultiplesCard.props;

        expect(shouldRenderBetLegs).toBe(false);
      });
    });

    describe("and does not have one line multiple bets", () => {
      it("should call MultiLinesMultiples card with shouldRenderBetLegs as true", () => {
        renderSportsbookConfirm({
          betsWithTotalCombinedStake: {
            ...betsWithTotalCombinedStakeMock,
            multiLinesMultiples: true,
            oneLineMultiple: false,
          },
        });

        const { card: multiLinesMultiplesCard } = SportsbookPlacePanel.mock.calls[0][0].betslipCards[1].content[0];
        const { shouldRenderBetLegs } = multiLinesMultiplesCard.props;

        expect(shouldRenderBetLegs).toBe(true);
      });
    });
  });

  describe("when has a desktop layout available", () => {
    it("should pass down the isDesktop prop", () => {
      useContext.mockReturnValue({
        setFocusedKeyboardControls: jest.fn(),
        setIsBetConfirmationStep: jest.fn(),
        isDesktopLayout: true,
      });
      renderSportsbookConfirm();

      expect(SportsbookPlacePanel).toHaveBeenCalledWith(
        expect.objectContaining({
          isDesktop: true,
        }),
        undefined,
      );
      expect(SportsbookPlacePanel).toHaveBeenCalledTimes(1);
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
        const dispatchLogin = jest.fn();
        const dispatchLoginToPlaceBetAction = jest.fn();

        it("should call dispatchLogin with the correct payload", () => {
          renderSportsbookConfirm({ isLoggedIn: false, dispatchLogin, dispatchLoginToPlaceBetAction });

          act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

          expect(dispatchLoginToPlaceBetAction).toHaveBeenCalled();

          expect(dispatchLogin).toHaveBeenCalledWith("ssoUrlMock&url=https%3A%2F%2Fwww.betfair.com%2Fbetting");
          expect(dispatchLogin).toHaveBeenCalledTimes(1);
        });

        describe("when getAuthData returns null", () => {
          it("should call dispatchLoginToPlaceBetAction and dispatchLogin with the correct payload", () => {
            getAuthData.mockReturnValueOnce(null);

            renderSportsbookConfirm({
              dispatchLogin,
              isLoggedIn: false,
              dispatchLoginToPlaceBetAction,
            });

            act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

            expect(dispatchLoginToPlaceBetAction).toHaveBeenCalled();

            expect(dispatchLogin).toHaveBeenCalledWith("undefined&url=https%3A%2F%2Fwww.betfair.com%2Fbetting");
          });
        });
      });

      describe("when deposit is required", () => {
        it("should not call dispatchPlacement", () => {
          const dispatchPlacement = jest.fn();

          renderSportsbookConfirm({
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchPlacement,
          });

          act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

          expect(dispatchPlacement).not.toHaveBeenCalled();
        });

        it("should call dispatchDepositRedirect", () => {
          const dispatchDepositRedirect = jest.fn();

          renderSportsbookConfirm({
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchDepositRedirect,
          });

          act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

          expect(dispatchDepositRedirect).toHaveBeenCalled();
        });

        it("should call dispatchNavigate", () => {
          const dispatchNavigate = jest.fn();

          renderSportsbookConfirm({
            isFreeBetsSelected: true,
            isLoggedIn: true,
            isDepositRequired: true,
            dispatchNavigate,
          });

          act(() => SportsbookPlacePanel.mock.calls[0][0].onPlaceClick());

          expect(dispatchNavigate).toHaveBeenCalledWith("viewUrn", "viewUrl");
        });
      });

      describe("when deposit is not required", () => {
        it("should call dispatchPlacement with the correct payload", () => {
          const dispatchPlacement = jest.fn();

          renderSportsbookConfirm({
            isLoggedIn: true,
            isDepositRequired: false,
            dispatchPlacement,
          });

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
        useContext.mockReturnValue({ ...mockedUseContext });

        const dispatchEdit = jest.fn();
        renderSportsbookConfirm({ dispatchEdit });

        SecondaryButton.mock.calls[0][0].onTap();

        expect(dispatchEdit).toHaveBeenCalledTimes(1);
      });
    });
  });
});
