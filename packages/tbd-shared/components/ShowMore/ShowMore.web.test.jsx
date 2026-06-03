import { render, act } from "@testing-library/react";
import { ShowMore } from "@ppb/the-wall-web";
import ShowMoreWrapper from "./ShowMore.web";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn((translation) => translation.key),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ShowMore: jest.fn(() => <show-more-mock />),
}));

jest.mock("../../hooks/useScrollIntoView.web", () => ({
  useWindowScrollIntoView: jest.fn().mockReturnValue(() => {}),
}));

global.scrollTo = jest.fn();

const onToggleShowMoreRunnersMock = jest.fn();
const setShowMoreMock = jest.fn();

const DEFAULT_PROPS = {
  numberOfItemsToDisplay: 5,
  numberOfLines: 10,
  showMore: true,
  setShowMore: setShowMoreMock,
  cardRef: "ref:1",
  onToggleShowMoreRunners: onToggleShowMoreRunnersMock,
};

const renderComponent = (props = {}) => render(<ShowMoreWrapper {...DEFAULT_PROPS} {...props} />);

describe("ShowMoreWrapper component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when number of lines is greater than the number of items to display", () => {
    describe("when showMore is closed", () => {
      it("should render ShowMore with Show More text", () => {
        const showMoreComponent = renderComponent({});

        expect(showMoreComponent).toBeDefined();
        expect(ShowMore).toHaveBeenCalledTimes(1);
        expect(ShowMore).toHaveBeenCalledWith(
          {
            onClick: expect.any(Function),
            text: "I18N.SHOW_MORE",
            opened: false,
            isHighlighted: false,
          },
          undefined,
        );
      });

      describe("when clicked", () => {
        beforeEach(() => {
          renderComponent({ showMore: true, cardRef: { parentElement: { parentElement: <div /> } } });
          act(() => {
            const { onClick } = ShowMore.mock.calls[0][0];
            onClick();
          });
        });

        it("should not call window.scrollTo", () => {
          expect(window.scrollTo).toHaveBeenCalledTimes(0);
        });

        it("should call setShowMore callback with false", () => {
          expect(setShowMoreMock).toHaveBeenCalledTimes(1);
          expect(setShowMoreMock).toHaveBeenCalledWith(false);
        });

        it("should call onToggleShowMoreRunners callback", () => {
          expect(onToggleShowMoreRunnersMock).toHaveBeenCalledTimes(1);
          expect(onToggleShowMoreRunnersMock).toHaveBeenCalledWith(true);
        });
      });
    });

    describe("when showMore is opened", () => {
      it("should render ShowMore with Show Less text", () => {
        const showMoreComponent = renderComponent({ showMore: false });

        expect(showMoreComponent).toBeDefined();
        expect(ShowMore).toHaveBeenCalledTimes(1);
        expect(ShowMore).toHaveBeenCalledWith(
          {
            onClick: expect.any(Function),
            text: "I18N.SHOW_LESS",
            opened: true,
            isHighlighted: false,
          },
          undefined,
        );
      });

      describe("when clicked", () => {
        beforeEach(() => {
          renderComponent({ showMore: false, cardRef: { parentElement: { parentElement: <div /> } } });
          act(() => {
            const { onClick } = ShowMore.mock.calls[0][0];
            onClick();
          });
        });

        it("should call window.scrollTo", () => {
          expect(window.scrollTo).toHaveBeenCalledTimes(1);
        });

        it("should call setShowMore callback with false", () => {
          expect(setShowMoreMock).toHaveBeenCalledTimes(1);
          expect(setShowMoreMock).toHaveBeenCalledWith(true);
        });

        it("should call onToggleShowMoreRunners callback", () => {
          expect(onToggleShowMoreRunnersMock).toHaveBeenCalledTimes(1);
          expect(onToggleShowMoreRunnersMock).toHaveBeenCalledWith(false);
        });
      });

      describe("when showMore is Highlighted", () => {
        it("should render ShowMore with highlighted prop as true", () => {
          const showMoreComponent = renderComponent({ isHighlighted: true });

          expect(showMoreComponent).toBeDefined();
          expect(ShowMore).toHaveBeenCalledTimes(1);
          expect(ShowMore).toHaveBeenCalledWith(
            {
              onClick: expect.any(Function),
              text: "I18N.SHOW_MORE",
              opened: false,
              isHighlighted: true,
            },
            undefined,
          );
        });
      });
    });

    describe("when number of lines is not greater thatn number of items to display", () => {
      let showMoreComponent;
      beforeEach(() => {
        showMoreComponent = renderComponent({ numberOfItemsToDisplay: 10 });
      });

      it("should not render ShowMore", () => {
        expect(showMoreComponent).toBeDefined();
        expect(ShowMore).not.toHaveBeenCalled();
      });

      it("should not call setShowMore callback", () => {
        expect(setShowMoreMock).not.toHaveBeenCalled();
      });

      it("should call onToggleShowMoreRunners callback", () => {
        expect(onToggleShowMoreRunnersMock).not.toHaveBeenCalled();
      });
    });
  });
});
