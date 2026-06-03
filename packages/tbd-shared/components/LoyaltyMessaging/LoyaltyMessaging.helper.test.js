import { getModalParams, getParsedUrl, getTcUrl, getToastParams, isValidMessage } from "./LoyaltyMessaging.helper";

describe("LoyaltyMessaging", () => {
  const textMock = {
    message: {
      template: {
        header: "Regular value: ${params.text}",

        text: "Regular value: ${params.text2:string}",
      },
      params: {
        text: "text",
        text2: "more text",
      },
    },
  };

  const userDetailsMock = {
    localeCode: "en_GB",
    localeCodeBcp47: "en-GB",
    currencyCode: "GBP",
  };

  describe("isValidMessage", () => {
    describe("when the message does not have a valid format", () => {
      const invalidMock = {
        message: {
          template: {
            header: "Invalid param",
          },
          params: {},
        },
      };

      it("should return false", () => {
        const isValid = isValidMessage(invalidMock);
        expect(isValid).toBe(false);
      });
    });

    describe("when the message has a valid format", () => {
      it("should return true", () => {
        const isValid = isValidMessage(textMock);
        expect(isValid).toBe(true);
      });
    });
  });

  describe("getToastParams", () => {
    it("should replace the parameters", () => {
      const content = getToastParams(textMock, userDetailsMock);

      expect(content).toEqual({
        header: "Regular value: text",
        text: "Regular value: more text",
      });
    });

    describe("when formatting monetary values", () => {
      const mixedMock = {
        message: {
          template: {
            header: "Monetary value: ${params.num:monetary} Regular Value: ${params.num}",

            text: "Regular value: ${params.text} Monetary Filter: ${params.text}",
          },
          params: {
            num: "20",
            text: "text",
          },
        },
      };

      const content = getToastParams(mixedMock, userDetailsMock);

      it("should format numbers accordingly", () => {
        expect(content.header).toEqual("Monetary value: £20.00 Regular Value: 20");
      });

      describe("if the value isn't numeric", () => {
        it("should return the original value", () => {
          expect(content.text).toEqual("Regular value: text Monetary Filter: text");
        });
      });
    });

    describe("when formatting string values", () => {
      const mixedMock = {
        message: {
          template: {
            header: "Some text: ${params.someText:string}",

            text: "Regular value: ${params.text} Monetary Filter: ${params.text}",
          },
          params: {
            someText: "text",
          },
        },
      };

      const content = getToastParams(mixedMock, userDetailsMock);

      it("should format the string accordingly", () => {
        expect(content.header).toEqual("Some text: text");
      });
    });

    describe("when params don't exist", () => {
      const toastMockEmptyText = {
        message: {
          template: {
            header: "Invalid param: ${params.invalid} Regular Value: ${params.invalid:monetary}",
            text: "",
          },
          params: {},
        },
      };

      it("shouldn't replace the placeholder", () => {
        const content = getToastParams(toastMockEmptyText, userDetailsMock);

        expect(content.header).toEqual("Invalid param: ${params.invalid} Regular Value: ${params.invalid:monetary}");
      });
    });
  });

  describe("getModalParams", () => {
    const modalMock = {
      message: {
        template: {
          header: "Modal Header",
          text: "Modal text",
          buttonUrl: "//betting/football/s-1",
          image: "someImageUrl",
          imageAlt: "Modal header",
          buttonText: "Button text",
          tcText: "T&C Apply",
          tcUrl: "https://promotions.betfair.com",
        },
      },
    };

    const modalMockWithParams = {
      message: {
        template: {
          header: "Modal Header: ${params.header}",

          text: "Modal Text: ${params.text}",
          buttonUrl: "//betting/football/s-1",
          image: "someImageUrl",
          imageAlt: "Modal header",
          buttonText: "Button text",
          tcText: "T&C Apply",

          tcUrl: "${params.tcUrl}",
        },
        params: {
          header: "Header Replace",
          text: "Text Replace",
          tcUrl: "https://promotions.betfair.com",
        },
      },
    };

    it("should replace the parameters", () => {
      const content = getModalParams(modalMockWithParams, userDetailsMock);

      expect(content).toEqual({
        header: "Modal Header: Header Replace",
        text: "Modal Text: Text Replace",
        buttonUrl: "//betting/football/s-1",
        image: "someImageUrl",
        imageAlt: "Modal header",
        buttonText: "Button text",
        tcText: "T&C Apply",
        tcUrl: "https://promotions.betfair.com",
      });
    });

    it("should return the Modal", () => {
      expect(getModalParams(modalMock, userDetailsMock)).toStrictEqual(modalMock.message.template);
    });
  });

  describe("getParsedUrl", () => {
    describe("when URL starts with HTTP", () => {
      it("the final URL should not change", () => {
        expect(getParsedUrl("http://www.google.pt", "www.betfair.com")).toEqual("http://www.google.pt");
      });
    });

    describe("when the URL starts with /", () => {
      it("the final URL should be updated correctly", () => {
        expect(getParsedUrl("/partialUrl", "www.betfair.com")).toEqual("www.betfair.com/partialUrl");
      });
    });

    describe("when the URL does not start with neither HTTP nor /", () => {
      it("the final URL should be updated correctly", () => {
        expect(getParsedUrl("partialUrl", "www.betfair.com")).toEqual("www.betfair.com/partialUrl");
      });
    });
  });

  describe("getTcUrl", () => {
    const modalMockWithTCParams = {
      message: {
        template: {
          header: "Modal Header: ${params.header}",

          text: "Modal Text: ${params.text}",
          buttonUrl: "//betting/football/s-1",
          image: "someImageUrl",
          imageAlt: "Modal header",
          buttonText: "Button text",
          tcText: "T&C Apply",

          tcUrl: "${params.tcUrl}",
        },
        params: {
          header: "Header Replace",
          text: "Text Replace",
          tcUrl: "https://promotions.betfair.com",
        },
      },
    };

    it("should return the final URL updated correctly", () => {
      expect(getTcUrl(modalMockWithTCParams, userDetailsMock)).toEqual({ tcUrl: "https://promotions.betfair.com" });
    });
  });
});
