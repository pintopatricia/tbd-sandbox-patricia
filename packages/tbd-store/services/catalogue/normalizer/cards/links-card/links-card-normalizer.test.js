import normalizer from "./links-card-normalizer";

const BFF_RESPONSE = {
  __typename: "LinksCard",
  urn: "ppb:tbd:card:links:myaccount#menuSection",
  section: [
    {
      title: "My Betfair Rewards & Promotions",
      sectionType: "GENERIC",
      items: [
        {
          text: "My Promotions",
          url: "https://promos.prd.internal/sport?prod=90&returnURL=https%3A%2F%2Fwww%2Eprd.internal%2Fsport",
          target: "_top",
          alignment: "LEFT",
        },
        {
          text: "Refer & Earn",
          url: "https://promos.prd.internal/refer-and-earn?prod=90&returnURL=https%3A%2F%2Fwww%2Eprd.internal%2Fsport",
          target: "_top",
          alignment: "LEFT",
        },
        {
          text: "Active Bonuses",
          url: "https://promos.prd.internal/mybonuses?prod=90&returnURL=https%3A%2F%2Fwww%2Eprd.internal%2Fsport",
          target: "_top",
          alignment: "LEFT",
        },
      ],
    },
    {
      title: undefined,
      sectionType: "GENERIC",
      items: [
        {
          text: "Verify My Account",
          viewLink: {
            viewUrl:
              "https://myaccount.prd.internal/documents/upload?prod=90&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.prd.internal%2Faccount%2Fnavigation%3Fprod%3D90",
            viewUrn: "ppb:tbd:view:external",
          },
          target: undefined,
          alignment: "LEFT",
        },
        {
          text: "My Details",
          viewLink: {
            viewUrl: "https://myaccount.prd.internal/accountdetails/mydetails?prod=90&width=320px&showHeader=0",
            viewUrn: "ppb:tbd:view:external",
          },
          target: "_self",
          alignment: "LEFT",
        },
        {
          text: "Settings",
          viewLink: {
            viewUrl: "https://responsiblegambling.prd.internal?showHeader=0",
            viewUrn: "ppb:tbd:view:external",
          },
          target: "_self",
          alignment: "RIGHT",
        },
      ],
    },
    {
      title: "My Wallet",
      sectionType: "GENERIC",
      items: [
        {
          text: "My Card Details",
          url: "https://myfunds.prd.internal/manage/cards?prod=90&width=320px&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.prd.internal%2Faccount%2Fnavigation%3Fprod%3D90",
          target: "_self",
          alignment: "CENTER",
        },
        {
          text: "Transfer Funds",
          url: "https://myaccount.prd.internal/payments/transfer?prod=90&showHeader=0",
          target: "_self",
          alignment: "LEFT",
        },
      ],
    },
    {
      title: "Safer Gambling",
      sectionType: "GENERIC",
      items: [
        {
          text: "Player Protection Tools",
          viewLink: {
            viewUrl: undefined,
            viewUrn: "ppb:tbd:view:external",
          },
          target: "_self",
          alignment: "LEFT",
        },
        {
          text: "Responsible Gambling Information",
          viewLink: {
            viewUrl: undefined,
            viewUrn: "ppb:tbd:view:external",
          },
          target: "_blank",
          alignment: "LEFT",
        },
      ],
    },
    {
      title: "Betting Activity",
      sectionType: "GENERIC",
      items: [
        {
          text: "My Sportsbook Bets",
          viewLink: {
            viewUrl: undefined,
            viewUrn: "ppb:tbd:view:external",
          },
          target: "_self",
          alignment: "LEFT",
        },
        {
          text: "My Exchange Bets",
          viewLink: {
            viewUrl: undefined,
            viewUrn: "ppb:tbd:view:external",
          },
          target: "_self",
          alignment: "LEFT",
        },
        {
          text: "Transaction History",
          viewLink: {
            viewUrl: undefined,
            viewUrn: "ppb:tbd:view:external",
          },
          target: "_self",
          alignment: "LEFT",
        },
      ],
    },
    {
      title: "Help & support",
      sectionType: "GENERIC",
      items: [
        {
          text: "Help & support",
          viewLink: {
            viewUrl: "https://support.prd.internal/app/home/?prod=90",
            viewUrn: "ppb:tbd:view:external",
          },
          target: "_self",
          alignment: "LEFT",
        },
      ],
    },
  ],
};

