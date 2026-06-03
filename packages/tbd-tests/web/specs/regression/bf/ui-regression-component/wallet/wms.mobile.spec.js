const { getWmsMessage, getGenericLayout, readWmsMessage } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { ModalPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getHtmlFilePuppeteer } = require("../../../../../mock-essentials/controllers/html/html-controller");

const modalPO = new ModalPO();
const mockService = new MockService();

const URL = `${routes.getHomeViewUrl()}?loginStatus=SUCCESS`;
const ONE_WEB_MESSAGE = {
  MarketingMessages: [
    {
      urn: "ppb:tbd:modalElement:webMessage:1",
      content: {
        title: "My Web Message",
        templateUrl: "/templates/messagetemplate/index.html",
        templateHeight: 400,
        templateWidth: 800,
      },
    },
  ],
};

const TWO_WEB_MESSAGES = {
  MarketingMessages: [
    {
      urn: "ppb:tbd:modalElement:webMessage:1",
      content: {
        title: "First Web Message",
        templateUrl: "/messagetemplate/index.html",
        templateHeight: 400,
        templateWidth: 800,
      },
    },
    {
      urn: "ppb:tbd:modalElement:webMessage:2",
      content: {
        title: "Second Web Message",
        templateUrl: "/messagetemplate/index.html",
        templateHeight: 400,
        templateWidth: 800,
      },
    },
  ],
};
const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: {},
  edges: [],
  partialEdges: [],
};

const MODAL_CONTENT = `<p id="message-template">First template</p>`;

const MODAL_ELEMENT = $("#message-template");

describe("Web Messages", () => {
  describe("[912888] When the user is successfully logged in", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_HOME_VIEW_MOCK.urn, {
          currentUrl: "?loginStatus=SUCCESS",
          __POST_LOGIN_SESSION__: true,
        }),
      );

      await mockService.mockHttpRequest(getHtmlFilePuppeteer({ path: ".*messagetemplate.*", content: MODAL_CONTENT }));

      await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK));
    });

    describe("and has a web message", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getWmsMessage(ONE_WEB_MESSAGE));
        await browser.url(URL);
        await browser.waitUntilIframeReady(modalPO.body.$("iframe"), MODAL_ELEMENT);
      });

      it("[PRPI-7669] The web message header is displayed", async () => {
        expect(await modalPO.header.isDisplayed()).toBe(true);
      });

      it("[PRPI-7670] and the web message title is correct", async () => {
        expect(await modalPO.headerTitle.getText()).toBe("");
      });

      it("[PRPI-7671] and the web message body is displayed", async () => {
        expect(await modalPO.body.isDisplayed()).toBe(true);
      });

      it("[PRPI-8439] and the web message body 'messagetemplate' is displayed", async () => {
        expect(await modalPO.body.$("iframe").getAttribute("src")).toContain("messagetemplate");
      });
    });

    describe("and has two web message", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getWmsMessage(TWO_WEB_MESSAGES));
        await mockService.mockHttpRequest(readWmsMessage());
        await browser.url(URL);

        await browser.waitUntilIframeReady(modalPO.body.$("iframe"), MODAL_ELEMENT);
      });

      it("[PRPI-7672] and the first modal body is correct", async () => {
        expect(await modalPO.body.$("iframe").getAttribute("title")).toEqual("First Web Message");
      });

      describe("and when the user closes the second web message", () => {
        beforeAll(async () => {
          await modalPO.headerCloseBtn.waitForClickable({
            timeout: 8000,
            timeoutMsg: "Modal close button was not clickable",
          });
          await modalPO.headerCloseBtn.click();

          await browser.waitUntilIframeReady(modalPO.body.$("iframe"), MODAL_ELEMENT);
        });

        it("[PRPI-7673] and the second modal body is correct", async () => {
          expect(await modalPO.body.$("iframe").getAttribute("title")).toEqual("Second Web Message");
        });
      });
    });
  });
});
