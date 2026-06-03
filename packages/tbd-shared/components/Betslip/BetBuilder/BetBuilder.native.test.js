import { useContext } from "react";
import { render } from "@testing-library/react-native";

import { Alerts, BetControls as BetslipBetControls, InfoLabel } from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName, OthersIconName } from "@ppb/the-wall-icons";
import { InfoLabelType } from "@ppb/the-wall-common/types";

import { ConnectedBetLegsBetBuilder } from "../BetLegs";
import { BetLegs } from "../BetLegs/BetLegs.native";
import { ConnectedSelectionBetBuilders } from "../Selection";
import { Selection } from "../Selection/Selection.native";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.native";

import { BetBuilder } from "./BetBuilder.native";
import {
  SUBTITLE,
  TITLE,
  TITLE_CONTAINER,
  POPULAR_BADGE,
  POPULAR_ICON,
  POPULAR_LABEL,
} from "./BetBuilder.native.selectors";
import styles from "./BetBuilder.native.styles";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isBetConfirmationStep: false,
  })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  BetControls: jest.fn(() => <bet-controls-mock />),
  Alerts: jest.fn(() => <notifications-mock />),
  InfoLabel: jest.fn(() => <info-label-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../BetLegs", () => ({
  ConnectedBetLegsBetBuilder: jest.fn(() => <connected-legs-mock />),
}));
jest.mock("../BetLegs/BetLegs.native", () => ({
  BetLegs: jest.fn(() => <bet-legs-mock />),
}));

jest.mock("../Selection", () => ({
  ConnectedSelectionBetBuilders: jest.fn(() => <connected-selection-mock />),
}));
jest.mock("../Selection/Selection.native", () => ({
  Selection: jest.fn(() => <selection-mock />),
}));

jest.mock("../BetControls", () => jest.fn(() => <connected-bet-controls-mock />));

