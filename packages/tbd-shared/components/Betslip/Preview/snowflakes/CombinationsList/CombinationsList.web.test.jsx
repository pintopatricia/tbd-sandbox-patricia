import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { CombinationsList, CombinationsListLine } from "./CombinationsList.web";
import { HEADER, HEADER_ODD, HEADER_PAYOUT, HEADER_TITLE, LINES, MORE } from "./CombinationsList.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
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

const DefaultCombinationsList = ({
  isOpen = false,
  shortViewCount = 1337,
  children = <></>,
  i18n = {},
  onToggle = jest.fn(),
  onMore = jest.fn(),
}) => (
  <CombinationsList isOpen={isOpen} shortViewCount={shortViewCount} i18n={i18n} onToggle={onToggle} onMore={onMore}>
    {children}
  </CombinationsList>
);

describe("CombinationsList", () => {
  beforeEach(jest.clearAllMocks);

  describe("header", () => {
    describe("when closed", () => {
      it("should render header title", () => {
        const { container } = renderCombinationsList({
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(container.querySelector(HEADER_TITLE)).toHaveTextContent("some title");
      });

      it("should not render header odd column", () => {
        const { container } = renderCombinationsList({
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(container.querySelector(HEADER_TITLE)).not.toHaveTextContent("some odd");
      });

      it("should not render header payout column", () => {
        const { container } = renderCombinationsList({
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(container.querySelector(HEADER_PAYOUT)).not.toHaveTextContent("some payout");
      });

      it("should not render children", () => {
        const { container } = renderCombinationsList({
          children: "Test",
        });

        const lines = container.querySelector("combinations-grid-lines");

        expect(lines).toBe(null);
      });
    });

    describe("when open", () => {
      it("should render header title", () => {
        const { container } = renderCombinationsList({
          isOpen: true,
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(container.querySelector(HEADER_TITLE)).toHaveTextContent("some title");
      });

      it("should render header odd column", () => {
        const { container } = renderCombinationsList({
          isOpen: true,
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(container.querySelector(HEADER_ODD)).toHaveTextContent("some odd");
      });

      it("should render header payout column", () => {
        const { container } = renderCombinationsList({
          isOpen: true,
          i18n: {
            title: "some title",
            odd: "some odd",
            payout: "some payout",
          },
        });

        expect(container.querySelector(HEADER_PAYOUT)).toHaveTextContent("some payout");
      });

      describe("and children size is equal to shortViewCount", () => {
        it("should render all children", () => {
          const { container } = render(
            <DefaultCombinationsList isOpen={true} shortViewCount={2}>
              <div>child 1</div>
              <div>child 2</div>
            </DefaultCombinationsList>,
          );

          const lines = container.querySelector(LINES);

          expect(lines).not.toBe(null);
          expect(lines.children.length).toBe(2);

          const [firstLine, secondLine] = lines.children;
          expect(firstLine).toHaveTextContent("child 1");
          expect(secondLine).toHaveTextContent("child 2");
        });

        it("should not render more/less button", () => {
          const { container } = render(
            <DefaultCombinationsList isOpen={true} shortViewCount={2}>
              <div>child 1</div>
              <div>child 2</div>
            </DefaultCombinationsList>,
          );

          const moreBtn = container.querySelector(MORE);
          expect(moreBtn).toBe(null);
        });
      });

      describe("and children size is lower than shortViewCount", () => {
        it("should render all children", () => {
          const { container } = render(
            <DefaultCombinationsList isOpen={true} shortViewCount={3}>
              <div>child 1</div>
              <div>child 2</div>
            </DefaultCombinationsList>,
          );

          const lines = container.querySelector(LINES);

          expect(lines).not.toBe(null);
          expect(lines.children.length).toBe(2);

          const [firstLine, secondLine] = lines.children;
          expect(firstLine).toHaveTextContent("child 1");
          expect(secondLine).toHaveTextContent("child 2");
        });

        it("should not render more/less button", () => {
          const { container } = render(
            <DefaultCombinationsList isOpen={true} shortViewCount={3}>
              <div>child 1</div>
              <div>child 2</div>
            </DefaultCombinationsList>,
          );

          const moreBtn = container.querySelector(MORE);
          expect(moreBtn).toBe(null);
        });
      });

      describe("and children size is greater than shortViewCount", () => {
        it("should render only shortViewCount number of children", () => {
          const { container } = render(
            <DefaultCombinationsList isOpen={true} shortViewCount={1}>
              <div>child 1</div>
              <div>child 2</div>
            </DefaultCombinationsList>,
          );

          const lines = container.querySelector(LINES);

          expect(lines).not.toBe(null);
          expect(lines.children.length).toBe(1);

          const [firstLine] = lines.children;
          expect(firstLine).toHaveTextContent("child 1");
        });

        it("should render more button", () => {
          const { container } = render(
            <DefaultCombinationsList
              isOpen={true}
              shortViewCount={1}
              i18n={{
                more: "More",
                less: "Less",
              }}
            >
              <div>child 1</div>
              <div>child 2</div>
            </DefaultCombinationsList>,
          );

          const moreBtn = container.querySelector(MORE);
          expect(moreBtn).not.toBe(null);
          expect(moreBtn).toHaveTextContent("More");
        });

        describe("and more button is clicked", () => {
          it("should render all children", () => {
            const { container } = render(
              <DefaultCombinationsList
                isOpen={true}
                shortViewCount={1}
                i18n={{
                  more: "More",
                  less: "Less",
                }}
              >
                <div>child 1</div>
                <div>child 2</div>
              </DefaultCombinationsList>,
            );

            const moreBtn = container.querySelector(MORE);
            fireEvent.click(moreBtn);

            const lines = container.querySelector(LINES);

            expect(lines).not.toBe(null);
            expect(lines.children.length).toBe(2);

            const [firstLine, secondLine] = lines.children;
            expect(firstLine).toHaveTextContent("child 1");
            expect(secondLine).toHaveTextContent("child 2");
          });

          it("should render less button", () => {
            const { container } = render(
              <DefaultCombinationsList
                isOpen={true}
                shortViewCount={1}
                i18n={{
                  more: "More",
                  less: "Less",
                }}
              >
                <div>child 1</div>
                <div>child 2</div>
              </DefaultCombinationsList>,
            );

            const moreBtn = container.querySelector(MORE);
            fireEvent.click(moreBtn);

            expect(moreBtn).toHaveTextContent("Less");
          });

          describe("and less button is clicked", () => {
            it("should go back to short view state", () => {
              const { container } = render(
                <DefaultCombinationsList
                  isOpen={true}
                  shortViewCount={1}
                  i18n={{
                    more: "More",
                    less: "Less",
                  }}
                >
                  <div>child 1</div>
                  <div>child 2</div>
                </DefaultCombinationsList>,
              );

              const moreBtn = container.querySelector(MORE);
              fireEvent.click(moreBtn);
              fireEvent.click(moreBtn);

              const lines = container.querySelector(LINES);
              expect(lines).not.toBe(null);
              expect(lines.children.length).toBe(1);

              const [firstLine] = lines.children;
              expect(firstLine).toHaveTextContent("child 1");

              expect(moreBtn).toHaveTextContent("More");
            });
          });
        });
      });
    });

    describe("when clicked", () => {
      it("should call onToggle callback", () => {
        const onToggleSpy = jest.fn();
        const { container } = renderCombinationsList({
          isOpen: true,
          i18n: {},
          onToggle: onToggleSpy,
        });

        const header = container.querySelector(HEADER);
        fireEvent.click(header);

        expect(onToggleSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("more", () => {
    describe("when is not open", () => {
      it("should not render more button", () => {
        const { container } = render(
          <DefaultCombinationsList isOpen={false} shortViewCount={1}>
            <div>child 1</div>
            <div>child 2</div>
          </DefaultCombinationsList>,
        );

        expect(container.querySelector(MORE)).toBe(null);
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
    const { container } = renderCombinationsListLine({
      children: "Test",
    });

    expect(container.querySelector("span:nth-child(1)")).toHaveTextContent("Id");
  });

  it("should render line content", () => {
    const { container } = renderCombinationsListLine({
      children: "Test",
    });

    expect(container.querySelector("span:nth-child(2)")).toHaveTextContent("Test");
  });

  it("should render line odd", () => {
    const { container } = renderCombinationsListLine({
      children: "Test",
    });

    expect(container.querySelector("span:nth-child(3)")).toHaveTextContent("Odd");
  });

  it("should render line payout", () => {
    const { container } = renderCombinationsListLine({
      children: "Test",
    });

    expect(container.querySelector("span:nth-child(4)")).toHaveTextContent("Payout");
  });
});
