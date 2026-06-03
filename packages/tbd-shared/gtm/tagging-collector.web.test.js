import { sendEvent } from "./tagging-collector.web";

const analyticsPushEvent = jest.fn();

describe("tagging-collector", () => {
  describe("when the event is metaData", () => {
    beforeEach(() => {
      window.dataLayer = undefined;
      window._aw_ = undefined;
      window.enhancedDataLayer = undefined;
    });

    it("should push the event to dataLayer", () => {
      const event = {
        event: "metaData",
        category: "category",
        action: "action",
        label: "label",
        cd3: "betslip",
      };

      sendEvent(event);
      expect(window.dataLayer).toEqual([event]);
    });
  });

  describe("when the event is not metaData", () => {
    describe("when _aw_ is undefined", () => {
      describe("and when enhancedDataLayer is undefined on window", () => {
        beforeEach(() => {
          window._aw_ = undefined;
          window.enhancedDataLayer = undefined;
        });

        it("should initialize the enhancedDataLayer and add the new event to it", () => {
          const event = {
            event: "event",
            category: "category",
            action: "action",
            label: "label",
            cd3: "betslip",
          };

          sendEvent(event);
          expect(window.enhancedDataLayer).toEqual([event]);
        });
      });

      describe("and when enhancedDataLayer is defined on window", () => {
        beforeEach(() => {
          window._aw_ = undefined;
          window.enhancedDataLayer = [];
        });

        it("should add the new event to it", () => {
          const event = {
            event: "event",
            category: "category",
            action: "action",
            label: "label",
            cd3: "betslip",
          };

          sendEvent(event);
          expect(window.enhancedDataLayer).toEqual([event]);
        });

        it("should convert properties to lowercase", () => {
          const event = {
            event: "ga_event",
            category: "category Awesome",
            action: 1,
            label: "Label",
            cd3: undefined,
          };

          sendEvent(event);
          expect(window.enhancedDataLayer).toEqual([
            {
              event: "ga_event",
              category: "category awesome",
              action: 1,
              label: "label",
              cd3: undefined,
            },
          ]);
        });

        it("should NOT change ignored properties", () => {
          const event = {
            event: "ga_pageLoad",
            ga_target_property: "UA-1234567-8",
            app_id: "wsedGda123GDA",
            country: "PT",
            currency: "EUR",
            jurisdiction: "INTERNATIONAL",
          };

          sendEvent(event);
          expect(window.enhancedDataLayer).toEqual([
            {
              event: "ga_pageLoad",
              ga_target_property: "UA-1234567-8",
              app_id: "wsedGda123GDA",
              country: "pt",
              currency: "eur",
              jurisdiction: "international",
            },
          ]);
        });
      });
    });

    describe("when _aw_ is defined and _aw_.analyticsPushEvent is a function", () => {
      beforeEach(() => {
        window._aw_ = { analyticsPushEvent };
      });

      it("should call _aw_.analyticsPushEvent with the event", () => {
        const event = {
          event: "event",
          category: "category",
          action: "action",
          label: "label",
        };

        sendEvent(event);
        expect(analyticsPushEvent).toHaveBeenCalledWith(event);
      });
    });
  });

  describe("when ga is defined in window", () => {
    beforeAll(() => {
      window.ga = jest.fn();
    });

    it("should call it with transport set to beacon", () => {
      const event = {
        event: "event",
        category: "category",
        action: "action",
        label: "label",
      };

      sendEvent(event);
      expect(window.ga).toHaveBeenCalledWith("set", { transport: "beacon" });
    });
  });
});
