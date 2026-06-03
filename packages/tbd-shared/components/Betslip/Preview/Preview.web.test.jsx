import { render, act } from "@testing-library/react";
import { Preview } from "./Preview.web";
import { CombinationsList } from "./snowflakes/CombinationsList/CombinationsList.web";
import ConnectedPreviewLine from "../PreviewLine";
import { PreviewLine } from "../PreviewLine/PreviewLine.web";

jest.mock("./snowflakes/CombinationsList/CombinationsList.web", () => ({
  CombinationsList: jest.fn(({ children }) => <combinations-list-mock>{children}</combinations-list-mock>),
}));

jest.mock("../PreviewLine", () => jest.fn(() => <connected-preview-mock />));
jest.mock("../PreviewLine/PreviewLine.web", () => ({
  PreviewLine: jest.fn(() => <preview-line-mock />),
}));

function renderPreview({ id = "COMB:1", lineIds = [], i18n = {}, dispatchOnOpen = jest.fn() } = {}) {
  return render(<Preview id={id} lineIds={lineIds} i18n={i18n} dispatchOnOpen={dispatchOnOpen} />);
}

describe("ConnectedPreview", () => {
  beforeEach(jest.clearAllMocks);

  it("should call CombinationsList", () => {
    renderPreview();

    expect(CombinationsList).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        shortViewCount: 4,
        i18n: {},
        isOpen: false,
        onMore: expect.any(Function),
        onToggle: expect.any(Function),
      },
      undefined,
    );
  });

  it("should call ConnectedPreviewLine per each line id", () => {
    renderPreview({ lineIds: ["1", "2"] });

    expect(ConnectedPreviewLine).toHaveBeenNthCalledWith(
      1,
      {
        id: "1",
        component: PreviewLine,
        order: 0,
      },
      undefined,
    );

    expect(ConnectedPreviewLine).toHaveBeenNthCalledWith(
      2,
      {
        id: "2",
        component: PreviewLine,
        order: 1,
      },
      undefined,
    );

    expect(ConnectedPreviewLine).toHaveBeenCalledTimes(2);
  });

  describe("when open state is toggled to true", () => {
    it("should dispatch on open only", () => {
      const dispatchOnOpenSpy = jest.fn();

      renderPreview({ dispatchOnOpen: dispatchOnOpenSpy });

      act(() => {
        const { onToggle } = CombinationsList.mock.calls[0][0];

        onToggle();
      });

      act(() => {
        const { onToggle } = CombinationsList.mock.calls[1][0];

        onToggle();
      });

      expect(dispatchOnOpenSpy).toHaveBeenCalledWith("COMB:1");
      expect(dispatchOnOpenSpy).toHaveBeenCalledTimes(1);
    });
  });
});