jest.mock("../BetControls/BetControls.native", () => ({
  BetControls: jest.fn(() => <bet-controls-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {
    SignpostingGenerosityIconDefault: "SignpostingGenerosityIconDefault",
  },
  typography: {},
  spacings: {},
  heights: {},
}));

function renderBetBuilder({
  id,
  title,
  subtitle,
  isPopular = false,
  isPackagedCreatedBets = false,
  shouldFocusStakeField = false,
  notifications,
  legIds = [],
  failedLegIds = [],
  odds,
  oddsMovement,
  stake,
  bonusAvailabilityLabel,
  isDisabled,
  isReadOnly,
  isStakeValid,
  betControlsExperimentVariant = "control",
  i18n = {},
  dispatchSportsbookValidateStake,
  dispatchStakeChange,
} = {}) {
  return render(
    <BetBuilder
      id={id}
      title={title}
      subtitle={subtitle}
      isPopular={isPopular}
      isPackagedCreatedBets={isPackagedCreatedBets}
      shouldFocusStakeField={shouldFocusStakeField}
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
    it("should render the title container with the appropriate style", () => {
      const { queryByTestId } = renderBetBuilder({ title: "Title" });
      const TITLE_CONTAINER_ELEMENT = queryByTestId(TITLE_CONTAINER);

      expect(TITLE_CONTAINER_ELEMENT).toHaveStyle(styles.titleContainer);
    });

    it("should place the passed title in the correct place", () => {
      const { queryByTestId } = renderBetBuilder({
        title: "Title",
      });

      expect(queryByTestId(TITLE)).toHaveTextContent("Title");
    });

    describe("when isPopular is false", () => {
      it("should not draw the popularBadge container", () => {
        const { queryByTestId } = renderBetBuilder({ title: "Title" });

        expect(queryByTestId(POPULAR_BADGE)).toBeNull();
      });
    });

    describe("when isPopular is true", () => {
      it("should draw the popularBadge container with the appropriate style", () => {
        const { queryByTestId } = renderBetBuilder({ title: "Title", isPopular: true });
        const POPULAR_BADGE_CONTAINER = queryByTestId(POPULAR_BADGE);

        expect(POPULAR_BADGE_CONTAINER).not.toBeNull();
        expect(POPULAR_BADGE_CONTAINER).toHaveStyle(styles.popularBadge);
      });

      it("should draw the popularIcon container with the appropriate style", () => {
        const { queryByTestId } = renderBetBuilder({ title: "Title", isPopular: true });
        const POPULAR_ICON_CONTAINER = queryByTestId(POPULAR_ICON);

        expect(POPULAR_ICON_CONTAINER).not.toBeNull();
        expect(POPULAR_ICON_CONTAINER).toHaveStyle(styles.popularIcon);
      });

      it("should call GenericIcon with the correct props", () => {
        renderBetBuilder({ title: "Title", isPopular: true });

        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: ValueIconName.POPULAR_BET_BUILDER,
            color: "SignpostingGenerosityIconDefault",
          },
          undefined,
        );
      });

      it("should render the popularLabel with the appropriate class and text", () => {
        const { queryByTestId } = renderBetBuilder({
          title: "Title",
          isPopular: true,
          i18n: { popular: "POPULAR" },
        });
        const POPULAR_LABEL_ELEMENT = queryByTestId(POPULAR_LABEL);

        expect(POPULAR_LABEL_ELEMENT).not.toBeNull();
        expect(POPULAR_LABEL_ELEMENT).toHaveStyle(styles.popularLabel);
        expect(POPULAR_LABEL_ELEMENT).toHaveTextContent("POPULAR");
      });
    });

    describe("when isPackagedCreatedBets is false", () => {
      it("should not render the Request a Bet InfoLabel", () => {
        renderBetBuilder({ title: "Title" });

        expect(InfoLabel).toHaveBeenCalledTimes(0);
      });
    });

    describe("when isPackagedCreatedBets is true", () => {
      it("should render the Request a Bet InfoLabel with correct props", () => {
        renderBetBuilder({ title: "Title", isPackagedCreatedBets: true, i18n: { createdBets: "Request a Bet" } });

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
      const { queryByTestId } = renderBetBuilder({
        subtitle: "Subitle",
      });

      expect(queryByTestId(SUBTITLE)).toHaveTextContent("Subitle");
    });
  });

  describe("notifications", () => {
    it("should delegate bet.notifications to Alerts", () => {
      renderBetBuilder({
        notifications: [{ type: "notification type" }],
      });

      expect(Alerts).toHaveBeenCalledWith({ alerts: [{ type: "notification type" }] }, undefined);
      expect(Alerts).toHaveBeenCalledTimes(1);
    });
  });

  describe("selections", () => {
    it("should call ConnectedBetLegsBetBuilder", () => {
      renderBetBuilder({
        legIds: [{ id: "leg:1" }],
      });

      expect(ConnectedBetLegsBetBuilder).toHaveBeenCalledWith(
        {
          legIds: [{ id: "leg:1" }],
          component: BetLegs,
          renderLeg: expect.any(Function),
        },
        undefined,
      );
      expect(ConnectedBetLegsBetBuilder).toHaveBeenCalledTimes(2);
    });

    describe("renderLeg", () => {
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

      it("should render ConnectedSelectionBetBuilder", () => {
        renderBetBuilder({
          legIds: [{ id: "leg:1" }],
        });
        render(ConnectedBetLegsBetBuilder.mock.calls[1][0].renderLeg("leg:1"));

        expect(ConnectedSelectionBetBuilders).toHaveBeenCalledWith(
          {
            component: Selection,
            id: "leg:1",
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
          renderBetBuilder({
            id: null,
            odds: "odds",
            i18n: { odds: "odds", stake: "stake" },
          });

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
              isStartingPriceDisabled: false,
              returnsLabel: "",
              displayReturns: false,
              isStakeValid: true,
              isAccaInsuranceSelected: false,
              isAccaInsuranceDisabled: false,
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
          renderBetBuilder({
            id: null,
            odds: "odds",
            i18n: { odds: "odds", stake: "stake" },
          });

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
              isStartingPriceDisabled: true,
              isAccaInsuranceSelected: false,
              isAccaInsuranceDisabled: true,
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
        renderBetBuilder({ id: "some-id", betControlsExperimentVariant: "betslip-bet-controls-on-top" });

        const betLegsCallOrder = ConnectedBetLegsBetBuilder.mock.invocationCallOrder[0];
        const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];

        expect(betControlsCallOrder).toBeLessThan(betLegsCallOrder);
      });

      it("should render BetControls after BetLegs when betControlsExperimentVariant is not 'betslip-bet-controls-on-top'", () => {
        renderBetBuilder({ id: "some-id" });

        const betControlsCallOrder = ConnectedBetControls.mock.invocationCallOrder[0];
        const betLegsCallOrder = ConnectedBetLegsBetBuilder.mock.invocationCallOrder[0];

        expect(betControlsCallOrder).toBeGreaterThan(betLegsCallOrder);
      });
    });
  });
});
