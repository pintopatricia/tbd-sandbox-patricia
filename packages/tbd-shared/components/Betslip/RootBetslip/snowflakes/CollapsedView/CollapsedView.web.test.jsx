import { render } from "@testing-library/react";
import { Styled } from "@ppb/the-wall-web";
import { BetslipType } from "@ppb/tbd-store/state/constants";

import { Minimized } from "../Minimized/Minimized.web";
import { CollapsedView } from "./CollapsedView.web";

jest.mock("@ppb/the-wall-web", () => ({
  Styled: jest.fn((props) => <styled-title {...props} />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon {...props} />),
}));

jest.mock("../Minimized/Minimized.web", () => ({
  Minimized: jest.fn(({ children }) => <div data-testid="minimized-mock">{children}</div>),
}));

jest.mock("../../../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

function renderCollapsedView({
  title = "",
  activeBetslipType = "SPORTSBOOK",
  totalSelections = 1,
  hasFailures,
  isConfirm = false,
} = {}) {
  return render(
    <CollapsedView
      title={title}
      activeBetslipType={activeBetslipType}
      totalSelections={totalSelections}
      hasFailures={hasFailures}
      isConfirm={isConfirm}
    />,
  );
}

describe("CollapsedView", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when is OBB betslip", () => {
    describe("and has failures", () => {
      it("should render the not combinable message", () => {
        const { getByText } = renderCollapsedView({
          hasFailures: true,
          activeBetslipType: BetslipType.OBB,
        });

        expect(getByText("I18N.BETSLIP.NOT_COMBINABLE")).not.toBeNull();
      });
    });

    describe("and has a single selection", () => {
      it("should render minimized component with correct title", () => {
        const { getByText } = renderCollapsedView({
          totalSelections: 1,
          activeBetslipType: BetslipType.OBB,
        });

        expect(getByText("I18N.OBB_BETSLIP.TITLE")).not.toBeNull();
        expect(getByText(/I18N\.BETSLIP\.ADD_MORE_SELECTIONS/)).not.toBeNull();
      });
    });

    describe("and has several selections", () => {
      it("should render minimized component with correct title", () => {
        const { getByText } = renderCollapsedView({
          totalSelections: 2,
          activeBetslipType: BetslipType.OBB,
        });

        expect(getByText("I18N.OBB_BETSLIP.TITLE")).not.toBeNull();
      });
    });
  });

  describe("when is not OBB betslip", () => {
    describe("and has failures", () => {
      it("should render the not combinable message", () => {
        const { getByText } = renderCollapsedView({
          hasFailures: true,
        });

        expect(getByText("I18N.BETSLIP.NOT_COMBINABLE")).not.toBeNull();
      });
    });

    describe("when isConfirm is true", () => {
      it("should render the confirm selections message", () => {
        const { getByText } = renderCollapsedView({
          isConfirm: true,
        });

        expect(getByText("I18N.BETSLIP.TITLE")).not.toBeNull();
        expect(getByText(/I18N\.BETSLIP\.CONFIRM_SELECTIONS/)).not.toBeNull();
      });
    });

    describe("when isConfirm is false", () => {
      describe("and has several selections", () => {
        it("should render minimazed component with correct title", () => {
          const { getByText } = renderCollapsedView({
            totalSelections: 2,
          });

          expect(getByText("I18N.BETSLIP.TITLE")).not.toBeNull();
        });
      });
      describe("when has title", () => {
        it("should render the Styled component with title", () => {
          renderCollapsedView({
            title: "TITLE MOCK",
            totalSelections: 2,
          });

          expect(Minimized).toHaveBeenCalledWith(
            expect.objectContaining({
              children: expect.anything(),
            }),
            undefined,
          );

          expect(Styled).toHaveBeenCalledWith(
            expect.objectContaining({
              translation: "TITLE MOCK",
              styles: expect.anything(),
            }),
            undefined,
          );
        });
      });
    });
  });
});
