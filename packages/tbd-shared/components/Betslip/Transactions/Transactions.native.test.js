import { render, act } from "@testing-library/react-native";
import { DeviceEventEmitter } from "react-native";
import { PYWEventActions } from "@ppb/tbd-store/state/entities/PaymentsWeb.types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { goBack } from "@ppb/tbd-router/native";
import { Transactions } from "./Transactions.native";
import * as selectors from "./Transactions.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon />),
}));

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-router/native", () => ({
  goBack: jest.fn(),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {
    MessagingSuccessIconDefault: "MessagingSuccessIconDefault",
  },
  typography: {},
  spacings: {},
  stackings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderTransactions({
  labels = {},
  isDepositRedirect,
  activeProduct,
  origin,
  excRunner,
  excMarket,
  excBetId,
  dispatchSbkDepositSuccessful = () => {},
  dispatchExcDepositSuccessful = () => {},
} = {}) {
  return render(
    <Transactions
      labels={labels}
      isDepositRedirect={isDepositRedirect}
      activeProduct={activeProduct}
      origin={origin}
      excRunner={excRunner}
      excMarket={excMarket}
      excBetId={excBetId}
      dispatchSbkDepositSuccessful={dispatchSbkDepositSuccessful}
      dispatchExcDepositSuccessful={dispatchExcDepositSuccessful}
    />,
  );
}

describe("Transactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers("legacy");
  });

  describe("when there's a DEPOSIT_SUCCESS event", () => {
    describe("and isDepositRedirect is true", () => {
      it("should render a GenericIcon", () => {
        const { unmount: unmountToRemoveListeners } = renderTransactions({ isDepositRedirect: true });
        act(() => {
          DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
        });

        expect(GenericIcon).toHaveBeenCalledWith(
          {
            color: "MessagingSuccessIconDefault",
            name: SystemIconName.NOTIFICATION_SUCCESS,
          },
          undefined,
        );

        unmountToRemoveListeners();
      });

      it("should render the title", () => {
        const { queryByTestId, unmount: unmountToRemoveListeners } = renderTransactions({
          isDepositRedirect: true,
          labels: { depositSuccessful: "depositSuccessful" },
        });
        act(() => {
          DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
        });

        const title = queryByTestId(selectors.TRANSACTIONS_TITLE_ID);

        expect(title).toHaveTextContent("depositSuccessful");

        unmountToRemoveListeners();
      });

      it("should render the subtitle", () => {
        const { queryByTestId, unmount: unmountToRemoveListeners } = renderTransactions({
          isDepositRedirect: true,
          labels: { placingBet: "placingBet" },
        });
        act(() => {
          DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
        });

        const subtitle = queryByTestId(selectors.TRANSACTIONS_SUBTITLE_ID);

        expect(subtitle).toHaveTextContent("placingBet");

        unmountToRemoveListeners();
      });

      it("should call goBack", () => {
        const { unmount: unmountToRemoveListeners } = renderTransactions({ isDepositRedirect: true });

        act(() => {
          DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
        });

        expect(goBack).toHaveBeenCalledWith();
        expect(goBack).toHaveBeenCalledTimes(1);

        unmountToRemoveListeners();
      });

      describe("when active product is SBK", () => {
        it("should call dispatchSbkDepositSuccessful", () => {
          const dispatchSbkDepositSuccessful = jest.fn();
          const { unmount: unmountToRemoveListeners } = renderTransactions({
            isDepositRedirect: true,
            activeProduct: "SPORTSBOOK",
            dispatchSbkDepositSuccessful,
          });

          act(() => {
            DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
          });

          expect(dispatchSbkDepositSuccessful).toHaveBeenCalledWith();
          expect(dispatchSbkDepositSuccessful).toHaveBeenCalledTimes(1);

          unmountToRemoveListeners();
        });
      });

      describe("when active product is EXC", () => {
        describe("and origin is PLACE_POTENTIAL", () => {
          it("should call dispatchExcDepositSuccessful", () => {
            const dispatchExcDepositSuccessful = jest.fn();
            const { unmount: unmountToRemoveListeners } = renderTransactions({
              isDepositRedirect: true,
              activeProduct: "EXCHANGE",
              origin: "PLACE_POTENTIAL",
              excRunner: "runner",
              dispatchExcDepositSuccessful,
            });

            act(() => {
              DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
            });

            expect(dispatchExcDepositSuccessful).toHaveBeenCalledWith("PLACE_POTENTIAL", "runner");
            expect(dispatchExcDepositSuccessful).toHaveBeenCalledTimes(1);

            unmountToRemoveListeners();
          });
        });

        describe("and origin is CONFIRM_POTENTIAL", () => {
          it("should call dispatchExcDepositSuccessful", () => {
            const dispatchExcDepositSuccessful = jest.fn();
            const { unmount: unmountToRemoveListeners } = renderTransactions({
              isDepositRedirect: true,
              activeProduct: "EXCHANGE",
              origin: "CONFIRM_POTENTIAL",
              excRunner: "runner",
              dispatchExcDepositSuccessful,
            });

            act(() => {
              DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
            });

            expect(dispatchExcDepositSuccessful).toHaveBeenCalledWith("CONFIRM_POTENTIAL", "runner");
            expect(dispatchExcDepositSuccessful).toHaveBeenCalledTimes(1);

            unmountToRemoveListeners();
          });
        });

        describe("and origin is Edit", () => {
          it("should call dispatchExcDepositSuccessful", () => {
            const dispatchExcDepositSuccessful = jest.fn();
            const { unmount: unmountToRemoveListeners } = renderTransactions({
              isDepositRedirect: true,
              activeProduct: "EXCHANGE",
              origin: "EDIT_UNMATCHED",
              excRunner: "runner",
              excMarket: "market",
              excBetId: "betId",
              dispatchExcDepositSuccessful,
            });

            act(() => {
              DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
            });

            expect(dispatchExcDepositSuccessful).toHaveBeenCalledWith("EDIT_UNMATCHED", "runner", "market", "betId");
            expect(dispatchExcDepositSuccessful).toHaveBeenCalledTimes(1);

            unmountToRemoveListeners();
          });
        });
      });

      describe("after 3 seconds", () => {
        it("should not render", () => {
          const { queryByTestId, unmount: unmountToRemoveListeners } = renderTransactions({ isDepositRedirect: true });

          act(() => {
            DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
            jest.advanceTimersByTime(3000);
          });

          expect(queryByTestId(selectors.TRANSACTIONS)).toBeNull();

          unmountToRemoveListeners();
        });
      });
    });

    describe("and isDepositRedirect is false", () => {
      it("should not render", () => {
        const { queryByTestId, unmount: unmountToRemoveListeners } = renderTransactions({ isDepositRedirect: false });

        act(() => {
          DeviceEventEmitter.emit(PYWEventActions.DEPOSIT_SUCCESS);
        });

        expect(queryByTestId(selectors.TRANSACTIONS)).toBeNull();

        unmountToRemoveListeners();
      });
    });
  });
});
