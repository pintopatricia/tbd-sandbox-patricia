const {
  FooterPO,
  HeaderPO,
  SectionElementsPO,
  QuickLinkPO,
  CardPO,
  ClockPO,
  RegulatorySectionsSessionPO,
} = require("../../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const headerPO = new HeaderPO();

const footerPO = new FooterPO();
const footerPOFirstSection = new SectionElementsPO(footerPO.sections[0]);
const footerPOFirstCollapseSection = new SectionElementsPO(footerPO.sections[1]);
const footerPOFirstCollapseSectionCard = new CardPO(footerPOFirstCollapseSection.element);
const footerPOSecondCollapseSection = new SectionElementsPO(footerPO.sections[3]);
const footerPOSecondCollapseSectionCard = new CardPO(footerPOSecondCollapseSection.element);
const footerPOFirstCollapseSectionLink = new QuickLinkPO(footerPOFirstCollapseSection.cardItems[3]);
const footerPOSecondCollapseSectionLink = new QuickLinkPO(footerPOSecondCollapseSection.cardItems[5]);
const footerPOFirstSectionLink = new QuickLinkPO(footerPOFirstSection.items[3]);
const regulatorySectionsSessionCollapse = new RegulatorySectionsSessionPO(footerPOFirstCollapseSection.cardItems[4]);
const regulatorySectionsSession = new RegulatorySectionsSessionPO(footerPOFirstSection.items[4]);
const regulatorySectionsSessionLoggedInSince = new RegulatorySectionsSessionPO(footerPOFirstSection.items[5]);
const regulatorySectionsSessionCollapseLoggedInSince = new RegulatorySectionsSessionPO(
  footerPOFirstCollapseSection.cardItems[5],
);
const footerPOSixthSection = new SectionElementsPO(footerPO.sections[5]);
const footerPOLastLogin = new RegulatorySectionsSessionPO(footerPOSixthSection.items[0]);
const clockPO = new ClockPO(footerPOFirstSection.items[6]);

const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
            items: [
              {
                __typename: "RegulatoryImageItem",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/over18.png",
                alignment: "LEFT",
                alt: null,
                target: "POPUP",
                link: "http://content.betfair.com/misc/?product=portal&sWhichKey=gamCare&locale=en_GB&region=GBR&brand=betfair&entrydomain=betfair.com",
              },
              {
                __typename: "RegulatoryImageItem",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/gamCare.png",
                alignment: "LEFT",
                alt: null,
                target: "BLANK",
                link: "http://www.gamcare.org.uk/",
              },
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Text Item on Footer.",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Gambling can be addictive, please play responsibly",
                url: "http://responsiblegambling.betfair.com/",
                target: "BLANK",
              },
              {
                __typename: "RegulatorySessionItem",
                alignment: "LEFT",
                sessionText: "Some Session Text",
                timeFormat: "HH:mm",
              },
              {
                __typename: "RegulatoryLoggedInSinceItem",
                alignment: "LEFT",
                loggedInSinceText: "Some Logged In Text",
                timeFormat: "HH:mm",
              },
              {
                __typename: "RegulatoryClockItem",
                alignment: "LEFT",
                timeZone: "Europe/London",
                timeFormat: "HH:mm",
              },
            ],
          },
          {
            sectionType: "ACCORDION",
            __typename: "RegulatorySectionAccordion",
            title: "Policies and Assistance",
            items: [
              {
                __typename: "RegulatoryImageItem",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/over18.png",
                alignment: "LEFT",
                alt: null,
                target: "POPUP",
                link: "http://content.betfair.com/misc/?product=portal&sWhichKey=gamCare&locale=en_GB&region=GBR&brand=betfair&entrydomain=betfair.com",
              },
              {
                __typename: "RegulatoryImageItem",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/gamCare.png",
                alignment: "LEFT",
                alt: null,
                target: "BLANK",
                link: "http://www.gamcare.org.uk/",
              },
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Text Item in Footer Collapse.",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Gambling can be addictive, please play responsibly in Collapse",
                url: "http://responsiblegambling.betfair.com/",
                target: "BLANK",
              },
              {
                __typename: "RegulatorySessionItem",
                alignment: "LEFT",
                sessionText: "Some Session Text in Collapse",
                timeFormat: "HH:mm",
              },
              {
                __typename: "RegulatoryLoggedInSinceItem",
                alignment: "LEFT",
                loggedInSinceText: "Some Logged In Text in Collapse",
                timeFormat: "HH:mm",
              },
            ],
          },
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: null,
            items: [
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Warning: Live scores and other data on this site is sourced from third party feeds and may be subject to time delays and/or be innaccurate. Other customer may have access to faster or more accurate data. If you rely on this data to place bets, you do so at your own risk. Betfair does not accept responsibility for loss suffered as a result of reliance on this data.",
              },
            ],
          },
          {
            sectionType: "ACCORDION",
            __typename: "RegulatorySectionAccordion",
            title: "Licensing",
            items: [
              {
                __typename: "RegulatoryImageItem",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/lgaMalta.png",
                alignment: "LEFT",
                alt: null,
                target: "BLANK",
                link: "https://www.mga.org.mt/",
              },
              {
                __typename: "RegulatoryImageItem",
                imageURL:
                  "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/gamblingCommission.png",
                alignment: "LEFT",
                alt: null,
                target: "BLANK",
                link: "http://www.gamblingcommission.gov.uk/",
              },
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "PPB Counterparty Services Limited, having its registered address at Triq il-Kappillan Mifsud, St. Venera, SVR 1851, MALTA, is licensed and regulated by the Malta Gaming Authority under Licence Number MGA/CRP/131/2006 (issued on 01 August 2018).",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Malta Gaming Authority",
                url: "https://www.mga.org.mt/",
                target: "BLANK",
              },
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "For customers in the UK, the entities below are licensed and regulated by the Gambling Comission.",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "TSE Malta LP",
                url: "https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/39561",
                target: "BLANK",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "PPB Counterparty Services Limited",
                url: "https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/39439",
                target: "BLANK",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Betfair Casino Limited",
                url: "https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/39435",
                target: "BLANK",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "PPB Entertainment Limited",
                url: "https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/39426",
                target: "BLANK",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Further Regulatory Information",
                url: "https://www.betfair.com/aboutUs/Regulatory.Information/",
                target: "BLANK",
              },
            ],
          },
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            title: "Official Betting Partners",
            items: [
              {
                __typename: "RegulatoryImageItem",
                imageURL:
                  "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/RealMadridOfficial.png",
                alignment: "LEFT",
                alt: null,
                target: "BLANK",
                link: null,
              },
            ],
          },
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: null,
            items: [
              {
                __typename: "RegulatoryLastLogInItem",
                alignment: "CENTER",
                lastLoginText: "Ultimo accesso:",
                time: "2022-08-09T17:16",
                timeFormat: "dd/MM/yyyy - HH:mm:ss",
              },
              {
                __typename: "RegulatoryUserDetailsItem",
                alignment: "CENTER",
                firstName: "Fabrizio",
                lastName: "Sottosanti",
                nationalIdentifier: "STTFRZ90B11C351P",
                contractNumber: "11768106",
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
    },
  ],

  bottomBar: {},
};

