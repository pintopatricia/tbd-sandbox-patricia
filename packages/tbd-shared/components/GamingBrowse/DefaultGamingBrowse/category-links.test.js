import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { getCategoryLinks } from "./category-links";
import { i18n } from "../../../helpers/i18n";

describe("CategoryLinks", () => {
  const translations = {
    casinoHome: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
    casinoPromotionsDa: i18n({ key: "I18N.CATEGORY.PROMOTIONS" }),
    casinoHomeRo: i18n({ key: "I18N.NAVIGATION_BAR.HOME" }),
    casinoPromotions: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
    cardGames: i18n({ key: "I18N.CATEGORY.CARD_GAMES" }),
    casinoPremium: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
    slots: i18n({ key: "I18N.CATEGORY.SLOTS" }),
    liveCasino: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
    new: i18n({ key: "I18N.CATEGORY.NEW" }),
    megaways: i18n({ key: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }) }),
    jackpotKings: i18n({ key: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }) }),
    dailyJackpot: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
    exclusive: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
    roulette: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
    blackjack: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
    tableGames: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
    allJackpots: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
    allGames: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
    bingo: i18n({ key: "I18N.CATEGORY.BINGO" }),
    poker: i18n({ key: "I18N.CATEGORY.POKER" }),
    rtp: i18n({ key: "I18N.CATEGORY.RTP" }),
    returns: i18n({ key: "I18N.BETSLIP.RETURNS" }),
  };

  it("should return gaming browse category links for international logged out user", () => {
    const categoryLinks = getCategoryLinks(Jurisdiction.INTERNATIONAL);
    expect(categoryLinks).toEqual([
      {
        text: translations.casinoHome,
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: "ppb:tbd:view:gaming:1",
        },
        target: "_self",
      },
      {
        text: translations.casinoPromotions,
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: "ppb:tbd:view:promotions:1",
        },
        target: "_self",
      },
      {
        text: translations.slots,
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-slots",
        },
        target: "_self",
      },
      {
        text: translations.liveCasino,
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-live-casino",
        },
        target: "_self",
      },
      {
        text: translations.new,
        viewLink: {
          viewUrl: "casino/p/gaming-new/gs-gaming-new",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-new",
        },
        target: "_self",
      },
      {
        text: translations.casinoPremium,
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-premium-casino",
        },
        target: "_self",
      },
      {
        text: translations.megaways,
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-megaways-slots",
        },
        target: "_self",
      },
      {
        text: translations.jackpotKings,
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpot-king",
        },
        target: "_self",
      },
      {
        text: translations.dailyJackpot,
        viewLink: {
          viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-daily-jackpot",
        },
        target: "_self",
      },
      {
        text: translations.exclusive,
        viewLink: {
          viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-exclusive",
        },
        target: "_self",
      },
      {
        text: translations.roulette,
        viewLink: {
          viewUrl: "casino/c/gaming-roulette/gc-gaming-roulette",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-roulette",
        },
        target: "_self",
      },
      {
        text: translations.blackjack,
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-blackjack",
        },
        target: "_self",
      },
      {
        text: translations.tableGames,
        viewLink: {
          viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-table-games",
        },
        target: "_self",
      },
      {
        text: i18n({ key: translations.allJackpots }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpots/gc-gaming-jackpots",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpots",
        },
        target: "_self",
      },
      {
        text: translations.allGames,
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-all-games",
        },
        target: "_self",
      },
      {
        text: translations.bingo,
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
      {
        text: translations.poker,
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
    ]);
  });
  it("should return gaming browse category links for spain logged in user", () => {
    const categoryLinks = getCategoryLinks("SPAIN", "es", true);
    expect(categoryLinks).toEqual([
      {
        text: translations.casinoHome,
        viewLink: {
          viewUrl: "casino/gm-casino-homepage-logged-in-and-vip",
          viewUrn: "ppb:tbd:view:gaming:casino-homepage-logged-in-and-vip",
        },
        target: "_self",
      },
      {
        text: translations.casinoPromotions,
        viewLink: {
          viewUrl: "casino/p-promociones-logged-in",
          viewUrn: "ppb:tbd:view:promotions:promociones-logged-in",
        },
        target: "_self",
      },
      {
        text: translations.new,
        viewLink: {
          viewUrl: "casino/c/casino-nuevos/gc-casino-nuevos",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-nuevos",
        },
        target: "_self",
      },
      {
        text: translations.slots,
        viewLink: {
          viewUrl: "casino/c/casino-slots/gc-casino-slots",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-slots",
        },
        target: "_self",
      },
      {
        text: translations.liveCasino,
        viewLink: {
          viewUrl: "casino/p/casino-casino-en-vivo/gs-casino-casino-en-vivo",
          viewUrn: "ppb:tbd:view:gamingSegmentation:casino-casino-en-vivo",
        },
        target: "_self",
      },
      {
        text: translations.roulette,
        viewLink: {
          viewUrl: "casino/c/casino-ruleta/gc-casino-ruleta",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-ruleta",
        },
        target: "_self",
      },
      {
        text: translations.blackjack,
        viewLink: {
          viewUrl: "casino/c/casino-blackjack/gc-casino-blackjack",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-blackjack",
        },
        target: "_self",
      },
      {
        text: translations.allJackpots,
        viewLink: {
          viewUrl: "casino/c/casino-jackpots/gc-casino-jackpots",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-jackpots",
        },
        target: "_self",
      },
      {
        text: translations.poker,
        viewLink: {
          viewUrl: "https://poker.betfair.es/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
      {
        text: translations.rtp,
        viewLink: {
          viewUrl: "https://casino.betfair.es/info/retorno-al-jugador/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
    ]);
  });
  it("should return gaming browse category links for INTERNATIONAL jurisdiction, hu language", () => {
    const categoryLinks = getCategoryLinks("INTERNATIONAL", "hu", true);
    expect(categoryLinks).toEqual([
      {
        text: translations.casinoHome,
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: "ppb:tbd:view:gaming:1",
        },
        target: "_self",
      },
      {
        text: translations.casinoPromotions,
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: "ppb:tbd:view:promotions:1",
        },
        target: "_self",
      },
      {
        text: translations.slots,
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-slots",
        },
        target: "_self",
      },
      {
        text: translations.liveCasino,
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-live-casino",
        },
        target: "_self",
      },
      {
        text: translations.new,
        viewLink: {
          viewUrl: "casino/p/gaming-uj/gs-gaming-uj",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-uj",
        },
        target: "_self",
      },
      {
        text: translations.casinoPremium,
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-premium-casino",
        },
        target: "_self",
      },
      {
        text: translations.megaways,
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-megaways-slots",
        },
        target: "_self",
      },
      {
        text: translations.jackpotKings,
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpot-king",
        },
        target: "_self",
      },
      {
        text: translations.dailyJackpot,
        viewLink: {
          viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-daily-jackpot",
        },
        target: "_self",
      },
      {
        text: translations.exclusive,
        viewLink: {
          viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-exclusive",
        },
        target: "_self",
      },
      {
        text: translations.roulette,
        viewLink: {
          viewUrl: "casino/c/gaming-rulett/gc-gaming-rulett",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-rulett",
        },
        target: "_self",
      },
      {
        text: translations.blackjack,
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-blackjack",
        },
        target: "_self",
      },
      {
        text: translations.tableGames,
        viewLink: {
          viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-table-games",
        },
        target: "_self",
      },
      {
        text: i18n({ key: translations.allJackpots }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpotok/gc-gaming-jackpotok",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpotok",
        },
        target: "_self",
      },
      {
        text: translations.allGames,
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-all-games",
        },
        target: "_self",
      },
      {
        text: translations.bingo,
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
      {
        text: translations.poker,
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
    ]);
  });
  it("should return default category links when jurisdiction and localeCode are undefined", () => {
    const categoryLinks = getCategoryLinks(undefined, undefined, true);
    expect(categoryLinks).toEqual([
      {
        text: translations.casinoHome,
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: "ppb:tbd:view:gaming:1",
        },
        target: "_self",
      },
      {
        text: translations.casinoPromotions,
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: "ppb:tbd:view:promotions:1",
        },
        target: "_self",
      },
      {
        text: translations.slots,
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-slots",
        },
        target: "_self",
      },
      {
        text: translations.liveCasino,
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-live-casino",
        },
        target: "_self",
      },
      {
        text: translations.new,
        viewLink: {
          viewUrl: "casino/p/gaming-new/gs-gaming-new",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-new",
        },
        target: "_self",
      },
      {
        text: translations.casinoPremium,
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-premium-casino",
        },
        target: "_self",
      },
      {
        text: translations.megaways,
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-megaways-slots",
        },
        target: "_self",
      },
      {
        text: translations.jackpotKings,
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpot-king",
        },
        target: "_self",
      },
      {
        text: translations.dailyJackpot,
        viewLink: {
          viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-daily-jackpot",
        },
        target: "_self",
      },
      {
        text: translations.exclusive,
        viewLink: {
          viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-exclusive",
        },
        target: "_self",
      },
      {
        text: translations.roulette,
        viewLink: {
          viewUrl: "casino/c/gaming-roulette/gc-gaming-roulette",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-roulette",
        },
        target: "_self",
      },
      {
        text: translations.blackjack,
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-blackjack",
        },
        target: "_self",
      },
      {
        text: translations.tableGames,
        viewLink: {
          viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-table-games",
        },
        target: "_self",
      },
      {
        text: i18n({ key: translations.allJackpots }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpots/gc-gaming-jackpots",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpots",
        },
        target: "_self",
      },
      {
        text: translations.allGames,
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-all-games",
        },
        target: "_self",
      },
      {
        text: translations.bingo,
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
      {
        text: translations.poker,
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
    ]);
  });
  it("should return default category links when localeCode is undefined", () => {
    const categoryLinks = getCategoryLinks("SPAIN", undefined, true);
    expect(categoryLinks).toEqual([
      {
        text: translations.casinoHome,
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: "ppb:tbd:view:gaming:1",
        },
        target: "_self",
      },
      {
        text: translations.casinoPromotions,
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: "ppb:tbd:view:promotions:1",
        },
        target: "_self",
      },
      {
        text: translations.slots,
        viewLink: {
          viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-slots",
        },
        target: "_self",
      },
      {
        text: translations.liveCasino,
        viewLink: {
          viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-live-casino",
        },
        target: "_self",
      },
      {
        text: translations.new,
        viewLink: {
          viewUrl: "casino/p/gaming-new/gs-gaming-new",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-new",
        },
        target: "_self",
      },
      {
        text: translations.casinoPremium,
        viewLink: {
          viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
          viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-premium-casino",
        },
        target: "_self",
      },
      {
        text: translations.megaways,
        viewLink: {
          viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-megaways-slots",
        },
        target: "_self",
      },
      {
        text: translations.jackpotKings,
        viewLink: {
          viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpot-king",
        },
        target: "_self",
      },
      {
        text: translations.dailyJackpot,
        viewLink: {
          viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-daily-jackpot",
        },
        target: "_self",
      },
      {
        text: translations.exclusive,
        viewLink: {
          viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-exclusive",
        },
        target: "_self",
      },
      {
        text: translations.roulette,
        viewLink: {
          viewUrl: "casino/c/gaming-roulette/gc-gaming-roulette",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-roulette",
        },
        target: "_self",
      },
      {
        text: translations.blackjack,
        viewLink: {
          viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-blackjack",
        },
        target: "_self",
      },
      {
        text: translations.tableGames,
        viewLink: {
          viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-table-games",
        },
        target: "_self",
      },
      {
        text: i18n({ key: translations.allJackpots }),
        viewLink: {
          viewUrl: "casino/c/gaming-jackpots/gc-gaming-jackpots",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpots",
        },
        target: "_self",
      },
      {
        text: translations.allGames,
        viewLink: {
          viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
          viewUrn: "ppb:tbd:view:gamingCategory:gaming-all-games",
        },
        target: "_self",
      },
      {
        text: translations.bingo,
        viewLink: {
          viewUrl: "https://bingo.betfair.com/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
      {
        text: translations.poker,
        viewLink: {
          viewUrl: "https://mpoker.betfair.com/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
    ]);
  });
  it("should return gaming browse category links for ITALY jurisdiction", () => {
    const categoryLinks = getCategoryLinks("ITALY", "it", true);
    expect(categoryLinks).toEqual([
      {
        text: translations.casinoHome,
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: "ppb:tbd:view:gaming:1",
        },
        target: "_self",
      },
      {
        text: translations.casinoPromotions,
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: "ppb:tbd:view:promotions:1",
        },
        target: "_self",
      },
      {
        text: translations.new,
        viewLink: {
          viewUrl: "casino/c/casino-nuovi/gc-casino-nuovi",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-nuovi",
        },
        target: "_self",
      },
      {
        text: translations.roulette,
        viewLink: {
          viewUrl: "casino/c/casino-rouletten/gc-casino-roulette",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-roulette",
        },
        target: "_self",
      },
      {
        text: translations.blackjack,
        viewLink: {
          viewUrl: "casino/c/casino-blackjack/gc-casino-blackjack",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-blackjack",
        },
        target: "_self",
      },
      {
        text: translations.slots,
        viewLink: {
          viewUrl: "casino/c/casino-slot/gc-casino-slot",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-slot",
        },
        target: "_self",
      },
      {
        text: translations.liveCasino,
        viewLink: {
          viewUrl: "casino/p/casino-casino-live/gs-casino-casino-live",
          viewUrn: "ppb:tbd:view:gamingSegmentation:casino-casino-live",
        },
        target: "_self",
      },
      {
        text: translations.allJackpots,
        viewLink: {
          viewUrl: "casino/c/casino-jackpots/gc-casino-jackpots",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-jackpots",
        },
        target: "_self",
      },
      {
        text: translations.poker,
        viewLink: {
          viewUrl: "https://casino.betfair.it/c/video-poker/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
      {
        text: translations.returns,
        viewLink: {
          viewUrl: "https://casino.betfair.it/info/it-vincite/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
      {
        text: "T&Cs Bonus",
        viewLink: {
          viewUrl: "https://casino.betfair.it/info/termini-condizioni-generali/",
          viewUrn: "ppb:tbd:view:external:external",
          viewDisplayMode: "SELF_INAPP",
        },
        target: "_self",
      },
    ]);
  });
  it("should return gaming browse category links for ROMANIA jurisdiction", () => {
    const categoryLinks = getCategoryLinks("ROMANIA", "ro", true);
    expect(categoryLinks).toEqual([
      {
        text: translations.casinoHomeRo,
        viewLink: {
          viewUrl: "casino/gm-1",
          viewUrn: "ppb:tbd:view:gaming:1",
        },
        target: "_self",
      },
      {
        text: translations.casinoPromotions,
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: "ppb:tbd:view:promotions:1",
        },
        target: "_self",
      },
      {
        text: translations.roulette,
        viewLink: {
          viewUrl: "casino/c/vegas-ro-ruleta/gc-vegas-ro-ruleta",
          viewUrn: "ppb:tbd:view:gamingCategory:vegas-ro-ruleta",
        },
        target: "_self",
      },
      {
        text: translations.blackjack,
        viewLink: {
          viewUrl: "casino/c/vegas-ro-blackjack/gc-vegas-ro-blackjack",
          viewUrn: "ppb:tbd:view:gamingCategory:vegas-ro-blackjack",
        },
        target: "_self",
      },
      {
        text: translations.liveCasino,
        viewLink: {
          viewUrl: "casino/c/vegas-ro-live-casino/gc-vegas-ro-live-casino",
          viewUrn: "ppb:tbd:view:gamingCategory:vegas-ro-live-casino",
        },
        target: "_self",
      },
      {
        text: translations.slots,
        viewLink: {
          viewUrl: "casino/c/vegas-ro-sloturi/gc-vegas-ro-sloturi",
          viewUrn: "ppb:tbd:view:gamingCategory:vegas-ro-sloturi",
        },
        target: "_self",
      },
      {
        text: translations.allJackpots,
        viewLink: {
          viewUrl: "casino/c/vegas-ro-jackpoturi/gc-vegas-ro-jackpoturi",
          viewUrn: "ppb:tbd:view:gamingCategory:vegas-ro-jackpoturi",
        },
        target: "_self",
      },
      {
        text: translations.tableGames,
        viewLink: {
          viewUrl: "casino/c/vegas-ro-jocuri-de-carti/gc-vegas-ro-jocuri-de-carti",
          viewUrn: "ppb:tbd:view:gamingCategory:vegas-ro-jocuri-de-carti",
        },
        target: "_self",
      },
      {
        text: translations.poker,
        viewLink: {
          viewUrl: "casino/c/vegas-ro-video-poker/gc-vegas-ro-video-poker",
          viewUrn: "ppb:tbd:view:gamingCategory:vegas-ro-video-poker",
        },
        target: "_self",
      },
      {
        text: translations.allGames,
        viewLink: {
          viewUrl: "casino/c/vegas-ro-toate-jocurile/gc-vegas-ro-toate-jocurile",
          viewUrn: "ppb:tbd:view:gamingCategory:vegas-ro-toate-jocurile",
        },
        target: "_self",
      },
    ]);
  });
  it("should return gaming browse category links for DENMARK jurisdiction", () => {
    const categoryLinks = getCategoryLinks("DENMARK", "da", true);
    expect(categoryLinks).toEqual([
      {
        text: translations.casinoHome,
        viewLink: {
          viewUrl: `casino/gm-1`,
          viewUrn: "ppb:tbd:view:gaming:1",
        },
        target: "_self",
      },
      {
        text: translations.casinoPromotionsDa,
        viewLink: {
          viewUrl: "casino/p-1",
          viewUrn: "ppb:tbd:view:promotions:1",
        },
        target: "_self",
      },
      {
        text: translations.slots,
        viewLink: {
          viewUrl: "casino/c/casino-slots/gc-casino-slots",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-slots",
        },
        target: "_self",
      },
      {
        text: translations.allJackpots,
        viewLink: {
          viewUrl: "casino/c/casino-jackpots/gc-casino-jackpots",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-jackpots",
        },
        target: "_self",
      },
      {
        text: translations.tableGames,
        viewLink: {
          viewUrl: "casino//c/casino-borde/gc-casino-borde",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-borde",
        },
        target: "_self",
      },
      {
        text: translations.liveCasino,
        viewLink: {
          viewUrl: "casino/c/casino-live/gc-casino-live",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-live",
        },
        target: "_self",
      },
      {
        text: translations.cardGames,
        viewLink: {
          viewUrl: "casino/c/casino-kort/gc-casino-kort",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-kort",
        },
        target: "_self",
      },
      {
        text: translations.poker,
        viewLink: {
          viewUrl: "casino/c/casino-video-pokerspil/gc-casino-video-pokerspil",
          viewUrn: "ppb:tbd:view:gamingCategory:casino-video-pokerspil",
        },
        target: "_self",
      },
    ]);
  });
});
