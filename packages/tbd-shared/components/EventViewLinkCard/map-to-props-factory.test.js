import { PUSH } from "@ppb/tbd-store/actions/router";
import { getEventViewLink } from "@ppb/tbd-store/state/layout/cards/event-viewlinks/event-view-link-cards-selectors";
import { UI__NAVIGATE_TO_EVENT_FROM_SPORT } from "@ppb/tbd-store/actions/navigation";
import { mapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";
import { formatDate } from "../../helpers/dates";

const cardUrnMock = "ppb:bfrb/betting";
const viewLinkMock = {
  runnerNameAway: "",
  runnerNameHome: "test event",
  urn: "ppb:bfrb/betting",
  viewLink: {
    viewUrl: "fake_eventUrl",
    viewUrn: "fake_urn",
  },
};

const getViewLinkMock = {
  urn: "ppb:bfrb/betting",
  eventId: 1023,
  eventName: "test event",
  viewLink: {
    viewUrl: "fake_eventUrl",
    viewUrn: "fake_urn",
  },
};

const stateMock = {
  layouts: {
    swimlanecardgroups: {
      "ppb:tbd:cardgroup#29606443": {
        urn: "ppb:tbd:cardgroup#29606443",
        typename: "SwimlaneCardGroup",
        title: "English Premier League 2",
        items: ["ppb:tbd:eventViewLink:29596042"],
      },
    },
  },
};

const getUserDetails = jest.fn(() => ({ localeCodeBcp47: "locale", timezone: "timezone" }));

jest.mock("@ppb/tbd-store/state/layout/cards/event-viewlinks/event-view-link-cards-selectors", () => ({
  getEventViewLink: jest.fn(() => getViewLinkMock),
}));

jest.mock("../../helpers/dates", () => ({
  formatDate: jest.fn(() => "date formatted"),
  formatTime: jest.fn(() => "time formatted"),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mapStateToProps = makeMapStateToProps();

  describe("when has a viewlink", () => {
    let result;

    describe("when getEventViewLink has dates", () => {
      describe("when is inplay", () => {
        const getViewLinkMockWithStartedAt = {
          ...getViewLinkMock,
          inplay: true,
          startedAt: new Date("2019-07-12 12:30:00"),
        };

        beforeEach(() => {
          getEventViewLink.mockReturnValue(getViewLinkMockWithStartedAt);
          result = mapStateToProps(stateMock, { urn: cardUrnMock });
        });

        it("should call getEventViewLink", () => {
          expect(getEventViewLink).toHaveBeenCalledWith(stateMock, "ppb:bfrb/betting");
        });

        it("should call getUserDetails", () => {
          expect(getUserDetails).toHaveBeenCalledWith(stateMock);
        });

        it("should return a valid viewLink", () => {
          expect(result).toEqual({
            viewlink: {
              ...viewLinkMock,
              inplay: "I18N.SPORT_EVENT.IN_PLAY",
              date: "date formatted",
              dateTime: new Date("2019-07-12 12:30:00").toString(),
              startTime: "time formatted",
            },
          });
        });

        it("should call date formatters with the correct parameters", () => {
          expect(formatDate).toHaveBeenCalledWith(getViewLinkMockWithStartedAt.startedAt, "locale", "timezone");
        });
      });

      describe("when is not inplay", () => {
        const getViewLinkMockWithScheduledAt = {
          ...getViewLinkMock,
          inplay: false,
          scheduledAt: new Date("2019-07-12 12:30:00"),
        };

        beforeEach(() => {
          getEventViewLink.mockReturnValue(getViewLinkMockWithScheduledAt);
          result = mapStateToProps(stateMock, { urn: cardUrnMock });
        });

        it("should call getEventViewLink", () => {
          expect(getEventViewLink).toHaveBeenCalledWith(stateMock, "ppb:bfrb/betting");
        });

        it("should return a valid viewLink", () => {
          expect(result).toEqual({
            viewlink: {
              ...viewLinkMock,
              inplay: "",
              date: "date formatted",
              dateTime: new Date("2019-07-12 12:30:00").toString(),
              startTime: "time formatted",
            },
          });
        });
      });
    });

    describe("when getEventViewLink has team names", () => {
      const getViewLinkWithTeamNames = {
        ...getViewLinkMock,
        home: {
          name: "home name",
        },
        away: {
          name: "away name",
        },
      };

      beforeEach(() => {
        getEventViewLink.mockReturnValue(getViewLinkWithTeamNames);
        result = mapStateToProps(stateMock, { urn: cardUrnMock });
      });

      it("should call getEventViewLink", () => {
        expect(getEventViewLink).toHaveBeenCalledWith(stateMock, "ppb:bfrb/betting");
      });

      it("should return a valid viewLink", () => {
        expect(result).toEqual({
          viewlink: {
            ...viewLinkMock,
            inplay: "",
            runnerNameAway: "away name",
            runnerNameHome: "home name",
          },
        });
      });
    });

    describe("when getEventViewLink has not got dates", () => {
      const getViewLinkMockWithoutDates = {
        ...getViewLinkMock,
        inplay: false,
      };

      beforeEach(() => {
        getEventViewLink.mockReturnValue(getViewLinkMockWithoutDates);
        result = mapStateToProps(stateMock, { urn: cardUrnMock });
      });

      it("should call getEventViewLink", () => {
        expect(getEventViewLink).toHaveBeenCalledWith(stateMock, "ppb:bfrb/betting");
      });

      it("should return a valid viewLink", () => {
        expect(result).toEqual({
          viewlink: {
            ...viewLinkMock,
            inplay: "",
          },
        });
      });
    });
  });

  describe("when has not got a viewlink", () => {
    let result;
    beforeEach(() => {
      getEventViewLink.mockReturnValue(undefined);
      result = mapStateToProps(stateMock, { urn: cardUrnMock });
    });

    it("should call getEventViewLink", () => {
      expect(getEventViewLink).toHaveBeenCalledWith(stateMock, "ppb:bfrb/betting");
    });

    it("should return a valid viewLink", () => {
      expect(result).toEqual({});
    });

    it("should not call getUserDetails", () => {
      expect(getUserDetails).not.toHaveBeenCalled();
    });
  });
});

describe("dispatchClickCard", () => {
  it("should return right data", () => {
    const result = mapDispatchToProps.dispatchClickCard(
      cardUrnMock,
      "sportEventURN",
      viewLinkMock.viewUrl,
      "fixtureURN",
    );

    expect(result).toEqual({
      type: UI__NAVIGATE_TO_EVENT_FROM_SPORT,
      payload: {
        fixtureURN: "fixtureURN",
        sportEventURN: "sportEventURN",
        type: "secondary swimlane",
        cardUrn: cardUrnMock,
        href: viewLinkMock.viewUrl,
      },
    });
  });
});

describe("dispatchPushAction", () => {
  it("should return right data", () => {
    const result = mapDispatchToProps.dispatchPushAction(viewLinkMock);

    expect(result).toEqual({
      type: PUSH,
      payload: viewLinkMock,
    });
  });
});
