const { BannersPO, UserProfileHeaderPO } = require("../../../../../page-objects");
const { getMyAccountLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { handleBannerAction } = require("../../../../../mock-essentials/controllers/max/max-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const userProfileHeaderPO = new UserProfileHeaderPO();
const mockService = new MockService();
const bannersPO = new BannersPO();

const PHONE_BANNER = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "AccountBannersCard",
          bannerDetails: [
            {
              bannerInfo: {
                title: "Verify Number",
                bodyContent: {
                  text: "Did you know you can enhance the security of your account by verifying your phone number?",
                },
              },
              minimizedBannerInfo: {
                bodyText: "Did you know you can enhance the security of your account by verifying your phone number?",
              },
              bannerActions: [
                {
                  label: "Verify Number",
                  minimizedLabel: "Verify Number",
                  type: "button",
                  buttonType: "PRIMARY",
                  path: "/accountdetails/mydetails?shouldVerifyPhone=true",
                  url: "https://myaccount.nxt.internal:443/accountdetails/mydetails?shouldVerifyPhone=true&flow=tbd",
                  target: "_top",
                },
              ],

              isMinimized: true,
              useCase: "DEFAULT",
              priority: "4120",
              flow: "TBD",
              attentionLevel: "WARNING",
              bannerType: "phone",
            },
          ],
        },
      },
    ],
  },
};

const NON_KYC_BANNER = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "AccountBannersCard",
          bannerDetails: [
            {
              bannerInfo: {
                title: "Nearly There",
                bodyContent: {
                  text: "We just need one more document to get your account up and running.",
                },
              },
              minimizedBannerInfo: {
                bodyText: "You need to verify your account",
              },
              bannerActions: [
                {
                  label: "Verify",
                  type: "button",
                  buttonType: "PRIMARY",
                  path: "/documents/upload",
                  url: "https://myaccount.nxt.com.betfair/documents/upload",
                  target: "_blank",
                },
              ],

              isMinimized: "true",
              priority: "1070",
              useCase: "AT_LEAST_ONE_DOC_SUBMITTED",
              flow: "TBD",
              attentionLevel: "SEVERE",
              bannerType: "kyc",
            },
          ],
        },
      },
    ],
  },
};

const KYC_COMPLETE_BANNER = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "AccountBannersCard",
          urn: "ppb:tbd:card:accountBanners:myaccount#accountBanners",
          bannerDetails: [
            {
              bannerInfo: {
                title: "All Done",
                bodyContent: {
                  text: "Congratulations, your account is fully verified and ready to go.",
                },
              },
              minimizedBannerInfo: {
                bodyText: "Congratulations, your account is fully verified and ready to go.",
              },
              useCase: "CUSTOMER_IS_KYC",
              isClosable: true,
              isMinimized: false,
              priority: "1070",
              flow: "TBD",
              attentionLevel: "CONFIRMATION",
              bannerType: "kyc",
            },
          ],
        },
      },
    ],
  },
};

const NEWS_BANNER = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "AccountBannersCard",
          urn: "ppb:tbd:card:accountBanners:myaccount#accountBanners",
          bannerDetails: [
            {
              bannerInfo: {
                title: "News banner",
                bodyContent: {
                  text: "You got so many offers mate - check it out",
                },
              },
              minimizedBannerInfo: {
                bodyText: "this is you news banner",
              },
              bannerActions: [
                {
                  label: "Find out more",
                  minimizedLabel: "Find out more",
                  type: "button",
                  buttonType: "PRIMARY",
                  path: "/api/lossLimits/confirm",
                  url: "https://playerprotection.nxt.com.betfair",
                  target: "_blank",
                },
                {
                  label: "Dismiss",
                  minimizedLabel: "Dismiss",
                  type: "button",
                  buttonType: "SECONDARY",
                  path: "https://myaccount.nxt.com.betfair/usp/set",
                  url: "https://playerprotection.nxt.com.betfair",
                  target: "api",
                  action: "UPDATE_USER_PREFERENCE",
                  data: '{"preferenceKey": "maw.news.banner","value":"958"}',
                },
              ],

              isMinimized: true,
              priority: "2120",
              useCase: "DEFAULT",
              flow: "TBD",
              attentionLevel: "INFO",
              version: 958,
              bannerType: "news",
            },
          ],
        },
      },
    ],
  },
};

