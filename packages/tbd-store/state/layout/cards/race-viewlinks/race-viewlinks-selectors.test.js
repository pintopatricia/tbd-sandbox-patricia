import {
  createRaceViewLinkCardHydratedByURNSelector,
  createRaceViewLinksCardHydratedByURNSelector,
} from "./race-viewlinks-selectors";
import { createRaceByURNSelector } from "../../../entities/races/race-selectors";
import { createCardByURNSelector } from "../cards-selectors";
import { createMeetingByURNSelector } from "../../../entities/meetings/meeting-selectors";
import { getSportByURN } from "../../../entities/sports/sport-selectors";

jest.mock("../cards-selectors");
jest.mock("../../../entities/races/race-selectors");
jest.mock("../../../entities/meetings/meeting-selectors");
jest.mock("../../../entities/sports/sport-selectors");

describe("createRaceViewLinksCardHydratedByURNSelector", () => {
  describe("when no card with that URN exists", () => {
    let state;
    const setup = () => {
      state = {
        layouts: {
          cards: {
            raceviewlinks: {
              "ppb:tbd:card:raceviewlinks:29980518": {
                urn: "ppb:tbd:card:raceviewlinks:29980518",
              },
            },
          },
        },
        entities: {
          races: {},
        },
      };

      createCardByURNSelector.mockReturnValue(() => undefined);
      createRaceByURNSelector.mockReturnValue(() => undefined);
    };

    it("should return undefined", () => {
      setup();

      expect(createRaceViewLinksCardHydratedByURNSelector()(state, "card:3")).toEqual(undefined);
    });
  });

  describe("when the card exists", () => {
    let state;
    const raceViewLinkCard = {
      urn: "ppb:tbd:card:raceviewlinks:1",
      typename: "RaceViewLinksCard",
      race: "ppb:race:1",
      raceViewLinks: [
        {
          viewLink: {
            viewUrn: "viewLinkURN1",
            viewUrl: "viewLinkURL1",
          },
          race: "pbb:race:1",
          marketPromo: {
            title: "Title",
            description: "Description",
            signposting: "EXTRA_PLACES",
          },
        },
      ],
    };
    const race = {
      urn: "ppb:race:1",
      meeting: "ppb:meeting:1",
      startTime: new Date("2020-07-14T12:35:00.000Z"),
      name: "Win Each Way",
      runners: null,
      details: null,
    };
    const setup = () => {
      state = {
        layouts: {
          cards: {
            raceviewlinks: {
              "ppb:tbd:card:raceviewlinks:1": raceViewLinkCard,
            },
          },
        },
        entities: {
          races: {
            "ppb:race:1": race,
          },
        },
      };

      createCardByURNSelector.mockReturnValue(() => raceViewLinkCard);
      createRaceByURNSelector.mockReturnValue(() => race);
    };

    it("should return the race viewlinks card with the race information", () => {
      setup();

      expect(createRaceViewLinksCardHydratedByURNSelector()(state, "ppb:tbd:card:raceviewlinks:1")).toEqual({
        urn: "ppb:tbd:card:raceviewlinks:1",
        typename: "RaceViewLinksCard",
        race: {
          urn: "ppb:race:1",
          meeting: "ppb:meeting:1",
          startTime: new Date("2020-07-14T12:35:00.000Z"),
          name: "Win Each Way",
          runners: null,
          details: null,
        },
        raceViewLinks: [
          {
            viewLink: {
              viewUrn: "viewLinkURN1",
              viewUrl: "viewLinkURL1",
            },
            race: {
              urn: "ppb:race:1",
              meeting: "ppb:meeting:1",
              startTime: new Date("2020-07-14T12:35:00.000Z"),
              name: "Win Each Way",
              runners: null,
              details: null,
            },
            marketPromo: {
              title: "Title",
              description: "Description",
              signposting: "EXTRA_PLACES",
            },
          },
        ],
      });
    });
  });
});

