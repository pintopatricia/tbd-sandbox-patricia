import { useContext } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { BetslipNotifications, BetslipBetControls, InfoLabel } from "@ppb/the-wall-web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName, OthersIconName } from "@ppb/the-wall-icons";

import { InfoLabelType } from "@ppb/the-wall-common/types";
import { ConnectedBetLegsBetBuilder } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.web";
import { ConnectedSelectionBetBuilders } from "../Selection";
import { Selection } from "../Selection/Selection.web";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";

import { SUBTITLE, TITLE, POPULAR_BADGE, POPULAR_ICON, POPULAR_LABEL } from "./BetBuilder.web.selectors";
import { BetBuilder } from "./BetBuilder.web";
import styles from "./BetBuilder.web.css";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isBetConfirmationStep: false,
  })),
}));

jest.mock("@ppb/the-wall-web", () => ({
  BetslipBetControls: jest.fn(() => <bet-controls-mock />),
  BetslipNotifications: jest.fn(() => <notifications-mock />),
  InfoLabel: jest.fn(({ props }) => <info-label-mock {...props} />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../BetLegs", () => ({
  ConnectedBetLegsBetBuilder: jest.fn(() => <connected-legs-mock />),
}));

jest.mock("../BetLegs/BetLegs.web", () => ({
  BetLegs: jest.fn(() => <bet-legs-mock />),
}));

jest.mock("../Selection", () => ({
  ConnectedSelectionBetBuilders: jest.fn(() => <connected-selection-mock />),
}));

jest.mock("../Selection/Selection.web", () => ({
  Selection: jest.fn(() => <selection-mock />),
}));

jest.mock("../BetControls", () => jest.fn(() => <connected-bet-controls-mock />));

jest.mock("../BetControls/BetControls.web", () => ({
  BetControls: jest.fn(() => <bet-controls-mock />),
}));

function renderBetBuilder({
  id = "id",
  title = "title",
  subtitle = "subtitle",
  notifications = [],
  legIds = [{ id: "LEG:1" }],
  failedLegIds = [],
  odds = "odds",
  oddsMovement = "oddsMovement",
  stake = "stake",
  bonusAvailabilityLabel = "bonusAvailabilityLabel",
  isDisabled = false,
  isReadOnly = false,
  isStakeValid = false,
  useCustomKeyboard = false,
  isPopular = false,
  isPackagedCreatedBets = false,
  shouldFocusStakeField = false,
  betControlsExperimentVariant = "control",
  i18n = {
    odds: "odds",
    stake: "stake",
    oddsMovementUp: "oddsMovementUp",
    oddsMovementDown: "oddsMovementDown",
    popular: "POPULAR",
    createdBets: "Request a Bet",
  },
  dispatchSportsbookValidateStake = jest.fn(),
  dispatchStakeChange = jest.fn(),
} = {}) {
  return render(
    <BetBuilder
      id={id}
      title={title}
      subtitle={subtitle}
      notifications={notifications}
      legIds={legIds}
      failedLegIds={failedLegIds}
      odds={odds}
      oddsMovement={oddsMovement}
      stake={stake}
      bonusAvailabilityLabel={bonusAvailabilityLabel}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isStakeValid={isStakeValid}
      useCustomKeyboard={useCustomKeyboard}
      isPopular={isPopular}
      isPackagedCreatedBets={isPackagedCreatedBets}
      shouldFocusStakeField={shouldFocusStakeField}
      betControlsExperimentVariant={betControlsExperimentVariant}
      i18n={i18n}
      dispatchSportsbookValidateStake={dispatchSportsbookValidateStake}
      dispatchStakeChange={dispatchStakeChange}
    />,
  );
}

describe("BetBuilder", () => {
  beforeEach(jest.clearAllMocks);

  describe("title", () => {
    it("should place the passed title in the correct place", () => {
      const { container } = renderBetBuilder({ title: "title" });

      expect(container.querySelector(TITLE)).toHaveTextContent("title");
    });

    describe("when isPopular is false", () => {
      it("should not draw the popularBadge container", () => {
        const { container } = renderBetBuilder({});

        expect(container.querySelector(POPULAR_BADGE)).toBeNull();
      });
    });

    describe("when isPopular is true", () => {
      it("should draw the popularBadge container with the appropriate class", () => {
        const { container } = renderBetBuilder({ isPopular: true });
        const POPULAR_BADGE_CONTAINER = container.querySelector(POPULAR_BADGE);

        expect(POPULAR_BADGE_CONTAINER).not.toBeNull();
        expect(POPULAR_BADGE_CONTAINER).toHaveClass(styles.popularBadge);
      });

      it("should draw the popularIcon container with the appropriate class", () => {
        const { container } = renderBetBuilder({ isPopular: true });
        const POPULAR_ICON_CONTAINER = container.querySelector(POPULAR_ICON);

        expect(POPULAR_ICON_CONTAINER).not.toBeNull();
        expect(POPULAR_ICON_CONTAINER).toHaveClass(styles.popularIcon);
      });

      it("should call GenericIcon with the correct props", () => {
        renderBetBuilder({ isPopular: true });

        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: ValueIconName.POPULAR_BET_BUILDER,
            color: "var(--signposting-generosity-icon-default)",
          },
          undefined,
        );
      });

      it("should render the popularLabel with the appropriate class and text", () => {
        const { container } = renderBetBuilder({ isPopular: true });
        const POPULAR_LABEL_ELEMENT = container.querySelector(POPULAR_LABEL);

        expect(POPULAR_LABEL_ELEMENT).not.toBeNull();
        expect(POPULAR_LABEL_ELEMENT).toHaveClass(styles.popularLabel);
        expect(POPULAR_LABEL_ELEMENT).toHaveTextContent("POPULAR");
      });
    });

    describe("when isPackagedCreatedBets is false", () => {
      it("should not render the Request a Bet InfoLabel", () => {
        renderBetBuilder();

        expect(InfoLabel).toHaveBeenCalledTimes(0);
      });
    });

    describe("when isPackagedCreatedBets is true", () => {
      it("should render the Request a Bet InfoLabel with correct props", () => {
        renderBetBuilder({ isPackagedCreatedBets: true, i18n: { createdBets: "Request a Bet" } });

        expect(InfoLabel).toHaveBeenCalledTimes(1);
        expect(InfoLabel).toHaveBeenCalledWith(
          {
            label: "Request a Bet",
            iconName: OthersIconName.ODDS_ON_THAT,
            infoLabelType: InfoLabelType.BRANDED,
          },
          undefined,
        );
      });
    });
  });

  describe("subtitle", () => {
    it("should place the passed subtitle in the correct place", () => {
      const { container } = renderBetBuilder({ subtitle: "subtitle" });

      expect(container.querySelector(SUBTITLE)).toHaveTextContent("subtitle");
    });
  });

  describe("notifications", () => {
    it("should delegate notifications to BetslipNotifications", () => {
      renderBetBuilder({ notifications: [{ type: "notification type" }] });

      expect(BetslipNotifications).toHaveBeenCalledWith({ alerts: [{ type: "notification type" }] }, undefined);
      expect(BetslipNotifications).toHaveBeenCalledTimes(1);
    });
  });

  describe("selections", () => {
    it("should call ConnectedBetLegsBetBuilder", () => {
      renderBetBuilder();

      expect(ConnectedBetLegsBetBuilder).toHaveBeenCalledWith(
        {
          legIds: [{ id: "LEG:1" }],
          component: BetLegs,
          renderLeg: expect.any(Function),
        },
        undefined,
      );
      expect(ConnectedBetLegsBetBuilder).toHaveBeenCalledTimes(2);
    });

    it("should call ConnectedBetLegsBetBuilder with warning", () => {
      renderBetBuilder({
        failedLegIds: [{ id: "failed:leg:1" }],
      });

      expect(ConnectedBetLegsBetBuilder).toHaveBeenNthCalledWith(
        1,
        {
          legIds: [{ id: "failed:leg:1" }],
          component: BetLegs,
          renderLeg: expect.any(Function),
          isWarning: true,
          hasIcon: true,
        },
        undefined,
      );
      expect(ConnectedBetLegsBetBuilder).toHaveBeenCalledTimes(2);
    });

    describe("renderLeg", () => {
      it("should render ConnectedSelectionBetBuilder", () => {
        renderBetBuilder();
        render(ConnectedBetLegsBetBuilder.mock.calls[1][0].renderLeg("LEG:1"));

        expect(ConnectedSelectionBetBuilders).toHaveBeenCalledWith(
          {
            component: Selection,
            id: "LEG:1",
            isReadOnly: false,
          },
          undefined,
        );
        expect(ConnectedSelectionBetBuilders).toHaveBeenCalledTimes(1);
      });

      describe("when is bet confirmation step", () => {
        it("should render ConnectedSelectionBetBuilder with isReadOnly as true", () => {
          useContext.mockReturnValueOnce({ isBetConfirmationStep: true });
          renderBetBuilder({
            legIds: [{ id: "leg:1" }],
          });
          render(ConnectedBetLegsBetBuilder.mock.calls[1][0].renderLeg("leg:1"));

          expect(ConnectedSelectionBetBuilders).toHaveBeenCalledWith(
            {
              component: Selection,
              id: "leg:1",
              isReadOnly: true,
            },
            undefined,
          );
          expect(ConnectedSelectionBetBuilders).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("controls", () => {
    describe("when there is no id", () => {
      describe("and is not bet confirmation step", () => {
        it("should instantiate BetslipBetControls with proper values", () => {
          renderBetBuilder({ id: null });

          expect(BetslipBetControls).toHaveBeenCalledTimes(1);
          expect(BetslipBetControls).toHaveBeenCalledWith(
            {
              id: null,
              isPanelDisabled: true,
              odds: "odds",
              oddsLabel: "odds",
              stakeLabel: "stake",
              hasEachWay: false,
              hasAccaInsurance: false,
              returnsLabel: "",
              displayReturns: false,
              isStakeValid: true,
              isAccaInsuranceSelected: false,
              isAccaInsuranceDisabled: false,
              isStartingPriceDisabled: false,
              isEachWayDisabled: false,
              isStakeReadonly: false,
            },
            undefined,
          );
        });
      });

      describe("and is bet confirmation step", () => {
        it("should instantiate BetslipBetControls with proper values", () => {
          useContext.mockReturnValueOnce({ isBetConfirmationStep: true });
          renderBetBuilder({ id: null });

          expect(BetslipBetControls).toHaveBeenCalledTimes(1);
          expect(BetslipBetControls).toHaveBeenCalledWith(
            {
              id: null,
              isPanelDisabled: true,
              odds: "odds",
              oddsLabel: "odds",
              stakeLabel: "stake",
              hasEachWay: false,
              hasAccaInsurance: false,
              returnsLabel: "",
              displayReturns: false,
              isStakeValid: true,
              isAccaInsuranceSelected: false,
              isAccaInsuranceDisabled: true,
              isStartingPriceDisabled: true,
              isEachWayDisabled: true,
              isStakeReadonly: true,
            },
            undefined,
          );
        });
      });
    });

    describe("when there is an id", () => {
      it("should call the ConnectedBetControls", () => {
        renderBetBuilder({ id: "some_id" });

        expect(ConnectedBetControls).toHaveBeenCalledTimes(1);
        expect(ConnectedBetControls).toHaveBeenCalledWith(
          {
            combinationId: "some_id",
            component: BetControls,
            shouldFocusStakeField: false,
          },
          undefined,
        );
      });
    });
    describe("betControlsExperimentVariant", () => {
      it("should render BetControls before BetLegs when betControlsExperimentVariant is 'betslip-bet-controls-on-top'", () => {
        renderBetBuilder({ betControlsExperimentVariant: "betslip-bet-controls-on-top" });

        const betLegsCallOrder = ConnectedBetLegsBetBuilder.mock.invocationCallOrder[0];
        const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];

        expect(betControlsCallOrder).toBeLessThan(betLegsCallOrder);
      });

      it("should render BetControls after BetLegs when betControlsExperimentVariant is not 'betslip-bet-controls-on-top'", () => {
        renderBetBuilder();

        const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];
        const betLegsCallOrder = ConnectedBetLegsBetBuilder.mock.invocationCallOrder[0];

        expect(betControlsCallOrder).toBeGreaterThan(betLegsCallOrder);
      });
    });
  });
});
