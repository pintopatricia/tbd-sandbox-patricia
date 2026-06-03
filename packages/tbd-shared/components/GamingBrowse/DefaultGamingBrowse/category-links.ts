import { LinkItems, LinkItem, LinkLocales } from "@ppb/tbd-store/state/layout/views/browse-view/BrowseInterface.types";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { codecs } from "@ppb/tbd-urn-codecs";
import { i18n } from "../../../helpers/i18n";

// FIX:  temporary approach until Browse View content will be created in Prismic
export const generateCategoryLinks = (loggedIn: boolean): LinkItems => ({
  INTERNATIONAL: {
    en_GB: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-new/gs-gaming-new",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-new").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-premium-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
          viewUrn: codecs.gamingCategoryView.encode("gaming-daily-jackpot").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
          viewUrn: codecs.gamingCategoryView.encode("gaming-exclusive").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-roulette/gc-gaming-roulette",
          viewUrn: codecs.gamingCategoryView.encode("gaming-roulette").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-table-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpots/gc-gaming-jackpots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BINGO" }),
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    es: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-nuevos/gs-gaming-nuevos",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-nuevos").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino-es/gs-gaming-premium-casino-es",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-premium-casino-es").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-diario/gc-gaming-jackpot-diario",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-diario").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-exclusivo/gc-gaming-exclusivo",
          viewUrn: codecs.gamingCategoryView.encode("gaming-exclusivo").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-ruleta/gc-gaming-ruleta",
          viewUrn: codecs.gamingCategoryView.encode("gaming-ruleta").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-juegos-de-mesa/gc-gaming-juegos-de-mesa",
          viewUrn: codecs.gamingCategoryView.encode("gaming-juegos-de-mesa").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpots/gc-gaming-jackpots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BINGO" }),
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    es_419: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-nuevos/gs-gaming-nuevos",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-nuevos").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino-es/gs-gaming-premium-casino-es",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-premium-casino-es").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-diario/gc-gaming-jackpot-diario",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-diario").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-exclusivo/gc-gaming-exclusivo",
          viewUrn: codecs.gamingCategoryView.encode("gaming-exclusivo").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-ruleta/gc-gaming-ruleta",
          viewUrn: codecs.gamingCategoryView.encode("gaming-ruleta").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-juegos-de-mesa/gc-gaming-juegos-de-mesa",
          viewUrn: codecs.gamingCategoryView.encode("gaming-juegos-de-mesa").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpots/gc-gaming-jackpots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BINGO" }),
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    hu: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-uj/gs-gaming-uj",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-uj").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-premium-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
          viewUrn: codecs.gamingCategoryView.encode("gaming-daily-jackpot").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
          viewUrn: codecs.gamingCategoryView.encode("gaming-exclusive").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-rulett/gc-gaming-rulett",
          viewUrn: codecs.gamingCategoryView.encode("gaming-rulett").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-table-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpotok/gc-gaming-jackpotok",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpotok").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BINGO" }),
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    fi: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-usi/gs-gaming-usi",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-usi").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-premium-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
          viewUrn: codecs.gamingCategoryView.encode("gaming-daily-jackpot").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
          viewUrn: codecs.gamingCategoryView.encode("gaming-exclusive").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-ruletti/gc-gaming-ruletti",
          viewUrn: codecs.gamingCategoryView.encode("gaming-ruletti").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-table-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpotit/gc-gaming-jackpotit",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpotit").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BINGO" }),
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    pt_BR: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-novos/gs-gaming-novos",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-novos").uid,
        },
        target: "_self",
      },
      // {
      //   text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
      //   viewLink: {
      //     viewUrl: "casino/p/gaming-premium-casino-es/gs-gaming-premium-casino-es",
      //     viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-premium-casino-es",
      //   },
      //   target: "_self",
      // },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-grande-premio-diario/gc-gaming-grande-premio-diario",
          viewUrn: codecs.gamingCategoryView.encode("gaming-grande-premio-diario").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-exclusivo/gc-gaming-exclusivo",
          viewUrn: codecs.gamingCategoryView.encode("gaming-exclusivo").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-roleta/gc-gaming-roleta",
          viewUrn: codecs.gamingCategoryView.encode("gaming-roleta").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jogos-de-mesa/gc-gaming-jogos-de-mesa",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jogos-de-mesa").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-grandes-premios/gc-gaming-grandes-premios",
          viewUrn: codecs.gamingCategoryView.encode("gaming-grandes-premios").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BINGO" }),
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    ru: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-sloty-kazino/gs-gaming-sloty-kazino",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-sloty-kazino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-novinki/gs-gaming-novinki",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-novinki").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
        viewLink: {
          viewUrl: "casino/p/gaming-premium-kazino/gs-gaming-premium-kazino",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-premium-kazino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-yezhednevnyy-dzhekpot/gc-gaming-yezhednevnyy-dzhekpot",
          viewUrn: codecs.gamingCategoryView.encode("gaming-yezhednevnyy-dzhekpot").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-eksklyuzivnyy/gc-gaming-eksklyuzivnyy",
          viewUrn: codecs.gamingCategoryView.encode("gaming-eksklyuzivnyy").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-ruletka/gc-gaming-ruletka",
          viewUrn: codecs.gamingCategoryView.encode("gaming-ruletka").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blekdzhek/gc-gaming-blekdzhek",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blekdzhek").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-nastolnyye-igry/gc-gaming-nastolnyye-igry",
          viewUrn: codecs.gamingCategoryView.encode("gaming-nastolnyye-igry").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-dzhekpoty/gc-gaming-dzhekpoty",
          viewUrn: codecs.gamingCategoryView.encode("gaming-gaming-dzhekpoty").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    no: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-nytt/gs-gaming-nytt",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-nytt").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-premium-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
          viewUrn: codecs.gamingCategoryView.encode("gaming-daily-jackpot").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
          viewUrn: codecs.gamingCategoryView.encode("gaming-exclusive").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-rulett/gc-gaming-rulett",
          viewUrn: codecs.gamingCategoryView.encode("gaming-rulett").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-table-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpoter/gc-gaming-jackpoter",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpoter").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BINGO" }),
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    de: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/p/gaming-neu/gs-gaming-neu",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-neu").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
        viewLink: {
          viewUrl: "casino/p/gaming-premium-kasino/gs-gaming-premium-kasino",
          viewUrn: codecs.gamingSegmentationView.encode("gaming-premium-kasino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-megaways-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpot-king").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
        viewLink: {
          viewUrl: "casino/c/gaming-taglicher-jackpot/gc-gaming-taglicher-jackpot",
          viewUrn: codecs.gamingCategoryView.encode("gaming-taglicher-jackpot").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-exklusiv/gc-gaming-exklusiv",
          viewUrn: codecs.gamingCategoryView.encode("gaming-exklusiv").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/gaming-roulette/gc-gaming-roulette",
          viewUrn: codecs.gamingCategoryView.encode("gaming-roulette").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("gaming-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-casino-tischspiele/gc-gaming-casino-tischspiele",
          viewUrn: codecs.gamingCategoryView.encode("gaming-casino-tischspiele").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpots/gc-gaming-jackpots",
          viewUrn: codecs.gamingCategoryView.encode("gaming-jackpots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: codecs.gamingCategoryView.encode("gaming-all-games").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BINGO" }),
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
  },
  SPAIN: {
    en_GB: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: `casino/gm-${loggedIn ? "casino-homepage-logged-in-and-vip" : "casino-logged-out-homepage-en"}`,
          viewUrn: codecs.gamingView.encode(
            loggedIn ? "casino-homepage-logged-in-and-vip" : "casino-logged-out-homepage-en",
          ).uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: `casino/p-${loggedIn ? "casino-logged-in-promo-hub-en" : "casino-logged-out-promos-hub-en"}`,
          viewUrn: codecs.promotionsView.encode(
            loggedIn ? "casino-logged-in-promo-hub-en" : "casino-logged-out-promos-hub-en",
          ).uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/c/casino-new-en/gc-casino-new-en",
          viewUrn: codecs.gamingCategoryView.encode("casino-new-en").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/c/casino-slots-en/gc-casino-slots-en",
          viewUrn: codecs.gamingCategoryView.encode("casino-slots-en").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/p/casino-live-casino/gs-casino-live-casino",
          viewUrn: codecs.gamingSegmentationView.encode("casino-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/casino-table-en/gc-casino-table-en",
          viewUrn: codecs.gamingCategoryView.encode("casino-table-en").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/casino-blackjack/gc-casino-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("casino-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/casino-jackpots-en/gc-casino-jackpots-en",
          viewUrn: codecs.gamingCategoryView.encode("casino-jackpots-en").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://poker.betfair.es//",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.RTP" }),
        viewLink: {
          viewUrl: "https://casino.betfair.es/info/rtp-info-en/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
    es: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: `casino/gm-${loggedIn ? "casino-homepage-logged-in-and-vip" : "casino-logged-out-homepage"}`,
          viewUrn: codecs.gamingView.encode(
            loggedIn ? "casino-homepage-logged-in-and-vip" : "casino-logged-out-homepage",
          ).uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: `casino/p-${loggedIn ? "promociones-logged-in" : "promociones"}`,
          viewUrn: codecs.promotionsView.encode(loggedIn ? "promociones-logged-in" : "promociones").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/c/casino-nuevos/gc-casino-nuevos",
          viewUrn: codecs.gamingCategoryView.encode("casino-nuevos").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/c/casino-slots/gc-casino-slots",
          viewUrn: codecs.gamingCategoryView.encode("casino-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/p/casino-casino-en-vivo/gs-casino-casino-en-vivo",
          viewUrn: codecs.gamingSegmentationView.encode("casino-casino-en-vivo").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/casino-ruleta/gc-casino-ruleta",
          viewUrn: codecs.gamingCategoryView.encode("casino-ruleta").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/casino-blackjack/gc-casino-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("casino-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/casino-jackpots/gc-casino-jackpots",
          viewUrn: codecs.gamingCategoryView.encode("casino-jackpots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://poker.betfair.es/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.RTP" }),
        viewLink: {
          viewUrl: "https://casino.betfair.es/info/retorno-al-jugador/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
  },
  ITALY: {
    it: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: `casino/gm-1`,
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.NEW" }),
        viewLink: {
          viewUrl: "casino/c/casino-nuovi/gc-casino-nuovi",
          viewUrn: codecs.gamingCategoryView.encode("casino-nuovi").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/casino-rouletten/gc-casino-roulette",
          viewUrn: codecs.gamingCategoryView.encode("casino-roulette").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/casino-blackjack/gc-casino-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("casino-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/c/casino-slot/gc-casino-slot",
          viewUrn: codecs.gamingCategoryView.encode("casino-slot").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/p/casino-casino-live/gs-casino-casino-live",
          viewUrn: codecs.gamingSegmentationView.encode("casino-casino-live").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/casino-jackpots/gc-casino-jackpots",
          viewUrn: codecs.gamingCategoryView.encode("casino-jackpots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "https://casino.betfair.it/c/video-poker/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.BETSLIP.RETURNS" }),
        viewLink: {
          viewUrl: "https://casino.betfair.it/info/it-vincite/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
      {
        text: "T&Cs Bonus",
        viewLink: {
          viewUrl: "https://casino.betfair.it/info/termini-condizioni-generali/",
          viewUrn: codecs.externalView.encode().uid,
          viewDisplayMode: DisplayMode.SelfInapp,
        },
        target: "_self",
      },
    ],
  },
  ROMANIA: {
    ro: [
      {
        text: i18n({ key: "I18N.NAVIGATION_BAR.HOME" }),
        viewLink: {
          viewUrl: `casino/gm-1`,
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
        viewLink: {
          viewUrl: "casino/c/vegas-ro-ruleta/gc-vegas-ro-ruleta",
          viewUrn: codecs.gamingCategoryView.encode("vegas-ro-ruleta").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
        viewLink: {
          viewUrl: "casino/c/vegas-ro-blackjack/gc-vegas-ro-blackjack",
          viewUrn: codecs.gamingCategoryView.encode("vegas-ro-blackjack").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/vegas-ro-live-casino/gc-vegas-ro-live-casino",
          viewUrn: codecs.gamingCategoryView.encode("vegas-ro-live-casino").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/c/vegas-ro-sloturi/gc-vegas-ro-sloturi",
          viewUrn: codecs.gamingCategoryView.encode("vegas-ro-sloturi").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/vegas-ro-jackpoturi/gc-vegas-ro-jackpoturi",
          viewUrn: codecs.gamingCategoryView.encode("vegas-ro-jackpoturi").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/vegas-ro-jocuri-de-carti/gc-vegas-ro-jocuri-de-carti",
          viewUrn: codecs.gamingCategoryView.encode("vegas-ro-jocuri-de-carti").uid,
        },
        target: "_self",
      },
      // jocuri cu carti
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "casino/c/vegas-ro-video-poker/gc-vegas-ro-video-poker",
          viewUrn: codecs.gamingCategoryView.encode("vegas-ro-video-poker").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/vegas-ro-toate-jocurile/gc-vegas-ro-toate-jocurile",
          viewUrn: codecs.gamingCategoryView.encode("vegas-ro-toate-jocurile").uid,
        },
        target: "_self",
      },
    ],
  },
  DENMARK: {
    da: [
      {
        text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
        viewLink: {
          viewUrl: `casino/gm-1`,
          viewUrn: codecs.gamingView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.PROMOTIONS" }),
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: codecs.promotionsView.encode("1").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
        viewLink: {
          viewUrl: "casino/c/casino-slots/gc-casino-slots",
          viewUrn: codecs.gamingCategoryView.encode("casino-slots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
        viewLink: {
          viewUrl: "casino/c/casino-jackpots/gc-casino-jackpots",
          viewUrn: codecs.gamingCategoryView.encode("casino-jackpots").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
        viewLink: {
          viewUrl: "casino//c/casino-borde/gc-casino-borde",
          viewUrn: codecs.gamingCategoryView.encode("casino-borde").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
        viewLink: {
          viewUrl: "casino/c/casino-live/gc-casino-live",
          viewUrn: codecs.gamingCategoryView.encode("casino-live").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.CARD_GAMES" }),
        viewLink: {
          viewUrl: "casino/c/casino-kort/gc-casino-kort",
          viewUrn: codecs.gamingCategoryView.encode("casino-kort").uid,
        },
        target: "_self",
      },
      {
        text: i18n({ key: "I18N.CATEGORY.POKER" }),
        viewLink: {
          viewUrl: "casino/c/casino-video-pokerspil/gc-casino-video-pokerspil",
          viewUrn: codecs.gamingCategoryView.encode("casino-video-pokerspil").uid,
        },
        target: "_self",
      },
    ],
  },
});

export const getCategoryLinks = (jurisdiction: string, localeCode: string, loggedIn: boolean): LinkItem[] => {
  const categoryLinks = generateCategoryLinks(loggedIn);
  const defaultLinks = categoryLinks.INTERNATIONAL.en_GB!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  if (!categoryLinks[jurisdiction as keyof LinkItems]) {
    return defaultLinks;
  }
  return categoryLinks[jurisdiction as keyof LinkItems][localeCode as keyof LinkLocales] || defaultLinks;
};