const RG_LOSS_AND_DEPOSIT_LIMIT_BANNERS = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "AccountBannersCard",
          urn: "ppb:tbd:card:accountBanners:myaccount#accountBanners",
          bannerDetails: [
            {
              bannerInfo: {
                title: "Please confirm your new All Products Loss Limit of £150 per week for it to take effect.",
                bodyContent: {
                  text: "You updated your limit on 07/12/2020.",
                },
              },
              minimizedBannerInfo: {
                bodyText: "please confirm sir",
              },
              bannerActions: [
                {
                  label: "Cancel",
                  gaLabel: "all products - weekly - 150",
                  type: "button",
                  buttonType: "PRIMARY",
                  path: "/api/lossLimits/confirm",
                  url: "https://playerprotection.nxt.com.betfair",
                  target: "api",
                  action: "ACCEPT_OR_CANCEL_LOSS_LIMIT",
                  data: '{"productName": "GLOBAL","confirmed": "false"}',
                  actionFinalize: {
                    onErrorBanner: {
                      bannerInfo: {
                        title: "Sorry, something went wrong",
                        bodyContent: {
                          text: "We were unable to cancel your pending limit. Please try again later.",
                        },
                      },
                      bannerActions: [
                        {
                          label: "Dismiss",
                          type: "button",
                          target: "close",
                        },
                      ],

                      attentionLevel: "WARNING",
                    },
                    onSuccessBanner: {
                      bannerInfo: {
                        title: "You canceled",
                        bodyContent: {
                          text: "You canceled this",
                        },
                      },
                      bannerActions: [
                        {
                          label: "Dismiss",
                          type: "button",
                          target: "close",
                        },
                      ],

                      attentionLevel: "WARNING",
                    },
                  },
                },
                {
                  label: "Confirm",
                  gaLabel: "all products - weekly - 150",
                  type: "button",
                  buttonType: "PRIMARY",
                  path: "/api/lossLimits/confirm",
                  url: "https://playerprotection.nxt.com.betfair",
                  target: "api",
                  action: "ACCEPT_OR_CANCEL_LOSS_LIMIT",
                  data: '{"productName": "GLOBAL","confirmed": "true"}',
                  actionFinalize: {
                    onErrorBanner: {
                      bannerInfo: {
                        title: "Sorry, something went wrong",
                        bodyContent: {
                          text: "We were unable to confirm your pending limit. Please try again later.",
                        },
                      },
                      bannerActions: [
                        {
                          label: "Dismiss",
                          type: "button",
                          target: "close",
                        },
                      ],

                      attentionLevel: "WARNING",
                    },
                    onSuccessBanner: {
                      bannerInfo: {
                        title: "good job. You're good to go",
                        bodyContent: {
                          text: "We confirm your pending limit.",
                        },
                      },
                      bannerActions: [
                        {
                          label: "Dismiss",
                          type: "button",
                          target: "close",
                        },
                      ],

                      attentionLevel: "WARNING",
                    },
                  },
                },
              ],

              priority: "3120",
              useCase: "LOSS_LIMIT",
              flow: "TBD",
              attentionLevel: "WARNING",
              bannerType: "rg",
            },
            {
              bannerInfo: {
                title: "Please confirm your new Deposit Limit of £1500 per day for it to take effect.",
                bodyContent: {
                  text: "You updated your limit on 07/12/2020.",
                },
              },
              minimizedBannerInfo: {
                bodyText: "Please confirm your new Deposit Limit of £1500 per day for it to take effect.",
              },
              bannerActions: [
                {
                  label: "Cancel",
                  gaLabel: "all products - weekly - 150",
                  type: "button",
                  buttonType: "PRIMARY",
                  path: "/api/lossLimits/confirm",
                  url: "https://playerprotection.nxt.com.betfair",
                  target: "api",
                  action: "ACCEPT_OR_CANCEL_LOSS_LIMIT",
                  data: '{"productName": "GLOBAL","confirmed": "false"}',
                  actionFinalize: {
                    onErrorBanner: {
                      bannerInfo: {
                        title: "Sorry, something went wrong",
                        bodyContent: {
                          text: "We were unable to cancel your pending limit. Please try again later.",
                        },
                      },
                      bannerActions: [
                        {
                          label: "Dismiss",
                          type: "button",
                          target: "close",
                        },
                      ],

                      attentionLevel: "WARNING",
                    },
                    onSuccessBanner: {
                      bannerInfo: {
                        title: "You canceled",
                        bodyContent: {
                          text: "You canceled this",
                        },
                      },
                      bannerActions: [
                        {
                          label: "Dismiss",
                          type: "button",
                          target: "close",
                        },
                      ],

                      attentionLevel: "WARNING",
                    },
                  },
                },
                {
                  label: "Confirm",
                  gaLabel: "all products - weekly - 150",
                  type: "button",
                  buttonType: "PRIMARY",
                  path: "/api/lossLimits/confirm",
                  url: "https://playerprotection.nxt.com.betfair",
                  target: "api",
                  action: "ACCEPT_OR_CANCEL_LOSS_LIMIT",
                  data: '{"productName": "GLOBAL","confirmed": "true"}',
                  actionFinalize: {
                    onErrorBanner: {
                      bannerInfo: {
                        title: "Sorry, something went wrong",
                        bodyContent: {
                          text: "We were unable to confirm your pending limit. Please try again later.",
                        },
                      },
                      bannerActions: [
                        {
                          label: "Dismiss",
                          type: "button",
                          target: "close",
                        },
                      ],

                      attentionLevel: "WARNING",
                    },
                    onSuccessBanner: {
                      bannerInfo: {
                        title: "good job. You're good to go",
                        bodyContent: {
                          text: "We confirm your pending limit.",
                        },
                      },
                      bannerActions: [
                        {
                          label: "Dismiss",
                          type: "button",
                          target: "close",
                        },
                      ],

                      attentionLevel: "WARNING",
                    },
                  },
                },
              ],

              priority: "3120",
              useCase: "LOSS_LIMIT",
              flow: "TBD",
              attentionLevel: "WARNING",
              bannerType: "rg",
            },
          ],
        },
      },
    ],
  },
};

