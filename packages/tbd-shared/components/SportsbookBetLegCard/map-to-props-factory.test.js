import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { SUBSCRIBE_FIXTURE_UPDATES, UNSUBSCRIBE_FIXTURE_UPDATES } from "@ppb/tbd-store/actions/fixture";
import { UI__NAVIGATE_TO_UPPER_LEVEL_FROM_MY_BETS } from "@ppb/tbd-store/actions/navigation";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { createGetThrottleSelector } from "@ppb/tbd-store/state";
import { ValueIconName } from "@ppb/the-wall-icons";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";

import { createBuildBetLegPartsVM } from "../../view-model-factories/my-bets-sbk-leg";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const BET_LEG_MOCK = {
  urn: "urn",
  result: "PLACED",
  parts: [],
};

const BET_LEG_ACCA_FREEZE_MOCK = {
  urn: "urn",
  result: "PLACED",
  mutations: {
    details: [
      {
        freezeDetails: {
          homeTeamScore: 1,
          awayTeamScore: 0,
          minute: 33,
        },
      },
    ],
  },
  parts: [],
};

const BET_LEG_PART_MOCK = {
  title: "title",
  subtitle: "subtitle",
  tertiaryTitle: "tertiaryTitle",
  statusLabel: { statusLabel: "label" },
  racingLabel: "racingLabel",
  odd: "odd",
  previousOdd: "previousOdd",
  navigationViewLink: {
    viewUrl: "navigationViewLinkUrl",
    viewUrn: "navigationViewLinkUrn",
  },
  is90Min: true,
  isSuperSub: false,
  sportId: "1",
  eventUrn: "eventUrn",
  outcomeDefinitionExp: "outcomeDefinitionExp",
  runners: undefined,
  result: "PLACED",
};

const OBB_BET_LEG_PART_MOCK = {
  title: "title",
  subtitle: "subtitle",
  is90Min: false,
  statusLabel: {
    statusLabelType: "label",
    text: "WON",
    statusLabelSize: "small",
  },
  eventUrn: "urn",
  expressionComponents: {},
  expressionMetadata: {
    participants: [
      {
        name: "Francisco Conceicao",
        id: "106462",
        __typename: "ExpressionParticipant",
      },
      {
        name: "Antonio Silva",
        id: "130812",
        __typename: "ExpressionParticipant",
      },
    ],
    __typename: "ExpressionMetadata",
  },
  betLegPartType: "xOfN",
  result: "WON",
};

const BET_LEG_RACING_PART_MOCK = {
  title: "title",
  subtitle: "subtitle",
  tertiaryTitle: "tertiaryTitle",
  statusLabel: { statusLabel: "label" },
  racingLabel: "racingLabel",
  odd: "odd",
  previousOdd: "previousOdd",
  navigationViewLink: {
    viewUrl: "navigationViewLinkUrl",
    viewUrn: "navigationViewLinkUrn",
  },
  is90Min: false,
  sportId: "7",
  eventUrn: "eventUrn",
  outcomeDefinitionExp: "outcomeDefinitionExp",
  silkUrl: "silkUrl",
  result: "PLACED",
};

const BET_LEG_RACING_MOCK = {
  urn: "urn",
  result: "PLACED",
  type: "SIMPLE_SELECTION",
  parts: [BET_LEG_RACING_PART_MOCK],
};

const getSportsbookBetLegByURNMock = jest.fn();
const getSportsbookBetByURNMock = jest.fn();
const buildBetLegPartsByBetLegsMock = jest.fn();

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: false })),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors", () => ({
  createSportsbookBetLegSelector: jest.fn(() => getSportsbookBetLegByURNMock),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetSelector: jest.fn(() => getSportsbookBetByURNMock),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("../../view-model-factories/my-bets-sbk-leg", () => ({
  createBuildBetLegPartsVM: jest.fn(() => buildBetLegPartsByBetLegsMock),
}));

