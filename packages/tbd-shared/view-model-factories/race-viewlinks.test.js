import { createRaceViewLinksViewModel } from "./race-viewlinks";
import { formatTime } from "../helpers/dates";

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

jest.mock("../helpers/dates", () => ({
  formatTime: jest.fn(() => "MOCKED_DATE"),
}));

describe("race viewlinks view model factory", () => {
  describe("createRaceViewLinksViewModel", () => {
    it("should return empty object if the card is missing", () => {
      const getPropsForRaceViewLinksVm = createRaceViewLinksViewModel();

      const result = getPropsForRaceViewLinksVm(null, USER_DETAILS);

      expect(result).toEqual({});
    });

    it("should return initial values if the props are invalid", () => {
      const getPropsForRaceViewLinksVm = createRaceViewLinksViewModel();

      const result = getPropsForRaceViewLinksVm({ raceViewLinks: [], race: "" }, USER_DETAILS);

      expect(result).toEqual({
        raceItems: [],
        defaultRaceIndex: undefined,
      });
    });

    it("should return the correct props for race viewlinks", () => {
      const getPropsForRaceViewLinksVm = createRaceViewLinksViewModel();

      const raceViewLinksCardHydrated = {
        raceViewLinks: [
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:1.100",
              viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C1.100",
            },
            race: {
              urn: "ppb:race:1.100",
              startTime: new Date("2020-10-26T19:10:00.000Z"),
            },
            marketPromo: {
              signposting: "EXTRA_PLACES",
            },
          },
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:2.200",
              viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C2.200",
            },
            race: {
              urn: "ppb:race:2.200",
              startTime: new Date("2020-10-26T19:20:00.000Z"),
            },
            marketPromo: {
              signposting: "EXTRA_PLACES",
            },
          },
        ],
        race: {
          urn: "ppb:race:2.200",
        },
      };

      const result = getPropsForRaceViewLinksVm(raceViewLinksCardHydrated, USER_DETAILS);

      expect(result).toEqual({
        raceItems: [
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:1.100",
              viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C1.100",
            },
            raceTime: "MOCKED_DATE",
            isRaceClosed: false,
            marketPromo: {
              signposting: "EXTRA_PLACES",
            },
          },
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:2.200",
              viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C2.200",
            },
            raceTime: "MOCKED_DATE",
            isRaceClosed: false,
            marketPromo: {
              signposting: "EXTRA_PLACES",
            },
          },
        ],
        defaultRaceIndex: 1,
      });

      expect(formatTime).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
    });

    it("should filter races that are undefined", () => {
      const getPropsForRaceViewLinksVm = createRaceViewLinksViewModel();

      const raceViewLinksCardHydrated = {
        raceViewLinks: [
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:1.100",
              viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C1.100",
            },
            race: undefined,
          },
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:2.200",
              viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C2.200",
            },
            race: {
              urn: "ppb:race:2.200",
              startTime: new Date("2020-10-26T19:20:00.000Z"),
            },
          },
        ],
        race: {
          urn: "ppb:race:2.200",
        },
      };

      const result = getPropsForRaceViewLinksVm(raceViewLinksCardHydrated, USER_DETAILS);

      expect(result).toEqual({
        raceItems: [
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:2.200",
              viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C2.200",
            },
            raceTime: "MOCKED_DATE",
            isRaceClosed: false,
          },
        ],
        defaultRaceIndex: 1,
      });
    });
  });
});