const BUDGET_BANNER = {
  __typename: "MyAccountView",
  urn: "ppb:tbd:view:myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  url: "navigation/myAccountView:cHBiOnRiZDp2aWV3OnNwb3J0OjEjIyMv",
  items: {
    edges: [
      {
        node: {
          __typename: "AccountBannersCard",
          bannerDetails: [
            {
              bannerInfo: {
                title: "Your Spend Budget is under review",
                bodyContent: {
                  text:
                    "We’ve received your documents and are now reviewing your Spend Budget. A decision will be made in" +
                    " the next 48hrs, so we’ll keep your Spend Budget the same in the meantime.",
                },
              },
              isMinimized: "false",
              priority: "4100",
              useCase: "DEFAULT",
              flow: "TBD",
              attentionLevel: "INFO",
              bannerType: "budget",
            },
          ],
        },
      },
    ],
  },
};

describe("Banners", () => {
  describe("[744726] When the user opens the event page and is logged in", () => {
    describe("and has a Deposit Limit and a Loss Limit set", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(RG_LOSS_AND_DEPOSIT_LIMIT_BANNERS.urn, { firstName: "valer" }),
        );
        await mockService.mockHttpRequest(getMyAccountLayout(RG_LOSS_AND_DEPOSIT_LIMIT_BANNERS));
        await mockService.mockHttpRequest(handleBannerAction());
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(bannersPO.element);
      });

      it("[PRPI-6621] Product Loss Limit banner should be displayed", async () => {
        expect(await bannersPO.titleText.getText()).toBe(
          "Please confirm your new All Products Loss Limit of £150 per week for it to take effect. 1/2",
        );
      });

      it("[PRPI-6622] and the correct body should be displayed", async () => {
        expect(await bannersPO.bannerText.getText()).toBe("You updated your limit on 07/12/2020.");
      });

      it("[PRPI-6623] and the first button is displayed", async () => {
        expect(await bannersPO.firstButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-6624] and the first button is correct", async () => {
        expect(await bannersPO.firstButton.getText()).toBe("Cancel");
      });

      it("[PRPI-6625] and the second button is displayed", async () => {
        expect(await bannersPO.secondButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-6626] and the second button is correct", async () => {
        expect(await bannersPO.secondButton.getText()).toBe("Confirm");
      });

      describe("and when it taps Confirm button", () => {
        beforeAll(async () => {
          await bannersPO.secondButton.click();
          const titleText = await bannersPO.titleText;
          await browser.waitUntilEquals(
            titleText,
            "Please confirm your new Deposit Limit of £1500 per day for it to take effect. 2/2",
          );
        });

        it("[PRPI-6627] Deposit Loss Limit banner should be displayed", async () => {
          expect(await bannersPO.titleText.getText()).toBe(
            "Please confirm your new Deposit Limit of £1500 per day for it to take effect. 2/2",
          );
        });

        it("[PRPI-6628] and the correct body should be displayed", async () => {
          expect(await bannersPO.bannerText.getText()).toBe("You updated your limit on 07/12/2020.");
        });

        it("[PRPI-6629] and the first button is displayed", async () => {
          expect(await bannersPO.firstButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-6630] and the first button is correct", async () => {
          expect(await bannersPO.firstButton.getText()).toBe("Cancel");
        });

        it("[PRPI-6631] and the second button is displayed", async () => {
          expect(await bannersPO.secondButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-6632] and the second button is correct", async () => {
          expect(await bannersPO.secondButton.getText()).toBe("Confirm");
        });
      });
    });

    describe("and has a News Banner set", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(NEWS_BANNER.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(NEWS_BANNER));
        await mockService.mockHttpRequest(handleBannerAction());
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(bannersPO.element);
      });

      it("[PRPI-6633] News banner should be displayed", async () => {
        expect(await bannersPO.titleText.getText()).toBe("News banner");
      });

      it("[PRPI-6634] and the correct body should be displayed", async () => {
        expect(await bannersPO.bannerText.getText()).toBe("You got so many offers mate - check it out");
      });

      it("[PRPI-6635] and the first button is displayed", async () => {
        expect(await bannersPO.firstButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-6636] and the first button is correct", async () => {
        expect(await bannersPO.firstButton.getText()).toBe("Find out more");
      });

      it("[PRPI-6637] and the second button is displayed", async () => {
        expect(await bannersPO.secondButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-6638] and the second button is correct", async () => {
        expect(await bannersPO.secondButton.getText()).toBe("Dismiss");
      });

      describe("and when it taps Dismiss button", () => {
        beforeAll(async () => {
          await bannersPO.secondButton.click();
          await browser.waitUntilNotInDOM(bannersPO.element);
        });

        it("[PRPI-6639] News banner should no longer be displayed", async () => {
          expect(await bannersPO.element.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and is not full KYC'ed", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(NON_KYC_BANNER.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(NON_KYC_BANNER));
        await mockService.mockHttpRequest(handleBannerAction());
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(bannersPO.element);
      });

      it("[PRPI-6640] KYC banner should be displayed", async () => {
        expect(await bannersPO.titleText.getText()).toBe("Nearly There");
      });

      it("[PRPI-6641] and the correct body is displayed", async () => {
        expect(await bannersPO.bannerText.getText()).toBe(
          "We just need one more document to get your account up and running.",
        );
      });

      it("[PRPI-6642] and the first button is displayed", async () => {
        expect(await bannersPO.firstButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-6643] and the first button is correct", async () => {
        expect(await bannersPO.firstButton.getText()).toBe("Verify");
      });
    });

    describe("and has an unverified phone number", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(PHONE_BANNER.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(PHONE_BANNER));
        await mockService.mockHttpRequest(handleBannerAction());
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(bannersPO.element);
      });

      it("[PRPI-6644] Phone banner should be displayed", async () => {
        expect(await bannersPO.titleText.getText()).toBe("Verify Number");
      });

      it("[PRPI-6645] and the correct body is displayed", async () => {
        expect(await bannersPO.bannerText.getText()).toBe(
          "Did you know you can enhance the security of your account by verifying your phone number?",
        );
      });

      it("[PRPI-6646] and the first button is displayed", async () => {
        expect(await bannersPO.firstButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-6647] and the first button is correct", async () => {
        expect(await bannersPO.firstButton.getText()).toBe("Verify Number");
      });
    });

    describe("and is full KYC'ed", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(KYC_COMPLETE_BANNER.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(KYC_COMPLETE_BANNER));
        await mockService.mockHttpRequest(handleBannerAction());
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(bannersPO.element);
      });

      it("[PRPI-6648] KYC complete banner should be displayed", async () => {
        expect(await bannersPO.titleText.getText()).toBe("All Done");
      });

      it("[PRPI-6649] and the correct body is displayed", async () => {
        expect(await bannersPO.bannerText.getText()).toBe(
          "Congratulations, your account is fully verified and ready to go.",
        );
      });

      it("[PRPI-6650] and the close 'x' button is is displayed", async () => {
        expect(await bannersPO.closeIcon.isDisplayed()).toBe(true);
      });

      describe("and when it taps X button", () => {
        beforeAll(async () => {
          await bannersPO.closeIcon.click();
          await browser.waitUntilNotInDOM(bannersPO.element);
        });

        it("[PRPI-6651] News banner should no longer be displayed", async () => {
          expect(await bannersPO.element.isDisplayed()).toBe(false);
        });
      });
    });

    describe("and has a Budget Banner set", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BUDGET_BANNER.urn, { firstName: "valer" }));
        await mockService.mockHttpRequest(getMyAccountLayout(BUDGET_BANNER));
        await mockService.mockHttpRequest(handleBannerAction());
        await browser.url(routes.getHomeViewUrl());
        await browser.waitUntilDisplayed(userProfileHeaderPO.element);
        await browser.waitUntilDisplayed(bannersPO.element);
      });

      it("[PRPI-6652] Budget banner should be displayed", async () => {
        expect(await bannersPO.titleText.getText()).toBe("Your Spend Budget is under review");
      });

      it("[PRPI-6653] and the correct body should be displayed", async () => {
        expect(await bannersPO.bannerText.getText()).toBe(
          "We’ve received your documents and are now reviewing your Spend Budget. A decision will be made in" +
            " the next 48hrs, so we’ll keep your Spend Budget the same in the meantime.",
        );
      });
    });
  });
});