describe("Links card normalizer", () => {
  describe("normalizeLinksCardFragmentIntoLinksCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "LinksCard",
        sections: [
          {
            title: "My Betfair Rewards & Promotions",
            sectionType: "GENERIC",
            items: [
              {
                alignment: "left",
                target: "_top",
                text: "My Promotions",
                viewLink: {
                  viewUrl:
                    "https://promos.prd.internal/sport?prod=90&returnURL=https%3A%2F%2Fwww%2Eprd.internal%2Fsport",
                  viewUrn: "ppb:tbd:view:external",
                },
              },
              {
                alignment: "left",
                target: "_top",
                text: "Refer & Earn",
                viewLink: {
                  viewUrl:
                    "https://promos.prd.internal/refer-and-earn?prod=90&returnURL=https%3A%2F%2Fwww%2Eprd.internal%2Fsport",
                  viewUrn: "ppb:tbd:view:external",
                },
              },
              {
                alignment: "left",
                target: "_top",
                text: "Active Bonuses",
                viewLink: {
                  viewUrl:
                    "https://promos.prd.internal/mybonuses?prod=90&returnURL=https%3A%2F%2Fwww%2Eprd.internal%2Fsport",
                  viewUrn: "ppb:tbd:view:external",
                },
              },
            ],
          },
          {
            title: undefined,
            sectionType: "GENERIC",
            items: [
              {
                alignment: "left",
                target: undefined,
                text: "Verify My Account",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
              {
                alignment: "left",
                target: "_self",
                text: "My Details",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
              {
                alignment: "right",
                target: "_self",
                text: "Settings",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
            ],
          },
          {
            title: "My Wallet",
            sectionType: "GENERIC",
            items: [
              {
                alignment: "center",
                target: "_self",
                text: "My Card Details",
                viewLink: {
                  viewUrl:
                    "https://myfunds.prd.internal/manage/cards?prod=90&width=320px&showHeader=0&returnURL=https%3A%2F%2Fmyaccount.prd.internal%2Faccount%2Fnavigation%3Fprod%3D90",
                  viewUrn: "ppb:tbd:view:external",
                },
              },
              {
                alignment: "left",
                target: "_self",
                text: "Transfer Funds",
                viewLink: {
                  viewUrl: "https://myaccount.prd.internal/payments/transfer?prod=90&showHeader=0",
                  viewUrn: "ppb:tbd:view:external",
                },
              },
            ],
          },
          {
            title: "Safer Gambling",
            sectionType: "GENERIC",
            items: [
              {
                alignment: "left",
                target: "_self",
                text: "Player Protection Tools",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
              {
                alignment: "left",
                target: "_blank",
                text: "Responsible Gambling Information",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
            ],
          },
          {
            title: "Betting Activity",
            sectionType: "GENERIC",
            items: [
              {
                alignment: "left",
                target: "_self",
                text: "My Sportsbook Bets",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
              {
                alignment: "left",
                target: "_self",
                text: "My Exchange Bets",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
              {
                alignment: "left",
                target: "_self",
                text: "Transaction History",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
            ],
          },
          {
            title: "Help & support",
            sectionType: "GENERIC",
            items: [
              {
                alignment: "left",
                target: "_self",
                text: "Help & support",
                viewLink: {
                  viewUrl: undefined,
                  viewUrn: "ppb:tbd:view:external",
                },
              },
            ],
          },
        ],
        urn: "ppb:tbd:card:links:myaccount#menuSection",
      });
    });
  });
});
