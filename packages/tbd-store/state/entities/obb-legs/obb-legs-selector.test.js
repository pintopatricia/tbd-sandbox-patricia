import { buildObbLegSelector } from "./builders/obb-selector-leg-builder";
import { createObbLegByIdSelector, buildObbLeg } from "./obb-legs-selector";

jest.mock("../user-preferences/user-preferences-selectors", () => ({
  createSportsbookDisplayOddsPreferencesSelector: jest.fn(),
}));

jest.mock("../../layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("./builders/obb-selector-leg-builder", () => ({
  buildObbLegSelector: jest.fn(),
}));

const obbIncidentTypes = {
  GOALS_TIME_ADJUSTED: {
    id: "GOALS_TIME_ADJUSTED",
  },
  GOALS: {
    id: "GOALS",
  },
  SHOTS: {
    id: "SHOTS",
  },
  BOOKED: {
    id: "BOOKED",
  },
};

const obbParticipants = {
  "ppb:obb:footballPlayer:4404/e/33956657": {
    urn: "ppb:obb:footballPlayer:4404/e/33956657",
    player: {
      id: "4404",
      name: "Ashley Barnes",
    },
    team: {
      name: "Burnley",
    },
  },
  "ppb:obb:footballPlayer:4405/e/33956657": {
    urn: "ppb:obb:footballPlayer:4405/e/33956657",
    player: {
      id: "4405",
      name: "Carl Barnes",
    },
    team: {
      name: "Burnley",
    },
  },
};

const obbLeg = {
  id: "b6139aa8a3cf3e98",
  templateId: "squadBet",
  event: {
    typename: "SportsEvent",
    urn: "ppb:event:34278006",
    name: "Man Utd v Athletic Bilbao",
  },
  quote: {
    typename: "ObbQuoteSuccess",
    price: {
      typename: "ObbOdds",
      decimal: 1.5,
      fractional: {
        typename: "FractionalOdds",
        numerator: 3,
        denominator: 2,
      },
    },
  },
  templateParams: {
    participants: [
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
    ],
    outcomeId: "GOALS",
    value: 2,
  },
};

const obbLegs = {
  [obbLeg.id]: obbLeg,
};

const stateMock = {
  layouts: {
    cards: {
      obbcards: {},
    },
  },
  entities: {
    obbIncidentTypes,
    obbParticipants,
    obbLegs,
  },
};

describe("obb legs selectors", () => {
  describe("createObbLegByIdSelector", () => {
    describe("when the obbLeg is defined", () => {
      it("should call buildObbLegSelector with the correct parameters", () => {
        createObbLegByIdSelector()(stateMock, obbLeg.id);

        expect(buildObbLegSelector).toHaveBeenCalledWith(obbLeg, obbParticipants);
      });
    });

    describe("when the selecting urn is not found", () => {
      it("should return undefined", () => {
        expect(createObbLegByIdSelector()(stateMock, "123")).toBeUndefined();
      });
    });
  });
});

describe("buildObbLeg", () => {
  describe("when the leg is not defined", () => {
    it("should return undefined", () => {
      expect(buildObbLeg(undefined)).toBeUndefined();
    });
  });
});
