import { getSportByURN } from "../../../entities/sports/sport-selectors";
import { createSportViewLinkCardHydratedByURNSelector } from "./sport-viewlinks-selectors";

const cardUrnMock = "ppb:tbd:card:sportviewlink:123";
const sportUrnMock = "ppb:tbd:eventType:1";

const sportViewLinkCardMock = {
  urn: cardUrnMock,
  sport: sportUrnMock,
};

const sportMock = {
  urn: sportUrnMock,
};

const stateMock = {
  layouts: {
    cards: {
      sportviewlinks: {
        [cardUrnMock]: sportViewLinkCardMock,
      },
    },
  },
  entities: {
    sports: {
      [sportUrnMock]: sportMock,
    },
  },
};

const getSportViewLinkCardByURN = jest.fn(() => sportViewLinkCardMock);

jest.mock("../../../entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(() => sportMock),
}));
jest.mock("../cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getSportViewLinkCardByURN),
}));

describe("sportviewlink selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("createSportViewLinkCardHydratedByURNSelector", () => {
    describe("when all the card data exists", () => {
      it("should return the hydrated sport view link card", () => {
        expect(createSportViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual({
          sport: sportMock,
          card: sportViewLinkCardMock,
        });
      });
    });

    describe("when there's no sport", () => {
      it("should return undefined", () => {
        getSportByURN.mockReturnValueOnce(undefined);

        expect(createSportViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });

    describe("when there's no card with the specified URN", () => {
      it("should return undefined", () => {
        getSportViewLinkCardByURN.mockReturnValueOnce(undefined);
        getSportByURN.mockReturnValueOnce(undefined);

        expect(createSportViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });
  });
});
