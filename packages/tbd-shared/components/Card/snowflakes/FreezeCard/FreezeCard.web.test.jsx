import "jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { StatusLabel } from "@ppb/the-wall-web/";

import { FreezeCardStates, FreezeCardStatuses } from "./shared";
import { FreezeCard } from "./FreezeCard.web";
import styles from "./FreezeCard.web.css";
import { TEST_ID, CONTENT_TEXT, LABEL, ICON } from "./FreezeCard.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  StatusLabel: jest.fn(() => <status-label-mock />),
}));

function renderFreezeCard({ status, state, statusLabel, text, contentText, onClick } = {}) {
  return render(
    <FreezeCard
      status={status}
      state={state}
      statusLabel={statusLabel}
      text={text}
      contentText={contentText}
      onClick={onClick}
    >
      <div></div>
    </FreezeCard>,
  );
}

beforeEach(() => jest.clearAllMocks());

describe("FreezeCard", () => {
  it("should render the card", () => {
    const { container } = renderFreezeCard();
    expect(container).not.toBeNull();
  });

  it("should render the sport icon", () => {
    renderFreezeCard({});
    expect(GenericIcon).toHaveBeenCalled();
  });

  it("should render the label", () => {
    const { container } = renderFreezeCard({ text: "label" });
    expect(container.querySelector(LABEL).textContent).toBe("label");
  });

  it("should render the content text", () => {
    const { container } = renderFreezeCard({ contentText: "content text" });
    expect(container.querySelector(CONTENT_TEXT).textContent).toBe("content text");
  });

  it("should be styled as default when status is pre play", () => {
    const { container } = renderFreezeCard({ status: FreezeCardStatuses.PREPLAY });
    expect(container.querySelector(TEST_ID).classList).toContain(styles.freezeCard);
    expect(container.querySelector(TEST_ID).classList).toHaveLength(1);

    expect(container.querySelector(ICON).classList).toContain(styles.icon);
    expect(container.querySelector(ICON).classList).toHaveLength(1);

    expect(container.querySelector(LABEL).classList).toContain(styles.label);
    expect(container.querySelector(LABEL).classList).toHaveLength(1);

    expect(container.querySelector(CONTENT_TEXT).classList).toContain(styles.contentText);
    expect(container.querySelector(CONTENT_TEXT).classList).toHaveLength(1);
  });

  it("should be styled as finished when status is finished", () => {
    const { container } = renderFreezeCard({ status: FreezeCardStatuses.FINISHED });
    expect(container.querySelector(TEST_ID).classList).toContain(styles.freezeCardFinished);
    expect(container.querySelector(TEST_ID).classList).toHaveLength(2);

    expect(container.querySelector(ICON).classList).toContain(styles.iconFinished);
    expect(container.querySelector(ICON).classList).toHaveLength(2);

    expect(container.querySelector(LABEL).classList).toContain(styles.labelFinished);
    expect(container.querySelector(LABEL).classList).toHaveLength(2);

    expect(container.querySelector(CONTENT_TEXT).classList).toContain(styles.contentTextFinished);
    expect(container.querySelector(CONTENT_TEXT).classList).toHaveLength(2);
  });

  it("should be styled as default when status is in play and state is default", () => {
    const { container } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.DEFAULT });
    expect(container.querySelector(TEST_ID).classList).toContain(styles.freezeCard);
    expect(container.querySelector(TEST_ID).classList).toHaveLength(1);

    expect(container.querySelector(ICON).classList).toContain(styles.icon);
    expect(container.querySelector(ICON).classList).toHaveLength(1);

    expect(container.querySelector(LABEL).classList).toContain(styles.label);
    expect(container.querySelector(LABEL).classList).toHaveLength(1);

    expect(container.querySelector(CONTENT_TEXT).classList).toContain(styles.contentText);
    expect(container.querySelector(CONTENT_TEXT).classList).toHaveLength(1);
  });

  it("should be styled as active when status is in play and state is active", () => {
    const { container } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.ACTIVE });
    expect(container.querySelector(TEST_ID).classList).toContain(styles.freezeCardActive);
    expect(container.querySelector(TEST_ID).classList).toHaveLength(2);

    expect(container.querySelector(ICON).classList).toContain(styles.iconActive);
    expect(container.querySelector(ICON).classList).toHaveLength(2);

    expect(container.querySelector(LABEL).classList).toContain(styles.labelActive);
    expect(container.querySelector(LABEL).classList).toHaveLength(2);

    expect(container.querySelector(CONTENT_TEXT).classList).toContain(styles.contentTextActive);
    expect(container.querySelector(CONTENT_TEXT).classList).toHaveLength(2);
  });

  it("should be styled as selected when status is in play and state is selected", () => {
    const { container } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.SELECTED });
    expect(container.querySelector(TEST_ID).classList).toContain(styles.freezeCardSelected);
    expect(container.querySelector(TEST_ID).classList).toHaveLength(2);

    expect(container.querySelector(ICON).classList).toContain(styles.iconSelected);
    expect(container.querySelector(ICON).classList).toHaveLength(2);

    expect(container.querySelector(LABEL).classList).toContain(styles.labelSelected);
    expect(container.querySelector(LABEL).classList).toHaveLength(2);

    expect(container.querySelector(CONTENT_TEXT).classList).toContain(styles.contentTextSelected);
    expect(container.querySelector(CONTENT_TEXT).classList).toHaveLength(2);
  });

  it("should be styled as suspended when status is in play and state is suspended", () => {
    const { container } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.SUSPENDED });
    expect(container.querySelector(TEST_ID).classList).toContain(styles.freezeCardSuspended);
    expect(container.querySelector(TEST_ID).classList).toHaveLength(2);

    expect(container.querySelector(ICON).classList).toContain(styles.iconSuspended);
    expect(container.querySelector(ICON).classList).toHaveLength(2);

    expect(container.querySelector(LABEL).classList).toContain(styles.labelSuspended);
    expect(container.querySelector(LABEL).classList).toHaveLength(2);

    expect(container.querySelector(CONTENT_TEXT).classList).toContain(styles.contentTextSuspended);
    expect(container.querySelector(CONTENT_TEXT).classList).toHaveLength(2);
  });

  it("should be styled as ineligible when status is in play and state is ineligible", () => {
    const { container } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.INELIGIBLE });
    expect(container.querySelector(TEST_ID).classList).toContain(styles.freezeCard);
    expect(container.querySelector(TEST_ID).classList).toHaveLength(2);

    expect(container.querySelector(ICON).classList).toContain(styles.iconIneligible);
    expect(container.querySelector(ICON).classList).toHaveLength(2);

    expect(container.querySelector(LABEL).classList).toContain(styles.labelIneligible);
    expect(container.querySelector(LABEL).classList).toHaveLength(2);

    expect(container.querySelector(CONTENT_TEXT).classList).toContain(styles.contentTextIneligible);
    expect(container.querySelector(CONTENT_TEXT).classList).toHaveLength(2);
  });

  it("should not render status label when status label is false", () => {
    renderFreezeCard({ statusLabel: false });
    expect(StatusLabel).not.toHaveBeenCalled();
  });

  it("should not render status label when status is pre play", () => {
    renderFreezeCard({ status: FreezeCardStatuses.PREPLAY });
    expect(StatusLabel).not.toHaveBeenCalled();
  });

  it("should render status label when status is not preplay and status label is true", () => {
    renderFreezeCard({
      state: FreezeCardStates.ACTIVE,
      status: FreezeCardStatuses.INPLAY,
      statusLabel: true,
    });
    expect(StatusLabel).toHaveBeenCalled();
  });
});
