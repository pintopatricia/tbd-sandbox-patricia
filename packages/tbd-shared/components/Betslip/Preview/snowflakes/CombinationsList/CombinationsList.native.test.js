import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";

import { CombinationsList, CombinationsListLine } from "./CombinationsList.native";
import {
  COMBINATIONS_LIST_HEADER,
  COMBINATIONS_LIST_HEADER_ODD,
  COMBINATIONS_LIST_HEADER_PAYOUT,
  COMBINATIONS_LIST_HEADER_TITLE,
  COMBINATIONS_LIST_LINES,
  COMBINATIONS_LIST_MORE,
  COMBINATIONS_LIST_MORE_LABEL,
} from "./CombinationsList.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  heights: {},
  spacings: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderCombinationsList({
  isOpen = false,
  shortViewCount = 1337,
  children = <></>,
  i18n = {},
  onToggle = jest.fn(),
  onMore = jest.fn(),
} = {}) {
  return render(
    <CombinationsList isOpen={isOpen} shortViewCount={shortViewCount} i18n={i18n} onToggle={onToggle} onMore={onMore}>
      {children}
    </CombinationsList>,
  );
}

describe("CombinationsList", () => {
  beforeEach(jest.clearAllMocks);

  describe("header", () => {
    describe("when closed", () => {
      it("should render header title", () => {
        const { getByTestId } = renderCombinationsList({
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(getByTestId(COMBINATIONS_LIST_HEADER_TITLE)).toHaveTextContent("some title");
      });

      it("should not render header odd column", () => {
        const { queryByTestId } = renderCombinationsList({
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(queryByTestId(COMBINATIONS_LIST_HEADER_ODD)).toBe(null);
      });

      it("should not render header payout column", () => {
        const { queryByTestId } = renderCombinationsList({
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(queryByTestId(COMBINATIONS_LIST_HEADER_PAYOUT)).toBe(null);
      });

      it("should not render children", () => {
        const { queryByTestId } = renderCombinationsList({
          children: <Text>{"Test"}</Text>,
        });

        const lines = queryByTestId(COMBINATIONS_LIST_LINES);

        expect(lines).toBe(null);
      });
    });

    describe("when open", () => {
      it("should render header title", () => {
        const { getByTestId } = renderCombinationsList({
          isOpen: true,
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(getByTestId(COMBINATIONS_LIST_HEADER_TITLE)).toHaveTextContent("some title");
      });

      it("should render header odd column", () => {
        const { getByTestId } = renderCombinationsList({
          isOpen: true,
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(getByTestId(COMBINATIONS_LIST_HEADER_ODD)).toHaveTextContent("some odd");
      });

      it("should render header payout column", () => {
        const { getByTestId } = renderCombinationsList({
          isOpen: true,
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(getByTestId(COMBINATIONS_LIST_HEADER_PAYOUT)).toHaveTextContent("some payout");
      });

      describe("and children size is equal to shortViewCount", () => {
        it("should render all children", () => {
          const { getByTestId, getByText } = render(
            <CombinationsList isOpen={true} shortViewCount={2} i18n={{}} onToggle={jest.fn()} onMore={jest.fn()}>
              <Text>child 1</Text>
              <Text>child 2</Text>
            </CombinationsList>,
          );

          const lines = getByTestId(COMBINATIONS_LIST_LINES);

          expect(lines).not.toBe(null);
          expect(lines.children.length).toBe(2);

          expect(getByText("child 1")).not.toBeNull();
          expect(getByText("child 2")).not.toBeNull();
        });

        it("should not render more/less button", () => {
          const { queryByTestId } = render(
            <CombinationsList isOpen={true} shortViewCount={2} i18n={{}} onToggle={jest.fn()} onMore={jest.fn()}>
              <Text>child 1</Text>
              <Text>child 2</Text>
            </CombinationsList>,
          );

          const moreBtn = queryByTestId(COMBINATIONS_LIST_MORE);
          expect(moreBtn).toBe(null);
        });
      });

      describe("and children size is lower than shortViewCount", () => {
        it("should render all children", () => {
          const { getByTestId, getByText } = render(
            <CombinationsList isOpen={true} shortViewCount={3} i18n={{}} onToggle={jest.fn()} onMore={jest.fn()}>
              <Text>child 1</Text>
              <Text>child 2</Text>
            </CombinationsList>,
          );

          const lines = getByTestId(COMBINATIONS_LIST_LINES);

          expect(lines).not.toBe(null);
          expect(lines.children.length).toBe(2);

          expect(getByText("child 1")).not.toBeNull();
          expect(getByText("child 2")).not.toBeNull();
        });

        it("should not render more/less button", () => {
          const { queryByTestId } = render(
            <CombinationsList isOpen={true} shortViewCount={3} i18n={{}} onToggle={jest.fn()} onMore={jest.fn()}>
              <Text>child 1</Text>
              <Text>child 2</Text>
            </CombinationsList>,
          );

          const moreBtn = queryByTestId(COMBINATIONS_LIST_MORE);
          expect(moreBtn).toBe(null);
        });
      });

      describe("and children size is greater than shortViewCount", () => {
        it("should render only shortViewCount number of children", () => {
          const { getByTestId, getByText } = render(
            <CombinationsList isOpen={true} shortViewCount={1} i18n={{}} onToggle={jest.fn()} onMore={jest.fn()}>
              <Text>child 1</Text>
              <Text>child 2</Text>
            </CombinationsList>,
          );

          const lines = getByTestId(COMBINATIONS_LIST_LINES);

          expect(lines).not.toBe(null);
          expect(lines.children.length).toBe(1);

          expect(getByText("child 1")).not.toBeNull();
        });

        it("should render more button", () => {
          const { getByTestId } = render(
            <CombinationsList
              isOpen={true}
              shortViewCount={1}
              i18n={{
                more: "More",
                less: "Less",
              }}
              onToggle={jest.fn()}
              onMore={jest.fn()}
            >
              <Text>child 1</Text>
              <Text>child 2</Text>
            </CombinationsList>,
          );

          const moreBtn = getByTestId(COMBINATIONS_LIST_MORE_LABEL);
          expect(moreBtn).toHaveTextContent("More");
        });

        describe("and more button is clicked", () => {
          it("should render all children", () => {
            const { getByTestId, getByText } = render(
              <CombinationsList
                isOpen={true}
                shortViewCount={1}
                i18n={{
                  more: "More",
                  less: "Less",
                }}
                onToggle={jest.fn()}
                onMore={jest.fn()}
              >
                <Text>child 1</Text>
                <Text>child 2</Text>
              </CombinationsList>,
            );

            const moreBtn = getByTestId(COMBINATIONS_LIST_MORE_LABEL);
            fireEvent.press(moreBtn);

            const lines = getByTestId(COMBINATIONS_LIST_LINES);

            expect(lines).not.toBe(null);
            expect(lines.children.length).toBe(2);

            expect(getByText("child 1")).not.toBeNull();
            expect(getByText("child 2")).not.toBeNull();
          });

          it("should render less button", () => {
            const { getByTestId } = render(
              <CombinationsList
                isOpen={true}
                shortViewCount={1}
                i18n={{
                  more: "More",
                  less: "Less",
                }}
                onToggle={jest.fn()}
                onMore={jest.fn()}
              >
                <Text>child 1</Text>
                <Text>child 2</Text>
              </CombinationsList>,
            );

            const moreBtn = getByTestId(COMBINATIONS_LIST_MORE_LABEL);
            fireEvent.press(moreBtn);

            expect(moreBtn).toHaveTextContent("Less");
          });

          describe("and less button is clicked", () => {
            it("should go back to short view state", () => {
              const { getByTestId, getByText } = render(
                <CombinationsList
                  isOpen={true}
                  shortViewCount={1}
                  i18n={{
                    more: "More",
                    less: "Less",
                  }}
                  onToggle={jest.fn()}
                  onMore={jest.fn()}
                >
                  <Text>child 1</Text>
                  <Text>child 2</Text>
                </CombinationsList>,
              );

              const moreBtn = getByTestId(COMBINATIONS_LIST_MORE);
              fireEvent.press(moreBtn);
              fireEvent.press(moreBtn);

              const lines = getByTestId(COMBINATIONS_LIST_LINES);
              expect(lines).not.toBe(null);
              expect(lines.children.length).toBe(1);

              expect(getByText("child 1")).not.toBeNull();

              const moreBtnLabel = getByTestId(COMBINATIONS_LIST_MORE_LABEL);
              expect(moreBtnLabel).toHaveTextContent("More");
            });
          });
        });
      });
    });

    describe("when pressed", () => {
      it("should call onToggle callback", () => {
        const onToggleSpy = jest.fn();
        const { getByTestId } = renderCombinationsList({
          isOpen: true,
          i18n: {},
          onToggle: onToggleSpy,
        });

        const header = getByTestId(COMBINATIONS_LIST_HEADER);
        fireEvent.press(header);

        expect(onToggleSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("more", () => {
    describe("when is not open", () => {
      it("should not render more button", () => {
        const { queryByTestId } = render(
          <CombinationsList isOpen={false} shortViewCount={1} i18n={{}} onToggle={jest.fn()} onMore={jest.fn()}>
            <Text>child 1</Text>
            <Text>child 2</Text>
          </CombinationsList>,
        );

        expect(queryByTestId(COMBINATIONS_LIST_MORE)).toBe(null);
      });
    });
  });
});

describe("CombinationsListLine", () => {
  beforeEach(jest.clearAllMocks);

  function renderCombinationsListLine({ id = "Id", children = <></>, odd = "Odd", payout = "Payout" } = {}) {
    return render(
      <CombinationsListLine id={id} odd={odd} payout={payout}>
        {children}
      </CombinationsListLine>,
    );
  }

  it("should render line id", () => {
    const { getByTestId } = renderCombinationsListLine({
      children: <Text>{"Test"}</Text>,
    });

    expect(getByTestId("combinations-line-id")).toHaveTextContent("Id");
  });

  it("should render line content", () => {
    const { getByTestId } = renderCombinationsListLine({
      children: <Text>{"Test"}</Text>,
    });

    expect(getByTestId("combinations-line-content")).toHaveTextContent("Test");
  });

  it("should render line odd", () => {
    const { getByTestId } = renderCombinationsListLine({
      children: <Text>{"Test"}</Text>,
    });

    expect(getByTestId("combinations-line-odd")).toHaveTextContent("Odd");
  });

  it("should render line payout", () => {
    const { getByTestId } = renderCombinationsListLine({
      children: <Text>{"Test"}</Text>,
    });

    expect(getByTestId("combinations-line-payout")).toHaveTextContent("Payout");
  });
});
