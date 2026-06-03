import { render, act } from "@testing-library/react-native";
import { ShowMore } from "@ppb/the-wall-native";
import ShowMoreCard from "./ShowMore.native";
import { useScrollIntoView } from "../../hooks/useScrollIntoView.native";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn((translation) => translation.key),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  ShowMore: jest.fn(() => <show-more-mock />),
}));

jest.mock("../../hooks/useScrollIntoView.native", () => ({
  useScrollIntoView: jest.fn().mockReturnValue(() => {}),
}));

const onToggleShowMoreRunnersMock = jest.fn();
const setShowMoreMock = jest.fn();
const mockRef = { current: "ref:123" };

const DEFAULT_PROPS = {
  cardRef: mockRef,
  numberOfItemsToDisplay: 5,
  numberOfLines: 10,
  showMore: true,
  setShowMore: setShowMoreMock,
  onToggleShowMoreRunners: onToggleShowMoreRunnersMock,
};

const renderComponent = (props = {}) => render(<ShowMoreCard {...DEFAULT_PROPS} {...props} />);

describe("ShowMoreCard component", () => {
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
          renderComponent({});
          act(() => {
            const { onClick } = ShowMore.mock.calls[0][0];
            onClick();
          });
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

    describe("when ShowMore is open", () => {
      it("should render ShowMore with Show Less text", () => {
        renderComponent({ showMore: false });
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
          renderComponent({ showMore: false });
          act(() => {
            const { onClick } = ShowMore.mock.calls[0][0];
            onClick();
          });
        });

        it("should call useScrollIntoView", () => {
          expect(useScrollIntoView).toHaveBeenCalledTimes(1);
        });

        it("should call setShowMore callback with true", () => {
          expect(setShowMoreMock).toHaveBeenCalledTimes(1);
          expect(setShowMoreMock).toHaveBeenCalledWith(true);
        });

        it("should call onToggleShowMoreRunners callback", () => {
          expect(onToggleShowMoreRunnersMock).toHaveBeenCalledTimes(1);
          expect(onToggleShowMoreRunnersMock).toHaveBeenCalledWith(false);
        });
      });
    });

    describe("when ShowMore is highlighted", () => {
      it("should render ShowMore with highlighted prop as true", () => {
        renderComponent({ isHighlighted: true });
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

  describe("when number of lines is not greater than number of items to display", () => {
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
