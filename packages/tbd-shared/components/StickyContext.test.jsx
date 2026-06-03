import { useContext, useEffect } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { StickyContextProvider, StickyContext } from "./StickyContext";

function StickyConsumerMock() {
  const { currentSticky } = useContext(StickyContext);

  return <>{currentSticky}</>;
}

function StickyProviderMock({ urn }) {
  const { setCurrentSticky } = useContext(StickyContext);

  useEffect(() => setCurrentSticky(urn), [setCurrentSticky, urn]);

  return <></>;
}

function renderComponent(urn) {
  const result = render(
    <StickyContextProvider>
      <StickyProviderMock urn={urn} />
      <StickyConsumerMock />
    </StickyContextProvider>,
  );

  return result.container;
}

describe("StickyContextProvider", () => {
  it("should leave the consumer with the sticky urn", () => {
    const result = renderComponent("sticky:urn");

    expect(result.innerHTML).toEqual("sticky:urn");
  });

  it("should leave the consumer with no sticky urn", () => {
    const result = renderComponent(null);

    expect(result.innerHTML).toBe("");
  });
});
