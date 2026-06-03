import { render } from "@testing-library/react-native";
import { Styled } from "@ppb/the-wall-native";
import { BetslipType } from "@ppb/tbd-store/state/constants";

import { Minimized } from "../Minimized/Minimized.native";
import { CollapsedView } from "./CollapsedView.native";
import {
  MINIMIZED_ERROR_TITLE,
  MINIMIZED_STRONG_TITLE,
  MINIMIZED_WEAK_TITLE,
} from "../../RootBetslip.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  Styled: jest.fn((props) => <styled-title {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon {...props} />),
}));

jest.mock("../Minimized/Minimized.native", () => ({
  Minimized: jest.fn(() => <minimized-betslip-mock />),
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

beforeEach(() => jest.clearAllMocks());

describe("CollapsedView", () => {
  describe("when not OBB", () => {
    describe("when has failures", () => {
      it("should render Minimized with Not combinable message", () => {
        renderCollapsedView({
          hasFailures: true,
        });

        const { queryByTestId } = render(Minimized.mock.calls[0][0].children);
        const errorTitle = queryByTestId(MINIMIZED_ERROR_TITLE);
        expect(errorTitle).toHaveTextContent("I18N.BETSLIP.NOT_COMBINABLE");
      });
    });

    describe("when isConfirm is true", () => {
      it("should render Minimized with CONFIRM SELECTIONS title", () => {
        renderCollapsedView({
          isConfirm: true,
        });

        const { queryByTestId } = render(Minimized.mock.calls[0][0].children);
        const strongTitle = queryByTestId(MINIMIZED_STRONG_TITLE);
        expect(strongTitle).toHaveTextContent("I18N.BETSLIP.TITLE");

        const weakTitle = queryByTestId(MINIMIZED_WEAK_TITLE);
        expect(weakTitle).toHaveTextContent("- I18N.BETSLIP.CONFIRM_SELECTIONS");
      });
    });

    describe("when isConfirm is false", () => {
      describe("and has a single selection", () => {
        it("should render Minimized with correct title", () => {
          renderCollapsedView({
            totalSelections: 1,
          });

          const { queryByTestId } = render(Minimized.mock.calls[0][0].children);
          const strongTitle = queryByTestId(MINIMIZED_STRONG_TITLE);
          expect(strongTitle).toHaveTextContent("I18N.BETSLIP.TITLE");
        });
      });

      describe("and has several selections", () => {
        describe("and has not a title", () => {
          it("should render Minimized with correct title", () => {
            renderCollapsedView({
              totalSelections: 2,
            });

            const { queryByTestId } = render(Minimized.mock.calls[0][0].children);
            const strongTitle = queryByTestId(MINIMIZED_STRONG_TITLE);
            expect(strongTitle).toHaveTextContent("I18N.BETSLIP.TITLE");
          });
        });

        describe("and has a title", () => {
          it("should render Minimized with correct title", () => {
            renderCollapsedView({
              totalSelections: 2,
              title: "TITLE MOCK",
            });

            render(Minimized.mock.calls[0][0].children);
            expect(Styled).toHaveBeenCalledWith(
              expect.objectContaining({ translation: "TITLE MOCK", numberOfLines: 2 }),
              undefined,
            );
            expect(Styled).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });

  describe("when OBB", () => {
    describe("when has failures", () => {
      it("should render Minimized with Not combinable message", () => {
        renderCollapsedView({
          hasFailures: true,
          activeBetslipType: BetslipType.OBB,
        });

        const { queryByTestId } = render(Minimized.mock.calls[0][0].children);
        const errorTitle = queryByTestId(MINIMIZED_ERROR_TITLE);
        expect(errorTitle).toHaveTextContent("I18N.BETSLIP.NOT_COMBINABLE");
      });
    });

    describe("and has a single selection", () => {
      it("should render Minimized with correct title", () => {
        renderCollapsedView({
          totalSelections: 1,
          activeBetslipType: BetslipType.OBB,
        });

        const { queryByTestId } = render(Minimized.mock.calls[0][0].children);
        const strongTitle = queryByTestId(MINIMIZED_STRONG_TITLE);
        expect(strongTitle).toHaveTextContent("I18N.OBB_BETSLIP.TITLE");

        const weakTitle = queryByTestId(MINIMIZED_WEAK_TITLE);

        expect(weakTitle).toHaveTextContent("- I18N.BETSLIP.ADD_MORE_SELECTIONS");
      });
    });

    describe("and has several selections", () => {
      it("should render Minimized with correct title", () => {
        renderCollapsedView({
          totalSelections: 2,
          activeBetslipType: BetslipType.OBB,
        });

        const { queryByTestId } = render(Minimized.mock.calls[0][0].children);
        const strongTitle = queryByTestId(MINIMIZED_STRONG_TITLE);
        expect(strongTitle).toHaveTextContent("I18N.OBB_BETSLIP.TITLE");
      });
    });
  });
});
