import { getSportByURN } from "../../../entities/sports/sport-selectors";
import { getCompetitionByURN } from "../../../entities/competitions/competition-selectors";
import { createCompetitionViewLinkCardHydratedByURNSelector } from "./competition-viewlinks-selectors";

const cardUrnMock = "ppb:tbd:card:sportviewlink:123";
const sportUrnMock = "ppb:tbd:eventType:1";
const competitionUrnMock = "ppb:tbd:competition:987";

const competitionViewLinkCardMock = {
  urn: cardUrnMock,
  competition: competitionUrnMock,
};

const sportMock = {
  urn: sportUrnMock,
};

const competitionMock = {
  urn: competitionUrnMock,
  sport: sportMock,
};

const stateMock = {
  layouts: {
    cards: {
      competitionviewlinks: {
        [cardUrnMock]: competitionViewLinkCardMock,
      },
    },
  },
  entities: {
    sports: {
      [sportUrnMock]: sportMock,
    },
    competitions: {
      [competitionUrnMock]: competitionMock,
    },
  },
};

const getCompetitionViewLinkCardByURN = jest.fn(() => competitionViewLinkCardMock);

jest.mock("../../../entities/competitions/competition-selectors", () => ({
  getCompetitionByURN: jest.fn(() => competitionMock),
}));
jest.mock("../../../entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(() => sportMock),
}));
jest.mock("../cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getCompetitionViewLinkCardByURN),
}));

describe("competitionviewlink selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("createCompetitionViewLinkCardHydratedByURNSelector", () => {
    describe("when all the card data exists", () => {
      it("should return the hydrated competition view link card", () => {
        expect(createCompetitionViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual({
          competition: competitionMock,
          sport: sportMock,
          card: competitionViewLinkCardMock,
        });
      });
    });

    describe("when there's no sport", () => {
      it("should return undefined", () => {
        getSportByURN.mockReturnValueOnce(undefined);

        expect(createCompetitionViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });

    describe("when there's no competition", () => {
      it("should return undefined", () => {
        getCompetitionByURN.mockReturnValueOnce(undefined);

        expect(createCompetitionViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });

    describe("when there's no card with the specified URN", () => {
      it("should return undefined", () => {
        getCompetitionViewLinkCardByURN.mockReturnValueOnce(undefined);
        getCompetitionByURN.mockReturnValueOnce(undefined);
        getSportByURN.mockReturnValueOnce(undefined);

        expect(createCompetitionViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });
  });
});
