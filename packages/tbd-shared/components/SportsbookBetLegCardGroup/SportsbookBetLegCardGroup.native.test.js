import { act, render } from "@testing-library/react-native";
import { Divider } from "@ppb/the-wall-native";
import SportsbookBetLegCardGroup from "./SportsbookBetLegCardGroup.native";
import ConnectedCard from "../Card";
import ConnectedFixtureCard from "../FixtureCard";
import Card from "../Card/Card.native";
import MyBetsFixtureCard from "../FixtureCard/MyBetsFixture/MyBetsFixtureCard.native";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.native";
import StatsSupportingContentButtonsCardGroup from "../StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.native";

jest.mock("../FixtureCard", (props) => jest.fn(() => <connected-fixture-card-mock {...props} />));
jest.mock("../FixtureCard/MyBetsFixture/MyBetsFixtureCard.native", (props) =>
  jest.fn(() => <my-bets-fixture-card-mock {...props} />),
);
jest.mock("../FixtureCard/FixtureCardPlaceholder.native", () => jest.fn(() => <fixture-card-placeholder-mock />));
jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.native", () => jest.fn(() => <card-mock />));
jest.mock("../StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.native", () =>
  jest.fn(() => <stats-supporting-content-buttons-card-group-mock />),
);

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  tokens: {},
}));

jest.mock("@ppb/tbd-router", () => ({
  navigationRef: {
    current: {
      isFocused: jest.fn().mockReturnValue(true),
    },
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn(() => <divider-mock />),
}));

const mockDispatchSubscribeBlhResult = jest.fn();
const mockDispatchUnsubscribeBlhResult = jest.fn();
const mockDispatchSubscribeBmeResult = jest.fn();
const mockDispatchUnsubscribeBmeResult = jest.fn();

const defaultProps = {
  betURN: "foo",
  cards: [
    {
      typename: "Card1",
      urn: "ppb:tbd:card:1",
    },
    {
      typename: "Card2",
      urn: "ppb:tbd:card:2",
    },
  ],
  isMutationEligible: true,
  statsSupportingContentButtonsUrn: undefined,
  dispatchSubscribeBlhResult: mockDispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult: mockDispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult: mockDispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult: mockDispatchUnsubscribeBmeResult,
};

afterEach(jest.clearAllMocks);

function renderSportsbookBetLegCardGroup(props) {
  return render(<SportsbookBetLegCardGroup {...props} />);
}

describe("SportsbookBetLegCardGroup", () => {
  describe("when there are no cards", () => {
    it("should not render any card", () => {
      renderSportsbookBetLegCardGroup({
        ...defaultProps,
        cards: [],
        isSettled: true,
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
      expect(ConnectedFixtureCard).not.toHaveBeenCalled();
    });
  });

  describe("when there are cards available", () => {
    it("should render the given cards", () => {
      renderSportsbookBetLegCardGroup({
        ...defaultProps,
        isSettled: true,
        cards: [
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          },
          {
            typename: "BetLegCard",
            urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
          },
        ],
      });

      expect(ConnectedCard).toHaveBeenCalledTimes(1);
      expect(ConnectedFixtureCard).toHaveBeenCalledTimes(1);
      expect(ConnectedFixtureCard).toHaveBeenNthCalledWith(
        1,
        {
          component: MyBetsFixtureCard,
          urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          placeholder: FixtureCardPlaceholder,
          iconsList: undefined,
        },
        undefined,
      );
      expect(ConnectedCard).toHaveBeenNthCalledWith(
        1,
        { component: Card, typename: "BetLegCard", urn: "ppb:tbd:card:sbkBetLeg:1175702671/0" },
        undefined,
      );
    });

    describe("when one of this cards is a BetLegCard", () => {
      describe("and this card is not the last on the list", () => {
        it("should render the Divider component", () => {
          renderSportsbookBetLegCardGroup({
            ...defaultProps,
            isSettled: true,
            cards: [
              {
                typename: "BetLegCard",
                urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
              },
              {
                typename: "BetLegCard",
                urn: "ppb:tbd:card:sbkBetLeg:1175702672/0",
              },
              {
                typename: "FixtureCard",
                urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
              },
            ],
          });

          expect(ConnectedCard).toHaveBeenCalledTimes(2);
          expect(ConnectedFixtureCard).toHaveBeenCalledTimes(1);

          expect(Divider).toHaveBeenCalledTimes(1);
        });
      });

      describe("and this card is the last one on the list", () => {
        it("shouldn't render the Divider component", () => {
          renderSportsbookBetLegCardGroup({
            ...defaultProps,
            isSettled: true,
          });

          expect(ConnectedCard).toHaveBeenCalledTimes(2);

          expect(Divider).not.toHaveBeenCalled();
        });
      });
    });

    describe("when one of this cards is a StatsSupportingContentButtonsCardGroup", () => {
      it("should render the StatsSupportingContentButtonsCardGroup component", () => {
        const statsSupportingContentButtonsUrn = "ppb:tbd:stats:cardGroup:supportingcontentbuttons:30824665|my-bets";

        renderSportsbookBetLegCardGroup({
          ...defaultProps,
          statsSupportingContentButtonsUrn,
          isSettled: true,
          cards: [
            {
              typename: "BetLegCard",
              urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
            },
            {
              typename: "FixtureCard",
              urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
            },
            {
              typename: "StatsSupportingContentButtonsCardGroup",
              urn: statsSupportingContentButtonsUrn,
            },
          ],
        });

        expect(ConnectedCard).toHaveBeenCalledTimes(1);
        expect(ConnectedFixtureCard).toHaveBeenCalledTimes(1);
        expect(StatsSupportingContentButtonsCardGroup).toHaveBeenCalledTimes(1);
        expect(StatsSupportingContentButtonsCardGroup).toHaveBeenCalledWith(
          { urn: statsSupportingContentButtonsUrn },
          undefined,
        );

        expect(Divider).not.toHaveBeenCalled();
      });
    });
  });

  describe.each([
    ["dispatchSubscribeBlhResult", mockDispatchSubscribeBlhResult, true],
    ["dispatchUnsubscribeBlhResult", mockDispatchUnsubscribeBlhResult, false],
    ["dispatchSubscribeBmeResult", mockDispatchSubscribeBmeResult, true],
    ["dispatchUnsubscribeBmeResult", mockDispatchUnsubscribeBmeResult, false],
  ])("%s", (action, actionFn, navigationIsFocused) => {
    describe("when bet is open", () => {
      describe(`and navigationIsFocused is ${navigationIsFocused}`, () => {
        it(`should call ${action} with URN`, () => {
          const { unmount } = renderSportsbookBetLegCardGroup(
            { ...defaultProps, isSettled: false },
            navigationIsFocused,
          );

          act(() => {
            if (!navigationIsFocused) unmount();
          });

          expect(actionFn).toHaveBeenCalledWith(defaultProps.betURN);
        });
      });
    });

    describe("when bet is settled", () => {
      describe(`and navigationIsFocused is ${navigationIsFocused}`, () => {
        it(`should not call ${action}`, () => {
          const { unmount } = renderSportsbookBetLegCardGroup(
            { ...defaultProps, isSettled: true },
            navigationIsFocused,
          );

          act(() => {
            if (!navigationIsFocused) unmount();
          });

          expect(actionFn).not.toHaveBeenCalled();
        });
      });
    });
  });
});
