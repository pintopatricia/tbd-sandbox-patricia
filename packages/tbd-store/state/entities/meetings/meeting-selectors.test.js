import { createMeetingByURNSelector } from "./meeting-selectors";

const meetingData = {
  urn: "ppb:meeting:12290316",
  date: new Date("2020-02-28T14:00:00Z"),
  country: "FRA",
  countryFlag: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
  venue: "Ayr",
};

const stateMock = {
  entities: {
    meetings: {
      "ppb:meeting:12290316": meetingData,
    },
  },
};

describe('"meetings" selector', () => {
  describe("createMeetingURNSelector selector", () => {
    it("must return the meeting when it exists", () => {
      const getMeetingByURN = createMeetingByURNSelector();
      const meeting = getMeetingByURN(stateMock.entities.meetings, "ppb:meeting:12290316");

      expect(meeting).toEqual(meetingData);
    });

    it("must return undefined when meeting with urn `ppb:meeting:000000000` doesn't exist", () => {
      const getMeetingByURN = createMeetingByURNSelector();
      const meeting = getMeetingByURN(stateMock.entities.meetings, "ppb:meeting:000000000");

      expect(meeting).toEqual(undefined);
    });

    it("must return undefined when there aren't meetings", () => {
      const getMeetingByURN = createMeetingByURNSelector();
      const meeting = getMeetingByURN({}, "ppb:meeting:12290316");

      expect(meeting).toEqual(undefined);
    });
  });
});
