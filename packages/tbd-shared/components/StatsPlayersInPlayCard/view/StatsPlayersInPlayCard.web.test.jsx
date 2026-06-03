import { act, render } from "@testing-library/react";

import { InfoLabelType } from "@ppb/the-wall-common/types";
import { MarketIconName, SystemIconName } from "@ppb/the-wall-icons";
import { EmptyState, InfoLabel, MarketPromo, ScrollableSwimlane } from "@ppb/the-wall-web";

import StatsContentCardPlaceholder from "../../StatsContentCardPlaceholder/StatsContentCardPlaceholder.web";
import useStatsPlayersInPlayCardVM from "../viewmodel/StatsPlayersInPlayCard.viewmodel";

import StatsTable from "./snowflakes/StatsTable/StatsTable.web";
import StatsPlayersInPlayCard from "./StatsPlayersInPlayCard.web";

jest.mock("@ppb/the-wall-common/types", () => ({
  InfoLabelType: {
    BRANDED: "BRANDED",
  },
}));

jest.mock("@ppb/the-wall-icons", () => ({
  MarketIconName: {
    MARKET_RULES: "MARKET_RULES",
  },
  SystemIconName: {
    ACC_SUBTRACT: "ACC_SUBTRACT",
  },
}));

jest.mock("@ppb/the-wall-web", () => ({
  EmptyState: jest.fn(() => <empty-state-mock />),
  InfoLabel: jest.fn(() => <info-label-mock />),
  MarketPromo: jest.fn(() => <market-promo-mock />),
  ScrollableSwimlane: jest.fn(({ children }) => <scrollable-swimlane-mock>{children}</scrollable-swimlane-mock>),
}));

jest.mock("../../StatsContentCardPlaceholder/StatsContentCardPlaceholder.web", () =>
  jest.fn(() => <stats-content-card-placeholder-mock />),
);

jest.mock("../viewmodel/StatsPlayersInPlayCard.viewmodel", () => jest.fn());

jest.mock("./snowflakes/StatsTable/StatsTable.web", () => jest.fn(() => <stats-table-mock />));

const CARD_URN = "card:urn";
const TRANSLATIONS = {
  emptyStateMessageGeneral: "I18N.STATS.NO_STATS_AVAILABLE",
  emptyStateMessageSingleStat: "I18N.STATS.IP_PLAYER_NO_PLAYER_WITH_STATS",
  emptyStateTitle: "I18N.STATS.STATS_UNAVAILABLE",
  player: "I18N.STATS.PLAYER",
  showLess: "I18N.SHOW_LESS",
  showMore: "I18N.SHOW_MORE",
  termsConditions: "I18N.STATS.IP_PLAYER_HELP_SUPPORT",
  total: "I18N.STATS.TOTAL",
};

const onTermsTap = jest.fn();
const onExpandableClickButton = jest.fn();

const renderComponent = () => render(<StatsPlayersInPlayCard urn={CARD_URN} />);

