import MockDate from "mockdate";
import betfairSharedDataCookieHelper from "./betfair-shared-data-cookie-helper";

describe("betfairSharedDataCookieHelper", () => {
  beforeEach(() => {
    MockDate.set("1999-06-11 21:00:00"); // 929134800000 TZ=UTC
  });

  describe("when no cookie is passed", () => {
    it("should return currentTimestamp and session type prospect with 1 year of expiration date", () => {
      expect(betfairSharedDataCookieHelper()).toEqual({
        changed: true,
        expires: new Date("2000-06-11 21:00:00"),
        value: "ts=929134800000|st=p",
      });
    });
  });

  describe("when the cookie is passed", () => {
    describe("when user is logged out", () => {
      describe("when session type is reg", () => {
        it("should not change", () => {
          expect(betfairSharedDataCookieHelper(false, "ts=928965600000|st=reg")).toEqual({
            changed: false,
          });
        });
      });

      describe("when session type is not reg", () => {
        describe("when cookie has more than 24 hours", () => {
          it("should return currentTimestamp and session type return prospect", () => {
            expect(betfairSharedDataCookieHelper(false, "ts=928965600000|st=p")).toEqual({
              changed: true,
              expires: new Date("2000-06-11 21:00:00"),
              value: "ts=929134800000|st=rp",
            });
          });
        });
        describe("when cookie has less than 24 hours", () => {
          it("should not change", () => {
            expect(betfairSharedDataCookieHelper(false, "ts=929131100000|st=p")).toEqual({
              changed: false,
            });
          });
        });
      });
    });

    describe("when user is logged in", () => {
      describe("when session type is not reg", () => {
        it("should return cookie with currentTimestamp session type updated to reg", () => {
          expect(betfairSharedDataCookieHelper(true, "ts=929095200000|st=p")).toEqual({
            changed: true,
            expires: new Date("2000-06-11 21:00:00"),
            value: "ts=929134800000|st=reg",
          });
        });
      });

      describe("when session type is reg", () => {
        it("should not change", () => {
          expect(betfairSharedDataCookieHelper(true, "ts=929095200000|st=reg")).toEqual({
            changed: false,
          });
        });
      });
    });
  });
});
