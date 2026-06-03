import { buildSbkPlaceBetButtonLabels } from "./betslip-place-button-helper";

jest.mock("./i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues: { stake, odds } = {} }) => {
    const stakeLabel = stake ? ` | STAKE: ${stake}` : "";
    const oddsLabel = odds ? ` | ODDS: ${odds}` : "";

    return `${key}${stakeLabel}${oddsLabel}`;
  }),
}));

describe("buildSbkPlaceBetButtonLabels", () => {
  describe("when the user is logged out", () => {
    describe("and has no stake", () => {
      it("should return the enter stake label", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: false,
            hasStake: false,
          }),
        ).toEqual({
          label: "I18N.BETSLIP.ENTER_STAKE",
          reverseLabels: false,
        });
      });
    });
    describe("and has stake", () => {
      it("should return the login label", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: false,
            hasStake: true,
          }),
        ).toEqual({
          label: "I18N.BETSLIP.LOGIN_PLACE_BET",
          reverseLabels: false,
        });
      });
    });
  });

  describe("when the user is authenticating after login press", () => {
    it("should return the ellipsis label (overriding login label) while not yet logged in", () => {
      expect(
        buildSbkPlaceBetButtonLabels({
          isLoggedIn: false,
          isAuthenticating: true,
          hasStake: true,
        }),
      ).toEqual({
        label: "…",
        reverseLabels: false,
      });
    });

    it("should not return the ellipsis label when there is no stake", () => {
      expect(
        buildSbkPlaceBetButtonLabels({
          isLoggedIn: false,
          isAuthenticating: true,
          hasStake: false,
        }),
      ).toEqual({
        label: "I18N.BETSLIP.ENTER_STAKE",
        reverseLabels: false,
      });
    });

    it("should not return the ellipsis label once user is logged in", () => {
      expect(
        buildSbkPlaceBetButtonLabels({
          isLoggedIn: true,
          isAuthenticating: true,
          hasStake: true,
          interpolatedValues: { stake: "$1.00" },
        }),
      ).toEqual({
        label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
        reverseLabels: false,
      });
    });
  });

  describe("when the user is placing a bet", () => {
    it("should return the placing bet loading label", () => {
      expect(
        buildSbkPlaceBetButtonLabels({
          isLoggedIn: true,
          isPlacing: true,
        }),
      ).toEqual({
        label: "",
        loadingLabel: "I18N.BETSLIP.PLACING_BET",
        reverseLabels: false,
      });
    });
  });

  describe("when all markets are closed/suspended", () => {
    it("should return the suspended label", () => {
      expect(buildSbkPlaceBetButtonLabels({ isLoggedIn: true, isSuspended: true })).toEqual({
        label: "I18N.BETSLIP.SUSPENDED",
        reverseLabels: false,
      });
    });
  });

  describe("when deposit is required", () => {
    describe("and isConfirmationStep is false", () => {
      it("should return the deposit and place message", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            isDepositRequired: true,
            hasStake: true,
            interpolatedValues: { stake: "$1.00" },
          }),
        ).toEqual({
          label: "I18N.BETSLIP.DEPOSIT_TO_PLACE_STAKE_BET | STAKE: $1.00",
          reverseLabels: false,
        });
      });
    });

    describe("and isConfirmationStep is true", () => {
      it("should return the deposit and confirm message", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            isConfirmationStep: true,
            isDepositRequired: true,
            hasStake: true,
            interpolatedValues: { stake: "$1.00" },
          }),
        ).toEqual({
          label: "I18N.BETSLIP.DEPOSIT_TO_CONFIRM_STAKE_BET | STAKE: $1.00",
          reverseLabels: false,
        });
      });
    });
  });

  describe("when betslip have generosity wallets enabled", () => {
    describe("and there's no stake available", () => {
      describe("and there's no odds changes", () => {
        describe("and there are no generosity tokens available", () => {
          it("should return the default label", () => {
            expect(
              buildSbkPlaceBetButtonLabels({
                isLoggedIn: true,
                hasGenerosityWallets: true,
                hasStake: false,
                hasGenerosityTokens: false,
              }),
            ).toEqual({
              label: "I18N.BETSLIP.PLACE_BET",
              reverseLabels: false,
            });
          });
        });

        describe("and there are generosity tokens available", () => {
          it("should return the enter stake label", () => {
            expect(
              buildSbkPlaceBetButtonLabels({
                isLoggedIn: true,
                hasGenerosityWallets: true,
                hasStake: false,
                hasGenerosityTokens: true,
              }),
            ).toEqual({
              label: "I18N.BETSLIP.ENTER_STAKE",
              reverseLabels: false,
            });
          });
        });
      });

      describe("and have odds changes with odds value", () => {
        describe("and there are no generosity tokens available", () => {
          it("should return the default label with accept odds value", () => {
            expect(
              buildSbkPlaceBetButtonLabels({
                isLoggedIn: true,
                hasGenerosityWallets: true,
                hasGenerosityTokens: false,
                hasStake: false,
                hasOddsChanged: true,
                interpolatedValues: { odds: "2" },
              }),
            ).toEqual({
              label: "I18N.BETSLIP.PLACE_BET",
              secondaryLabel: "I18N.BETSLIP.ACCEPT_VALUE_AND_PLACE | ODDS: 2",
              reverseLabels: true,
            });
          });
        });

        describe("and there are generosity tokens available", () => {
          it("should return the default label with accept odds value", () => {
            expect(
              buildSbkPlaceBetButtonLabels({
                isLoggedIn: true,
                hasGenerosityWallets: true,
                hasGenerosityTokens: true,
                hasStake: false,
                hasOddsChanged: true,
                interpolatedValues: { odds: "2" },
              }),
            ).toEqual({
              label: "I18N.BETSLIP.ENTER_STAKE",
              reverseLabels: false,
            });
          });
        });
      });

      describe("and have odds changes without odds value", () => {
        describe("and there are no generosity tokens available", () => {
          it("should return the default label with accept odds without value", () => {
            expect(
              buildSbkPlaceBetButtonLabels({
                isLoggedIn: true,
                hasGenerosityWallets: true,
                hasGenerosityTokens: false,
                hasStake: false,
                hasOddsChanged: true,
              }),
            ).toEqual({
              label: "I18N.BETSLIP.PLACE_BET",
              secondaryLabel: "I18N.BETSLIP.ACCEPT_ODDS_AND_PLACE",
              reverseLabels: true,
            });
          });
        });

        describe("and there are generosity tokens available", () => {
          it("should return the default label with accept odds without value", () => {
            expect(
              buildSbkPlaceBetButtonLabels({
                isLoggedIn: true,
                hasGenerosityWallets: true,
                hasGenerosityTokens: true,
                hasStake: false,
                hasOddsChanged: true,
              }),
            ).toEqual({
              label: "I18N.BETSLIP.ENTER_STAKE",
              reverseLabels: false,
            });
          });
        });
      });
    });

    describe("and isConfirmationStep is false", () => {
      describe("and have stake", () => {
        it("should return the place with stake message", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              hasGenerosityWallets: true,
              hasStake: true,
              interpolatedValues: { stake: "$1.00" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
            reverseLabels: false,
          });
        });
      });

      describe("and have stake, and have odds changes with odds value", () => {
        it("should return the place with stake message and accept odds with value, reversed", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              hasGenerosityWallets: true,
              hasStake: true,
              hasOddsChanged: true,
              interpolatedValues: { stake: "$1.00", odds: "2" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
            secondaryLabel: "I18N.BETSLIP.ACCEPT_VALUE_AND_PLACE | ODDS: 2",
            reverseLabels: true,
          });
        });
      });

      describe("and have stake, and have odds changes without odds value", () => {
        it("should return the place with stake message and accept odds without value, reversed", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              hasGenerosityWallets: true,
              hasStake: true,
              hasOddsChanged: true,
              interpolatedValues: { stake: "$1.00" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
            secondaryLabel: "I18N.BETSLIP.ACCEPT_ODDS_AND_PLACE",
            reverseLabels: true,
          });
        });
      });
    });

    describe("and isConfirmationStep is true", () => {
      describe("and have stake", () => {
        it("should return the place with stake message", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              isConfirmationStep: true,
              hasGenerosityWallets: true,
              hasStake: true,
              interpolatedValues: { stake: "$1.00" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.CONFIRM_PLACE_STAKE_BET | STAKE: $1.00",
            reverseLabels: false,
          });
        });
      });

      describe("and have stake, and have odds changes with odds value", () => {
        it("should return the place with stake message and accept odds with value, reversed", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              isConfirmationStep: true,
              hasGenerosityWallets: true,
              hasStake: true,
              hasOddsChanged: true,
              interpolatedValues: { stake: "$1.00", odds: "2" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.CONFIRM_PLACE_STAKE_BET | STAKE: $1.00",
            secondaryLabel: "I18N.BETSLIP.ACCEPT_VALUE_AND_PLACE | ODDS: 2",
            reverseLabels: true,
          });
        });
      });

      describe("and have stake, and have odds changes without odds value", () => {
        it("should return the place with stake message and accept odds without value, reversed", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              isConfirmationStep: true,
              hasGenerosityWallets: true,
              hasStake: true,
              hasOddsChanged: true,
              interpolatedValues: { stake: "$1.00" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.CONFIRM_PLACE_STAKE_BET | STAKE: $1.00",
            secondaryLabel: "I18N.BETSLIP.ACCEPT_ODDS_AND_PLACE",
            reverseLabels: true,
          });
        });
      });
    });
  });

  describe("when betslip doesn't have bonus wallets enabled", () => {
    describe("and there's no stake available", () => {
      it("should return the enter stake label", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            hasStake: false,
          }),
        ).toEqual({
          label: "I18N.BETSLIP.ENTER_STAKE",
          reverseLabels: false,
        });
      });
    });

    describe("and isConfirmationStep is false", () => {
      describe("and have stake", () => {
        it("should return the place with stake message", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              hasStake: true,
              interpolatedValues: { stake: "$1.00" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
            reverseLabels: false,
          });
        });
      });

      describe("and have stake, and have odds changes with odds value", () => {
        it("should return the place with stake message and accept odds with value, reversed", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              hasStake: true,
              hasOddsChanged: true,
              interpolatedValues: { stake: "$1.00", odds: "2" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
            secondaryLabel: "I18N.BETSLIP.ACCEPT_VALUE_AND_PLACE | ODDS: 2",
            reverseLabels: true,
          });
        });
      });

      describe("and have stake, and have odds changes without odds value", () => {
        it("should return the place with stake message and accept odds without value, reversed", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              hasStake: true,
              hasOddsChanged: true,
              interpolatedValues: { stake: "$1.00" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
            secondaryLabel: "I18N.BETSLIP.ACCEPT_ODDS_AND_PLACE",
            reverseLabels: true,
          });
        });
      });
    });

    describe("and isConfirmationStep is true", () => {
      describe("and have stake", () => {
        it("should return the place with stake message", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              isConfirmationStep: true,
              hasStake: true,
              interpolatedValues: { stake: "$1.00" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.CONFIRM_PLACE_STAKE_BET | STAKE: $1.00",
            reverseLabels: false,
          });
        });
      });

      describe("and have stake, and have odds changes with odds value", () => {
        it("should return the place with stake message and accept odds with value, reversed", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              isConfirmationStep: true,
              hasStake: true,
              hasOddsChanged: true,
              interpolatedValues: { stake: "$1.00", odds: "2" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.CONFIRM_PLACE_STAKE_BET | STAKE: $1.00",
            secondaryLabel: "I18N.BETSLIP.ACCEPT_VALUE_AND_PLACE | ODDS: 2",
            reverseLabels: true,
          });
        });
      });

      describe("and have stake, and have odds changes without odds value", () => {
        it("should return the place with stake message and accept odds without value, reversed", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              isConfirmationStep: true,
              hasStake: true,
              hasOddsChanged: true,
              interpolatedValues: { stake: "$1.00" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.CONFIRM_PLACE_STAKE_BET | STAKE: $1.00",
            secondaryLabel: "I18N.BETSLIP.ACCEPT_ODDS_AND_PLACE",
            reverseLabels: true,
          });
        });
      });
    });
  });

  describe("when shouldAcceptOddsMovement preference is enabled", () => {
    describe("and odds have changed", () => {
      it("should NOT show the accept odds secondary label", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            hasStake: true,
            hasOddsChanged: true,
            shouldAcceptOddsMovement: true,
            interpolatedValues: { stake: "$1.00", odds: "5/1" },
          }),
        ).toEqual({
          label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
          reverseLabels: false,
        });
      });

      it("should NOT show the accept odds secondary label even without specific odds value", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            hasStake: true,
            hasOddsChanged: true,
            shouldAcceptOddsMovement: true,
            interpolatedValues: { stake: "$1.00" },
          }),
        ).toEqual({
          label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
          reverseLabels: false,
        });
      });

      describe("with generosity wallets enabled", () => {
        it("should NOT show the accept odds secondary label", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              hasGenerosityWallets: true,
              hasStake: true,
              hasOddsChanged: true,
              shouldAcceptOddsMovement: true,
              interpolatedValues: { stake: "$1.00", odds: "5/1" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
            reverseLabels: false,
          });
        });
      });

      describe("in confirmation step", () => {
        it("should NOT show the accept odds secondary label", () => {
          expect(
            buildSbkPlaceBetButtonLabels({
              isLoggedIn: true,
              isConfirmationStep: true,
              hasStake: true,
              hasOddsChanged: true,
              shouldAcceptOddsMovement: true,
              interpolatedValues: { stake: "$1.00", odds: "5/1" },
            }),
          ).toEqual({
            label: "I18N.BETSLIP.CONFIRM_PLACE_STAKE_BET | STAKE: $1.00",
            reverseLabels: false,
          });
        });
      });
    });

    describe("and no odds have changed", () => {
      it("should return the standard place bet label", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            hasStake: true,
            hasOddsChanged: false,
            shouldAcceptOddsMovement: true,
            interpolatedValues: { stake: "$1.00" },
          }),
        ).toEqual({
          label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
          reverseLabels: false,
        });
      });
    });
  });

  describe("when shouldAcceptOddsMovement preference is disabled", () => {
    describe("and odds have changed", () => {
      it("should show the accept odds secondary label with specific odds value", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            hasStake: true,
            hasOddsChanged: true,
            shouldAcceptOddsMovement: false,
            interpolatedValues: { stake: "$1.00", odds: "5/1" },
          }),
        ).toEqual({
          label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
          secondaryLabel: "I18N.BETSLIP.ACCEPT_VALUE_AND_PLACE | ODDS: 5/1",
          reverseLabels: true,
        });
      });

      it("should show the accept odds secondary label without specific odds value", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            hasStake: true,
            hasOddsChanged: true,
            shouldAcceptOddsMovement: false,
            interpolatedValues: { stake: "$1.00" },
          }),
        ).toEqual({
          label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
          secondaryLabel: "I18N.BETSLIP.ACCEPT_ODDS_AND_PLACE",
          reverseLabels: true,
        });
      });
    });

    describe("and no odds have changed", () => {
      it("should return the standard place bet label without secondary label", () => {
        expect(
          buildSbkPlaceBetButtonLabels({
            isLoggedIn: true,
            hasStake: true,
            hasOddsChanged: false,
            shouldAcceptOddsMovement: false,
            interpolatedValues: { stake: "$1.00" },
          }),
        ).toEqual({
          label: "I18N.BETSLIP.PLACE_STAKE_BET | STAKE: $1.00",
          reverseLabels: false,
        });
      });
    });
  });
});