const BFF_MOCK_ALTERNATIVE = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Generic zero items",
            items: [],
          },
          {
            sectionType: "ACCORDION",
            __typename: "RegulatorySectionAccordion",
            title: "Collapse zero items",
            items: [],
          },
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Valid Generic",
            textColor: ":FFFFFF",
            items: [
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Text Item.",
              },
              {
                __typename: "invalid",
                alignment: "LEFT",
                text: "Text Item.",
              },
              {},
            ],
          },
          {
            sectionType: "ACCORDION",
            __typename: "RegulatorySectionAccordion",
            title: "Valid COLLAPSE",
            textColor: ":FFFFFF",
            items: [
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Gambling can be addictive, please play responsibly",
                url: "http://responsiblegambling.betfair.com/",
                target: "BLANK",
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
    },
  ],

  bottomBar: {},
};

const BFF_MOCK_EMPTY = {
  urn: "ppb:tbd:view:generic:home",
  edges: [],
  bottomBar: {},
};

describe("Layout Entity - RegulatoryCard", () => {
  describe("When the user opens the home page (empty sections on bff)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { date: "2009-10-10T18:44" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_EMPTY));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(headerPO.element);
    });

    it("[PRPI-7476] the footer is not on the page", async () => {
      expect(await footerPO.element.isExisting()).toBe(false);
    });
  });

  describe("When the user opens the event page (footer with empty fields)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { date: "2009-10-10T18:44" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_ALTERNATIVE));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(footerPO.element);
    });

    it("[PRPI-7477] the footer should have 4 sections", async () => {
      expect(await footerPO.sections.length).toBe(4);
    });
    it("[PRPI-7478] the first section should have 0 items", async () => {
      expect(await footerPOFirstCollapseSection.cardItems.length).toBe(0);
    });
    it("[PRPI-7479] the first section should have title Generic zero items", async () => {
      expect(await footerPOFirstSection.title.getText()).toBe("Generic zero items");
    });
    it("[PRPI-7480] the first collapse section should have title Collapse zero items", async () => {
      expect(await footerPOFirstCollapseSection.cardHeader.getText()).toBe("Collapse zero items");
    });
    it("[PRPI-7481] the second collapse section should have title Valid COLLAPSE", async () => {
      expect(await footerPOSecondCollapseSection.cardHeader.getText()).toBe("Valid COLLAPSE");
    });
    it("[PRPI-7482] the second collapse section should have 1 item", async () => {
      expect(await footerPOSecondCollapseSection.cardItems.length).toBe(1);
    });
  });

  describe("When the user opens the event page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { date: "2009-10-10T18:44" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await browser.url(routes.getHomeViewUrl());
      await browser.waitUntilDisplayed(footerPO.element);
    });

    it("[PRPI-7483] the footer should have 6 sections", async () => {
      expect(await footerPO.sections.length).toBe(6);
    });

    describe("Generic Section", () => {
      it("[PRPI-7484] the first section should have 7 items", async () => {
        expect(await footerPOFirstSection.items.length).toBe(7);
      });
      it("[PRPI-7485] there are 2 images on the first section", async () => {
        expect(await footerPOFirstSection.images.length).toBe(2);
      });
      it("[PRPI-7486] the second item is of type text", async () => {
        expect(await footerPOFirstSection.items[2].getText()).toBe("Text Item on Footer.");
      });
      it("[PRPI-7487] the third item is of type link", async () => {
        expect(await footerPOFirstSectionLink.element.isDisplayed()).toBe(true);
        expect(await footerPOFirstSectionLink.title.getText()).toBe(
          "Gambling can be addictive, please play responsibly",
        );
      });
      it("[PRPI-7488] the fifth item is of type session", async () => {
        expect(await regulatorySectionsSession.element.isDisplayed()).toBe(true);
        expect(await regulatorySectionsSession.text.getText()).toBe("Some Session Text");
        expect(await regulatorySectionsSession.time.isDisplayed()).toBe(true);
      });
      it("[PRPI-7489] the sixth item is of type logged_in_since", async () => {
        expect(await regulatorySectionsSessionLoggedInSince.element.isDisplayed()).toBe(true);
        expect(await regulatorySectionsSessionLoggedInSince.text.getText()).toBe("Some Logged In Text");
        expect(await regulatorySectionsSessionLoggedInSince.time.isDisplayed()).toBe(true);
      });
      it("[PRPI-7490] the seventh item is of type clock", async () => {
        expect(await clockPO.element.isDisplayed()).toBe(true);
      });
      describe("And RegulatoryCard is retrieved with last login and user details", () => {
        it("[PRPI-7491] The user first name should be visible", async () => {
          expect(await footerPOSixthSection.items[1].getText()).toContain("Fabrizio");
        });
        it("[PRPI-7492] The user last name should be visible", async () => {
          expect(await footerPOSixthSection.items[1].getText()).toContain("Sottosanti");
        });
        it("[PRPI-7493] The contract number should be visible 'Contract n\xBA 11768206'", async () => {
          expect(await footerPOSixthSection.items[1].getText()).toContain("11768106");
        });
        it("[PRPI-7494] The nationalIdentifier number should be visible '1139492482'", async () => {
          expect(await footerPOSixthSection.items[1].getText()).toContain("STTFRZ90B11C351P");
        });
        it("[PRPI-7495] The last login date and hour should be visible 'Ultimo acesso: 09/08/2022 - 17:16'", async () => {
          expect(await footerPOLastLogin.element.isDisplayed()).toBe(true);
          expect(await footerPOLastLogin.text.getText()).toBe("Ultimo accesso:");
          expect(await footerPOLastLogin.time.isDisplayed()).toBe(true);
          expect(await footerPOLastLogin.time.getText()).toBe("09/08/2022 - 17:16");
        });
      });
    });

    describe("Collapsible Card Section", () => {
      it("[PRPI-7496] the second section should be a Collapsible Card with text and title ", async () => {
        expect(await footerPOFirstCollapseSection.cardHeader.getText()).toBe("Policies and Assistance");
      });

      it("[PRPI-7497] it should have 6 items", async () => {
        expect(await footerPOFirstCollapseSection.cardItems.length).toBe(6);
      });
      it("[PRPI-7498] it should have 2 image", async () => {
        expect(await footerPOFirstCollapseSection.images.length).toBe(2);
      });
      it("[PRPI-7499] the second item is of type text", async () => {
        expect(await footerPOFirstCollapseSection.cardItems[2].getText()).toBe("Text Item in Footer Collapse.");
      });
      it("[PRPI-7500] the third item is of type link", async () => {
        expect(await footerPOFirstCollapseSectionLink.element.isDisplayed()).toBe(true);
        expect(await footerPOFirstCollapseSectionLink.title.getText()).toBe(
          "Gambling can be addictive, please play responsibly in Collapse",
        );
      });
      it("[PRPI-7501] the fifth item is of type session", async () => {
        expect(await regulatorySectionsSessionCollapse.element.isDisplayed()).toBe(true);
        expect(await regulatorySectionsSessionCollapse.text.getText()).toBe("Some Session Text in Collapse");
        expect(await regulatorySectionsSessionCollapse.time.isDisplayed()).toBe(true);
      });
      it("[PRPI-7502] the sixth item is of type logged_in_since", async () => {
        expect(await regulatorySectionsSessionCollapseLoggedInSince.element.isDisplayed()).toBe(true);
        expect(await regulatorySectionsSessionCollapseLoggedInSince.time.isDisplayed()).toBe(true);
        expect(await regulatorySectionsSessionCollapseLoggedInSince.text.getText()).toBe(
          "Some Logged In Text in Collapse",
        );
      });
    });

    describe("Card Section Collapse/Expand", () => {
      it("[PRPI-7503] the fourth section is an expanded collapse", async () => {
        expect(await footerPOSecondCollapseSection.cardHeader.getText()).toBe("Licensing");
        expect(await footerPOSecondCollapseSection.cardItems.length).toBe(6);
        expect(await footerPOSecondCollapseSectionLink.element.isDisplayed()).toBe(true);
      });

      describe("and the second Card is collapsed", () => {
        beforeAll(async () => {
          await footerPOSecondCollapseSectionCard.element.scrollIntoView({
            block: "center",
          });
          await footerPOSecondCollapseSectionCard.header.click();
          await browser.waitUntilNotInDOM(footerPOSecondCollapseSection.cardItems[9]);
        });

        it("[PRPI-7504] the second Card is collapsed and has no items", async () => {
          expect(await footerPOSecondCollapseSection.cardItems.length).toBe(0);
        });
        it("[PRPI-7505] the first Card is expanded and has 6 items", async () => {
          expect(await footerPOFirstCollapseSection.cardItems.length).toBe(6);
        });

        describe("and the first Card is collapsed", () => {
          beforeAll(async () => {
            await footerPOFirstCollapseSectionCard.element.scrollIntoView({
              block: "center",
            });
            await footerPOFirstCollapseSectionCard.header.click();
            await browser.waitUntilNotInDOM(footerPOFirstCollapseSection.cardItems[6]);
          });

          it("[PRPI-7506] the first Card is collapsed and has no items", async () => {
            expect(await footerPOFirstCollapseSection.cardItems.length).toBe(0);
          });
          it("[PRPI-7507] the second Card is collapsed and has no items", async () => {
            expect(await footerPOSecondCollapseSection.cardItems.length).toBe(0);
          });

          describe("and the second Card is expanded", () => {
            beforeAll(async () => {
              await footerPOSecondCollapseSectionCard.element.scrollIntoView({
                block: "center",
              });
              await footerPOSecondCollapseSectionCard.header.click();
              await browser.waitUntilDisplayed(footerPOSecondCollapseSection.cardItems[5]);
            });

            it("[PRPI-7508] the first Card is collapsed and has no items", async () => {
              expect(await footerPOFirstCollapseSection.cardItems.length).toBe(0);
            });
            it("[PRPI-7509] the second Card is expanded and has 10 items", async () => {
              expect(await footerPOSecondCollapseSection.cardItems.length).toBe(6);
            });
          });
        });
      });
    });
  });
});
