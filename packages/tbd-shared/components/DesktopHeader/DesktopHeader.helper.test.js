import { startSSC, loadScripts, loadHeader } from "./DesktopHeader.helper";

describe("Desktop Header Helper", () => {
  const JS_FILES_MOCK = ["src.js"];

  afterEach(jest.resetAllMocks);

  describe("loadHeader", () => {
    const SSC_CONFIG = { config: "CONFIG" };
    const SSC_CONTENT_URL = "CONTENT_URL";
    const HEADER_HTML = "HEADER_HTML";
    const SSOID_COOKIE = "SSOID_COOKIE";
    const CSS_FILES_MOCK = ["src.css"];
    const SET_JS_FILES = jest.fn();
    const SET_HTML_CONTENT = jest.fn();
    const fetchFnMock = jest.fn();
    const jsonFnMock = jest.fn();

    beforeEach(() => {
      jsonFnMock.mockReturnValue({
        jsFiles: JS_FILES_MOCK,
        cssFiles: CSS_FILES_MOCK,
        header: HEADER_HTML,
      });
      fetchFnMock.mockReturnValue(Promise.resolve({ json: jsonFnMock }));
      global.fetch = fetchFnMock;
      global.console.error = jest.fn();
    });

    it("should throw if something goes wrong", async () => {
      let errorMessage;

      jsonFnMock.mockImplementation(() => {
        throw new Error("");
      });

      try {
        await startSSC(SSC_CONFIG, SSC_CONTENT_URL, SSOID_COOKIE);
      } catch (e) {
        errorMessage = e.message;
      }

      expect(errorMessage).toMatch(/(Could not load SSC Header).*/);
    });

    it("should call fetch without `X-Authentication` header if ssoidCookie is an empty string", async () => {
      await startSSC(SSC_CONFIG, SSC_CONTENT_URL, "");

      expect(fetchFnMock).toHaveBeenCalledWith(SSC_CONTENT_URL, {
        body: JSON.stringify(SSC_CONFIG),
        headers: {},
        method: "post",
      });
    });

    it("should call fetch with the correct parameters", async () => {
      await startSSC(SSC_CONFIG, SSC_CONTENT_URL, SSOID_COOKIE);

      expect(fetchFnMock).toHaveBeenCalledWith(SSC_CONTENT_URL, {
        body: JSON.stringify(SSC_CONFIG),
        headers: {
          "X-Authentication": SSOID_COOKIE,
        },
        method: "post",
      });
    });

    it("should return json ssc response", async () => {
      const result = await startSSC(SSC_CONFIG, SSC_CONTENT_URL, SSOID_COOKIE);

      expect(result).toEqual({
        cssFiles: ["src.css"],
        header: "HEADER_HTML",
        jsFiles: ["src.js"],
      });
    });

    describe("loadHeader", () => {
      let createElementMockFn;
      let appendChildMockFn;

      beforeEach(() => {
        createElementMockFn = jest.fn(() => ({}));
        appendChildMockFn = jest.fn();

        jest.spyOn(document, "createElement").mockImplementationOnce(createElementMockFn);
        jest.spyOn(document.head, "appendChild").mockImplementationOnce(appendChildMockFn);
      });

      it("should insert a link element for the css files", () => {
        loadHeader(CSS_FILES_MOCK[0], HEADER_HTML, SET_HTML_CONTENT);

        expect(createElementMockFn).toHaveBeenCalledWith("link");

        expect(appendChildMockFn).toHaveBeenCalledWith({
          href: CSS_FILES_MOCK[0],
          rel: "stylesheet",
          type: "text/css",
          onerror: expect.any(Function),
          onload: expect.any(Function),
        });
      });

      it("should call the setHtmlContent callback when the onload fn triggers", () => {
        loadHeader(CSS_FILES_MOCK[0], HEADER_HTML, SET_HTML_CONTENT);

        appendChildMockFn.mock.calls[0][0].onload();

        expect(SET_HTML_CONTENT).toHaveBeenCalledWith("HEADER_HTML");
      });

      it("should throw an error when onerror fn triggers", () => {
        let errorMessage;

        loadHeader(CSS_FILES_MOCK[0], HEADER_HTML, SET_HTML_CONTENT);

        try {
          appendChildMockFn.mock.calls[0][0].onerror();
        } catch (e) {
          errorMessage = e.message;
        }

        expect(errorMessage).toMatch(/(Could not load CSS for SSC).*/);
      });
    });
  });

  describe("loadScripts", () => {
    let getElementByIdMockFn;
    let getElementsByTagNameMockFn;
    let createElementMockFn;
    let appendChildMockFn;
    let evalMockFn;

    beforeEach(() => {
      getElementByIdMockFn = jest.fn();
      getElementsByTagNameMockFn = jest.fn();
      createElementMockFn = jest.fn(() => ({}));
      appendChildMockFn = jest.fn();
      evalMockFn = jest.fn();

      jest.spyOn(document, "createElement").mockImplementationOnce(createElementMockFn);
      jest.spyOn(document.head, "appendChild").mockImplementationOnce(appendChildMockFn);
      jest.spyOn(document, "getElementById").mockImplementationOnce(getElementByIdMockFn);
      jest.spyOn(global, "eval").mockImplementationOnce(evalMockFn);
    });

    it("should only call getElementById if it returns undefined", async () => {
      await loadScripts(JS_FILES_MOCK);

      expect(getElementByIdMockFn).toHaveBeenCalledWith("ssc-header-container");
      expect(getElementsByTagNameMockFn).not.toHaveBeenCalled();
      expect(createElementMockFn).not.toHaveBeenCalled();
      expect(appendChildMockFn).not.toHaveBeenCalled();
    });

    describe("when getElementById does not return undefined", () => {
      beforeEach(() => {
        getElementByIdMockFn.mockReturnValue({
          getElementsByTagName: getElementsByTagNameMockFn,
        });
      });

      describe("and getElementsByTagName returns undefined", () => {
        it("should not call createElement nor appendChild if the return from getElementsByTagName is undefined", async () => {
          await loadScripts(JS_FILES_MOCK);

          expect(getElementByIdMockFn).toHaveBeenCalledWith("ssc-header-container");
          expect(getElementsByTagNameMockFn).toHaveBeenCalledWith("script");
          expect(createElementMockFn).not.toHaveBeenCalled();
          expect(appendChildMockFn).not.toHaveBeenCalled();
        });
      });

      describe("and getElementsByTagName returns an empty array", () => {
        beforeEach(() => {
          getElementsByTagNameMockFn.mockReturnValue([]);
        });

        it("should not call createElement nor appendChild if the return from getElementsByTagName is undefined", async () => {
          await loadScripts(JS_FILES_MOCK);

          expect(getElementByIdMockFn).toHaveBeenCalledWith("ssc-header-container");
          expect(getElementsByTagNameMockFn).toHaveBeenCalledWith("script");
          expect(createElementMockFn).not.toHaveBeenCalled();
          expect(appendChildMockFn).not.toHaveBeenCalled();
        });
      });

      describe("and getElementsByTagName returns a non-empty array of strings", () => {
        const ELEMENTS_BY_TAG_NAME = [{ innerHTML: "FAKE_HTML" }, { innerHTML: "FAKE_HTML_2" }];

        beforeEach(() => {
          getElementsByTagNameMockFn.mockReturnValue(ELEMENTS_BY_TAG_NAME);
        });

        it("should call eval with the return values of getElementsByTagName", async () => {
          await loadScripts(JS_FILES_MOCK);

          expect(eval).toHaveBeenCalledTimes(2);
          expect(eval).toHaveBeenCalledWith(ELEMENTS_BY_TAG_NAME[0].innerHTML);
          expect(eval).toHaveBeenCalledWith(ELEMENTS_BY_TAG_NAME[1].innerHTML);
        });

        it("should log the error when eval fails", async () => {
          const THE_ERROR = new Error("ERROR");

          evalMockFn.mockImplementationOnce(() => {
            throw THE_ERROR;
          });

          await loadScripts(JS_FILES_MOCK);

          expect(eval).toHaveBeenCalledTimes(2);
          expect(console.error).toHaveBeenCalledTimes(1);
          expect(console.error).toHaveBeenCalledWith("Failed to eval script inside SSC header", THE_ERROR);
        });

        it("should call all document functions with the correct parameters", async () => {
          await loadScripts(JS_FILES_MOCK);

          expect(getElementByIdMockFn).toHaveBeenCalledWith("ssc-header-container");
          expect(getElementsByTagNameMockFn).toHaveBeenCalledWith("script");
          expect(createElementMockFn).toHaveBeenCalledWith("script");
          expect(appendChildMockFn).toHaveBeenCalledWith({
            async: true,
            crossOrigin: "anonymous",
            onerror: expect.any(Function),
            src: JS_FILES_MOCK[0],
          });
        });

        it("should throw an error if the script onerror triggers", async () => {
          let errorMessage;

          await loadScripts(JS_FILES_MOCK);

          try {
            appendChildMockFn.mock.calls[0][0].onerror();
          } catch (e) {
            errorMessage = e.message;
          }
          expect(errorMessage).toMatch(/(Could not load JS for SSC).*/);
        });
      });
    });
  });
});
