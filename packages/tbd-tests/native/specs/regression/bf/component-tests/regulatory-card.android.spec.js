const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../helpers/urls");
const MockService = require("../../../../mock-essentials/mocking-service");
const {
  GenericScreenSO,
  FooterSO,
  CardSO,
  SectionElementsSO,
  ClockSO,
  RegulatorySectionsSessionSO,
} = require("../../../../screen-objects");
const { swipeUp } = require("../../../../helpers/gestures");

const mockService = new MockService();
const footerSO = new FooterSO();
const firstSectionSO = new SectionElementsSO(footerSO.sections[0]);
const secondSectionSO = new SectionElementsSO(footerSO.sections[1]);
const thirdSectionSO = new SectionElementsSO(footerSO.sections[2]);
const fourthSectionSO = new SectionElementsSO(footerSO.sections[3]);
const thirdSectionCardSO = new CardSO(thirdSectionSO.element);
const sessionSectionsSessionSO = new RegulatorySectionsSessionSO(secondSectionSO.textElements[0]);
const loggedSectionsSessionSO = new RegulatorySectionsSessionSO(secondSectionSO.textElements[1]);
const lastLoginSectionsSessionSO = new RegulatorySectionsSessionSO(fourthSectionSO.textElements[0]);
const genericScreenSO = new GenericScreenSO();
const clockSO = new ClockSO(firstSectionSO.element);

const mock = {
  __typename: "GenericView",
  url: "view/generic:home",
  urn: "ppb:tbd:view:generic:home",

  edges: [
    {
      node: {
        urn: "ppb:tbd:card:regulatory",
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
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Gambling can be addictive, please play responsibly",
                url: "http://responsiblegambling.betfair.com/",
                target: "BLANK",
              },
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Regulatory Section Text",
              },
            ],
          },
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: null,
            items: [
              {
                __typename: "RegulatorySessionItem",
                alignment: "LEFT",
                sessionText: "Session",
                timeFormat: "HH:mm",
              },
              {
                __typename: "RegulatoryLoggedInSinceItem",
                alignment: "LEFT",
                loggedInSinceText: "Some Logged In Text",
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
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Text Item in Footer Accordion.",
              },
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Text Item 2 in Footer Accordion.",
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
              {
                __typename: "RegulatoryClockItem",
                alignment: "LEFT",
                timeZone: "Europe/London",
                timeFormat: "HH:mm",
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
        __typename: "RegulatoryCard",
        urn: "ppb:tbd:card:regulatory",
      },
    },
  ],
};

describe("Layout Entity - RegulatoryCard", () => {
  describe("When user enters a generic screen and sees the footer", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(mock));
      await startApp("home");
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilEquals(firstSectionSO.title, "Responsible Gambling");
      await browser.waitUntilDisplayed(firstSectionSO.imageElements[0]);
    });

    it("[PRPI-2494] The first regulatory section title should be displayed", async () => {
      expect(await firstSectionSO.title.getText()).toBe("Responsible Gambling");
    });

    it("[PRPI-2495] The first regulatory section image item should be displayed", async () => {
      expect(await firstSectionSO.imageElements[0].isDisplayed()).toBe(true);
    });

    it("[PRPI-2496] The first regulatory section link item text should be correct", async () => {
      expect(await firstSectionSO.linkElements[0].getText()).toBe("Gambling can be addictive, please play responsibly");
    });

    it("[PRPI-2497] The first regulatory section text item should be displayed with correct text", async () => {
      expect(await firstSectionSO.textElements[0].getText()).toBe("Regulatory Section Text");
    });

    it("[PRPI-2498] The second regulatory section should not have a title", async () => {
      expect(await secondSectionSO.title.isDisplayed()).toBe(false);
    });

    it("[PRPI-2499] The second regulatory session item text should be 'Session'", async () => {
      expect(await sessionSectionsSessionSO.text.getText()).toBe("Session");
    });

    it("[PRPI-2500] The second regulatory logged in since should display correct value", async () => {
      expect(await loggedSectionsSessionSO.text.getText()).toBe("Some Logged In Text");
    });

    it("[PRPI-2501] The collapsible card should be open", async () => {
      expect(await thirdSectionCardSO.contentWrapper.isDisplayed()).toBe(true);
    });

    it("[PRPI-2502] The collapsible card items should be displayed", async () => {
      expect(await thirdSectionSO.textElements.length).toBe(2);
    });

    describe("When the user scrolls down on the footer And RegulatoryCard is retrieved with last login and user details", () => {
      beforeAll(async () => {
        await swipeUp();
        await browser.waitUntilDisplayed(fourthSectionSO.element);
      });

      it("[PRPI-2503] The user first name should be visible", async () => {
        expect(await fourthSectionSO.textElements[1].getText()).toContain("Fabrizio");
      });
      it("[PRPI-2504] The user last name should be visible", async () => {
        expect(await fourthSectionSO.textElements[1].getText()).toContain("Sottosanti");
      });
      it("[PRPI-2505] The contract number should be visible 'Contract n\xBA 11768206'", async () => {
        expect(await fourthSectionSO.textElements[1].getText()).toContain("11768106");
      });
      it("[PRPI-2506] The nationalIdentifier number should be visible '1139492482'", async () => {
        expect(await fourthSectionSO.textElements[1].getText()).toContain("STTFRZ90B11C351P");
      });
      it("[PRPI-2507] The last login date and hour should be visible 'Ultimo acesso: 09/08/2022 - 17:16'", async () => {
        expect(await lastLoginSectionsSessionSO.text.isDisplayed()).toBe(true);
        expect(await lastLoginSectionsSessionSO.text.getText()).toBe("Ultimo accesso:");
        expect(await lastLoginSectionsSessionSO.time.isDisplayed()).toBe(true);
        expect(await lastLoginSectionsSessionSO.time.getText()).toBe("09/08/2022 - 17:16");
      });
      it("[PRPI-2508] The first regulatory section clock item should be displayed", async () => {
        expect(await clockSO.element.isDisplayed()).toBe(true);
      });
    });

    describe("When user taps to collapse the card", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(thirdSectionCardSO.header);
        await browser.waitUntilDisplayed(thirdSectionCardSO.contentWrapper);
        await thirdSectionCardSO.header.click();
        await browser.waitUntilNotDisplayed(thirdSectionCardSO.contentWrapper);
      });

      it("[PRPI-2509] The collapsible card section should be collapsed", async () => {
        expect(await thirdSectionCardSO.contentWrapper.isDisplayed()).toBe(false);
      });

      it("[PRPI-2510] The collapsible card section items should not be displayed", async () => {
        expect(await thirdSectionSO.textElements.length).toBe(0);
      });

      describe("When user taps to open the collapsible card", () => {
        beforeAll(async () => {
          await browser.waitUntilNotDisplayed(thirdSectionCardSO.contentWrapper);
          await browser.waitUntilClickableNative(thirdSectionCardSO.header);
          await thirdSectionCardSO.header.click();
          await browser.waitUntilDisplayed(thirdSectionCardSO.contentWrapper);
          await browser.waitUntilDisplayed(thirdSectionSO.textElements[0]);
          await swipeUp();
        });

        it("[PRPI-2511] The collapsible card should be open", async () => {
          expect(await thirdSectionCardSO.contentWrapper.isDisplayed()).toBe(true);
        });

        it("[PRPI-2512] The collapsible card items should be displayed", async () => {
          expect(await thirdSectionSO.textElements.length).toBe(2);
        });
      });
    });
  });
});
