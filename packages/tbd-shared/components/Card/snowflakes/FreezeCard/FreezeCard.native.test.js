import { render } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { StatusLabel } from "@ppb/the-wall-native/";

import { FreezeCard } from "./FreezeCard.native";
import { FreezeCardStates, FreezeCardStatuses } from "./shared";
import { FREEZE_CARD, FREEZE_CARD_CONTENT_TEXT, FREEZE_CARD_LABEL } from "./FreezeCard.native.selectors";
import styles from "./FreezeCard.native.styles";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  StatusLabel: jest.fn(() => <status-label-mock />),
  Text: jest.requireActual("react-native").Text,
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
    const { root } = renderFreezeCard();
    expect(root).not.toBeNull();
  });

  it("should render the sport icon", () => {
    renderFreezeCard({});

    expect(GenericIcon).toHaveBeenCalled();
  });

  it("should render the label", () => {
    const { getByTestId } = renderFreezeCard({ text: "label" });

    expect(getByTestId(FREEZE_CARD_LABEL)).toHaveTextContent("label");
  });

  it("should render the content text", () => {
    const { getByTestId } = renderFreezeCard({ contentText: "content text" });
    expect(getByTestId(FREEZE_CARD_CONTENT_TEXT)).toHaveTextContent("content text");
  });

  it("should be styled as default when status is pre play", () => {
    const { getByTestId } = renderFreezeCard({ status: FreezeCardStatuses.PREPLAY });
    expect(getByTestId(FREEZE_CARD)).toHaveStyle(styles.freezeCard);

    expect(getByTestId(FREEZE_CARD_LABEL)).toHaveStyle(styles.label);

    expect(getByTestId(FREEZE_CARD_CONTENT_TEXT)).toHaveStyle(styles.contentText);
  });

  it("should be styled as finished when status is finished", () => {
    const { getByTestId } = renderFreezeCard({ status: FreezeCardStatuses.FINISHED });
    expect(getByTestId(FREEZE_CARD)).toHaveStyle(styles.freezeCardFinished);

    expect(getByTestId(FREEZE_CARD_LABEL)).toHaveStyle(styles.labelFinished);

    expect(getByTestId(FREEZE_CARD_CONTENT_TEXT)).toHaveStyle(styles.contentTextFinished);
  });

  it("should be styled as default when status is in play and state is default", () => {
    const { getByTestId } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.DEFAULT });
    expect(getByTestId(FREEZE_CARD)).toHaveStyle(styles.freezeCard);

    expect(getByTestId(FREEZE_CARD_LABEL)).toHaveStyle(styles.label);

    expect(getByTestId(FREEZE_CARD_CONTENT_TEXT)).toHaveStyle(styles.contentText);
  });

  it("should be styled as active when status is in play and state is active", () => {
    const { getByTestId } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.ACTIVE });
    expect(getByTestId(FREEZE_CARD)).toHaveStyle(styles.freezeCardActive);

    expect(getByTestId(FREEZE_CARD_LABEL)).toHaveStyle(styles.labelActive);

    expect(getByTestId(FREEZE_CARD_CONTENT_TEXT)).toHaveStyle(styles.contentTextActive);
  });

  it("should be styled as selected when status is in play and state is selected", () => {
    const { getByTestId } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.SELECTED });
    expect(getByTestId(FREEZE_CARD)).toHaveStyle(styles.freezeCardSelected);

    expect(getByTestId(FREEZE_CARD_LABEL)).toHaveStyle(styles.labelSelected);

    expect(getByTestId(FREEZE_CARD_CONTENT_TEXT)).toHaveStyle(styles.contentTextSelected);
  });

  it("should be styled as suspended when status is in play and state is suspended", () => {
    const { getByTestId } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.SUSPENDED });
    expect(getByTestId(FREEZE_CARD)).toHaveStyle(styles.freezeCardSuspended);

    expect(getByTestId(FREEZE_CARD_LABEL)).toHaveStyle(styles.labelSuspended);

    expect(getByTestId(FREEZE_CARD_CONTENT_TEXT)).toHaveStyle(styles.contentTextSuspended);
  });

  it("should be styled as ineligible when status is in play and state is ineligible", () => {
    const { getByTestId } = renderFreezeCard({ status: FreezeCardStatuses.INPLAY, state: FreezeCardStates.INELIGIBLE });
    expect(getByTestId(FREEZE_CARD)).toHaveStyle(styles.freezeCardIneligible);

    expect(getByTestId(FREEZE_CARD_LABEL)).toHaveStyle(styles.labelIneligible);

    expect(getByTestId(FREEZE_CARD_CONTENT_TEXT)).toHaveStyle(styles.contentTextIneligible);
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
