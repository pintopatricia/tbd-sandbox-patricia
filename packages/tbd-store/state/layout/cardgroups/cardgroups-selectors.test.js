import { createCardGroupByURNSelector, createFindCardGroupByURNSelector } from "./cardgroups-selectors";

const cardGroupsStoreEntities = [
  "swimlanecardgroups",
  "halftimespecialsswimlanecardgroups",
  "segmentedcardgroups",
  "expandablecardgroups",
  "selectableitemscardgroups",
  "pebblecardgroups",
  "gamingcardgroups",
  "futureracingcardgroups",
  "racesbytimerangecardgroups",
  "filteredcouponcardgroups",
  "swimlaneindexedcardgroups",
  "betcardgroups",
  "betsharingcardgroups",
  "sportsbookbetlegcardgroups",
  "sportsbookexpandablelegcardgroups",
  "marketbetcardgroups",
  "marketbetselectioncardgroups",
  "marketbetexpandablecardgroups",
  "virtualcardgroups",
  "extrawalletcardgroups",
  "obbcardgroups",
  "bytimerangemeetingcardgroup",
  "racingswimlanecardgroups",
  "popularswimlanecardgroups",
  "obbcreatedbetscardgroups",
  "obbonboardingcardsgroups",
];

/*
  The "stateMock" output:

  "layouts": {
    "cardgroups": {
      "swimlanecardgroups": {
        "swimlanecardgroups_URN": "swimlanecardgroups_MOCK_DATA"
      },
      ...
    }
  }
*/
const stateMock = {
  layouts: {
    cardgroups: cardGroupsStoreEntities.reduce(
      (acc, cardGroupStoreEntity) => ({
        ...acc,
        [cardGroupStoreEntity]: {
          [`${cardGroupStoreEntity}_URN`]: `${cardGroupStoreEntity}_MOCK_DATA`,
        },
      }),
      {},
    ),
  },
};

describe("CardGroup selectors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCardGroupByURNSelector selector", () => {
    it("must return null when receiving an URN for a non-existing card group", () => {
      const cardGroup = createCardGroupByURNSelector()(stateMock.layouts.cardgroups, "fakeUrn");

      expect(cardGroup).toBe(null);
    });

    it.each(cardGroupsStoreEntities)(`should return the correct cardGroup from "%s"`, async (cardGroupStoreEntity) => {
      const stateCardGroup = stateMock.layouts.cardgroups[cardGroupStoreEntity];
      const cardGroup = createCardGroupByURNSelector()(stateCardGroup, `${cardGroupStoreEntity}_URN`);

      expect(cardGroup).toEqual(stateCardGroup[`${cardGroupStoreEntity}_URN`]);
    });
  });

  describe("createFindCardGroupByURNSelector selector", () => {
    it("must return null when receiving an URN for a non-existing card group", () => {
      const cardGroup = createFindCardGroupByURNSelector()(stateMock.layouts.cardgroups, "fakeUrn");

      expect(cardGroup).toBe(null);
    });

    it.each(cardGroupsStoreEntities)(`should return the correct cardGroup from "%s"`, async (cardGroupStoreEntity) => {
      const stateCardGroups = stateMock.layouts.cardgroups;
      const stateCardGroup = stateCardGroups[cardGroupStoreEntity];

      const cardGroup = createFindCardGroupByURNSelector()(stateCardGroups, `${cardGroupStoreEntity}_URN`);

      expect(cardGroup).toEqual(stateCardGroup[`${cardGroupStoreEntity}_URN`]);
    });
  });
});
