import { makeMapStateToProps } from "./map-to-props-factory";
import { formatTime, formatDateWithToday } from "../../helpers/dates";

const getEventHeaderCard = jest.fn(() => undefined);
const getUserDetailsSelector = jest.fn(() => ({
  localeCodeBcp47: "localeCodeBcp47",
  timezone: "timezone",
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: () => getEventHeaderCard,
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: () => getUserDetailsSelector,
}));

jest.mock("../../helpers/dates", () => ({
  isToday: jest.fn(() => false),
  formatDateWithToday: jest.fn(() => "DATE FORMAT"),
  formatTime: jest.fn(() => "TIME FORMAT"),
}));

const GENERIC_STATE = {
  layouts: {
    cards: {
      eventheader: "eventheader",
    },
  },
};

const eventHeader = {
  title: "title",
  subtitle: "subtitle",
  tertiaryTitle: "tertiaryTitle",
  sportId: "sportId",
  date: "2023-04-11T19:00:00.000Z",
};

const urn = "ppb:tbd:card:eventHeader:someId/0";
const setupMapStateToProps = () => makeMapStateToProps()(GENERIC_STATE, { urn });

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when event header is not available", () => {
    it("should return empty state", () => {
      const state = setupMapStateToProps();

      expect(getEventHeaderCard).toHaveBeenCalledWith(GENERIC_STATE.layouts.cards.eventheader, urn);
      expect(getUserDetailsSelector).toHaveBeenCalledWith(GENERIC_STATE);

      expect(state).toEqual({});
    });
  });

  describe("when event header is available", () => {
    describe("and date is not defined", () => {
      it("should return state without date and time", () => {
        getEventHeaderCard.mockReturnValueOnce({
          ...eventHeader,
          date: undefined,
        });

        const state = setupMapStateToProps();

        expect(getEventHeaderCard).toHaveBeenCalledWith(GENERIC_STATE.layouts.cards.eventheader, urn);
        expect(getUserDetailsSelector).toHaveBeenCalledWith(GENERIC_STATE);

        expect(formatDateWithToday).not.toHaveBeenCalled();
        expect(formatTime).not.toHaveBeenCalled();

        expect(state).toEqual({
          ...eventHeader,
          date: undefined,
        });
      });
    });

    describe("and date is defined", () => {
      describe("and is today", () => {
        it("should return state with date and time", () => {
          formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");
          getEventHeaderCard.mockReturnValueOnce(eventHeader);

          const state = setupMapStateToProps();

          expect(getEventHeaderCard).toHaveBeenCalledWith(GENERIC_STATE.layouts.cards.eventheader, urn);
          expect(getUserDetailsSelector).toHaveBeenCalledWith(GENERIC_STATE);

          expect(formatDateWithToday).toHaveBeenCalledWith(
            new Date("2023-04-11T19:00:00.000Z"),
            "localeCodeBcp47",
            "timezone",
          );
          expect(formatTime).toHaveBeenCalledWith(expect.any(Object), "localeCodeBcp47", "timezone");

          expect(state).toEqual({
            ...eventHeader,
            date: "I18N.DATE.TODAY",
            time: "TIME FORMAT",
            dateTime: new Date("2023-04-11T19:00:00.000Z"),
          });
        });
      });
    });

    describe("and is not today", () => {
      it("should return state with date and time", () => {
        getEventHeaderCard.mockReturnValueOnce(eventHeader);

        const state = setupMapStateToProps();

        expect(getEventHeaderCard).toHaveBeenCalledWith(GENERIC_STATE.layouts.cards.eventheader, urn);
        expect(getUserDetailsSelector).toHaveBeenCalledWith(GENERIC_STATE);

        expect(formatDateWithToday).toHaveBeenCalledWith(expect.any(Object), "localeCodeBcp47", "timezone");
        expect(formatTime).toHaveBeenCalledWith(expect.any(Object), "localeCodeBcp47", "timezone");

        expect(state).toEqual({
          ...eventHeader,
          date: "DATE FORMAT",
          time: "TIME FORMAT",
          dateTime: new Date("2023-04-11T19:00:00.000Z"),
        });
      });
    });
  });
});
