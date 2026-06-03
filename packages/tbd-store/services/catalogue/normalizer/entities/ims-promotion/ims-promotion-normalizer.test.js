import normalizeImsPromotionFragmentIntoImsPromotion from "./ims-promotion-normalizer";

describe("normalizeImsPromotionFragmentIntoImsPromotion", () => {
  const fragmentMock = {
    urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
    headline: "headline",
    subHeadline: "subHeadline",
    bonusInstanceCode: "123",
    image: {
      url: "url",
      alt: "alt",
      dimensions: {
        width: "200",
        height: "200",
      },
    },
    ctaText: "ctaText",
    layout: "layout",
    status: "status",
    timeLeft: 0,
    wagerType: "PRE_WAGER",
    wageringLeft: null,
    percentCompleted: 0,
    bonusWagering: null,
    bonusAwarded: 0,
    freeSpins: {
      initialFreeSpins: 10,
      remainingFreeSpins: 10,
    },
    goldenChips: null,
    buyIn: null,
    currentBonusBalance: 0,
    amountOnPendingWinnings: 0,
  };

  it("should correctly normalize the card", () => {
    expect(normalizeImsPromotionFragmentIntoImsPromotion(fragmentMock)).toEqual({
      data: {
        urn: "ppb:gaming:promotion:uid/gaming-win-up-to-180-free-spins-bonus",
        headline: "headline",
        subHeadline: "subHeadline",
        bonusInstanceCode: "123",
        image: {
          url: "url",
          alt: "alt",
          dimensions: {
            width: "200",
            height: "200",
          },
        },
        ctaText: "ctaText",
        layout: "layout",
        status: "status",
        timeLeft: 0,
        wagerType: "PRE_WAGER",
        wageringLeft: null,
        percentCompleted: 0,
        bonusWagering: null,
        bonusAwarded: 0,
        currentBonusBalance: 0,
        amountOnPendingWinnings: 0,
        freeSpins: {
          initialFreeSpins: 10,
          remainingFreeSpins: 10,
        },
        goldenChips: null,
        buyIn: null,
      },
    });
  });
});
