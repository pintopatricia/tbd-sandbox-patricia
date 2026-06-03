import "jest-dom/extend-expect";
import { act, render } from "@testing-library/react";
import { FullScreenModal, RichTextComponent } from "@ppb/the-wall-web";

import MarketGraph from "./MarketGraph.web";
import styles from "./MarketGraph.web.css";
import { TEST_ID, HEADER } from "./MarketGraph.web.selectors";

import { getCookie } from "../../helpers/cookies.web";

jest.mock("@ppb/the-wall-web", () => ({
  __esModule: true,
  FullScreenModal: jest.fn(({ children }) => <full-screen-modal-mock>{children}</full-screen-modal-mock>),
  RichTextComponent: jest.fn(() => <rich-text-component-mock />),
}));

jest.mock("../../helpers/cookies.web", () => ({
  getCookie: jest.fn(),
}));

const renderMarketGraph = ({ theme = null, baseUrl, eventName, marketName, onMarketGraphDismiss = jest.fn() } = {}) => {
  getCookie.mockReturnValueOnce(theme);
  return render(
    <MarketGraph
      title="title"
      baseUrl={baseUrl}
      eventName={eventName}
      marketName={marketName}
      onMarketGraphDismiss={onMarketGraphDismiss}
    />,
  );
};

describe("Market Graph Component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when 'baseUrl' is valid", () => {
    describe("when event name is valid", () => {
      describe("when market name is valid", () => {
        const renderSuccessfulMarketGraph = ({ theme, onMarketGraphDismiss = jest.fn() } = {}) =>
          renderMarketGraph({
            theme,
            baseUrl: "https://ega.endpoint/",
            eventName: "eventName",
            marketName: "marketName",
            onMarketGraphDismiss,
          });

        it("should call getCookie", () => {
          renderSuccessfulMarketGraph();

          expect(getCookie).toHaveBeenCalledTimes(1);
          expect(getCookie).toHaveBeenCalledWith("theme");
        });

        it("should call FullScreenModal", () => {
          renderSuccessfulMarketGraph();

          expect(FullScreenModal).toHaveBeenCalledTimes(1);
          expect(FullScreenModal).toHaveBeenCalledWith(
            {
              title: "title",
              children: expect.anything(),
              onDismiss: expect.any(Function),
            },
            undefined,
          );
        });

        it("should render a container", () => {
          const { container } = renderSuccessfulMarketGraph();
          const mainContainer = container.querySelector(TEST_ID);

          expect(mainContainer).toBeDefined();
          expect(mainContainer).toHaveClass(styles.container);
        });

        it("should render an header", () => {
          const { container } = renderSuccessfulMarketGraph();
          const header = container.querySelector(HEADER);

          expect(header).toBeDefined();
          expect(header).toHaveClass(styles.header);
        });

        it("should call RichTextComponent", () => {
          renderSuccessfulMarketGraph();

          expect(RichTextComponent).toHaveBeenCalledTimes(1);
          expect(RichTextComponent).toHaveBeenCalledWith(
            {
              list: [
                {
                  text: "eventName",
                  type: "heading2",
                },
                {
                  text: "marketName",
                  type: "paragraph",
                },
              ],
            },
            undefined,
          );
        });

        it("should render an iframe", () => {
          const { container } = renderSuccessfulMarketGraph();
          const iframe = container.querySelector("iframe");

          expect(iframe).toBeDefined();
          expect(iframe.tagName).toEqual("IFRAME");
          expect(iframe).toHaveClass(styles.iframeMarketGraph);
        });

        describe("when getCookie returns data", () => {
          describe("when cookie value is valid", () => {
            it("should render an iframe with EGA url 'theme' query param as 2", () => {
              const { container } = renderSuccessfulMarketGraph({ theme: "2" });
              const iframe = container.querySelector("iframe");

              expect(iframe.getAttribute("src")).toEqual("https://ega.endpoint/?product=tbd&theme=2");
            });
          });

          describe("when cookie value is null", () => {
            it("should render an iframe with EGA url 'theme' query param as 1", () => {
              const { container } = renderSuccessfulMarketGraph();
              const iframe = container.querySelector("iframe");

              expect(iframe.getAttribute("src")).toEqual("https://ega.endpoint/?product=tbd&theme=1");
            });
          });
        });

        describe("when FullScreenModal.onDismiss is triggered", () => {
          it("should call onMarketGraphDismiss", () => {
            const onMarketGraphDismiss = jest.fn();
            renderSuccessfulMarketGraph({ onMarketGraphDismiss });

            act(() => {
              const [{ onDismiss }] = FullScreenModal.mock.calls[0];
              onDismiss();
            });

            expect(onMarketGraphDismiss).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("when market name is not valid", () => {
        it("should return null", () => {
          const { container } = renderMarketGraph({
            baseUrl: "https://ega.endpoint/",
            eventName: "eventName",
          });
          const mainContainer = container.querySelector(TEST_ID);

          expect(mainContainer).toEqual(null);
        });
      });
    });

    describe("when event name is not valid", () => {
      it("should return null", () => {
        const { container } = renderMarketGraph({ baseUrl: "https://ega.endpoint/" });
        const mainContainer = container.querySelector(TEST_ID);

        expect(mainContainer).toEqual(null);
      });
    });
  });

  describe("when 'baseUrl' is not valid", () => {
    it("should return null", () => {
      const { container } = renderMarketGraph();
      const mainContainer = container.querySelector(TEST_ID);

      expect(mainContainer).toEqual(null);
    });
  });
});
