import { render, act } from "@testing-library/react";
import { Divider, useOnIntersect } from "@ppb/the-wall-web";
import SportsbookBetLegCardGroup from "./SportsbookBetLegCardGroup.web";
import ConnectedCard from "../Card";
import ConnectedFixtureCard from "../FixtureCard";
import MyBetsFixtureCard from "../FixtureCard/MyBetsFixture/MyBetsFixtureCard.web";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.web";
import Card from "../Card/Card.web";
import StatsSupportingContentButtonsCardGroup from "../StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.web";

jest.mock("../FixtureCard", () => jest.fn(() => <connected-fixture-card-mock />));
jest.mock("../FixtureCard/MyBetsFixture/MyBetsFixtureCard.web", () => jest.fn(() => <my-bets-fixture-card-mock />));
jest.mock("../FixtureCard/FixtureCardPlaceholder.web", () => jest.fn(() => <fixture-card-placeholder-mock />));
jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));

jest.mock("../StatsSupportingContentButtonsCardGroup/view/StatsSupportingContentButtonsCardGroup.web", () =>
  jest.fn((props) => <stats-supporting-content-buttons-card-group-mock {...props} />),
);

jest.mock("@ppb/the-wall-web", () => ({
  Divider: jest.fn(() => <divider-mock />),
  useOnIntersect: jest.fn(),
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
  statsSupportingContentButtonsUrn: undefined,
  isMutationEligible: true,
  dispatchSubscribeBlhResult: mockDispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult: mockDispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult: mockDispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult: mockDispatchUnsubscribeBmeResult,
};

afterEach(jest.clearAllMocks);

function renderSportsbookBetLegCardGroup(props, isIntersecting = false) {
  useOnIntersect.mockReturnValue({ isIntersecting });

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
            typename: "BetLegCard",
            urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
          },
          {
            typename: "FixtureCard",
            urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
          },
        ],
      });

      expect(ConnectedCard).toHaveBeenCalledTimes(1);
      expect(ConnectedFixtureCard).toHaveBeenCalledTimes(1);
      expect(ConnectedCard).toHaveBeenNthCalledWith(
        1,
        { component: Card, typename: "BetLegCard", urn: "ppb:tbd:card:sbkBetLeg:1175702671/0" },
        undefined,
      );
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
                urn: "ppb:tbd:card:sbkBetLeg:1175702672/1",
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
            cards: [
              {
                typename: "BetLegCard",
                urn: "ppb:tbd:card:sbkBetLeg:1175702671/0",
              },
              {
                typename: "FixtureCard",
                urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
              },
            ],
          });

          expect(ConnectedCard).toHaveBeenCalledTimes(1);
          expect(ConnectedFixtureCard).toHaveBeenCalledTimes(1);
          expect(Divider).not.toHaveBeenCalled();
        });
      });
    });

    describe("when one of this cards is a StatsSupportingContentButtonsCardGroup", () => {
      it("should render the StatsSupportingContentButtonsCardGroup component", () => {
        const statsSupportingContentButtonsUrn = "ppb:tbd:stats:cardGroup:supportingcontentbuttons:30824665|my-bets";
        renderSportsbookBetLegCardGroup({
          ...defaultProps,
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
          statsSupportingContentButtonsUrn,
        });

        expect(ConnectedCard).toHaveBeenCalledTimes(1);
        expect(ConnectedFixtureCard).toHaveBeenCalledTimes(1);
        expect(Divider).not.toHaveBeenCalled();

        expect(StatsSupportingContentButtonsCardGroup).toHaveBeenCalledTimes(1);
        expect(StatsSupportingContentButtonsCardGroup).toHaveBeenCalledWith(
          { urn: statsSupportingContentButtonsUrn },
          undefined,
        );
      });
    });
  });

  describe.each([
    ["dispatchSubscribeBlhResult", mockDispatchSubscribeBlhResult, true],
    ["dispatchUnsubscribeBlhResult", mockDispatchUnsubscribeBlhResult, false],
    ["dispatchSubscribeBmeResult", mockDispatchSubscribeBmeResult, true],
    ["dispatchUnsubscribeBmeResult", mockDispatchUnsubscribeBmeResult, false],
  ])("%s", (action, actionFn, isIntersecting) => {
    describe("when bet is open", () => {
      describe(`and isIntersecting is ${isIntersecting}`, () => {
        it(`should call ${action} with URN`, () => {
          renderSportsbookBetLegCardGroup({ ...defaultProps, isSettled: false }, isIntersecting);

          expect(actionFn).toHaveBeenCalledWith(defaultProps.betURN);
        });
      });
    });

    describe("when bet is settled", () => {
      describe(`and isIntersecting is ${isIntersecting}`, () => {
        it(`should not call ${action}`, () => {
          renderSportsbookBetLegCardGroup({ ...defaultProps, isSettled: true }, isIntersecting);

          expect(actionFn).not.toHaveBeenCalled();
        });
      });
    });
  });
});
