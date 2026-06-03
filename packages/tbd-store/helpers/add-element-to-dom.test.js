import { addElementToDOM, DEFAULT_INJECTED_SCRIPT_PROPS, injectScript } from "./add-element-to-dom";

const { head } = document;

jest.spyOn(head, "appendChild");

const SCRIPT_MOCK = {
  src: "src.js",
};

describe("Add element to DOM helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("addElementToDOM", () => {
    it("should call the appendChild method only once, even when called twice with the same element", () => {
      const element = document.createElement("div");

      expect(head.appendChild).not.toHaveBeenCalled();

      addElementToDOM(head, element);

      expect(head.appendChild).toHaveBeenCalledTimes(1);
      expect(head.appendChild).toHaveBeenCalledWith(element);

      addElementToDOM(head, element);

      expect(head.appendChild).toHaveBeenCalledTimes(1);
    });
  });

  describe("injectScript", () => {
    beforeEach(() => {
      head.innerHTML = "";
    });

    describe("when only the src is passed", () => {
      it("should inject the script with correct params", () => {
        injectScript(SCRIPT_MOCK);

        const script = head.getElementsByTagName("script")[0];

        expect(head.innerHTML).toContain(SCRIPT_MOCK.src);

        expect(script.type).toBe(DEFAULT_INJECTED_SCRIPT_PROPS.type);
        expect(script.getAttribute("async")).toBe(DEFAULT_INJECTED_SCRIPT_PROPS.async);
        expect(script.getAttribute("src")).toBe(SCRIPT_MOCK.src);
      });
    });

    describe("when all props are passed", () => {
      it("should inject the script with correct params", () => {
        injectScript({
          ...SCRIPT_MOCK,
          type: "type",
          async: false,
          custom: "value",
        });

        const script = head.getElementsByTagName("script")[0];

        expect(head.innerHTML).toContain(SCRIPT_MOCK.src);

        expect(script.type).toBe("type");
        expect(script.getAttribute("async")).toBe("false");
        expect(script.getAttribute("custom")).toBe("value");
        expect(script.getAttribute("src")).toBe(SCRIPT_MOCK.src);
      });
    });
  });
});
