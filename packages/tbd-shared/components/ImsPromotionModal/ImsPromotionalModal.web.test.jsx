import { getByTestId, render, waitFor, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { FullScreenModal } from "@ppb/the-wall-web";
import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import ImsPromotionModal from "./ImsPromotionModal.web";

jest.mock("@ppb/the-wall-web", () => ({
  FullScreenModal: jest.fn((props) => <full-screen-modal-mock data-testid="full-screen-modal" {...props} />),
}));
jest.mock("../GenericView", () => jest.fn(() => <generic-view-connected data-testid="generic-page" />));
jest.mock("../GenericView/GenericView.web", () => ({
  GenericView: jest.fn(() => <generic-view-mock />),
  GenericViewPlaceholder: jest.fn(() => <generic-view-placeholder-mock />),
}));

const dispatchGoBack = jest.fn();

const promotionViewMock = {
  view: "fakePromotionViewUrn",
  title: "Title",
  returnViewLink: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
  dispatchGoBack,
};

function renderImsPromotionModal(mockedProps = {}) {
  return render(<ImsPromotionModal {...mockedProps} />);
}

describe("imsPromotionModal", () => {
  beforeEach(jest.clearAllMocks);

  it("should call FullScreenModal with the correct parameters", () => {
    renderImsPromotionModal(promotionViewMock);

    expect(FullScreenModal).toHaveBeenCalledWith(
      {
        title: "Title",
        onDismiss: expect.any(Function),
        children: expect.any(Object),
        showHeaderAndBottomBar: true,
      },
      undefined,
    );
  });

  it("should call GenericView with the correct parameters", async () => {
    const { container } = renderImsPromotionModal(promotionViewMock);

    await waitFor(() => getByTestId(container, "generic-page"));

    expect(ConnectedGenericView).toHaveBeenCalledWith(
      {
        urn: "fakePromotionViewUrn",
        component: GenericView,
        placeholder: GenericViewPlaceholder,
      },
      undefined,
    );
  });

  it("should not display the modal", async () => {
    const { container } = renderImsPromotionModal(promotionViewMock);

    act(() => {
      FullScreenModal.mock.calls[0][0].onDismiss();
    });

    const fullScreenModal = container.querySelector("[data-testid=full-screen-modal]");

    expect(fullScreenModal).toBe(null);
  });
});
