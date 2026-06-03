import { render, act, screen } from "@testing-library/react";
import { Drawer } from "@ppb/the-wall-web/components/walls/Drawer/Drawer";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { FreezeCard } from "../../Card/snowflakes/FreezeCard/FreezeCard.web";
import ConnectedFixtureHeader from "../../FixtureHeader";
import FixtureHeader from "../../FixtureHeader/FixtureHeader.web";
import ConnectedEventHeaderCard from "../../EventHeaderCard";
import EventHeaderCard from "../../EventHeaderCard/EventHeaderCard.web";
import { FreezeCardStates, FreezeCardStatuses } from "../../Card/snowflakes/FreezeCard/shared";
import FreezeSelectionBottomSheet from "./FreezeSelectionBottomSheet.web";
import { aBetLegFreezeInfo } from "./FreezeSelectionBottomSheet.testing";
import { FreezeConfirmButton } from "../FreezeConfirmButton/FreezeConfirmButton.web";
import styles from "./FreezeSelectionBottomSheet.web.css";

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/the-wall-web", () => ({
  PrimaryButton: jest.fn((props) => <primary-button-mock {...props} />),
  Alert: jest.fn((props) => <alert-mock data-testid="error-alert" {...props} />),
}));

jest.mock("@ppb/the-wall-web/components/walls/Drawer/Drawer", () => ({
  Drawer: jest.fn((props) => (
    <bottom-sheet {...props}>
      {props.children} {props.footerContent}
    </bottom-sheet>
  )),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

jest.mock("../FreezeConfirmButton/FreezeConfirmButton.web", () => ({
  FreezeConfirmButton: jest.fn((props) => <freeze-confirm-button-mock {...props}></freeze-confirm-button-mock>),
}));

jest.mock("../../Card/snowflakes/FreezeCard/FreezeCard.web", () => ({
  FreezeCard: jest.fn((props) => <freeze-card-mock {...props}>{props.children}</freeze-card-mock>),
}));

jest.mock("../../FixtureHeader", () => jest.fn(() => <connected-fixture-header-mock />));

jest.mock("../../FixtureHeader/FixtureHeader.web", () => ({
  FixtureHeader: jest.fn(() => <fixture-header-mock />),
}));

jest.mock("../../EventHeaderCard", () => jest.fn(() => <connected-event-header-card-mock />));

jest.mock("../../EventHeaderCard/EventHeaderCard.web", () => ({
  EventHeaderCard: jest.fn(() => <event-header-card-mock />),
}));

const onDismissSpy = jest.fn();

const dispatchOnSelectLeg = jest.fn();
const dispatchOnDeselectLeg = jest.fn();

function aProps(...legs) {
  return {
    betId: `${Math.random()}`,
    betLegFreezeInfos: [...legs],
    onDismiss: onDismissSpy,
    dispatchOnFreezeLeg: jest.fn(),
    dispatchOnSelectLeg,
    dispatchOnDeselectLeg,
  };
}

function renderFreezeSelectionBottomSheet({ betId, betLegFreezeInfos, onDismiss, dispatchOnFreezeLeg }) {
  return render(
    <FreezeSelectionBottomSheet
      betId={betId}
      betLegFreezeInfos={betLegFreezeInfos}
      onDismiss={onDismiss}
      dispatchOnFreezeLeg={dispatchOnFreezeLeg}
      dispatchOnSelectLeg={dispatchOnSelectLeg}
      dispatchOnDeselectLeg={dispatchOnDeselectLeg}
    />,
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("FreezeSelectionBottomSheet Component", () => {
  describe("on render freeze selection bottom sheet", () => {
    beforeEach(() => {
      const props = aProps(
        aBetLegFreezeInfo(),
        aBetLegFreezeInfo({
          mutationAvailability: "Not Eligible",
          freezeEligibility: FreezeCardStates.INELIGIBLE,
          freezeStatus: FreezeCardStatuses.INPLAY,
        }),
      );
      renderFreezeSelectionBottomSheet(props);
    });

    it("should render the drawer component properly", () => {
      expect(Drawer).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.any(Object),
          onOutsideTap: onDismissSpy,
          containerId: "freeze-selection-bottom-sheet",
          isDesktop: false,
          customStyle: styles.drawer,
        }),
        undefined,
      );
      expect(FreezeConfirmButton).toHaveBeenCalled();
    });

    it("should render the two FreezeCards correctly", () => {
      expect(FreezeCard).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          children: expect.any(Object),
          onClick: expect.any(Function),
          status: FreezeCardStatuses.INPLAY,
          state: FreezeCardStates.ACTIVE,
          statusLabel: true,
          text: "freezecardtext",
          contentText: "@ 3/2",
        }),
        undefined,
      );
      expect(FreezeCard).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          children: expect.any(Object),
          onClick: expect.any(Function),
          status: FreezeCardStatuses.INPLAY,
          state: FreezeCardStates.INELIGIBLE,
          statusLabel: true,
          text: "freezecardtext",
          contentText: "@ 3/2",
        }),
        undefined,
      );
    });

    it("should not show an error when no legs have a mutation failure", () => {
      renderFreezeSelectionBottomSheet(aProps());
      expect(screen.queryByTestId("error-alert")).toBeNull();
    });

    it("should show an error when a leg has a mutation failure", () => {
      renderFreezeSelectionBottomSheet(aProps(aBetLegFreezeInfo({ freezeFailure: true })));
      expect(screen.getByTestId("error-alert")).toBeDefined();
    });
  });

  describe("if a fixture is present", () => {
    it("a FixtureHeader should be rendered", () => {
      renderFreezeSelectionBottomSheet(
        aProps(
          aBetLegFreezeInfo({
            hasFixture: true,
          }),
        ),
      );

      expect(ConnectedFixtureHeader).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          component: FixtureHeader,
          fixture: "ppb:footballfixture:42",
          viewMode: ScoreboardViewMode.COUPON,
          sporteventURN: "ppb:event:7",
        }),
        undefined,
      );
    });
  });

  describe("if a fixture is not present", () => {
    it("an EventHeaderCard should be rendered", () => {
      const props = aProps(
        aBetLegFreezeInfo({
          hasFixture: false,
        }),
      );
      renderFreezeSelectionBottomSheet(props);

      expect(ConnectedEventHeaderCard).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          component: EventHeaderCard,
          urn: "ppb:eventheader:1",
        }),
        undefined,
      );
    });
  });

  describe("selection behaviour", () => {
    const CARD_1 = 1;
    const CARD_2 = 2;
    const CARD_3 = 3;

    const propsForCard = (cardNumber) => {
      const ix = FreezeCard.mock.calls.length - (3 - cardNumber) - 1; // No need to clear mocks
      return FreezeCard.mock.calls[ix][0];
    };

    const threeCards = aProps(
      aBetLegFreezeInfo(),
      aBetLegFreezeInfo({
        mutationAvailability: "Not Eligible",
        freezeEligibility: FreezeCardStates.INELIGIBLE,
        freezeStatus: FreezeCardStatuses.INPLAY,
      }),
      aBetLegFreezeInfo(),
    );

    it("three cards have correct state", () => {
      renderFreezeSelectionBottomSheet(threeCards);

      expect(propsForCard(CARD_1).state).toBe(FreezeCardStates.ACTIVE);
      expect(propsForCard(CARD_2).state).toBe(FreezeCardStates.INELIGIBLE);
      expect(propsForCard(CARD_3).state).toBe(FreezeCardStates.ACTIVE);

      expect(dispatchOnSelectLeg).toHaveBeenCalledTimes(0);
      expect(dispatchOnDeselectLeg).toHaveBeenCalledTimes(0);
    });

    it("pressing active card takes selection", async () => {
      renderFreezeSelectionBottomSheet(threeCards);

      await act(() => propsForCard(CARD_1).onClick());

      expect(propsForCard(CARD_1).state).toBe(FreezeCardStates.SELECTED);
      expect(propsForCard(CARD_2).state).toBe(FreezeCardStates.INELIGIBLE);
      expect(propsForCard(CARD_3).state).toBe(FreezeCardStates.ACTIVE);

      expect(dispatchOnSelectLeg).toHaveBeenCalledTimes(1);
      expect(dispatchOnDeselectLeg).toHaveBeenCalledTimes(0);
    });

    it("pressing ineligible Card doesn't steal selection", async () => {
      renderFreezeSelectionBottomSheet(threeCards);

      await act(() => propsForCard(CARD_1).onClick());
      await act(() => propsForCard(CARD_2).onClick());

      expect(propsForCard(CARD_1).state).toBe(FreezeCardStates.SELECTED);
      expect(propsForCard(CARD_2).state).toBe(FreezeCardStates.INELIGIBLE);
      expect(propsForCard(CARD_3).state).toBe(FreezeCardStates.ACTIVE);

      expect(dispatchOnSelectLeg).toHaveBeenCalledTimes(1);
      expect(dispatchOnDeselectLeg).toHaveBeenCalledTimes(0);
    });

    it("pressing an active Card steals selection", async () => {
      renderFreezeSelectionBottomSheet(threeCards);

      await act(() => propsForCard(CARD_1).onClick());
      await act(() => propsForCard(CARD_3).onClick());

      expect(propsForCard(CARD_1).state).toBe(FreezeCardStates.ACTIVE);
      expect(propsForCard(CARD_2).state).toBe(FreezeCardStates.INELIGIBLE);
      expect(propsForCard(CARD_3).state).toBe(FreezeCardStates.SELECTED);

      expect(dispatchOnSelectLeg).toHaveBeenCalledTimes(2);
      expect(dispatchOnDeselectLeg).toHaveBeenCalledTimes(1);
    });

    it("pressing current selection unselects it", async () => {
      renderFreezeSelectionBottomSheet(threeCards);

      await act(() => propsForCard(CARD_3).onClick());
      await act(() => propsForCard(CARD_3).onClick());

      expect(propsForCard(CARD_1).state).toBe(FreezeCardStates.ACTIVE);
      expect(propsForCard(CARD_2).state).toBe(FreezeCardStates.INELIGIBLE);
      expect(propsForCard(CARD_3).state).toBe(FreezeCardStates.ACTIVE);

      expect(dispatchOnSelectLeg).toHaveBeenCalledTimes(1);
      expect(dispatchOnDeselectLeg).toHaveBeenCalledTimes(1);
    });
  });

  it("should call onDismiss when BottomSheet.onHeaderIconTap is called", () => {
    renderFreezeSelectionBottomSheet(aProps());

    act(() => {
      const { onOutsideTap } = Drawer.mock.calls[0][0];
      onOutsideTap();
    });

    expect(onDismissSpy).toHaveBeenCalledTimes(1);
  });

  describe("FreezeSelectionBottomSheet Memoization", () => {
    let rerenderFn;
    const props = aProps(aBetLegFreezeInfo());

    beforeEach(() => {
      const { rerender } = renderFreezeSelectionBottomSheet(props);
      rerenderFn = rerender;
    });

    it("should call Drawer when rendering the 1st time", () => {
      expect(Drawer).toHaveBeenCalledTimes(1);
    });

    it("should not call Drawer when rerendering with the same props", () => {
      jest.resetAllMocks();

      rerenderFn(
        <FreezeSelectionBottomSheet
          betId={props.betId}
          betLegFreezeInfos={props.betLegFreezeInfos}
          onDismiss={props.onDismiss}
          dispatchOnFreezeLeg={props.dispatchOnFreezeLeg}
          dispatchOnSelectLeg={props.dispatchOnSelectLeg}
          dispatchOnDeselectLeg={props.dispatchOnDeselectLeg}
        />,
      );

      expect(Drawer).not.toHaveBeenCalled();
    });

    it("should call Drawer again when rerendering with different props", () => {
      jest.resetAllMocks();

      rerenderFn(
        <FreezeSelectionBottomSheet
          betId={"betId"}
          betLegFreezeInfos={props.betLegFreezeInfos}
          onDismiss={props.onDismiss}
          dispatchOnFreezeLeg={props.dispatchOnFreezeLeg}
          dispatchOnSelectLeg={props.dispatchOnSelectLeg}
          dispatchOnDeselectLeg={props.dispatchOnDeselectLeg}
        />,
      );

      expect(Drawer).toHaveBeenCalledTimes(1);
    });
  });
});
