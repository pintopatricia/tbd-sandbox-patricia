import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("Bet Legs/Bet Builder Connected Component", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    describe("when there's no confirmation", () => {
      it("should return false", () => {
        const props = makeMapStateToProps()({});

        expect(props).toEqual(false);
      });
    });

    describe("when there's a confirmation", () => {
      describe("when BETTING_GROUP_SWITCH", () => {
        it("should return correct title", () => {
          const { title } = makeMapStateToProps()({ confirmation: { id: "BETTING_GROUP_SWITCH" } });

          expect(title).toEqual("I18N.CONFIRMATION.TITLE.CLEAR_BETSLIP");
        });

        it("should return correct subtitle", () => {
          const { subtitle } = makeMapStateToProps()({ confirmation: { id: "BETTING_GROUP_SWITCH" } });

          expect(subtitle).toEqual("I18N.CONFIRMATION.SUBTITLE.CLEAR_BETSLIP");
        });

        describe("when returning refuse", () => {
          describe("when REAL", () => {
            it("should return to keep real bet", () => {
              const { refuse } = makeMapStateToProps()({
                confirmation: { id: "BETTING_GROUP_SWITCH" },
                betslip: { group: "REAL" },
              });

              expect(refuse).toEqual("I18N.CONFIRMATION.KEEP_REAL_BETSLIP");
            });
          });

          describe("when VIRTUAL", () => {
            it("should return to keep virtual bet", () => {
              const { refuse } = makeMapStateToProps()({
                confirmation: { id: "BETTING_GROUP_SWITCH" },
                betslip: { group: "VIRTUAL" },
              });

              expect(refuse).toEqual("I18N.CONFIRMATION.KEEP_VIRTUAL_BETSLIP");
            });
          });
        });

        it("should return correct accept", () => {
          const { accept } = makeMapStateToProps()({ confirmation: { id: "BETTING_GROUP_SWITCH" } });

          expect(accept).toEqual("I18N.CONFIRMATION.CLEAR_BETSLIP");
        });
      });

      describe("when BETTING_CLEAR", () => {
        it("should return correct title", () => {
          const { title } = makeMapStateToProps()({ confirmation: { id: "BETTING_CLEAR" } });

          expect(title).toEqual("I18N.BETSLIP.REMOVE_ALL_SELECTIONS");
        });

        it("should return correct subtitle", () => {
          const { subtitle } = makeMapStateToProps()({ confirmation: { id: "BETTING_CLEAR" } });

          expect(subtitle).toEqual("I18N.BETSLIP.REMOVE_ALL_QUESTION");
        });

        it("should return correct refuse", () => {
          const { refuse } = makeMapStateToProps()({ confirmation: { id: "BETTING_CLEAR" } });

          expect(refuse).toEqual("I18N.BETSLIP.NO_KEEP_SELECTION");
        });

        it("should return correct accept", () => {
          const { accept } = makeMapStateToProps()({ confirmation: { id: "BETTING_CLEAR" } });

          expect(accept).toEqual("I18N.BETSLIP.YES_CLEAR_BETSLIP");
        });
      });

      describe("when BETTING_BETSLIP_TYPE_SWITCH", () => {
        const fakeLeg = {
          obbBetting: {
            legs: {
              leg1: {
                urn: "urn",
                type: "basic",
                metadata: {
                  eventName: "Event",
                  legTypeDescription: "LegType",
                  aggregatorDescription: "Aggregator",
                  participantsDescription: "Participants",
                  outcomeDescription: "Outcome",
                },
              },
            },
          },
        };

        it("should return correct title", () => {
          const { title } = makeMapStateToProps()({
            confirmation: { id: "BETTING_BETSLIP_TYPE_SWITCH" },
            betting: { obbBetting: { legs: { leg1: fakeLeg } } },
          });

          expect(title).toEqual("I18N.CONFIRMATION.TITLE.CLEAR_BETSLIP");
        });

        describe("when returning subtitle", () => {
          describe("when switching from OBB betslip", () => {
            it("should return correct subtitle", () => {
              const { subtitle } = makeMapStateToProps()({
                confirmation: { id: "BETTING_BETSLIP_TYPE_SWITCH" },
                betting: { obbBetting: { legs: { leg1: fakeLeg } } },
              });

              expect(subtitle).toEqual("I18N.CONFIRMATION.SUBTITLE.CLEAR_BETSLIP_OBB");
            });
          });
          describe("when switching from SBK betslip", () => {
            it("should return correct subtitle", () => {
              const { subtitle } = makeMapStateToProps()({
                confirmation: { id: "BETTING_BETSLIP_TYPE_SWITCH" },
                betting: { obbBetting: { legs: {} } },
              });

              expect(subtitle).toEqual("I18N.CONFIRMATION.SUBTITLE.CLEAR_BETSLIP_SBK");
            });
          });
        });

        describe("when returning refuse", () => {
          describe("when switching from OBB betslip", () => {
            it("should return to keep the OBB betslip", () => {
              const { refuse } = makeMapStateToProps()({
                confirmation: { id: "BETTING_BETSLIP_TYPE_SWITCH" },
                betting: { obbBetting: { legs: { leg1: fakeLeg } } },
              });

              expect(refuse).toEqual("I18N.CONFIRMATION.KEEP_OBB_BETSLIP");
            });
          });

          describe("when switching from SBK betslip", () => {
            it("should return to keep the SBK betslip", () => {
              const { refuse } = makeMapStateToProps()({
                confirmation: { id: "BETTING_BETSLIP_TYPE_SWITCH" },
                betting: { obbBetting: { legs: {} } },
              });

              expect(refuse).toEqual("I18N.CONFIRMATION.KEEP_SBK_BETSLIP");
            });
          });
        });

        it("should return correct accept", () => {
          const { accept } = makeMapStateToProps()({
            confirmation: { id: "BETTING_BETSLIP_TYPE_SWITCH" },
            betting: { obbBetting: { legs: { leg1: fakeLeg } } },
          });

          expect(accept).toEqual("I18N.CONFIRMATION.CLEAR_BETSLIP");
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchActions", () => {
      it("should dispatch passed actions", () => {
        const dispatchSpy = jest.fn();
        const { dispatchActions } = mapDispatchToProps(dispatchSpy);

        dispatchActions([{ type: "x" }, { type: "y" }]);

        expect(dispatchSpy).toHaveBeenCalledWith({ type: "x", payload: { actionLabel: undefined } });
        expect(dispatchSpy).toHaveBeenCalledWith({ type: "y", payload: { actionLabel: undefined } });
        expect(dispatchSpy).toHaveBeenCalledTimes(2);
      });
    });
  });
});
