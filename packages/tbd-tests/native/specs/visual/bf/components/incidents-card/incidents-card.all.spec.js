const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { ShowMoreSO, PebbleListSO, SnackbarSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { startApp } = require("../../../../../helpers/urls");

const showMoreSO = new ShowMoreSO();
const mockService = new MockService();
const notificationSO = new PebbleListSO();
const snackbarSO = new SnackbarSO();

const EVENT_ID = "29465861";
const MODULE_NAME = "incidents-card";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  url: `/football/friendly-matches/rsm-hodonin-v-h-slavia-kromeriz/e-${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        availableToSubscribe: true,
        urn: `ppb:tbd:card:fixture:${EVENT_ID}|0|availableToSubscribe`,
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          __typename: "SportsEvent",
          name: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: `ppb:event:${EVENT_ID}`,
          competition: { urn: "ppb:competition:12345", name: "English Premier League" },
        },
        fixture: {
          __typename: "FootballFixture",
          urn: `ppb:fixture:${EVENT_ID}`,
          home: { name: "Ukraine" },
          away: { name: "Portugal" },
          id: `${EVENT_ID}`,
          scheduledAt: "2025-02-20T13:02:24Z",
          score: {
            home: 14,
            away: 2,
            __typename: "FootballScore",
          },
          duration: {
            period: "REGULAR",
            status: "INPLAY_SECOND_HALF",
            stoppageMinutes: null,
            clock: {
              minute: 66,
              second: 29,
              __typename: "Instant",
            },
            __typename: "FootballDuration",
          },
          penaltyShootout: null,
        },
      },
    },
    {
      node: {
        __typename: "IncidentsCard",
        urn: `ppb:tbd:card:incidents:${EVENT_ID}`,
        showEmptyState: false,
        fixture: {
          __typename: "FootballFixture",
          urn: `ppb:fixture:${EVENT_ID}`,
          home: { name: "Ukraine" },
          away: { name: "Portugal" },
          id: `${EVENT_ID}`,
          scheduledAt: "2025-02-20T13:02:24Z",
          score: {
            home: 14,
            away: 2,
            __typename: "FootballScore",
          },
          duration: {
            period: "REGULAR",
            status: "INPLAY_SECOND_HALF",
            stoppageMinutes: null,
            clock: {
              minute: 66,
              second: 29,
              __typename: "Instant",
            },
            __typename: "FootballDuration",
          },
          penaltyShootout: null,
          incidents: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 20,
                __typename: "Clock",
              },
              details: {
                __typename: "CardIncident",
                cardType: "YELLOW",
                side: "HOME",
                player: {
                  stratingType: "LINEUP",
                  name: "Bill Cipher",
                  id: "102",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 11,
                __typename: "Clock",
              },
              details: {
                __typename: "CardIncident",
                cardType: "YELLOW",
                side: "AWAY",
                player: {
                  id: "6",
                  stratingType: "LINEUP",
                  name: "Pacifina Northwesterfield Alexandrianna Everglade",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 14,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "AWAY",
                goalScorer: {
                  stratingType: "LINEUP",
                  id: "5",
                  name: "Grenda Grendinator",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 8,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "AWAY",
              },
              __typename: "FootballIncident",
            },

            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 46,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 35,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "OWN",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  id: "3",
                  name: "Soosalino Ramireztown Castellanos Mariposa Delacruz",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "EXTRA",
              periodStatus: "INPLAY_SECOND_HALF",
              clock: {
                minute: 124,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "EXTRA",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 47,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 19,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 18,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 17,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 16,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 15,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 14,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 13,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 12,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 11,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "NORMAL",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  name: "Grunkle Stan",
                  id: "2",
                },
              },
              __typename: "FootballIncident",
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              clock: {
                minute: 11,
                __typename: "Clock",
              },
              details: {
                __typename: "GoalIncident",
                goalType: "PENALTY",
                side: "HOME",
                goalScorer: {
                  stratingType: "LINEUP",
                  id: 12,
                  name: "Mabel Pines",
                },
              },
              __typename: "FootballIncident",
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:myAccount",
        quickLinksTitle: "All Competitions",
        links: [
          {
            label: "Deposit",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
            },
            target: "_self",
            icon: "deposit",
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}|0|availableToSubscribe`,
      },
    },
    {
      node: {
        __typename: "IncidentsCard",
        urn: `ppb:tbd:card:incidents:${EVENT_ID}`,
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:myAccount",
      },
    },
  ],
};