const DEFAULT_STATE = {
  layouts: {
    cards: {
      betlegs: {},
    },
  },
  betting: {},
  entities: {
    sportsbookbetlegs: {},
    throttles: {},
  },
};

function setup(state) {
  return makeMapStateToProps()(state, { urn: "betLegCardURN" });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("makeMapStateToProps", () => {
  describe("when getSportsbookBetLegCardByURN does not returns a card", () => {
    it("should return an empty object", () => {
      createCardByURNSelector.mockReturnValueOnce(() => undefined);

      expect(setup(DEFAULT_STATE)).toEqual({});
    });
  });

  describe("when getSportsbookBetLegCardByURN returns a card", () => {
    describe("and getSportsbookBetLegByURN does not returns a leg", () => {
      it("should return an empty object", () => {
        createCardByURNSelector.mockReturnValueOnce(() => ({ legURN: "legURN", betURN: "betURN" }));

        expect(setup(DEFAULT_STATE)).toEqual({});
      });
    });

    describe("and getSportsbookBetLegByURN returns a leg", () => {
      describe("and getSportsbookBetByURN does not returns a bet", () => {
        it("should return an empty object", () => {
          createCardByURNSelector.mockReturnValue(() => ({ legURN: "legURN", betURN: "betURN" }));
          getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);

          expect(setup(DEFAULT_STATE)).toEqual({});
        });
      });

      describe("and getSportsbookBetByURN returns a bet", () => {
        describe("and buildBetLegPartsByBetLegs does not return a bet leg part", () => {
          it("should return an empty object", () => {
            createCardByURNSelector.mockReturnValue(() => ({ legURN: "legURN", betURN: "betURN" }));
            getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);
            getSportsbookBetByURNMock.mockReturnValueOnce({ isSGM: false, isSGMMulti: true, isOddsBoosted: true });
            buildBetLegPartsByBetLegsMock.mockReturnValueOnce([]);

            expect(setup(DEFAULT_STATE)).toEqual({});
          });
        });

        it("should call createBuildBetLegPartsVM with correct parameters", () => {
          createCardByURNSelector
            .mockReturnValueOnce(() => ({ legURN: "legURN", betURN: "betURN" }))
            .mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
          getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);
          buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_PART_MOCK]);
          getSportsbookBetByURNMock.mockReturnValueOnce({ isSGM: false, isSGMMulti: true, isOddsBoosted: true });

          setup(DEFAULT_STATE);

          expect(createBuildBetLegPartsVM).toHaveBeenCalledWith(
            { LINKS: "LINKS" },
            false,
            true,
            true,
            undefined,
            undefined,
          );
        });

        it("should call buildBetLegPartsByBetLegs with correct parameters", () => {
          createCardByURNSelector.mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
          getSportsbookBetByURNMock.mockReturnValueOnce({ isSGM: false, isSGMMulti: true, isOddsBoosted: true });
          buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_PART_MOCK]);
          getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);

          setup(DEFAULT_STATE);

          expect(buildBetLegPartsByBetLegsMock).toHaveBeenCalledWith(DEFAULT_STATE, [BET_LEG_MOCK]);
        });

        it("should return an object with mapped legs", () => {
          createCardByURNSelector.mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
          getSportsbookBetByURNMock.mockReturnValueOnce({
            isSGM: false,
            isSGMMulti: true,
            isOddsBoosted: true,
            betId: "id1",
          });
          getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);
          buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_PART_MOCK]);

          expect(setup(DEFAULT_STATE)).toEqual({
            legParts: [
              {
                title: BET_LEG_PART_MOCK.title,
                subtitle: BET_LEG_PART_MOCK.subtitle,
                tertiaryTitle: BET_LEG_PART_MOCK.tertiaryTitle,
                statusLabel: BET_LEG_PART_MOCK.statusLabel,
                racingLabel: BET_LEG_PART_MOCK.racingLabel,
                odd: BET_LEG_PART_MOCK.odd,
                previousOdd: BET_LEG_PART_MOCK.previousOdd,
                navigationViewLink: BET_LEG_PART_MOCK.navigationViewLink,
                is90Min: BET_LEG_PART_MOCK.is90Min,
                isSuperSub: BET_LEG_PART_MOCK.isSuperSub,
                eventUrn: BET_LEG_PART_MOCK.eventUrn,
                outcomeDefinitionExp: BET_LEG_PART_MOCK.outcomeDefinitionExp,
                result: BET_LEG_MOCK.result,
                sportId: BET_LEG_PART_MOCK.sportId,
                showSportsIcon: false,
                showSilk: false,
                betId: "id1",
              },
            ],
            cardUrn: "betLegCardURN",
          });
        });

        describe("and the betLeg returned has freezeDetails", () => {
          it("should return a modified status label if the freezeDetail exists", () => {
            createCardByURNSelector.mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
            getSportsbookBetByURNMock.mockReturnValueOnce({ isSGM: false, isSGMMulti: true });
            getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_ACCA_FREEZE_MOCK);
            buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_PART_MOCK]);

            expect(setup(DEFAULT_STATE)).toEqual({
              legParts: [
                {
                  title: BET_LEG_PART_MOCK.title,
                  subtitle: BET_LEG_PART_MOCK.subtitle,
                  tertiaryTitle: BET_LEG_PART_MOCK.tertiaryTitle,
                  statusLabel: {
                    additionalText: "(33')",
                    iconName: ValueIconName.ACCA_FREEZE,
                    statusLabelSize: StatusLabelSizeType.SMALL,
                    statusLabelType: StatusLabelType.BRANDED,
                    text: "I18N.MY_BETS.BET_LEG.FROZEN_LABEL 1-0",
                  },
                  racingLabel: BET_LEG_PART_MOCK.racingLabel,
                  odd: BET_LEG_PART_MOCK.odd,
                  previousOdd: BET_LEG_PART_MOCK.previousOdd,
                  navigationViewLink: BET_LEG_PART_MOCK.navigationViewLink,
                  is90Min: BET_LEG_PART_MOCK.is90Min,
                  isSuperSub: BET_LEG_PART_MOCK.isSuperSub,
                  eventUrn: BET_LEG_PART_MOCK.eventUrn,
                  outcomeDefinitionExp: BET_LEG_PART_MOCK.outcomeDefinitionExp,
                  result: BET_LEG_ACCA_FREEZE_MOCK.result,
                  sportId: BET_LEG_PART_MOCK.sportId,
                  showSportsIcon: false,
                  showSilk: false,
                },
              ],
              cardUrn: "betLegCardURN",
            });
          });
          it("should return a result of WON if leg result is LOST", () => {
            const lostAccaFreezeMock = {
              ...BET_LEG_ACCA_FREEZE_MOCK,
              result: "LOST",
            };

            const BET_LEG_ACCA_FREEZE_PART_MOCK = {
              ...BET_LEG_PART_MOCK,
              result: "LOST",
            };

            createCardByURNSelector.mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
            getSportsbookBetByURNMock.mockReturnValueOnce({ isSGM: false, isSGMMulti: true });
            getSportsbookBetLegByURNMock.mockReturnValueOnce(lostAccaFreezeMock);
            buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_ACCA_FREEZE_PART_MOCK]);

            expect(setup(DEFAULT_STATE).legParts[0].result).toEqual("WON");
          });
        });

        describe("and the bet is a PriceBoostMulti", () => {
          it("should return previousOdd as undefined", () => {
            createCardByURNSelector
              .mockReturnValueOnce(() => ({ legURN: "legURN", betURN: "betURN" }))
              .mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
            getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);
            buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_PART_MOCK]);
            getSportsbookBetByURNMock.mockReturnValueOnce({ isPBM: true });

            const { previousOdd } = setup(DEFAULT_STATE);

            expect(previousOdd).toEqual(undefined);
          });

          it("should return odd as undefined", () => {
            createCardByURNSelector
              .mockReturnValueOnce(() => ({ legURN: "legURN", betURN: "betURN" }))
              .mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
            getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);
            buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_PART_MOCK]);
            getSportsbookBetByURNMock.mockReturnValueOnce({ isPBM: true });

            const { odd } = setup(DEFAULT_STATE);

            expect(odd).toEqual(undefined);
          });
        });
      });
    });
  });

  describe("and getSportsbookBetLegByURN returns a obb leg", () => {
    describe("and getSportsbookBetByURN does not returns a bet", () => {
      it("should return an object with mapped legs", () => {
        createCardByURNSelector.mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
        getSportsbookBetByURNMock.mockReturnValueOnce({ isSGM: false, isSGMMulti: true });
        getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);
        buildBetLegPartsByBetLegsMock.mockReturnValueOnce([OBB_BET_LEG_PART_MOCK]);

        expect(setup(DEFAULT_STATE)).toEqual({
          legParts: [
            {
              betLegPartType: "xOfN",
              eventUrn: "urn",
              expressionComponents: {},
              expressionMetadata: {
                __typename: "ExpressionMetadata",
                participants: [
                  {
                    __typename: "ExpressionParticipant",
                    id: "106462",
                    name: "Francisco Conceicao",
                  },
                  {
                    __typename: "ExpressionParticipant",
                    id: "130812",
                    name: "Antonio Silva",
                  },
                ],
              },
              is90Min: false,
              odd: undefined,
              previousOdd: undefined,
              result: "WON",
              runners: undefined,
              showSilk: false,
              showSportsIcon: false,
              statusLabel: {
                statusLabelSize: "small",
                statusLabelType: "label",
                text: "WON",
              },
              subtitle: "subtitle",
              title: "title",
            },
          ],
          cardUrn: "betLegCardURN",
        });
      });
    });
  });

  describe("when MY_BETS_WIN_LOST_VOID throttle is active", () => {
    it("should return an object with mapped legs inclusive its sportId and showSportsIcon", () => {
      createGetThrottleSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ isActive: true }));
      createCardByURNSelector.mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
      getSportsbookBetByURNMock.mockReturnValueOnce({ isSGM: false, isSGMMulti: true, isOddsBoosted: true });
      getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_MOCK);
      buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_PART_MOCK]);

      expect(setup(DEFAULT_STATE)).toEqual({
        legParts: [
          {
            title: BET_LEG_PART_MOCK.title,
            subtitle: BET_LEG_PART_MOCK.subtitle,
            tertiaryTitle: BET_LEG_PART_MOCK.tertiaryTitle,
            statusLabel: BET_LEG_PART_MOCK.statusLabel,
            racingLabel: BET_LEG_PART_MOCK.racingLabel,
            odd: BET_LEG_PART_MOCK.odd,
            previousOdd: BET_LEG_PART_MOCK.previousOdd,
            navigationViewLink: BET_LEG_PART_MOCK.navigationViewLink,
            is90Min: BET_LEG_PART_MOCK.is90Min,
            isSuperSub: BET_LEG_PART_MOCK.isSuperSub,
            eventUrn: BET_LEG_PART_MOCK.eventUrn,
            outcomeDefinitionExp: BET_LEG_PART_MOCK.outcomeDefinitionExp,
            sportId: BET_LEG_PART_MOCK.sportId,
            showSportsIcon: true,
            result: BET_LEG_MOCK.result,
            showSilk: false,
          },
        ],
        cardUrn: "betLegCardURN",
      });
    });
  });

  describe("when showSilk conditions are met", () => {
    it("should return an object with mapped legs inclusive its silkUrl and showSilk", () => {
      createGetThrottleSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ isActive: true }));
      createCardByURNSelector.mockReturnValueOnce(() => ({ navigationLinks: { LINKS: "LINKS" } }));
      getSportsbookBetByURNMock.mockReturnValueOnce({ isSGM: false, isSGMMulti: false, isOddsBoosted: false });
      getSportsbookBetLegByURNMock.mockReturnValueOnce(BET_LEG_RACING_MOCK);
      buildBetLegPartsByBetLegsMock.mockReturnValueOnce([BET_LEG_RACING_PART_MOCK]);

      expect(setup(DEFAULT_STATE)).toEqual({
        legParts: [
          {
            title: BET_LEG_RACING_PART_MOCK.title,
            subtitle: BET_LEG_RACING_PART_MOCK.subtitle,
            tertiaryTitle: BET_LEG_RACING_PART_MOCK.tertiaryTitle,
            statusLabel: BET_LEG_RACING_PART_MOCK.statusLabel,
            racingLabel: BET_LEG_RACING_PART_MOCK.racingLabel,
            odd: BET_LEG_RACING_PART_MOCK.odd,
            previousOdd: BET_LEG_RACING_PART_MOCK.previousOdd,
            navigationViewLink: BET_LEG_RACING_PART_MOCK.navigationViewLink,
            is90Min: BET_LEG_RACING_PART_MOCK.is90Min,
            eventUrn: BET_LEG_RACING_PART_MOCK.eventUrn,
            outcomeDefinitionExp: BET_LEG_RACING_PART_MOCK.outcomeDefinitionExp,
            sportId: BET_LEG_RACING_PART_MOCK.sportId,
            showSportsIcon: true,
            result: BET_LEG_RACING_MOCK.result,
            showSilk: true,
            silkUrl: BET_LEG_RACING_PART_MOCK.silkUrl,
          },
        ],
        cardUrn: "betLegCardURN",
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const FIXTURE_URN = "ppb:fixture:123456";

  it("should dispatch the dispatchPushAction", () => {
    const { dispatchPushAction } = mapDispatchToProps;

    expect(dispatchPushAction("viewLink")).toEqual({
      type: PUSH,
      payload: "viewLink",
    });
  });

  it("should dispatch the dispatchNavigateToViewLinkAction", () => {
    const { dispatchNavigateToViewLinkAction } = mapDispatchToProps;

    expect(dispatchNavigateToViewLinkAction("URL", "TEXT")).toEqual({
      type: UI__NAVIGATE_TO_UPPER_LEVEL_FROM_MY_BETS,
      payload: {
        url: "URL",
        text: "TEXT",
      },
    });
  });

  describe("dispatchSubscribeFixtureUpdates", () => {
    it("should dispatch SUBSCRIBE_FIXTURE_UPDATES action", () => {
      const { dispatchSubscribeFixtureUpdates } = mapDispatchToProps;
      const urn = FIXTURE_URN;
      const typename = "SomeFixture";
      const participantId = "1234";
      const includeSubstitutions = true;

      expect(dispatchSubscribeFixtureUpdates(urn, typename, participantId, includeSubstitutions)).toEqual({
        type: SUBSCRIBE_FIXTURE_UPDATES,
        payload: {
          urn,
          typename,
          isLite: true,
          includePlayers: true,
          footballPlayerIds: [participantId],
          includeSubstitutions,
        },
      });
    });
  });

  describe("dispatchUnsubscribeFixtureUpdates", () => {
    it("should dispatch UNSUBSCRIBE_FIXTURE_UPDATES action", () => {
      const { dispatchUnsubscribeFixtureUpdates } = mapDispatchToProps;
      const urn = FIXTURE_URN;
      const typename = "SomeFixture";

      expect(dispatchUnsubscribeFixtureUpdates(urn, typename)).toEqual({
        type: UNSUBSCRIBE_FIXTURE_UPDATES,
        payload: { urn, typename },
      });
    });
  });
});
