import { setupRefreshIntervals, getInterval, DEFAULT_INTERVALS } from "./intervals";

describe("Intervals", () => {
  describe("setupRefreshIntervals", () => {
    beforeEach(() => {
      setupRefreshIntervals(DEFAULT_INTERVALS);
    });

    it("should save intervals", () => {
      expect(getInterval("RANDOM_TLA")).toEqual(undefined);

      setupRefreshIntervals({
        RANDOM_TLA: 2000,
      });

      expect(getInterval("RANDOM_TLA")).toEqual(2000);
    });
  });

  describe("getInterval", () => {
    describe("when interval is number", () => {
      it("should return value", () => {
        setupRefreshIntervals({ SMP: 2222 });

        const interval = getInterval("SMP");
        expect(interval).toEqual(2222);
      });
    });

    describe("when interval is of type InplayIntervalConfig (BLH)", () => {
      it("should return inPlay interval", () => {
        setupRefreshIntervals({
          BLH: {
            inPlay: 1111,
            notInPlay: 9999,
          },
        });

        const interval = getInterval("BLH", { inPlay: true });
        expect(interval).toEqual(1111);
      });

      it("should return notInPlay interval", () => {
        setupRefreshIntervals({
          BLH: {
            inPlay: 1111,
            notInPlay: 9999,
          },
        });

        const interval = getInterval("BLH", { inPlay: false });
        expect(interval).toEqual(9999);
      });
    });

    describe("when interval is of type LoginStatusIntervalConfig (SCA)", () => {
      describe("when user is logged in", () => {
        it("should return inPlay interval", () => {
          setupRefreshIntervals({
            SCA: {
              loggedIn: {
                default: {
                  inPlay: 1111,
                  notInPlay: 9999,
                },
              },
            },
          });

          const interval = getInterval("SCA", { inPlay: true, loggedIn: true });
          expect(interval).toEqual(1111);
        });

        it("should return notInPlay interval", () => {
          setupRefreshIntervals({
            SCA: {
              loggedIn: {
                default: {
                  inPlay: 1111,
                  notInPlay: 9999,
                },
              },
            },
          });

          const interval = getInterval("SCA", { inPlay: false, loggedIn: true });
          expect(interval).toEqual(9999);
        });
      });

      describe("when user is logged out", () => {
        it("should return inPlay interval", () => {
          setupRefreshIntervals({
            SCA: {
              loggedOut: {
                default: {
                  inPlay: 1111,
                  notInPlay: 9999,
                },
              },
            },
          });

          const interval = getInterval("SCA", { inPlay: true, loggedIn: false });
          expect(interval).toEqual(1111);
        });

        it("should return notInPlay interval", () => {
          setupRefreshIntervals({
            SCA: {
              loggedOut: {
                default: {
                  inPlay: 1111,
                  notInPlay: 9999,
                },
              },
            },
          });

          const interval = getInterval("SCA", { inPlay: false, loggedIn: false });
          expect(interval).toEqual(9999);
        });
      });

      describe("when sports id interval is set", () => {
        it("should return inPlay interval", () => {
          setupRefreshIntervals({
            SCA: {
              loggedIn: {
                7: {
                  inPlay: 1111,
                  notInPlay: 9999,
                },
              },
            },
          });

          const interval = getInterval("SCA", { sportId: 7, inPlay: true, loggedIn: true });
          expect(interval).toEqual(1111);
        });

        it("should return notInPlay interval", () => {
          setupRefreshIntervals({
            SCA: {
              loggedIn: {
                7: {
                  inPlay: 1111,
                  notInPlay: 9999,
                },
              },
            },
          });

          const interval = getInterval("SCA", { sportId: 7, inPlay: false, loggedIn: true });
          expect(interval).toEqual(9999);
        });

        it("should return default interval for in play when sports id doesn't match", () => {
          setupRefreshIntervals({
            SCA: {
              loggedIn: {
                default: {
                  inPlay: 2222,
                },
                2: {
                  inPlay: 1111,
                  notInPlay: 9999,
                },
              },
            },
          });

          const interval = getInterval("SCA", { sportId: 7, inPlay: true, loggedIn: true });
          expect(interval).toEqual(2222);
        });
      });
    });

    describe("when interval is of type LoggedInStatusIntervalConfig (COS)", () => {
      describe("when user is logged out", () => {
        it("should return logged out config value when loggedIn is false", () => {
          setupRefreshIntervals({ COS: { loggedOut: 1111 } });

          const interval = getInterval("COS", { loggedIn: false });
          expect(interval).toEqual(1111);
        });
      });

      describe("when user is logged in", () => {
        describe("when default interval is set", () => {
          it("should return inPlay interval", () => {
            setupRefreshIntervals({
              COS: {
                loggedIn: {
                  default: {
                    inPlay: 1111,
                    notInPlay: 9999,
                  },
                },
              },
            });

            const interval = getInterval("COS", { inPlay: true, loggedIn: true });
            expect(interval).toEqual(1111);
          });

          it("should return notInPlay interval", () => {
            setupRefreshIntervals({
              COS: {
                loggedIn: {
                  default: {
                    inPlay: 1111,
                    notInPlay: 9999,
                  },
                },
              },
            });

            const interval = getInterval("COS", { inPlay: false, loggedIn: true });
            expect(interval).toEqual(9999);
          });
        });

        describe("when sports id interval is set", () => {
          it("should return inPlay interval", () => {
            setupRefreshIntervals({
              COS: {
                loggedIn: {
                  7: {
                    inPlay: 1111,
                    notInPlay: 9999,
                  },
                },
              },
            });

            const interval = getInterval("COS", { sportId: 7, inPlay: true, loggedIn: true });
            expect(interval).toEqual(1111);
          });

          it("should return notInPlay interval", () => {
            setupRefreshIntervals({
              COS: {
                loggedIn: {
                  7: {
                    inPlay: 1111,
                    notInPlay: 9999,
                  },
                },
              },
            });

            const interval = getInterval("COS", { sportId: 7, inPlay: false, loggedIn: true });
            expect(interval).toEqual(9999);
          });

          it("should return default interval for in play when sports id doesn't match", () => {
            setupRefreshIntervals({
              COS: {
                loggedIn: {
                  default: {
                    inPlay: 2222,
                  },
                  2: {
                    inPlay: 1111,
                    notInPlay: 9999,
                  },
                },
              },
            });

            const interval = getInterval("COS", { sportId: 7, inPlay: true, loggedIn: true });
            expect(interval).toEqual(2222);
          });
        });
      });
    });
  });
});