describe("createRaceViewLinkCardHydratedByURNSelector", () => {
  const raceViewLinkCard = {
    urn: "ppb:tbd:card:raceviewlink:1",
    typename: "RaceViewLinkCard",
    race: "ppb:race:1",
  };

  const race = {
    urn: "ppb:race:1",
    meeting: "ppb:meeting:1",
  };

  const meeting = {
    urn: "ppb:meeting:1",
    sportUrn: "ppb:eventType:1",
  };

  const sport = {
    urn: "pbb:eventType:1",
  };

  const state = {
    layouts: {
      cards: {
        raceviewlink: {
          "ppb:tbd:card:raceviewlink:1": raceViewLinkCard,
        },
      },
    },
    entities: {
      races: {
        "ppb:race:1": race,
      },
      meetings: {
        "ppb:meeting:1": meeting,
      },
      sports: {
        "ppb:eventType:1": sport,
      },
    },
  };

  beforeEach(jest.resetAllMocks);

  describe("when there's no card with the specified URN", () => {
    it("should return undefined", () => {
      createCardByURNSelector.mockReturnValue(() => undefined);

      expect(createRaceViewLinkCardHydratedByURNSelector()(state, "ppb:tbd:card:raceviewlink:1")).toEqual(undefined);
    });
  });

  describe("when there's no race", () => {
    it("should return undefined", () => {
      createCardByURNSelector.mockReturnValue(() => raceViewLinkCard);
      createRaceByURNSelector.mockReturnValue(() => undefined);

      expect(createRaceViewLinkCardHydratedByURNSelector()(state, "ppb:tbd:card:raceviewlink:1")).toEqual(undefined);
    });
  });

  describe("when there's no meeting", () => {
    it("should return undefined", () => {
      createCardByURNSelector.mockReturnValue(() => raceViewLinkCard);
      createRaceByURNSelector.mockReturnValue(() => race);
      createMeetingByURNSelector.mockReturnValue(() => undefined);

      expect(createRaceViewLinkCardHydratedByURNSelector()(state, "ppb:tbd:card:raceviewlink:1")).toEqual(undefined);
    });
  });

  describe("when meeting exists but has no sportUrn", () => {
    it("should call getSportByURN with an empty string as argument", () => {
      createCardByURNSelector.mockReturnValue(() => raceViewLinkCard);
      createRaceByURNSelector.mockReturnValue(() => race);
      createMeetingByURNSelector.mockReturnValue(() => ({ ...meeting, sportUrn: undefined }));

      createRaceViewLinkCardHydratedByURNSelector()(state, "ppb:tbd:card:raceviewlink:1");

      expect(getSportByURN).toHaveBeenCalledWith(
        {
          "ppb:eventType:1": sport,
        },
        "",
      );
    });
  });

  describe("when meeting exists and has a sportUrn", () => {
    it("should call getSportByURN with an that URN as argument", () => {
      createCardByURNSelector.mockReturnValue(() => raceViewLinkCard);
      createRaceByURNSelector.mockReturnValue(() => race);
      createMeetingByURNSelector.mockReturnValue(() => meeting);

      createRaceViewLinkCardHydratedByURNSelector()(state, "ppb:tbd:card:raceviewlink:1");

      expect(getSportByURN).toHaveBeenCalledWith(
        {
          "ppb:eventType:1": sport,
        },
        meeting.sportUrn,
      );
    });
  });

  describe("when there's no sport", () => {
    it("should return undefined", () => {
      createCardByURNSelector.mockReturnValue(() => raceViewLinkCard);
      createRaceByURNSelector.mockReturnValue(() => race);
      createMeetingByURNSelector.mockReturnValue(() => meeting);
      getSportByURN.mockReturnValue(undefined);

      expect(createRaceViewLinkCardHydratedByURNSelector()(state, "ppb:tbd:card:raceviewlink:1")).toEqual(undefined);
    });
  });

  describe("when all the card data exists", () => {
    it("should return the hydrated sport view link card", () => {
      createCardByURNSelector.mockReturnValue(() => raceViewLinkCard);
      createRaceByURNSelector.mockReturnValue(() => race);
      createMeetingByURNSelector.mockReturnValue(() => meeting);
      getSportByURN.mockReturnValue(sport);

      expect(createRaceViewLinkCardHydratedByURNSelector()(state, "ppb:tbd:card:raceviewlink:1")).toEqual({
        card: raceViewLinkCard,
        race,
        meeting,
        sport,
      });
    });
  });
});