describe("StatsPlayersInPlayCard.web", () => {
  afterEach(jest.clearAllMocks);

  describe("when `useStatsPlayersInPlayCardVM` returns no data", () => {
    describe("and still loading", () => {
      const STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED_LOADING = {
        vm: {
          data: {
            translations: TRANSLATIONS,
          },
          events: { onTermsTap, onExpandableClickButton },
        },
        loading: true,
      };

      beforeEach(() => {
        useStatsPlayersInPlayCardVM.mockReturnValueOnce(STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED_LOADING);

        renderComponent();
      });

      it("should call `useStatsPlayersInPlayCardVM` with the card URN", () => {
        expect(useStatsPlayersInPlayCardVM).toHaveBeenCalledWith(CARD_URN, true);
      });

      it("should call the StatsContentCardPlaceholder", () => {
        expect(StatsContentCardPlaceholder).toHaveBeenCalledWith({}, undefined);
      });
    });

    describe("and the request is called and loaded", () => {
      describe("but has no swimlaneItems", () => {
        const STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED = {
          vm: {
            data: {
              translations: TRANSLATIONS,
              swimlaneItems: [],
            },
            events: { onTermsTap, onExpandableClickButton },
          },
          request: {
            call: jest.fn(),
            loading: false,
            called: true,
          },
        };

        beforeEach(() => {
          useStatsPlayersInPlayCardVM.mockReturnValueOnce(STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED);

          renderComponent();
        });

        it("should call `useStatsPlayersInPlayCardVM` with the card URN", () => {
          expect(useStatsPlayersInPlayCardVM).toHaveBeenCalledWith(CARD_URN, true);
        });

        it("should call the EmptyState with the correct properties", () => {
          expect(EmptyState).toHaveBeenCalledWith(
            {
              isHighlighted: true,
              hasImage: false,
              message: TRANSLATIONS.emptyStateMessageGeneral,
              title: TRANSLATIONS.emptyStateTitle,
            },
            undefined,
          );
        });
      });

      describe("and has swimlaneItems", () => {
        const STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED = {
          vm: {
            data: {
              translations: TRANSLATIONS,
              termsAndConditionsURL: "https://www.fake.com",
              swimlaneItems: [
                {
                  description: "More than 5 description",
                  hasTermsAndConditions: true,
                  stat: "stat 1",
                  tableEntries: [...Array(10).keys()].map((_, index) => ({
                    id: `${index + 1}`,
                    playerName: `Player ${index + 1}`,
                    quantity: index + 1,
                    teamName: "Cenas",
                  })),
                  title: "More than 5 title",
                },
                {
                  description: null,
                  hasTermsAndConditions: true,
                  stat: "stat 2",
                  tableEntries: [],
                  title: "No entries or description title",
                },
                {
                  description: "Less than 5 description",
                  hasTermsAndConditions: false,
                  stat: "stat 3",
                  tableEntries: [
                    {
                      id: "3",
                      playerName: "Diogo Batista",
                      quantity: 1,
                      teamName: "Underlords",
                    },
                  ],
                  title: "Less than 5 title",
                },
              ],
              timestamp: "TIMESTAMP",
            },
            events: { onTermsTap, onExpandableClickButton },
          },
          request: {
            call: jest.fn(),
            loading: false,
            called: true,
          },
        };

        const MORE_THAN_FIVE_ENTRIES = STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED.vm.data.swimlaneItems[0];
        const LESS_THAN_FIVE_ENTRIES = STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED.vm.data.swimlaneItems[2];

        beforeEach(() => {
          useStatsPlayersInPlayCardVM.mockReturnValue(STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED);

          renderComponent();
        });

        it("should call `useStatsPlayersInPlayCardVM` with the card URN", () => {
          expect(useStatsPlayersInPlayCardVM).toHaveBeenCalledWith(CARD_URN, true);
        });

        it("should call the InfoLabel with the correct props", () => {
          expect(InfoLabel).toHaveBeenCalledWith(
            {
              iconName: SystemIconName.ACC_SUBTRACT,
              infoLabelType: InfoLabelType.BRANDED,
              label: "TIMESTAMP",
            },
            undefined,
          );
        });

        it("should call ScrollableSwimlane with the correct props", () => {
          expect(ScrollableSwimlane).toHaveBeenCalledWith(
            {
              children: expect.any(Object),
              isDesktopLayout: true,
              large: true,
              snap: true,
            },
            undefined,
          );
        });

        it("should call MarketPromo with the correct props for items with description", () => {
          expect(MarketPromo).toHaveBeenCalledTimes(2);
          expect(MarketPromo).toHaveBeenCalledWith(
            {
              variant: "info",
              title: MORE_THAN_FIVE_ENTRIES.title,
              description: MORE_THAN_FIVE_ENTRIES.description,
              linkText: TRANSLATIONS.termsConditions,
              signposting: MarketIconName.MARKET_RULES,
              onLinkClick: expect.any(Function),
            },
            undefined,
          );

          expect(MarketPromo).toHaveBeenCalledWith(
            {
              variant: "info",
              title: LESS_THAN_FIVE_ENTRIES.title,
              description: LESS_THAN_FIVE_ENTRIES.description,
              linkText: TRANSLATIONS.termsConditions,
              signposting: MarketIconName.MARKET_RULES,
              onLinkClick: expect.any(Function),
            },
            undefined,
          );
        });

        it("should call EmptyState for items with no table entries", () => {
          expect(EmptyState).toHaveBeenCalledTimes(1);

          expect(EmptyState).toHaveBeenCalledWith(
            {
              hasImage: false,
              isHighlighted: true,
              message: TRANSLATIONS.emptyStateMessageSingleStat,
              title: TRANSLATIONS.emptyStateTitle,
            },
            undefined,
          );
        });

        it("should call StatsTable for items with table entries", () => {
          expect(StatsTable).toHaveBeenCalledTimes(2);

          expect(StatsTable).toHaveBeenCalledWith(
            {
              translations: TRANSLATIONS,
              bodyEntries: MORE_THAN_FIVE_ENTRIES.tableEntries.slice(0, 5),
              onShowMore: expect.any(Function),
              hasShowMore: true,
              isShowMoreOpen: false,
            },
            undefined,
          );

          expect(StatsTable).toHaveBeenCalledWith(
            {
              translations: TRANSLATIONS,
              bodyEntries: LESS_THAN_FIVE_ENTRIES.tableEntries,
              onShowMore: expect.any(Function),
              hasShowMore: false,
              isShowMoreOpen: false,
            },
            undefined,
          );
        });

        describe("onShowMore callback", () => {
          it("should call StatsTable with the updated props", () => {
            const showMoreFn = StatsTable.mock.calls[0][0].onShowMore;

            expect(StatsTable).toHaveBeenCalledTimes(2);

            act(showMoreFn);

            expect(onExpandableClickButton).toHaveBeenCalledWith("card:urn", true);

            expect(StatsTable).toHaveBeenCalledTimes(4);

            expect(StatsTable).toHaveBeenCalledWith(
              {
                translations: TRANSLATIONS,
                bodyEntries: MORE_THAN_FIVE_ENTRIES.tableEntries,
                onShowMore: expect.any(Function),
                hasShowMore: true,
                isShowMoreOpen: true,
              },
              undefined,
            );

            expect(StatsTable).toHaveBeenCalledWith(
              {
                translations: TRANSLATIONS,
                bodyEntries: LESS_THAN_FIVE_ENTRIES.tableEntries,
                onShowMore: expect.any(Function),
                hasShowMore: false,
                isShowMoreOpen: true,
              },
              undefined,
            );
          });
        });

        describe("onTermsClick callback", () => {
          it("should call window.open with the correct props", () => {
            const onTermsClickFn = MarketPromo.mock.calls[0][0].onLinkClick;

            window.open = jest.fn();

            act(onTermsClickFn);

            expect(onTermsTap).toHaveBeenCalledWith("card:urn", "https://www.fake.com", "More than 5 title");

            expect(window.open).toHaveBeenCalledWith(
              STATS_PLAYERS_IN_PLAY_CARD_VM_NO_DATA_CALLED.vm.data.termsAndConditionsURL,
              "_blank",
            );
          });
        });
      });
    });
  });
});