const SCA_MOCK = {
  fixture: [
    {
      id: `${EVENT_ID}`,
      score: {
        home: 15,
        away: 2,
        __typename: "FootballScore",
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_SECOND_HALF",
        stoppageMinutes: null,
        clock: {
          minute: 67,
          second: 29,
          __typename: "Instant",
        },
        __typename: "FootballDuration",
      },
      stats: [
        {
          periodStatus: "FULL",
          period: null,
          home: {
            redCards: 1,
          },
          away: {
            redCards: 0,
          },
        },
      ],

      __typename: "FootballFixture",
      incidents: [
        {
          period: "EXTRA",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 108,
            __typename: "Clock",
          },
          details: {
            __typename: "CardIncident",
            cardType: "YELLOW_RED",
            side: "HOME",
            player: {
              stratingType: "LINEUP",
              name: "Bill Cipher",
              id: "102",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 20,
            __typename: "Clock",
          },
          details: {
            __typename: "CardIncident",
            cardType: "YELLOW",
            side: "HOME",
            player: {
              stratingType: "LINEUP",
              name: "Bill Cipher",
              id: "102",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 11,
            __typename: "Clock",
          },
          details: {
            __typename: "CardIncident",
            cardType: "YELLOW",
            side: "AWAY",
            player: {
              stratingType: "LINEUP",
              name: "Pacifina Northwesterfield Alexandrianna Everglade",
              id: "6",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 14,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "AWAY",
            goalScorer: {
              stratingType: "LINEUP",
              id: "5",
              name: "Grenda Grendinator",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 8,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "AWAY",
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_SECOND_HALF",
          clock: {
            minute: 92,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              id: "1312",
              name: "Dipper Pines",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 46,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 35,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "OWN",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              id: "3",
              name: "Soosalino Ramireztown Castellanos Mariposa Delacruz",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "EXTRA",
          periodStatus: "INPLAY_SECOND_HALF",
          clock: {
            minute: 123,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "EXTRA",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 47,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 19,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 18,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 17,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 16,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 15,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 14,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 13,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 12,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 11,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "NORMAL",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              name: "Grunkle Stan",
              id: "2",
            },
          },
          __typename: "FootballIncident",
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          clock: {
            minute: 11,
            __typename: "Clock",
          },
          details: {
            __typename: "GoalIncident",
            goalType: "PENALTY",
            side: "HOME",
            goalScorer: {
              stratingType: "LINEUP",
              id: "12",
              name: "Mabel Pines",
            },
          },
          __typename: "FootballIncident",
        },
      ],
    },
  ],
};

describe("When the user goes to a football event view", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
  });

  describe("And the event is in InPlay and the home team has five incident lines", () => {
    beforeAll(async () => {
      const HOME_VIEW_LINK = getStartViewLink(
        `/football/friendly-matches/rsm-hodonin-v-h-slavia-kromeriz/e-${EVENT_ID}`,
      );
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(snackbarSO.element);
      await snackbarSO.closeButton.click();
      await notificationSO.element.waitForDisplayed({ reverse: true, withinViewport: true });

      await browser.pause(2000); // wait for app to stabilise
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4417]_should_display_the_incident_events_for_both_teams_below_scoreboard`,
      );
    });

    it("[PRPI-4417]_should_display_the_incident_events_for_both_teams_below_scoreboard", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4417]_should_display_the_incident_events_for_both_teams_below_scoreboard`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });

    describe("And then a Goal is scored for the home team and the incident lines are updated with one more line", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
        await browser.waitUntilDisplayed(showMoreSO.element);

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-4917]_should_display_show_more_button_below_incident_events`,
        );
      });

      it("[PRPI-4917]_should_display_show_more_button_below_incident_events", async () => {
        expect(
          (
            await browser.compareScreen(
              `${MODULE_NAME}_[PRPI-4917]_should_display_show_more_button_below_incident_events`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });

      describe("And then the user clicks on 'Show more' button", () => {
        beforeAll(async () => {
          await showMoreSO.element.click();
          await browser.waitUntilEquals(showMoreSO.text, "Show Less");

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1384]_should_display_the_sixth_incident_line_for_the_home_team`,
          );
        });

        it("[PRPI-1384]_should_display_the_sixth_incident_line_for_the_home_team", async () => {
          expect(
            (
              await browser.compareScreen(
                `${MODULE_NAME}_[PRPI-1384]_should_display_the_sixth_incident_line_for_the_home_team`,
              )
            ).misMatchPercentage,
          ).toEqual(0);
        });
      });
    });
  });
});
