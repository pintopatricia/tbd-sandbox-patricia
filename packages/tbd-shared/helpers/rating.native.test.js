import { getDaysBetweenDates, isToday } from "@ppb/tbd-store/helpers/dates";
import rating from "./rating.native";

jest.mock("@ppb/tbd-store/helpers/dates", () => ({
  getDaysBetweenDates: jest.fn(),
  isToday: jest.fn(),
}));

const dateSpy = jest.spyOn(Date, "now");
const DATE_NOW_MOCK = "2021-11-01T00:00:00.000Z";

const { checkRatingRequirements, handleSession } = rating;

function setupCheckRatingRequirements({
  isLoggedIn,
  ratingCount = 0,
  lastRatingDate,
  numberOfBets,
  session,
  daysBetweenDates = 180,
  triggerIsBet = false,
}) {
  const state = {
    rating: {
      ratingCount,
      lastRatingDate,
      numberOfBets,
      session,
    },
    entities: {
      userdetails: isLoggedIn ? { loggedIn: true } : undefined,
    },
  };

  getDaysBetweenDates.mockReturnValue(daysBetweenDates);

  return checkRatingRequirements(state, triggerIsBet);
}

describe("rating", () => {
  let validation;

  beforeEach(() => {
    jest.clearAllMocks();

    dateSpy.mockReturnValue(DATE_NOW_MOCK);
  });

  describe("when calling checkRatingRequirements", () => {
    describe("and is not logged in", () => {
      it("should return false", () => {
        validation = setupCheckRatingRequirements({});

        expect(validation).toBe(false);
      });
    });

    describe("and is logged in", () => {
      describe("and the rating count is bigger than 2", () => {
        it("should return false", () => {
          validation = setupCheckRatingRequirements({ isLoggedIn: true, ratingCount: 3 });

          expect(validation).toBe(false);
        });
      });

      describe("and the rating count is 2", () => {
        it("should return false", () => {
          validation = setupCheckRatingRequirements({ isLoggedIn: true, ratingCount: 2 });

          expect(validation).toBe(false);
        });
      });

      describe("and the rating count is 1", () => {
        describe("and matches all the requirements", () => {
          const ALL_REQUIREMENTS_MOCK = {
            isLoggedIn: true,
            ratingCount: 1,
            lastRatingDate: "2020-01-01T16:01:56.244Z",
            numberOfBets: 10,
            session: { numberOfSessions: 6, lastSessionDate: "2020-05-01T16:01:56.244Z" },
          };

          it("should return true", () => {
            validation = setupCheckRatingRequirements(ALL_REQUIREMENTS_MOCK);

            expect(validation).toBe(true);
          });

          describe("except the number of sessions", () => {
            it("should return false", () => {
              validation = setupCheckRatingRequirements({
                ...ALL_REQUIREMENTS_MOCK,
                session: { ...ALL_REQUIREMENTS_MOCK.session, numberOfSessions: 2 },
              });

              expect(validation).toBe(false);
            });
          });

          describe("except the number of bets", () => {
            it("should return false", () => {
              validation = setupCheckRatingRequirements({
                ...ALL_REQUIREMENTS_MOCK,
                numberOfBets: 1,
              });

              expect(validation).toBe(false);
            });

            describe("and the trigger is a bet", () => {
              describe("and the number of bets is off by 1", () => {
                it("should return true", () => {
                  validation = setupCheckRatingRequirements({
                    ...ALL_REQUIREMENTS_MOCK,
                    numberOfBets: ALL_REQUIREMENTS_MOCK.numberOfBets - 1,
                    triggerIsBet: true,
                  });

                  expect(validation).toBe(true);
                });
              });

              describe("and the number of bets is off by more than 1", () => {
                it("should return false", () => {
                  validation = setupCheckRatingRequirements({
                    ...ALL_REQUIREMENTS_MOCK,
                    numberOfBets: ALL_REQUIREMENTS_MOCK.numberOfBets - 2,
                    triggerIsBet: true,
                  });

                  expect(validation).toBe(false);
                });
              });
            });
          });

          describe("except the number of days between ratings", () => {
            it("should call 'getDaysBetweenDates' with the expected arguments", () => {
              validation = setupCheckRatingRequirements({ ...ALL_REQUIREMENTS_MOCK, daysBetweenDates: 179 });

              expect(getDaysBetweenDates).toHaveBeenCalledWith(
                new Date(DATE_NOW_MOCK),
                ALL_REQUIREMENTS_MOCK.lastRatingDate,
              );
            });

            it("should return false", () => {
              validation = setupCheckRatingRequirements({ ...ALL_REQUIREMENTS_MOCK, daysBetweenDates: 179 });

              expect(validation).toBe(false);
            });
          });
        });
      });

      describe("and the rating count is 0", () => {
        describe("and matches all the requirements", () => {
          const ALL_REQUIREMENTS_MOCK = {
            isLoggedIn: true,
            ratingCount: 0,
            lastRatingDate: undefined,
            numberOfBets: 5,
            session: { numberOfSessions: 3, lastSessionDate: "2020-05-01T16:01:56.244Z" },
          };

          it("should return true", () => {
            validation = setupCheckRatingRequirements(ALL_REQUIREMENTS_MOCK);

            expect(validation).toBe(true);
          });

          describe("except the number of sessions", () => {
            it("should return false", () => {
              validation = setupCheckRatingRequirements({
                ...ALL_REQUIREMENTS_MOCK,
                session: { ...ALL_REQUIREMENTS_MOCK.session, numberOfSessions: 2 },
              });

              expect(validation).toBe(false);
            });
          });

          describe("except the number of bets", () => {
            it("should return false", () => {
              validation = setupCheckRatingRequirements({
                ...ALL_REQUIREMENTS_MOCK,
                numberOfBets: 1,
              });

              expect(validation).toBe(false);
            });

            describe("and the trigger is a bet", () => {
              describe("and the number of bets is off by 1", () => {
                it("should return true", () => {
                  validation = setupCheckRatingRequirements({
                    ...ALL_REQUIREMENTS_MOCK,
                    numberOfBets: ALL_REQUIREMENTS_MOCK.numberOfBets - 1,
                    triggerIsBet: true,
                  });

                  expect(validation).toBe(true);
                });
              });

              describe("and the number of bets is off by more than 1", () => {
                it("should return false", () => {
                  validation = setupCheckRatingRequirements({
                    ...ALL_REQUIREMENTS_MOCK,
                    numberOfBets: ALL_REQUIREMENTS_MOCK.numberOfBets - 2,
                    triggerIsBet: true,
                  });

                  expect(validation).toBe(false);
                });
              });
            });
          });
        });
      });
    });
  });

  describe("when calling handleSession", () => {
    describe("and session is undefined", () => {
      it("should return a new session with the current date and increment the number of sessions by 1", () => {
        validation = handleSession(undefined);

        expect(validation).toEqual({
          lastSessionDate: new Date(Date.now()),
          numberOfSessions: 1,
        });
      });
    });

    describe("and there is no lastSessionDate", () => {
      it("should return a new session with the current date and increment the number of sessions by 1", () => {
        validation = handleSession({ lastSessionDate: undefined });

        expect(validation).toEqual({
          lastSessionDate: new Date(Date.now()),
          numberOfSessions: 1,
        });
      });
    });

    describe("and the lastSessionDate is not today", () => {
      it("should return a new session with the current date and increment the number of sessions by 1", () => {
        isToday.mockReturnValue(false);

        validation = handleSession({ lastSessionDate: new Date("2020-05-01T16:01:56.244Z"), numberOfSessions: 1 });

        expect(validation).toEqual({
          lastSessionDate: new Date(Date.now()),
          numberOfSessions: 2,
        });
      });
    });

    describe("and the lastSessionDate is today", () => {
      it("should return the same session", () => {
        const SESSION_MOCK = { lastSessionDate: new Date(Date.now()), numberOfSessions: 2 };
        isToday.mockReturnValue(true);

        validation = handleSession(SESSION_MOCK);

        expect(validation).toEqual(SESSION_MOCK);
      });
    });
  });
});
