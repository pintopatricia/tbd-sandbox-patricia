import { useContext } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { RefProvider, RefContext } from "./RefContext";

const refMock = "the ref";
const refSetterMock = "the ref setter";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(() => [refMock, refSetterMock]),
}));

function MockComponent() {
  const [ref, setRef] = useContext(RefContext);
  return (
    <div>
      <span data-testid="ref">{ref}</span>
      <span data-testid="setref">{setRef}</span>
    </div>
  );
}

function renderComponent() {
  return render(
    <RefProvider>
      <MockComponent />
    </RefProvider>,
  );
}

describe("RefContext", () => {
  it("should provide a ref value", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId("ref").innerHTML).toBe("the ref");
  });

  it("should provide a ref setter", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId("setref").innerHTML).toBe("the ref setter");
  });
});
