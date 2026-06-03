import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { SuccessfulDepositContent } from "./SuccessfulDepositContent.web";
import { TEST_ID, TITLE, SUBTITLE } from "./SuccessfulDepositContent.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <quick-link-mock />),
}));

function renderSuccessfulDepositContent({ depositSuccessful = "depositSuccessful", placingBet = "placingBet" } = {}) {
  return render(<SuccessfulDepositContent depositSuccessful={depositSuccessful} placingBet={placingBet} />);
}

describe("SuccessfulDepositContent", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the component", () => {
    const { container } = renderSuccessfulDepositContent();

    expect(container.querySelector(TEST_ID)).not.toBe(null);
  });

  it("should render a GenericIcon", () => {
    renderSuccessfulDepositContent();

    expect(GenericIcon).toHaveBeenCalledWith(
      {
        color: "var(--messaging-success-icon-default)",
        name: SystemIconName.NOTIFICATION_SUCCESS,
      },
      undefined,
    );
  });

  it("should render the content title", () => {
    const { container } = renderSuccessfulDepositContent();
    const title = container.querySelector(TITLE);

    expect(title).toHaveTextContent("depositSuccessful");
  });

  it("should render the content subtitle", () => {
    const { container } = renderSuccessfulDepositContent();
    const subtitle = container.querySelector(SUBTITLE);

    expect(subtitle).toHaveTextContent("placingBet");
  });
});
